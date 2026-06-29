<template>
  <el-row :gutter="20">
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="circle-stat">
        <el-progress :color="circleColors" :percentage="circleData.sales" type="circle" :width="80" />
        <div class="circle-label">销售额</div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="circle-stat">
        <el-progress :color="circleColors" :percentage="circleData.orders" type="circle" :width="80" />
        <div class="circle-label">订单数</div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="circle-stat">
        <el-progress :color="circleColors" :percentage="circleData.users" type="circle" :width="80" />
        <div class="circle-label">用户数</div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="circle-stat">
        <el-progress :color="circleColors" :percentage="circleData.views" type="circle" :width="80" />
        <div class="circle-label">访问量</div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'StatisticCircle',
})

// 环形数据
const circleData = ref({
  sales: 78,
  orders: 65,
  users: 92,
  views: 84,
})

// 环形图颜色
const circleColors = [
  { color: 'var(--el-color-danger)', percentage: 20 },
  { color: 'var(--el-color-warning)', percentage: 40 },
  { color: 'var(--el-color-success)', percentage: 60 },
  { color: 'var(--el-color-primary)', percentage: 80 },
  { color: 'var(--el-color-info)', percentage: 100 },
]
</script>

<style lang="scss" scoped>
// 环形统计
.circle-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;

  .circle-label {
    margin-top: 12px;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}
</style>
