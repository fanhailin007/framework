<template>
  <div class="channel-analysis">
    <div class="channel-list">
      <div v-for="channel in channelData" :key="channel.name" class="channel-item">
        <div class="channel-info">
          <div class="channel-name">{{ channel.name }}</div>
          <div class="channel-desc">{{ channel.description }}</div>
        </div>
        <div class="channel-stats">
          <div class="stat-item">
            <span class="stat-label">访问量</span>
            <span class="stat-value">{{ channel.visits }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">转化率</span>
            <span class="stat-value">{{ channel.conversion }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">收入</span>
            <span class="stat-value">¥{{ channel.revenue }}</span>
          </div>
        </div>
        <div class="channel-trend">
          <el-progress :color="getChannelColor(channel.performance)" :percentage="channel.performance" :stroke-width="6" />
          <span class="trend-text">{{ channel.performance }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'StatisticChannelAnalysis',
})

const channelData = ref([
  {
    name: '官网',
    description: '官方网站流量',
    visits: 12345,
    conversion: 12.5,
    revenue: 23456,
    performance: 80,
  },
  {
    name: '小程序',
    description: '微信小程序流量',
    visits: 9876,
    conversion: 10.2,
    revenue: 19876,
    performance: 70,
  },
  {
    name: 'APP',
    description: '移动端APP流量',
    visits: 7654,
    conversion: 8.9,
    revenue: 15678,
    performance: 60,
  },
  {
    name: '线下门店',
    description: '实体门店流量',
    visits: 5432,
    conversion: 6.7,
    revenue: 12345,
    performance: 50,
  },
])

const getChannelColor = (performance: number) => {
  if (performance >= 80) return 'var(--el-color-success)'
  if (performance >= 60) return 'var(--el-color-primary)'
  if (performance >= 40) return 'var(--el-color-warning)'
  return 'var(--el-color-danger)'
}
</script>

<style lang="scss" scoped>
.channel-analysis {
  .channel-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .channel-item {
      flex: 1 1 220px;
      min-width: 220px;
      padding: 16px;
      background: var(--el-bg-color-overlay);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      .channel-info {
        margin-bottom: 12px;

        .channel-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .channel-desc {
          font-size: 12px;
          color: var(--el-text-color-regular);
        }
      }

      .channel-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: var(--el-text-color-regular);
          }

          .stat-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
        }
      }

      .channel-trend {
        display: flex;
        gap: 8px;
        align-items: center;

        .trend-text {
          font-size: 12px;
          color: var(--el-text-color-info);
        }
      }
    }
  }
}
</style>
