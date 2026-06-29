<template>
  <el-scrollbar height="100%">
    <div style="padding: 16px 8px 0 4px">
      <el-timeline class="notice-timeline">
        <el-timeline-item v-for="notice in notices" :key="notice.id" color="#01ffff" placement="bottom" :timestamp="notice.date">
          <span class="notice-timeline-title">{{ notice.title }}</span>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'WorkbenchNotice',
})

const notices = reactive([
  {
    id: 1,
    title: '关于2024年五一劳动节放假的详细安排通知',
    date: '2024-05-01',
  },
  {
    id: 2,
    title: '核心业务系统将于本周六凌晨进行停机升级维护',
    date: '2024-04-20',
  },
  {
    id: 3,
    title: 'AI智能数据分析模块V2.0版本已正式上线运行',
    date: '2024-04-10',
  },
  {
    id: 4,
    title: '关于办公区域网络设备更新换代的紧急通知',
    date: '2024-04-05',
  },
  { id: 5, title: '第三季度优秀员工评选活动正式启动', date: '2024-04-01' },
  { id: 6, title: '请全体员工注意查收四月份的电子工资条', date: '2024-03-30' },
  {
    id: 7,
    title: '公司内部技术分享会：探索前端微服务架构',
    date: '2024-03-25',
  },
  { id: 8, title: '关于加强办公室安全用电管理的通知', date: '2024-03-22' },
])
</script>

<style lang="scss" scoped>
.notice-timeline {
  padding: 0;

  :deep(.el-timeline-item__tail) {
    border-left: 2px solid #101f58 !important;
  }

  :deep(.el-timeline-item__node) {
    background: #01ffff !important;
    border: 2px solid #01ffff !important;
    box-shadow: 0 0 8px #01ffff44;
  }

  :deep(.el-timeline-item__wrapper) {
    color: #64c5d9;
  }

  :deep(.el-timeline-item__timestamp) {
    font-size: 13px;
    color: #fff;
    opacity: 0.6;
  }

  :deep(.el-timeline-item__content) {
    padding: 2px 0 2px 0;
    border-radius: 3px;
    transition: background 0.2s;
  }

  :deep(.el-timeline-item__content:hover) {
    background: rgba(1, 255, 255, 0.06);
  }
}

.notice-timeline-title {
  font-weight: 500;
  color: #01ffff;
}
</style>
