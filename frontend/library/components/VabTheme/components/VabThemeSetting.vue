<template>
  <div v-show="theme.showThemeSetting" class="vab-theme-setting">
    <el-collapse-transition>
      <section v-show="show">
        <div v-show="routeName !== 'SeparateLayout'" @click="randomTheme">
          <a>
            <vab-icon icon="fire-line" />
            <p>{{ translate('随机换肤') }}</p>
          </a>
        </div>
        <div v-show="routeName !== 'SeparateLayout'" @click="handleOpenTheme">
          <a>
            <vab-icon icon="t-shirt-line" />
            <p>{{ translate('主题配置') }}</p>
          </a>
        </div>
        <div @click="changeTheme('technology')">
          <a>
            <vab-icon icon="user-5-line" />
            <p>
              {{ translate('科技主题') }}
            </p>
          </a>
        </div>
        <div @click="changeTheme('plain')">
          <a>
            <vab-icon icon="computer-line" />
            <p>
              {{ translate('简洁主题') }}
            </p>
          </a>
        </div>
        <div @click="resetTheme">
          <a>
            <vab-icon icon="arrow-go-back-line" />
            <p>
              {{ translate('默认主题') }}
            </p>
          </a>
        </div>
        <div @click="removeLocalStorage">
          <a>
            <vab-icon icon="delete-bin-4-line" />
            <p>
              {{ translate('清理缓存') }}
            </p>
          </a>
        </div>
        <div class="vab-show-hide-box" @click="checkUpdate">
          <a>
            <vab-icon icon="upload-cloud-2-line" />
            <p>{{ translate('检查更新') }}</p>
          </a>
        </div>
      </section>
    </el-collapse-transition>

    <div class="vab-buy-box" @click="buy">
      <a class="vab-buy">
        <vab-icon icon="shopping-cart-2-line" />
        <p>{{ translate('购买源码') }}</p>
      </a>
    </div>
    <div class="vab-show-hide-box" @click="toggleShowHide">
      <a>
        <vab-icon :icon="show ? 'arrow-up-double-line' : 'arrow-down-double-line'" />
        <p>
          {{ translate(show ? '收起浮窗' : '展开浮窗') }}
        </p>
      </a>
    </div>
    <vab-update v-if="pwa" ref="vabUpdateRef" />
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { version as localVersion } from '~/package.json'
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'

import { pwa } from '/@/config'

defineOptions({
  name: 'VabThemeSetting',
})

const settingsStore = useSettingsStore()
const { device, theme } = storeToRefs(settingsStore)
const { saveTheme, updateTheme, setCssVar, updateCaughtTabs } = settingsStore
const show = ref<boolean>(true)
const route = useRoute()
const routeName = ref<any>(route.name)
const vabUpdateRef = ref()

const handleOpenTheme = () => {
  $pub('shop-vite-open-theme')
}

const buy = () => {
  window.open('https://vuejs-core.cn/authorization/shop-vite.html')
}

const removeLocalStorage = () => {
  localStorage.clear()
  updateCaughtTabs(false)
  location.reload()
}

const resetTheme = () => {
  $pub('shop-vite-reset-theme')
}

const changeTheme = (value: string) => {
  $pub('shop-vite-change-theme', value)
  $pub('shop-vite-save-theme')
}

const toggleShowHide = () => {
  show.value = !show.value
}

const shuffle = (val: any, list: any) => list.filter((item: any) => item !== val)[(Math.random() * (list.length - 1)) | 0]

const randomTheme = async () => {
  const loading = $baseLoading()

  setTimeout(() => {
    const themeName = shuffle(theme.value.themeName, ['default', 'plain', 'technology'])
    const columnStyle = shuffle(theme.value.columnStyle, ['vertical', 'horizontal', 'card', 'arrow', 'semicircle'])
    const tabsBarStyle = shuffle(theme.value.tabsBarStyle, ['card', 'smart', 'smooth', 'rect', 'glass'])
    const showTabsIcon = shuffle(theme.value.showTabsIcon, [true, false])
    const layout =
      device.value === 'desktop'
        ? shuffle(theme.value.layout, ['horizontal', 'vertical', 'column', 'comprehensive', 'fall', 'double'])
        : 'vertical'
    const _color = shuffle(theme.value.color, ['#1e90ff', '#4e6ef2', '#3fb884', '#16baa9', '#009688', '#6954f0', '#f01414'])
    const isFollow = shuffle(theme.value.isFollow, [true, false])

    theme.value.themeName = themeName
    theme.value.columnStyle = columnStyle
    theme.value.tabsBarStyle = tabsBarStyle
    theme.value.showTabsIcon = showTabsIcon
    theme.value.layout = layout

    if (themeName === 'technology') {
      theme.value.color = '#4e88f3'
    } else {
      theme.value.color = _color
    }

    if (themeName === 'default') {
      theme.value.isFollow = isFollow
      theme.value.glassMode = Math.random() > 0.5
    } else {
      theme.value.isFollow = false
    }

    setCssVar()
    updateTheme()
    saveTheme()
    setTimeout(() => {
      loading.close()
      $baseMessage('切换成功', 'success', 'hey')
    }, 1000)
  }, 100)
}

$sub('shop-vite-random-theme', randomTheme)

const checkUpdate = async () => {
  // 新增：判断当前地址是否包含vuejs-core.cn
  if (!window.location.href.includes('vuejs-core.cn')) {
    $baseMessage('非官方演示地址项目无法使用检查更新功能，请前往 Vue Shop Vite 官方演示地址查看最新版本', 'warning', 'hey')
    return
  }
  if (vabUpdateRef.value) {
    // 先重置弹窗状态，确保可以显示
    vabUpdateRef.value.resetDialogState?.()
    // 远程获取版本号
    let remoteVersion = ''
    try {
      const { data } = await axios({
        url: `./vue-shop-vite-version.json?t=${Date.now()}`,
        method: 'get',
      })
      remoteVersion = data.version || ''
    } catch {
      remoteVersion = ''
    }
    // 版本比较：将版本号拆分为数字数组进行比较
    const isNewer = (v1: string, v2: string) => {
      const v1Parts = v1.split('.').map(Number)
      const v2Parts = v2.split('.').map(Number)
      for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0
        const v2Part = v2Parts[i] || 0
        if (v1Part > v2Part) return true
        if (v1Part < v2Part) return false
      }
      return false // 相等的情况返回false
    }
    // 只有当远程版本大于本地版本时才显示更新弹窗
    if (remoteVersion && isNewer(remoteVersion, localVersion)) {
      $pub('update-website', remoteVersion)
      // 不需要在这里设置show=true，由update-website事件处理
    } else {
      $baseMessage('当前已是最新版本', 'success', 'hey', () => {
        location.reload()
      })
    }
  }
}

watch(
  route,
  () => {
    routeName.value = route.name
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.vab-theme-setting {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: calc(var(--el-z-index) - 1);
  padding: 10px 0 0 0;
  margin: 0;
  text-align: center;
  cursor: pointer;
  background: var(--el-color-white);
  border-top: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color);
  border-left: 1px solid var(--el-border-color);
  border-top-left-radius: var(--el-border-radius-base);
  border-bottom-left-radius: var(--el-border-radius-base);
  box-shadow: 0 0 50px 0 rgb(82 63 105 / 15%);
  transform: translateY(-50%);

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px 10px 10px;
    margin: 0;
    list-style: none;

    &:nth-child(n) {
      a {
        &:hover {
          color: var(--el-color-white);
        }
      }
    }

    &:nth-child(1),
    &:nth-child(3),
    &:nth-child(4) {
      a {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);

        &:hover {
          background: var(--el-color-primary);
        }
      }
    }

    &:nth-child(2),
    &:nth-child(5) {
      a {
        color: var(--el-color-success);
        background: var(--el-color-success-lighter);

        &:hover {
          background: var(--el-color-success);
        }
      }
    }

    &:nth-child(4) {
      a {
        color: var(--el-color-info);
        background: var(--el-color-info-lighter);

        &:hover {
          background: var(--el-color-info);
        }
      }
    }

    &:nth-child(6) {
      a {
        color: var(--el-color-danger);
        background: var(--el-color-danger-lighter);

        &:hover {
          background: var(--el-color-danger);
        }
      }
    }

    a {
      display: inline-block;
      width: 60px;
      height: 60px;
      padding-top: 10px;
      text-align: center;
      background: var(--el-color-white);
      border-radius: var(--el-border-radius-base);

      p {
        padding: 0;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: var(--el-font-size-extra-small);
        line-height: 25px;
        white-space: nowrap;
      }
    }
  }

  .vab-buy-box {
    a {
      color: var(--el-color-warning) !important;
      background: var(--el-color-warning-lighter) !important;

      &:hover {
        color: var(--el-color-white) !important;
        background: var(--el-color-warning) !important;
      }
    }
  }

  .vab-show-hide-box {
    a {
      color: var(--el-color-primary) !important;
      background: var(--el-color-primary-light-9) !important;

      &:hover {
        color: var(--el-color-white) !important;
        background: var(--el-color-primary) !important;
      }
    }
  }
}
</style>
