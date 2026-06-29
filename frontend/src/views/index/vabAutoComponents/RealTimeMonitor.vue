<template>
  <div class="real-time-monitor">
    <!-- 顶部统计指标 -->
    <div class="monitor-stats">
      <div v-for="stat in stats" :key="stat.id" class="stat-item">
        <div class="stat-icon">
          <el-icon :size="16">
            <component :is="getIconComponent(stat.icon)" />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div class="stat-trend" :class="stat.trend">
          <el-icon :size="12">
            <component :is="getIconComponent(stat.trend === 'up' ? 'ArrowUp' : 'ArrowDown')" />
          </el-icon>
          <span>{{ stat.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- 实时数据流 -->
    <div class="data-stream">
      <div class="stream-header">
        <span class="stream-title">实时数据流</span>
        <div class="stream-status">
          <div class="status-dot"></div>
          <span>活跃</span>
        </div>
      </div>
      <div class="stream-content">
        <div v-for="(item, index) in dataStream" :key="item.id" class="stream-item" :style="{ animationDelay: `${index * 0.2}s` }">
          <div class="item-time">{{ item.time }}</div>
          <div class="item-message">{{ item.message }}</div>
          <div class="item-type" :class="item.type">{{ item.typeText }}</div>
        </div>
      </div>
    </div>

    <!-- 系统健康度 -->
    <div class="health-indicator">
      <div class="health-header">
        <span>系统健康度</span>
        <span class="health-score">{{ healthScore }}%</span>
      </div>
      <div class="health-bar">
        <div class="health-fill" :style="{ width: healthScore + '%' }"></div>
        <div class="health-pulse"></div>
      </div>
    </div>

    <!-- 动态粒子效果 -->
    <div class="particles">
      <div v-for="i in 8" :key="i" class="particle" :style="{ '--particle-index': i }"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowUp, Connection, DataLine, Monitor, Warning } from '@element-plus/icons-vue'

defineOptions({
  name: 'RealTimeMonitor',
})

interface StatItem {
  id: number
  icon: string
  value: string
  label: string
  trend: 'up' | 'down'
  percentage: number
}

interface StreamItem {
  id: number
  time: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  typeText: string
}

// 图标映射
const iconMap: Record<string, any> = {
  Monitor,
  DataLine,
  Connection,
  Warning,
  ArrowUp,
  ArrowDown,
}

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Monitor
}

const stats = ref<StatItem[]>([
  {
    id: 1,
    icon: 'Monitor',
    value: '1,234',
    label: '在线设备',
    trend: 'up',
    percentage: 12.5,
  },
  {
    id: 2,
    icon: 'DataLine',
    value: '89.7%',
    label: '系统负载',
    trend: 'down',
    percentage: 3.2,
  },
  {
    id: 3,
    icon: 'Connection',
    value: '2.1ms',
    label: '响应时间',
    trend: 'up',
    percentage: 8.7,
  },
])

const dataStream = ref<StreamItem[]>([
  {
    id: 1,
    time: '14:32:15',
    message: '用户登录成功',
    type: 'success',
    typeText: '成功',
  },
  {
    id: 2,
    time: '14:31:58',
    message: '数据库连接异常',
    type: 'warning',
    typeText: '警告',
  },
  {
    id: 3,
    time: '14:31:42',
    message: '缓存更新完成',
    type: 'info',
    typeText: '信息',
  },
  {
    id: 4,
    time: '14:31:25',
    message: 'API调用超时',
    type: 'error',
    typeText: '错误',
  },
])

const healthScore = ref(87)

let healthInterval: NodeJS.Timeout

onMounted(() => {
  // 模拟健康度变化
  healthInterval = setInterval(() => {
    healthScore.value = Math.max(75, Math.min(95, healthScore.value + (Math.random() - 0.5) * 10))
  }, 3000)
})

onUnmounted(() => {
  if (healthInterval) {
    clearInterval(healthInterval)
  }
})
</script>

<style lang="scss" scoped>
.real-time-monitor {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  padding-top: 10px;
  overflow: hidden;

  // 统计指标
  .monitor-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .stat-item {
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(1, 255, 255, 0.2);
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(1, 255, 255, 0.5);
        box-shadow: 0 0 10px rgba(1, 255, 255, 0.2);
      }

      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        color: #01ffff;
        background: rgba(1, 255, 255, 0.1);
        border-radius: 4px;
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.2;
          color: #fff;
        }

        .stat-label {
          font-size: 11px;
          line-height: 1.2;
          color: rgba(255, 255, 255, 0.7);
        }
      }

      .stat-trend {
        display: flex;
        gap: 2px;
        align-items: center;
        font-size: 11px;
        font-weight: 500;

        &.up {
          color: #2ed573;
        }

        &.down {
          color: #ff4757;
        }
      }
    }
  }

  // 数据流
  .data-stream {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(1, 255, 255, 0.2);
    border-radius: 4px;

    .stream-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(1, 255, 255, 0.1);
      border-bottom: 1px solid rgba(1, 255, 255, 0.2);

      .stream-title {
        font-size: 12px;
        font-weight: 500;
        color: #01ffff;
      }

      .stream-status {
        display: flex;
        gap: 4px;
        align-items: center;
        font-size: 11px;
        color: #2ed573;

        .status-dot {
          width: 6px;
          height: 6px;
          background: #2ed573;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
      }
    }

    .stream-content {
      flex: 1;
      padding: 8px;
      overflow-y: auto;

      // 自定义滚动条样式
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #01ffff 0%, rgba(1, 255, 255, 0.6) 100%);
        border-radius: 2px;
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(180deg, #00ffff 0%, rgba(0, 255, 255, 0.8) 100%);
          box-shadow: 0 0 8px rgba(1, 255, 255, 0.5);
        }
      }

      &::-webkit-scrollbar-corner {
        background: transparent;
      }

      .stream-item {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 6px 8px;
        margin-bottom: 4px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        opacity: 0;
        transform: translateX(-20px);
        animation: slideIn 0.5s ease-out forwards;

        .item-time {
          min-width: 50px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
        }

        .item-message {
          flex: 1;
          font-size: 11px;
          color: #fff;
        }

        .item-type {
          padding: 2px 6px;
          font-size: 10px;
          font-weight: 500;
          border-radius: 2px;

          &.success {
            color: #2ed573;
            background: rgba(46, 213, 115, 0.2);
          }

          &.warning {
            color: #ffa502;
            background: rgba(255, 165, 2, 0.2);
          }

          &.error {
            color: #ff4757;
            background: rgba(255, 71, 87, 0.2);
          }

          &.info {
            color: #01ffff;
            background: rgba(1, 255, 255, 0.2);
          }
        }
      }
    }
  }

  // 健康度指示器
  .health-indicator {
    .health-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;

      span:first-child {
        font-size: 12px;
        font-weight: 500;
        color: #fff;
      }

      .health-score {
        font-size: 14px;
        font-weight: 600;
        color: #01ffff;
      }
    }

    .health-bar {
      position: relative;
      height: 6px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 3px;

      .health-fill {
        height: 100%;
        background: linear-gradient(90deg, #2ed573 0%, #01ffff 100%);
        border-radius: 3px;
        transition: width 0.5s ease;
      }

      .health-pulse {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent 0%, rgba(1, 255, 255, 0.3) 50%, transparent 100%);
        animation: pulse 2s infinite;
      }
    }
  }

  // 粒子效果
  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    .particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: #01ffff;
      border-radius: 50%;
      animation: float 4s infinite;
      animation-delay: calc(var(--particle-index) * 0.5s);

      &:nth-child(1) {
        top: 10%;
        left: 10%;
      }

      &:nth-child(2) {
        top: 20%;
        left: 80%;
      }

      &:nth-child(3) {
        top: 40%;
        left: 20%;
      }

      &:nth-child(4) {
        top: 60%;
        left: 70%;
      }

      &:nth-child(5) {
        top: 80%;
        left: 30%;
      }

      &:nth-child(6) {
        top: 30%;
        left: 60%;
      }

      &:nth-child(7) {
        top: 70%;
        left: 40%;
      }

      &:nth-child(8) {
        top: 50%;
        left: 90%;
      }
    }
  }
}

// 动画
@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%,
  100% {
    opacity: 0.3;
    transform: translateY(0px) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px) scale(1.2);
  }
}
</style>
