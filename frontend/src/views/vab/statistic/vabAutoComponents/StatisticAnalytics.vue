<template>
  <div class="statistic-analytics">
    <!-- 分析概览 -->
    <el-row class="mb-20" :gutter="20">
      <el-col :span="24">
        <vab-card>
          <template #header>
            <div class="analytics-header">
              <span>数据分析概览</span>
              <div class="analytics-controls">
                <el-date-picker
                  v-model="dateRange"
                  end-placeholder="结束日期"
                  range-separator="至"
                  size="small"
                  start-placeholder="开始日期"
                  type="daterange"
                />
                <el-button size="small" type="primary" @click="refreshData">
                  <el-icon>
                    <refresh />
                  </el-icon>
                  刷新
                </el-button>
              </div>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
              <div class="analytics-card">
                <div class="card-header">
                  <div class="card-title">转化率</div>
                  <el-tooltip content="访问到购买的用户比例" placement="top">
                    <el-icon :size="16">
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <div class="card-value">{{ analyticsData.conversionRate }}%</div>
                <div class="card-trend up">
                  <el-icon :size="12">
                    <arrow-up />
                  </el-icon>
                  <span>+{{ analyticsData.conversionGrowth }}%</span>
                </div>
                <div class="card-chart">
                  <el-progress :color="conversionColors" :percentage="analyticsData.conversionRate" type="circle" :width="60" />
                </div>
              </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
              <div class="analytics-card">
                <div class="card-header">
                  <div class="card-title">客单价</div>
                  <el-tooltip content="平均每个订单的金额" placement="top">
                    <el-icon :size="16">
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <div class="card-value">¥{{ analyticsData.avgOrderValue }}</div>
                <div class="card-trend up">
                  <el-icon :size="12">
                    <arrow-up />
                  </el-icon>
                  <span>+{{ analyticsData.avgOrderGrowth }}%</span>
                </div>
                <div class="card-chart">
                  <div class="sparkline">
                    <div
                      v-for="(point, index) in analyticsData.avgOrderChart"
                      :key="index"
                      class="sparkline-point"
                      :style="{ height: point + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
              <div class="analytics-card">
                <div class="card-header">
                  <div class="card-title">复购率</div>
                  <el-tooltip content="再次购买的用户比例" placement="top">
                    <el-icon :size="16">
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <div class="card-value">{{ analyticsData.repurchaseRate }}%</div>
                <div class="card-trend down">
                  <el-icon :size="12">
                    <arrow-down />
                  </el-icon>
                  <span>-{{ analyticsData.repurchaseDecline }}%</span>
                </div>
                <div class="card-chart">
                  <el-progress :color="repurchaseColors" :percentage="analyticsData.repurchaseRate" type="circle" :width="60" />
                </div>
              </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
              <div class="analytics-card">
                <div class="card-header">
                  <div class="card-title">留存率</div>
                  <el-tooltip content="次日留存用户比例" placement="top">
                    <el-icon :size="16">
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <div class="card-value">{{ analyticsData.retentionRate }}%</div>
                <div class="card-trend up">
                  <el-icon :size="12">
                    <arrow-up />
                  </el-icon>
                  <span>+{{ analyticsData.retentionGrowth }}%</span>
                </div>
                <div class="card-chart">
                  <div class="sparkline">
                    <div
                      v-for="(point, index) in analyticsData.retentionChart"
                      :key="index"
                      class="sparkline-point"
                      :style="{ height: point + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </vab-card>
      </el-col>
    </el-row>

    <!-- 详细分析 -->
    <el-row class="mb-20" :gutter="20">
      <!-- 用户行为分析已删除 -->
      <el-col :lg="12" :md="24" :sm="24" style="display: none" :xl="12" :xs="24" />
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <vab-card>
          <template #header>渠道分析</template>
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
        </vab-card>
      </el-col>
    </el-row>

    <!-- 预测分析 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <vab-card>
          <template #header>预测分析</template>
          <el-row :gutter="20">
            <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
              <div class="prediction-card">
                <div class="prediction-header">
                  <div class="prediction-title">销售预测</div>
                  <el-tag size="small" type="success">AI预测</el-tag>
                </div>
                <div class="prediction-content">
                  <div class="prediction-value">¥{{ predictionData.salesForecast }}</div>
                  <div class="prediction-label">下月预测销售额</div>
                  <div class="prediction-confidence">
                    <span>置信度: {{ predictionData.salesConfidence }}%</span>
                    <el-progress :percentage="predictionData.salesConfidence" :show-text="false" :stroke-width="4" />
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
              <div class="prediction-card">
                <div class="prediction-header">
                  <div class="prediction-title">用户增长预测</div>
                  <el-tag size="small" type="warning">趋势分析</el-tag>
                </div>
                <div class="prediction-content">
                  <div class="prediction-value">+{{ predictionData.userGrowth }}%</div>
                  <div class="prediction-label">下月用户增长率</div>
                  <div class="prediction-confidence">
                    <span>置信度: {{ predictionData.userConfidence }}%</span>
                    <el-progress :percentage="predictionData.userConfidence" :show-text="false" :stroke-width="4" />
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
              <div class="prediction-card">
                <div class="prediction-header">
                  <div class="prediction-title">库存预警</div>
                  <el-tag size="small" type="danger">需要关注</el-tag>
                </div>
                <div class="prediction-content">
                  <div class="prediction-value">
                    {{ predictionData.stockWarning }}
                  </div>
                  <div class="prediction-label">库存不足商品数</div>
                  <div class="prediction-confidence">
                    <span>建议补货: {{ predictionData.stockRecommend }}件</span>
                    <el-progress color="#f56c6c" :percentage="predictionData.stockUrgency" :show-text="false" :stroke-width="4" />
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowUp, QuestionFilled, Refresh } from '@element-plus/icons-vue'

// 日期范围
const dateRange = ref<[Date, Date]>()

// 分析数据
const analyticsData = ref({
  conversionRate: 12.5,
  conversionGrowth: 2.3,
  avgOrderValue: 456,
  avgOrderGrowth: 8.7,
  avgOrderChart: [45, 67, 34, 78, 56, 89, 67],
  repurchaseRate: 68,
  repurchaseDecline: 1.2,
  retentionRate: 76,
  retentionGrowth: 3.4,
  retentionChart: [78, 65, 89, 67, 45, 78, 56],
})

// 渠道数据
const channelData = ref([
  {
    name: '搜索引擎',
    description: 'Google、百度等',
    visits: 23456,
    conversion: 15.2,
    revenue: 345678,
    performance: 85,
  },
  {
    name: '社交媒体',
    description: '微信、微博等',
    visits: 18923,
    conversion: 12.8,
    revenue: 234567,
    performance: 72,
  },
  {
    name: '直接访问',
    description: '直接输入网址',
    visits: 15678,
    conversion: 18.5,
    revenue: 298765,
    performance: 91,
  },
  {
    name: '外部链接',
    description: '合作伙伴网站',
    visits: 9876,
    conversion: 9.3,
    revenue: 123456,
    performance: 58,
  },
])

// 预测数据
const predictionData = ref({
  salesForecast: 1456789,
  salesConfidence: 87,
  userGrowth: 12.5,
  userConfidence: 92,
  stockWarning: 15,
  stockRecommend: 234,
  stockUrgency: 75,
})

// 转化率颜色
const conversionColors = [
  { color: 'var(--el-color-danger)', percentage: 20 },
  { color: 'var(--el-color-warning)', percentage: 40 },
  { color: 'var(--el-color-success)', percentage: 60 },
  { color: 'var(--el-color-primary)', percentage: 80 },
  { color: 'var(--el-color-info)', percentage: 100 },
]

// 复购率颜色
const repurchaseColors = [
  { color: 'var(--el-color-danger)', percentage: 20 },
  { color: 'var(--el-color-warning)', percentage: 40 },
  { color: 'var(--el-color-success)', percentage: 60 },
  { color: 'var(--el-color-primary)', percentage: 80 },
  { color: 'var(--el-color-info)', percentage: 100 },
]

// 获取渠道颜色
const getChannelColor = (performance: number) => {
  if (performance >= 80) return 'var(--el-color-success)'
  if (performance >= 60) return 'var(--el-color-warning)'
  return 'var(--el-color-danger)'
}

// 刷新数据
const refreshData = () => {
  // 模拟数据刷新
  console.log('刷新数据...')
}
</script>

<style lang="scss" scoped>
.statistic-analytics {
  .mb-20 {
    margin-bottom: 20px;
  }

  // 分析头部
  .analytics-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .analytics-controls {
      display: flex;
      gap: 12px;
    }
  }

  // 分析卡片
  .analytics-card {
    position: relative;
    padding: 20px;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 12px;

      .card-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .el-icon {
        color: var(--el-text-color-regular);
      }
    }

    .card-value {
      margin-bottom: 8px;
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .card-trend {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-size: 12px;
      font-weight: 500;

      &.up {
        color: var(--el-color-success);
      }

      &.down {
        color: var(--el-color-danger);
      }

      .el-icon {
        margin-right: 4px;
      }
    }

    .card-chart {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }

    .sparkline {
      display: flex;
      gap: 2px;
      align-items: end;
      width: 80px;
      height: 40px;

      .sparkline-point {
        flex: 1;
        background: var(--el-color-primary);
        border-radius: 1px;
        transition: all 0.3s ease;
      }
    }
  }

  // 行为分析
  .behavior-analysis {
    .behavior-metrics {
      margin-bottom: 20px;

      .metric-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid var(--el-border-color-lighter);

        &:last-child {
          border-bottom: none;
        }

        .metric-label {
          font-size: 14px;
          color: var(--el-text-color-regular);
        }

        .metric-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .metric-change {
          font-size: 12px;
          font-weight: 500;

          &.up {
            color: var(--el-color-success);
          }

          &.down {
            color: var(--el-color-danger);
          }
        }
      }
    }

    .behavior-chart {
      .chart-title {
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .chart-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        background: var(--el-bg-color-page);
        border-radius: 8px;

        .placeholder-text {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .placeholder-desc {
          margin-top: 8px;
          font-size: 12px;
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  // 渠道分析
  .channel-analysis {
    .channel-list {
      .channel-item {
        display: flex;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid var(--el-border-color-lighter);

        &:last-child {
          border-bottom: none;
        }

        .channel-info {
          flex: 1;
          margin-right: 16px;

          .channel-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--el-text-color-primary);
          }

          .channel-desc {
            margin-top: 2px;
            font-size: 12px;
            color: var(--el-text-color-regular);
          }
        }

        .channel-stats {
          display: flex;
          gap: 16px;
          margin-right: 16px;

          .stat-item {
            text-align: center;

            .stat-label {
              display: block;
              font-size: 10px;
              color: var(--el-text-color-regular);
            }

            .stat-value {
              display: block;
              font-size: 12px;
              font-weight: 600;
              color: var(--el-text-color-primary);
            }
          }
        }

        .channel-trend {
          width: 120px;

          .trend-text {
            display: block;
            margin-top: 4px;
            font-size: 10px;
            color: var(--el-text-color-regular);
            text-align: center;
          }
        }
      }
    }
  }

  // 预测分析
  .prediction-card {
    padding: 20px;
    background: var(--el-bg-color-page);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .prediction-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .prediction-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }

    .prediction-content {
      .prediction-value {
        margin-bottom: 4px;
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .prediction-label {
        margin-bottom: 12px;
        font-size: 12px;
        color: var(--el-text-color-regular);
      }

      .prediction-confidence {
        span {
          display: block;
          margin-bottom: 4px;
          font-size: 10px;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}
</style>
