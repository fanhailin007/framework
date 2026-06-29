<template>
  <vab-colorful-card class="page-header" :style="style">
    <img alt="Admin" class="page-header-admin-avatar hidden-xs-only" :src="adminAvatar" />
    <div class="page-header-tip">
      <div class="page-header-tip-title">
        {{ handleTips() }}
      </div>
    </div>
  </vab-colorful-card>
</template>

<script lang="ts" setup>
import adminAvatar from '/@/assets/admin-avatar.svg'

const handleTips = () => {
  return 'LinkedYou は、企業内部プロジェクトの開発効率と運用品質を高めるための共通フロントエンドフレームワークです。'
}

const colorFrom = ref<string>('var(--el-color-primary-light-9)')
const colorTo = ref<string>('var(--el-color-white)')
const style = {
  background: `${colorTo.value} linear-gradient(120deg, ${colorFrom.value} 10%, ${colorTo.value}) no-repeat`,
}
</script>

<style lang="scss" scoped>
.page-header {
  :deep() {
    .el-card__body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
    }
  }

  &-admin-avatar {
    width: 80px;
    height: 80px;
    margin-right: var(--el-margin);
    object-fit: contain;
    border-radius: 24px;
    box-shadow: 0 10px 28px rgba(78, 136, 243, 0.16);
  }

  &-tip {
    flex: auto;
    width: calc(100% - 200px);
    min-width: 300px;

    &-title {
      font-size: var(--el-font-size-large);
      font-weight: bold;
      line-height: 30px;
    }
  }
}

@media (max-width: 576px) {
  .page-header {
    &-tip {
      width: 100%;
      min-width: 100%;
    }
  }
}
</style>
