<template>
  <vab-dialog v-model="show" append-to-body class="vab-update" :show-close="false" :show-fullscreen="false" width="410px">
    <template #header></template>
    <div class="vab-update-icon">
      <vab-icon icon="upload-cloud-2-fill" />
    </div>
    <vab-icon class="vab-update-cup" icon="cup-line" />
    <h3>版本更新：</h3>
    <p>
      {{ title }}
      V{{ version }}
    </p>
    <p>更新时间：{{ lastTime }}</p>
    <p v-if="!offlineReady && !needRefresh" style="margin-top: 16px; color: #999">当前已是最新版本</p>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="save">
        {{ buttonText }}
      </el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { version as packageVersion } from '~/package.json'
import { translate } from '/@/i18n'

import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabUpdate',
})

const { getTitle: title } = useSettingsStore()
// 添加isUpdating状态变量在组件作用域内
const buttonText = ref<string>(translate('立即升级'))
const loading = ref<boolean>(false)
const version = ref<string>(packageVersion)
const show = ref<boolean>(false)
const hasShownDialog = ref<boolean>(false) // 添加标记，用于防止重复弹窗
const isUpdating = ref<boolean>(false) // 添加更新中状态标志
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
})
const lastTime = dayjs().format('YYYY-MM-DD')

const save = async () => {
  if (!offlineReady.value && !needRefresh.value) {
    show.value = false
    hasShownDialog.value = false // 关闭弹窗时重置，防止重复弹窗
    setTimeout(() => {
      location.reload()
    }, 300) // 先关闭弹窗再刷新
    return
  }

  // 设置更新标志，防止watch回调重置按钮文本
  isUpdating.value = true

  buttonText.value = translate('正在更新')
  loading.value = true

  // 执行更新操作
  await updateServiceWorker()
  // 清理缓存
  $clearPWACache()

  setTimeout(() => {
    loading.value = false
    buttonText.value = translate('更新完成')

    // 更新完成后再关闭更新状态
    offlineReady.value = false
    needRefresh.value = false

    // 重置状态并刷新页面
    isUpdating.value = false
    hasShownDialog.value = false // 更新完成后重置，防止重复弹窗
    location.reload()
  }, 1000 * 5)
}

const handleShow = () => {
  // 只有当需要更新且没有显示过弹窗时，才显示弹窗
  if ((offlineReady.value || needRefresh.value) && !hasShownDialog.value) {
    show.value = true
    hasShownDialog.value = true // 设置标记，表示已经显示过弹窗
  }
}

// onMounted(() => {
//     setTimeout(() => {
//         handleShow()
//     }, 1000 * 3)
// })

watch(
  () => needRefresh.value,
  (val) => {
    // 只有未在更新过程中才改变按钮文本
    if (!isUpdating.value) {
      if (val) {
        buttonText.value = translate('立即升级')
      } else {
        buttonText.value = translate('关闭')
        hasShownDialog.value = false // 状态变为关闭时重置，防止重复弹窗
      }
    }
    // 只有当值为 true 且没有显示过弹窗时，才调用 handleShow
    if (val && !hasShownDialog.value) handleShow()
  }
)

onBeforeMount(() => {
  $sub('update-website', (servicesVersion: string) => {
    // 版本比较函数
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

    if (servicesVersion) {
      version.value = servicesVersion
      // 只有当服务器版本大于本地版本时，才设置更新状态
      if (isNewer(servicesVersion, packageVersion)) {
        offlineReady.value = true
        needRefresh.value = true
        handleShow()
      }
    }
  })
})

// 重置弹窗显示状态的方法
const resetDialogState = () => {
  hasShownDialog.value = false
  show.value = false
}

defineExpose({ save, show, resetDialogState })
</script>

<style lang="scss" scoped>
.vab-update {
  position: relative;

  &-icon {
    position: absolute;
    top: -50px;
    left: 50%;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: linear-gradient(1deg, var(--el-color-primary-light-1), var(--el-color-primary));
    border-radius: 50%;
    transform: translateX(-50%);

    i {
      font-size: 50px;
      color: var(--el-color-white);
    }
  }

  &-cup {
    position: absolute;
    right: 20px;
    bottom: 70px;
    font-size: 80px;
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(var(--el-color-primary-light-7), var(--el-color-primary-light-9));
    background-clip: text;
  }
}
</style>

<style lang="scss">
.vab-update {
  &.el-dialog {
    margin-top: 30vh !important;
    border-radius: 15px;

    .el-dialog__body {
      margin: 0 40px 0 40px;
    }

    .el-dialog__footer {
      text-align: center !important;

      .el-button {
        width: 200px;
        margin-bottom: 20px;
        background: var(--el-color-primary);
        border: 0;
        border-radius: 20px;
      }
    }
  }
}
</style>
