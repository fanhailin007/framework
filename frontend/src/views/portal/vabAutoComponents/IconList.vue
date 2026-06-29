<template>
  <el-row :gutter="20">
    <el-col v-for="(item, index) in iconList" :key="index" :lg="6" :md="6" :sm="12" :xl="6" :xs="12">
      <vab-card class="icon-panel" @click="handleMore">
        <div class="icon-content">
          <vab-icon :icon="item.icon" :style="{ backgroundColor: item.color }" />
          <div class="text-content">
            <p class="title">{{ item.title }}</p>
            <p class="description">{{ item.description }}</p>
          </div>
        </div>
      </vab-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
const iconList = ref<any>([
  {
    icon: 'baidu-line',
    title: '百科',
    description: '知识百科查询',
    color: '#5b38b9',
  },
  {
    icon: 'cast-line',
    title: '订阅',
    description: '内容订阅服务',
    color: '#f46e53',
  },
  {
    icon: 'award-line',
    title: '收藏',
    description: '收藏夹管理',
    color: '#6a59f4',
  },
  {
    icon: 'ball-pen-line',
    title: 'OKR',
    description: '目标与关键成果',
    color: '#2a7bff',
  },
  {
    icon: 'video-line',
    title: '学习',
    description: '在线学习平台',
    color: '#eb6d0b',
  },
  {
    icon: 'cellphone-line',
    title: '汇报',
    description: '工作报告系统',
    color: '#138eee',
  },
  {
    icon: 'code-box-line',
    title: '动态',
    description: '实时动态更新',
    color: '#21df97',
  },
  {
    click: 'handleMore',
    icon: 'chat-1-line',
    title: '帮助',
    description: '在线帮助支持',
    color: '#ff3256',
  },
])

const handleMore = () => {
  $baseAlert('敬请期待！')
}
</script>

<style lang="scss" scoped>
.icon-panel {
  cursor: pointer;
  border-radius: 15px !important;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  :deep() {
    .el-card__body {
      height: 66.5px;
      padding: 15px !important;
    }
  }

  .icon-content {
    display: flex;
    align-items: center;
    height: 100%;

    i {
      flex-shrink: 0;
      width: 46px;
      height: 46px;
      margin-right: 12px;
      font-size: 28px;
      line-height: 46px;
      color: var(--el-color-white);
      border-radius: 50%;
      transition: all ease-in-out 0.3s;
    }

    .text-content {
      flex: 1;
      overflow: hidden;

      .title {
        margin: 0 0 2px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        white-space: nowrap;
      }

      .description {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        color: var(--el-text-color-regular);
        white-space: nowrap;
      }
    }
  }
}
</style>
