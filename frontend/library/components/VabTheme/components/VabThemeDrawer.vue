<template>
  <el-drawer v-model="drawerVisible" append-to-body class="vab-drawer" :size="size" :title="translate('主题配置')">
    <el-scrollbar ref="themeScrollbar" height="calc(var(--vh, 1vh) * 100 - 145px)">
      <div class="theme-scroll-tip" @click="scrollToBottom">
        <vab-icon icon="arrow-down-line" />
        <span>{{ translate('点击可下拉查看更多主题配置项') }}</span>
      </div>
      <el-form ref="form" label-position="left" :model="theme">
        <el-form-item v-if="device !== 'mobile' && routeName !== 'SeparateLayout'" class="vab-shop-layout-item" :label="translate('布局')">
          <div class="right-align-content">
            <el-radio-group v-model="theme.layout" class="vab-shop-layout-radio-group">
              <el-radio-button v-for="item in layoutList" :key="item" :label="item" :value="item">
                <template #default>
                  <vab-icon :icon="item" is-custom-svg />
                </template>
              </el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item :label="translate('主题')">
          <el-radio-group v-model="theme.themeName" @change="_updateTheme">
            <el-radio-button v-for="item in themeNameList" :key="item.value" :label="translate(item.label)" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="route.path !== '/goods/posterDesign'" :label="translate('暗黑模式')">
          <vab-dark />
        </el-form-item>
        <el-form-item v-if="!['technology', 'gold'].includes(theme.themeName)" :label="translate('配色')">
          <vab-color-picker />
        </el-form-item>
        <el-form-item v-if="!['technology', 'gold'].includes(theme.themeName)" :label="translate('快捷配色')">
          <vab-quick-color :model-value="theme.color" @select="handleQuickColor" />
        </el-form-item>
        <el-form-item v-if="'default' === theme.themeName && mode !== 'dark'" :label="translate('菜单背景跟随配色')">
          <el-switch v-model="theme.isFollow" @change="updateIsFollow" />
        </el-form-item>
        <el-form-item v-if="theme.themeName === 'default' && mode !== 'dark'" :label="translate('头部液态玻璃')">
          <el-switch v-model="theme.glassMode" @change="setCssVar" />
        </el-form-item>
        <el-form-item v-if="theme.themeName === 'default' && theme.glassMode && mode !== 'dark'" :label="translate('液态玻璃透明度')">
          <el-slider
            v-model="theme.glassOpacity"
            :max="1"
            :min="0.55"
            :show-tooltip="true"
            :step="0.01"
            style="width: 120px"
            @change="setCssVar"
          />
        </el-form-item>
        <el-form-item v-if="theme.layout !== 'horizontal'" :label="translate('菜单宽度')">
          <el-select v-model="theme.menuWidth" @change="updateMenuWidth">
            <el-option v-for="item in menuWidthList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="theme.showFontSize" :label="translate('字体大小')">
          <vab-font-size />
        </el-form-item>
        <el-form-item :label="translate('标签')">
          <el-switch v-model="theme.showTabs" @change="handleShowTabs" />
        </el-form-item>
        <el-form-item v-if="theme.showTabs" :label="translate('持久化标签')">
          <el-switch v-model="persistenceTab" @change="handlePersistenceTab" />
        </el-form-item>
        <el-form-item v-if="theme.showTabs" :label="translate('标签图标')">
          <el-switch v-model="theme.showTabsIcon" />
        </el-form-item>
        <el-form-item v-if="theme.showTabs" :label="translate('标签风格')">
          <el-select v-model="theme.tabsBarStyle">
            <el-option v-for="item in tabsBarStyleList" :key="item.value" :label="translate(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="device !== 'mobile' && theme.showTabs" :label="translate('标签拖拽')">
          <el-switch v-model="theme.tabDrag" />
        </el-form-item>
        <el-form-item :label="translate('页脚')">
          <el-switch v-model="theme.showFooter" @change="handleShowFooter" />
        </el-form-item>
        <el-form-item v-if="theme.layout === 'column'" :label="translate('分栏风格')">
          <el-select v-model="theme.columnStyle">
            <el-option v-for="item in columnStyleList" :key="item.value" :label="translate(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="translate('国际化')">
          <vab-language />
        </el-form-item>
        <el-form-item :label="translate('圆角')">
          <el-input-number v-model="theme.radius" :max="26" :min="3" @change="handleRadius" />
        </el-form-item>
        <el-form-item v-if="!['technology', 'gold', 'plain'].includes(theme.themeName)" :label="translate('色弱')">
          <el-switch v-model="theme.colorWeakness" @change="handleColorWeakness" />
        </el-form-item>
        <el-form-item v-if="theme.layout !== 'comprehensive'" :label="translate('头部固定')">
          <el-switch v-model="theme.fixedHeader" />
        </el-form-item>
        <el-form-item :label="translate('暗黑组件')">
          <el-switch v-model="theme.showDark" />
        </el-form-item>
        <el-form-item :label="translate('字体')">
          <el-switch v-model="theme.showFontSize" />
        </el-form-item>
        <el-form-item :label="translate('颜色选择器')">
          <el-switch v-model="theme.showColorPicker" />
        </el-form-item>
        <el-form-item :label="translate('国际化')">
          <el-switch v-model="theme.showLanguage" />
        </el-form-item>
        <el-form-item :label="translate('进度条')">
          <el-switch v-model="theme.showProgressBar" />
        </el-form-item>
        <el-form-item :label="translate('刷新')">
          <el-switch v-model="theme.showRefresh" />
        </el-form-item>
        <el-form-item :label="translate('通知')">
          <el-switch v-model="theme.showNotice" />
        </el-form-item>
        <el-form-item :label="translate('全屏')">
          <el-switch v-model="theme.showFullScreen" />
        </el-form-item>
        <el-form-item :label="translate('锁屏')">
          <el-switch v-model="theme.showLock" />
        </el-form-item>
        <el-form-item :label="translate('快捷盒子')">
          <el-switch v-model="theme.showBox" />
        </el-form-item>
        <el-form-item :label="translate('右侧浮窗')">
          <el-switch v-model="theme.showThemeSetting" />
        </el-form-item>
        <el-form-item :label="translate('页面动画')">
          <el-select v-model="theme.pageTransition">
            <el-option v-for="item in pageTransitionList" :key="item.value" :label="translate(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button type="primary" @click="handleSaveTheme">
        {{ translate('保存') }}
      </el-button>
      <el-button @click="setDefaultTheme">
        {{ translate('恢复默认') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { RouteRecordName } from 'vue-router'
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabThemeDrawer',
})

interface ListType {
  value: string
  label: string
}

// 电脑端主题配置抽屉宽度
const size = ref<string>('360px')

// 移动端主题配置抽屉宽度
const mobileSize = ref<string>('85vw')

const route = useRoute()
const settingsStore = useSettingsStore()
const routeName = ref<RouteRecordName | null | undefined>(route.name)
const { theme, device, mode, persistenceTab } = storeToRefs(settingsStore)
const { saveTheme, resetTheme, updateTheme, updateCaughtTabs, setCssVar } = settingsStore
const drawerVisible = ref<boolean>(false)
const layoutList = ref<string[]>(['column', 'vertical', 'horizontal', 'comprehensive', 'fall', 'double'])
const tabsBarStyleList = ref<ListType[]>([
  { value: 'card', label: '卡片' },
  { value: 'smart', label: '灵动' },
  { value: 'smooth', label: '圆滑' },
  { value: 'rect', label: '矩形' },
  { value: 'glass', label: '玻璃' },
])
const menuWidthList = ref<string[]>(['266px', '277px', '288px', '299px'])
const themeNameList = ref<ListType[]>([
  { value: 'default', label: '默认' },
  { value: 'plain', label: '简洁' },
  { value: 'technology', label: '科技' },
  // { value: 'gold', label: '黑金' },
])
const columnStyleList = ref<ListType[]>([
  { value: 'vertical', label: '纵向' },
  { value: 'horizontal', label: '横向' },
  { value: 'card', label: '卡片' },
  { value: 'arrow', label: '箭头' },
  { value: 'semicircle', label: '半圆' },
])
const pageTransitionList = ref<ListType[]>([
  { value: 'null', label: '无动画' },
  { value: 'el-fade-in-linear', label: 'fade-in-linear' },
  { value: 'el-fade-in', label: 'fade-in' },
  { value: 'el-zoom-in-center', label: 'zoom-in-center' },
  { value: 'el-zoom-in-top', label: 'zoom-in-top' },
  { value: 'el-zoom-in-bottom', label: 'zoom-in-bottom' },
])

const themeScrollbar = ref<any>(null)

const handleOpenTheme = () => {
  drawerVisible.value = true
}

const updateMenuWidth = (value: string) => {
  theme.value.menuWidth = value
  setCssVar()
}

const updateIsFollow = (value: string | number | boolean) => {
  theme.value.isFollow = value
  setCssVar()
}

const handleShowFooter = (value: string | number | boolean) => {
  theme.value.showFooter = value
  setCssVar()
}

const handleRadius = (cur: number | undefined, prev: number | undefined) => {
  theme.value.radius = cur || prev
  setCssVar()
}

const handleColorWeakness = (value: string | number | boolean) => {
  theme.value.colorWeakness = value
  setCssVar()
}

const handleShowTabs = (value: string | number | boolean) => {
  const el = ref<HTMLElement | null>(null)
  if (value) {
    useCssVar('--el-tabs-height', el).value = '50px'
  } else {
    useCssVar('--el-tabs-height', el).value = '0px'
  }
}

const handlePersistenceTab = (value: string | number | boolean) => {
  updateCaughtTabs(value)
}

const _updateTheme = (value: string | number | boolean = '') => {
  if (value == 'default') $pub('shop-vite-reset-dark')
  if (['technology'].includes(theme.value.themeName)) $pub('shop-vite-reset-color')
  if (['gold'].includes(theme.value.themeName)) $pub('shop-vite-reset-color', '#DDBD62')

  const loading = $baseLoading()
  setTimeout(() => {
    updateTheme()
  }, 500)

  setTimeout(() => {
    loading.close()
    $baseMessage('切换成功', 'success', 'hey')
  }, 1000)

  saveTheme()
}

const setDefaultTheme = () => {
  drawerVisible.value = false
  const loading = $baseLoading()

  setTimeout(() => {
    resetTheme()

    $pub('shop-vite-reset-dark')
    $pub('shop-vite-reset-color')

    // 确保在恢复默认配置后正确应用液态玻璃效果
    setGlassModeClass(!!theme.value.glassMode)
  }, 500)

  setTimeout(() => {
    loading.close()
    $baseMessage('切换成功', 'success', 'hey')
    if (device.value === 'mobile') location.reload()
  }, 1000)
}

const handleSaveTheme = () => {
  saveTheme()
  drawerVisible.value = false
  //@ts-ignore
  //if (device.value === 'mobile') location.reload()
}

const handleQuickColor = (color: string) => {
  theme.value.color = color
  setCssVar()
  updateTheme()
  saveTheme()
}

const setGlassModeClass = (val: boolean) => {
  const body = document.body
  if (val) {
    body.classList.add('glass-mode')
  } else {
    body.classList.remove('glass-mode')
  }
  // 更新CSS变量
  settingsStore.setCssVar()
}

watch(
  () => !!theme.value.glassMode,
  (val) => {
    setGlassModeClass(val)
  },
  { immediate: true }
)

watch(
  route,
  () => {
    routeName.value = route.name
  },
  { immediate: true }
)

const scrollToBottom = () => {
  const scrollbar = themeScrollbar.value
  if (scrollbar && scrollbar.wrapRef) {
    const wrap = scrollbar.wrapRef
    wrap.scrollTo({ top: wrap.scrollHeight, behavior: 'smooth' })
  }
}

onBeforeMount(() => {
  $sub('shop-vite-open-theme', () => {
    handleOpenTheme()
  })
  $sub('shop-vite-reset-theme', () => {
    setDefaultTheme()
  })
  $sub('shop-vite-save-theme', () => {
    saveTheme()
  })
  $sub('shop-vite-change-theme', (value: ThemeName) => {
    theme.value.themeName = value
    _updateTheme()
  })
})

onMounted(() => {
  if (device.value === 'mobile') size.value = mobileSize.value
})
</script>

<style lang="scss">
.vab-drawer {
  // position: relative;

  .el-drawer__body {
    padding-right: 0;
    padding-bottom: 0;

    .el-scrollbar__wrap {
      padding-right: var(--el-padding);

      .el-form-item {
        display: flex;
        align-items: center;
        margin-bottom: 17.5px;

        &__label {
          flex: 1 1;

          i {
            cursor: pointer;
          }
        }

        &__content {
          flex: 0 0 auto;

          .el-input,
          .el-input-number,
          .el-select {
            width: 105px;
            min-width: 105px;
          }
        }

        &.vab-shop-layout-item {
          display: block !important;

          .el-form-item__content {
            .vab-shop-layout-radio-group {
              display: flex;
              align-items: center;
              justify-content: flex-end !important;
              margin: 0 !important;
              background: transparent;

              .el-radio-button {
                width: 40px;
                height: 40px;
                padding: 0;
                margin: 10px 0px 5px 10px;
                cursor: pointer;
                background: transparent;

                border-radius: var(--el-border-radius-base) !important;
                box-shadow: none;

                &:last-child {
                  margin-right: 0 !important;
                }

                &.is-disabled {
                  cursor: not-allowed;
                  opacity: 0.6;
                }

                .el-radio-button {
                  &__orig-radio {
                    display: none;
                  }

                  &__inner {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: block;
                    width: inherit;
                    height: inherit;
                    padding: 0;
                    margin: 0;
                    border: 0;
                    border-radius: var(--el-border-radius-base) !important;
                    box-shadow: none;

                    .vab-icon {
                      width: inherit;
                      height: inherit;
                      padding: 0;
                      margin: 0;
                      overflow: hidden;
                      border: 1px solid var(--el-border-color);
                      border-radius: var(--el-border-radius-base) !important;
                    }
                  }
                }

                .el-radio-button__original-radio:checked + .el-radio-button__inner {
                  background: transparent;

                  .vab-icon {
                    box-shadow: 0 0 2px 2px var(--el-color-primary);
                  }

                  &:before {
                    position: absolute;
                    right: 0;
                    bottom: 1px;
                    z-index: 1;
                    font-family: 'remixicon', sans-serif !important;
                    color: var(--el-color-white);
                    content: '';
                  }

                  &:after {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    content: '';
                    border: 12px dashed transparent;
                    border-right: 12px solid var(--el-color-primary);
                    border-bottom: 12px solid var(--el-color-primary);
                    border-radius: var(--el-border-radius-base) 0px var(--el-border-radius-base) 0px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .el-drawer__footer {
    z-index: calc(var(--el-z-index) + 1);
    padding: calc(var(--el-padding) / 2);
    border-top: 1px solid var(--el-border-color);
  }
}

.right-align-content {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 0;
}

.theme-scroll-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0 4px 0;
  margin-bottom: var(--el-margin);
  font-size: 14px;
  color: var(--el-color-warning);
  cursor: pointer;
  background: var(--el-color-warning-lighter);
  border-radius: 0 0 var(--el-border-radius-base) var(--el-border-radius-base);
}
</style>
