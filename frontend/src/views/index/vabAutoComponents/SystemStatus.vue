<template>
  <div class="system-status-container">
    <!-- 系统概览 -->
    <div class="status-overview">
      <div class="overview-item">
        <div class="item-icon">
          <el-icon size="16">
            <monitor />
          </el-icon>
        </div>
        <div class="item-info">
          <div class="item-value">{{ systemStatus.cpu }}%</div>
          <div class="item-label">CPU使用率</div>
        </div>
        <div class="item-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: systemStatus.cpu + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="overview-item">
        <div class="item-icon">
          <el-icon size="16">
            <cpu />
          </el-icon>
        </div>
        <div class="item-info">
          <div class="item-value">{{ systemStatus.memory }}%</div>
          <div class="item-label">内存使用率</div>
        </div>
        <div class="item-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: systemStatus.memory + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="overview-item">
        <div class="item-icon">
          <el-icon size="16">
            <folder />
          </el-icon>
        </div>
        <div class="item-info">
          <div class="item-value">{{ systemStatus.disk }}%</div>
          <div class="item-label">磁盘使用率</div>
        </div>
        <div class="item-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: systemStatus.disk + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 在线状态 -->
    <div class="online-status">
      <div class="status-header">
        <span class="status-title">在线状态</span>
        <div class="status-indicator" :class="{ online: isOnline }">
          <div class="indicator-dot"></div>
          <span>{{ isOnline ? '在线' : '离线' }}</span>
        </div>
      </div>

      <div class="status-grid">
        <div class="status-card">
          <div class="card-icon">
            <el-icon size="14">
              <user />
            </el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ onlineUsers }}</div>
            <div class="card-label">在线用户</div>
          </div>
        </div>

        <div class="status-card">
          <div class="card-icon">
            <el-icon size="14">
              <connection />
            </el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ activeConnections }}</div>
            <div class="card-label">活跃连接</div>
          </div>
        </div>

        <div class="status-card">
          <div class="card-icon">
            <el-icon size="14">
              <timer />
            </el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ uptime }}</div>
            <div class="card-label">运行时间</div>
          </div>
        </div>

        <div class="status-card">
          <div class="card-icon">
            <el-icon size="14">
              <data-line />
            </el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ responseTime }}ms</div>
            <div class="card-label">响应时间</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务状态 -->
    <div class="service-status">
      <div class="service-header">
        <span class="service-title">服务状态</span>
      </div>

      <div class="service-list">
        <div
          v-for="service in services"
          :key="service.name"
          class="service-item"
          :class="{
            'service-error': service.status === 'error',
            'service-warning': service.status === 'warning',
          }"
        >
          <div class="service-icon">
            <el-icon size="12">
              <component :is="getServiceIcon(service.status)" />
            </el-icon>
          </div>
          <div class="service-info">
            <div class="service-name">{{ service.name }}</div>
            <div class="service-desc">{{ service.description }}</div>
          </div>
          <div class="service-status-indicator" :class="`status-${service.status}`">
            <div class="status-dot"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CircleCheck, CircleClose, Connection, Cpu, DataLine, Folder, Monitor, Timer, User, Warning } from '@element-plus/icons-vue'

defineOptions({
  name: 'SystemStatus',
})

interface Service {
  name: string
  description: string
  status: 'normal' | 'warning' | 'error'
}

const systemStatus = reactive({
  cpu: 45,
  memory: 68,
  disk: 32,
})

const isOnline = ref(true)
const onlineUsers = ref(156)
const activeConnections = ref(89)
const uptime = ref('15天')
const responseTime = ref(128)

const services = ref<Service[]>([
  { name: 'Web服务', description: 'HTTP服务运行正常', status: 'normal' },
  { name: '数据库', description: 'MySQL连接正常', status: 'normal' },
  { name: '缓存服务', description: 'Redis响应较慢', status: 'warning' },
  { name: '文件服务', description: '存储空间充足', status: 'normal' },
  { name: '消息队列', description: 'RabbitMQ运行正常', status: 'normal' },
  { name: '监控服务', description: 'Prometheus数据异常', status: 'error' },
])

const getServiceIcon = (status: string) => {
  switch (status) {
    case 'normal': {
      return CircleCheck
    }
    case 'warning': {
      return Warning
    }
    case 'error': {
      return CircleClose
    }
    default: {
      return CircleCheck
    }
  }
}

// 模拟数据更新
let updateTimer: NodeJS.Timeout | null = null

const updateSystemData = () => {
  // 模拟CPU使用率变化
  systemStatus.cpu = Math.max(20, Math.min(80, systemStatus.cpu + (Math.random() - 0.5) * 10))

  // 模拟内存使用率变化
  systemStatus.memory = Math.max(40, Math.min(90, systemStatus.memory + (Math.random() - 0.5) * 5))

  // 模拟磁盘使用率变化
  systemStatus.disk = Math.max(25, Math.min(60, systemStatus.disk + (Math.random() - 0.5) * 3))

  // 模拟在线用户变化
  onlineUsers.value = Math.max(100, Math.min(200, onlineUsers.value + Math.floor((Math.random() - 0.5) * 10)))

  // 模拟活跃连接变化
  activeConnections.value = Math.max(50, Math.min(120, activeConnections.value + Math.floor((Math.random() - 0.5) * 8)))

  // 模拟响应时间变化
  responseTime.value = Math.max(80, Math.min(200, responseTime.value + Math.floor((Math.random() - 0.5) * 20)))
}

onMounted(() => {
  updateSystemData()
  updateTimer = setInterval(updateSystemData, 3000)
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style lang="scss" scoped>
.system-status-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 8px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(1, 255, 255, 0.3);
    border-radius: 2px;

    &:hover {
      background: rgba(1, 255, 255, 0.5);
    }
  }
}

// 系统概览
.status-overview {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.overview-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 8px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(1, 255, 255, 0.05) 100%);
  border: 1px solid rgba(1, 255, 255, 0.2);
  border-radius: 6px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(1, 255, 255, 0.4);
    box-shadow: 0 2px 8px rgba(1, 255, 255, 0.1);
  }

  .item-icon {
    flex-shrink: 0;
    color: #01ffff;
  }

  .item-info {
    flex: 1;
    min-width: 0;

    .item-value {
      font-size: 12px;
      font-weight: bold;
      color: #01ffff;
      text-shadow: 0 0 5px rgba(1, 255, 255, 0.5);
    }

    .item-label {
      margin-top: 1px;
      font-size: 8px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .item-progress {
    flex-shrink: 0;
    width: 50px;

    .progress-bar {
      width: 100%;
      height: 3px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(1, 255, 255, 0.2);
      border-radius: 2px;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #01ffff 0%, #00cccc 100%);
        border-radius: 2px;
        box-shadow: 0 0 4px rgba(1, 255, 255, 0.5);
        transition: width 0.8s ease;
      }
    }
  }
}

// 在线状态
.online-status {
  .status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;

    .status-title {
      font-size: 10px;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 0 5px rgba(1, 255, 255, 0.3);
    }

    .status-indicator {
      display: flex;
      gap: 3px;
      align-items: center;
      font-size: 8px;
      color: rgba(255, 255, 255, 0.7);

      .indicator-dot {
        width: 5px;
        height: 5px;
        background: #ff4757;
        border-radius: 50%;
        animation: pulse 2s infinite;

        .online & {
          background: #2ed573;
        }
      }
    }
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }

  .status-card {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 6px 8px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(1, 255, 255, 0.03) 100%);
    border: 1px solid rgba(1, 255, 255, 0.15);
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(1, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .card-icon {
      flex-shrink: 0;
      color: #01ffff;
    }

    .card-content {
      flex: 1;
      min-width: 0;

      .card-value {
        font-size: 10px;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 0 3px rgba(1, 255, 255, 0.3);
      }

      .card-label {
        margin-top: 1px;
        font-size: 7px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

// 服务状态
.service-status {
  .service-header {
    margin-bottom: 6px;

    .service-title {
      font-size: 10px;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 0 5px rgba(1, 255, 255, 0.3);
    }
  }

  .service-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .service-item {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 5px 6px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(1, 255, 255, 0.03) 100%);
    border: 1px solid rgba(1, 255, 255, 0.15);
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(1, 255, 255, 0.3);
    }

    &.service-error {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(255, 71, 87, 0.05) 100%);
      border-color: rgba(255, 71, 87, 0.4);
    }

    &.service-warning {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(255, 165, 2, 0.05) 100%);
      border-color: rgba(255, 165, 2, 0.4);
    }

    .service-icon {
      flex-shrink: 0;

      .service-error & {
        color: #ff4757;
      }

      .service-warning & {
        color: #ffa502;
      }

      .service-item:not(.service-error):not(.service-warning) & {
        color: #2ed573;
      }
    }

    .service-info {
      flex: 1;
      min-width: 0;

      .service-name {
        margin-bottom: 1px;
        font-size: 9px;
        font-weight: 500;
        color: #fff;
      }

      .service-desc {
        font-size: 7px;
        line-height: 1.2;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .service-status-indicator {
      flex-shrink: 0;

      .status-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        animation: pulse 2s infinite;

        .status-normal & {
          background: #2ed573;
        }

        .status-warning & {
          background: #ffa502;
        }

        .status-error & {
          background: #ff4757;
        }
      }
    }
  }
}

// 动画
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>
