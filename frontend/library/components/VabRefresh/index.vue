<template>
  <el-dropdown class="vab-refresh" popper-class="vab-refresh-popper" @command="handleCommand">
    <span class="refresh-trigger">
      <vab-icon :class="className" icon="refresh-line" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="refreshCurrent">{{ translate('刷新当前') }}</el-dropdown-item>
        <el-dropdown-item command="refreshAll">{{ translate('刷新全部') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { translate } from '/@/i18n'

defineOptions({
  name: 'VabRefresh',
})

const className = ref<string>('')

const rotate = () => {
  className.value = 'rotate'
  setTimeout(() => {
    className.value = ''
  }, 500)
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'refreshCurrent': {
      // 发送刷新当前标签页事件，让VabTabs组件自己处理路径
      $pub('refresh-current-tab')
      $pub('reload-router-view')
      rotate()
      break
    }
    case 'refreshAll': {
      $pub('refresh-all-tabs')
      $pub('reload-all')
      rotate()
      break
    }
  }
}

onBeforeMount(() => {
  $sub('refresh-rotate', () => {
    rotate()
  })
})
</script>

<style lang="scss" scoped>
.vab-refresh {
  .refresh-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}

.rotate {
  animation: rotate 0.5s linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
