<template>
  <div class="vab-right-tools">
    <vab-color-picker v-show="theme.showColorPicker" />
    <vab-dark v-show="theme.showDark" :style="!isHorizontal ? '' : { marginLeft: 'var(--el-margin)' }" />
    <vab-theme v-show="theme.showTheme && routeName !== 'SeparateLayout'" />
    <vab-error-log class="hidden-xs-only" />
    <vab-font-size v-show="theme.showFontSize" class="hidden-xs-only" />
    <vab-lock v-show="theme.showLock" />
    <!-- <vab-notice v-show="theme.showNotice" /> -->
    <vab-language v-show="theme.showLanguage" />
    <vab-fullscreen v-show="theme.showFullScreen" />
    <vab-refresh v-show="theme.showRefresh" />
    <vab-avatar />
  </div>
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabRightTools',
})

defineProps({
  isHorizontal: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const settingsStore = useSettingsStore()
const { theme, device } = storeToRefs(settingsStore)
const routeName = ref<any>(route.name)

let sortable: any
const handleTabDrag = () => {
  if (theme.value.rightToolsDrag && device.value != 'mobile') {
    const toolsElement = document.querySelector('.vab-right-tools-draggable') as HTMLElement | null

    if (toolsElement)
      sortable = new Sortable(toolsElement, {
        animation: 150,
        easing: 'cubic-bezier(1, 0, 0, 1)',
      })
  }
}

watch(
  route,
  () => {
    routeName.value = route.name
  },
  { immediate: true }
)

onMounted(() => {
  nextTick(() => {
    handleTabDrag()
  })
})

watch(
  theme.value,
  () => {
    if (theme.value.rightToolsDrag) handleTabDrag()
    else sortable && sortable.destroy()
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.vab-right-tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  // 主题
  :deep(.ri-t-shirt-line):hover {
    animation: tshirtShake 0.5s;
  }

  @keyframes tshirtShake {
    0%,
    100% {
      transform: rotate(0);
    }
    20% {
      transform: rotate(-15deg);
    }
    40% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(-10deg);
    }
    80% {
      transform: rotate(5deg);
    }
  }

  // 颜色选择
  :deep(.vab-color-picker):hover .el-color-picker__trigger {
    animation: paletteShake 0.5s;
  }

  @keyframes paletteShake {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }

  // 字体大小
  :deep(.ri-font-size-2):hover {
    animation: fontSizePulse 0.5s;
  }

  @keyframes fontSizePulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  // 锁屏
  :deep(.vab-lock):hover i {
    animation: lockShake 0.5s;
  }

  @keyframes lockShake {
    0%,
    100% {
      transform: rotate(0);
    }
    20% {
      transform: rotate(-18deg);
    }
    40% {
      transform: rotate(15deg);
    }
    60% {
      transform: rotate(-10deg);
    }
    80% {
      transform: rotate(8deg);
    }
  }

  // 通知
  :deep(.ri-notification-2-line):hover {
    animation: bellSwing 0.5s;
  }

  @keyframes bellSwing {
    0%,
    100% {
      transform: rotate(0);
    }
    20% {
      transform: rotate(-15deg);
    }
    40% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(-10deg);
    }
    80% {
      transform: rotate(5deg);
    }
  }

  // 语言
  :deep(.vab-language):hover i {
    animation: langScale 0.4s;
  }

  @keyframes langScale {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.18);
    }
  }

  // 全屏
  :deep(.vab-fullscreen):hover {
    animation: zoomInOut 0.5s;
  }

  @keyframes zoomInOut {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  // 刷新
  :deep(.ri-refresh-line):hover {
    animation: refreshSpin 0.7s linear;
  }

  @keyframes refreshSpin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  // box 图标左右摇晃
  :deep(.vab-box):hover .vab-icon {
    animation: lockShake 0.5s;
  }
}
</style>
