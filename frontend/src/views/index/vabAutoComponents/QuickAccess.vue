<template>
  <div class="quick-access-container">
    <div class="quick-access-grid">
      <div
        v-for="(item, index) in quickAccessItems"
        :key="item.id"
        class="quick-access-item"
        :class="{ 'item-active': item.active }"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="handleItemClick(item)"
        @mouseenter="handleMouseEnter($event, item)"
        @mouseleave="handleMouseLeave()"
      >
        <div class="item-background">
          <div class="item-glow"></div>
          <div class="item-border"></div>
        </div>
        <div class="item-content">
          <div class="item-icon">
            <el-icon :size="20">
              <component :is="getIconComponent(item.icon)" />
            </el-icon>
            <div class="icon-glow"></div>
          </div>
          <div class="item-label">{{ item.label }}</div>
          <div class="item-stats">
            <span class="stat-number">{{ item.stats }}</span>
            <span class="stat-unit">{{ item.unit }}</span>
          </div>
        </div>
        <div class="item-particles">
          <div v-for="i in 6" :key="i" class="particle" :style="{ '--particle-index': i }"></div>
        </div>
      </div>
    </div>

    <!-- 浮动提示 -->
    <div v-if="hoveredItem" class="floating-tooltip" :style="tooltipStyle">
      <div class="tooltip-content">
        <div class="tooltip-title">{{ hoveredItem.label }}</div>
        <div class="tooltip-desc">{{ hoveredItem.tooltip }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Bell, DataAnalysis, Document, Download, Edit, Plus, Setting, User } from '@element-plus/icons-vue'

defineOptions({
  name: 'QuickAccess',
})

interface QuickAccessItem {
  id: string
  label: string
  description: string
  icon: string
  stats: string | number
  unit: string
  tooltip: string
  action: string
  active: boolean
  color: string
}

const quickAccessItems = reactive<QuickAccessItem[]>([
  {
    id: 'new-task',
    label: '新建任务',
    description: '创建新的工作任务',
    icon: 'Plus',
    stats: '12',
    unit: '个',
    tooltip: '快速创建新的工作任务，支持多种任务类型',
    action: 'createTask',
    active: false,
    color: '#00ffff',
  },
  {
    id: 'approval',
    label: '审批管理',
    description: '处理待审批事项',
    icon: 'Edit',
    stats: '5',
    unit: '项',
    tooltip: '查看和处理所有待审批的工作事项',
    action: 'approval',
    active: false,
    color: '#ff6b6b',
  },
  {
    id: 'report',
    label: '数据报表',
    description: '生成分析报表',
    icon: 'Document',
    stats: '8',
    unit: '份',
    tooltip: '生成各类数据分析和统计报表',
    action: 'report',
    active: false,
    color: '#4ecdc4',
  },
  {
    id: 'export',
    label: '数据导出',
    description: '导出系统数据',
    icon: 'Download',
    stats: '156',
    unit: 'MB',
    tooltip: '导出系统数据，支持多种格式',
    action: 'export',
    active: false,
    color: '#45b7d1',
  },
  {
    id: 'settings',
    label: '系统设置',
    description: '配置系统参数',
    icon: 'Setting',
    stats: '23',
    unit: '项',
    tooltip: '管理系统配置和参数设置',
    action: 'settings',
    active: false,
    color: '#96ceb4',
  },
  {
    id: 'users',
    label: '用户管理',
    description: '管理系统用户',
    icon: 'User',
    stats: '89',
    unit: '人',
    tooltip: '管理系统用户和权限配置',
    action: 'users',
    active: false,
    color: '#feca57',
  },
  {
    id: 'analytics',
    label: '数据分析',
    description: '查看统计图表',
    icon: 'DataAnalysis',
    stats: '15',
    unit: '个',
    tooltip: '查看各类数据统计和分析图表',
    action: 'analytics',
    active: false,
    color: '#ff9ff3',
  },
  {
    id: 'notifications',
    label: '消息通知',
    description: '查看系统消息',
    icon: 'Bell',
    stats: '3',
    unit: '条',
    tooltip: '查看系统消息和通知提醒',
    action: 'notifications',
    active: false,
    color: '#54a0ff',
  },
])

const hoveredItem = ref<QuickAccessItem | null>(null)
const tooltipStyle = ref({})

// 图标映射
const iconMap: Record<string, any> = {
  Plus,
  Edit,
  Document,
  Download,
  Setting,
  User,
  DataAnalysis,
  Bell,
}

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Plus
}

const handleItemClick = (item: QuickAccessItem) => {
  // 添加点击动画效果
  item.active = true
  setTimeout(() => {
    item.active = false
  }, 300)

  // 执行对应的操作
  handleQuickAction(item)
}

const handleMouseEnter = (event: MouseEvent, item: QuickAccessItem) => {
  hoveredItem.value = item
  // 计算提示框位置
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  tooltipStyle.value = {
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top - 10}px`,
    transform: 'translateX(-50%) translateY(-100%)',
  }
}

const handleMouseLeave = () => {
  hoveredItem.value = null
}

const handleQuickAction = (item: QuickAccessItem) => {
  // 这里可以根据不同的action执行不同的操作
  console.log(`执行操作: ${item.action}`)

  // 模拟操作执行
  $baseMessage(`正在执行: ${item.label}`, 'success')

  // 可以在这里添加路由跳转或其他业务逻辑
  switch (item.action) {
    case 'createTask': {
      // 跳转到创建任务页面
      break
    }
    case 'approval': {
      // 跳转到审批页面
      break
    }
    case 'report': {
      // 跳转到报表页面
      break
    }
    case 'export': {
      // 执行导出操作
      break
    }
    case 'settings': {
      // 跳转到设置页面
      break
    }
    case 'users': {
      // 跳转到用户管理页面
      break
    }
    case 'analytics': {
      // 跳转到数据分析页面
      break
    }
    case 'notifications': {
      // 跳转到消息页面
      break
    }
  }
}

// 自动轮播激活效果
let autoPlayTimer: NodeJS.Timeout | null = null

const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * quickAccessItems.length)
    quickAccessItems.forEach((item, index) => {
      item.active = index === randomIndex
    })

    setTimeout(() => {
      quickAccessItems.forEach((item) => {
        item.active = false
      })
    }, 200)
  }, 3000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style lang="scss" scoped>
.quick-access-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: hidden;

  .quick-access-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 100%;
    height: 100%;
    padding-right: 5px;
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
  }
}

.quick-access-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  padding: 8px 6px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(1, 255, 255, 0.05) 100%);
  border: 2px solid rgba(1, 255, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out forwards;

  &:hover {
    border-color: rgba(1, 255, 255, 0.8);
    box-shadow:
      0 8px 25px rgba(1, 255, 255, 0.3),
      inset 0 0 20px rgba(1, 255, 255, 0.1);
    transform: translateY(-3px) scale(1.02);

    .item-glow {
      opacity: 1;
    }

    .item-particles .particle {
      animation: particleFloat 2s ease-in-out infinite;
    }

    .item-icon {
      transform: scale(1.1);
    }
  }

  &.item-active {
    border-color: #01ffff;
    box-shadow:
      0 0 30px rgba(1, 255, 255, 0.6),
      inset 0 0 30px rgba(1, 255, 255, 0.2);
    transform: scale(1.05);

    .item-content {
      transform: scale(1.05);
    }
  }
}

.item-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.item-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(1, 255, 255, 0.15) 0%, transparent 70%);
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
}

.item-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 30%, rgba(1, 255, 255, 0.1) 50%, transparent 70%);
  background-size: 200% 200%;
  border: 1px solid rgba(1, 255, 255, 0.2);
  border-radius: 8px;
  animation: borderShine 4s linear infinite;
}

.item-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}

.item-icon {
  position: relative;
  margin-bottom: 4px;
  color: #01ffff;
  transition: transform 0.3s ease;

  .icon-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    background: radial-gradient(circle, rgba(1, 255, 255, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: iconPulse 2s ease-in-out infinite;
  }
}

.item-label {
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(1, 255, 255, 0.6);
}

.item-stats {
  display: flex;
  gap: 2px;
  align-items: baseline;

  .stat-number {
    font-size: 14px;
    font-weight: bold;
    color: #01ffff;
    text-shadow: 0 0 8px rgba(1, 255, 255, 0.6);
  }

  .stat-unit {
    font-size: 8px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.item-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #01ffff;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(1, 255, 255, 0.8);
    opacity: 0;

    &:nth-child(1) {
      top: 20%;
      left: 20%;
    }

    &:nth-child(2) {
      top: 20%;
      right: 20%;
    }

    &:nth-child(3) {
      bottom: 20%;
      left: 20%;
    }

    &:nth-child(4) {
      right: 20%;
      bottom: 20%;
    }

    &:nth-child(5) {
      top: 50%;
      left: 10%;
    }

    &:nth-child(6) {
      top: 50%;
      right: 10%;
    }
  }
}

.floating-tooltip {
  position: fixed;
  z-index: 1000;
  pointer-events: none;

  .tooltip-content {
    min-width: 180px;
    padding: 12px;
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid #01ffff;
    border-radius: 8px;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(1, 255, 255, 0.2);
    backdrop-filter: blur(15px);

    .tooltip-title {
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #01ffff;
      text-shadow: 0 0 8px rgba(1, 255, 255, 0.5);
    }

    .tooltip-desc {
      margin-bottom: 10px;
      font-size: 11px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.8);
    }

    .tooltip-actions {
      pointer-events: auto;

      .el-button {
        font-weight: 600;
        color: #000;
        text-shadow: none;
        background: linear-gradient(135deg, #01ffff 0%, #00cccc 100%);
        border: none;

        &:hover {
          background: linear-gradient(135deg, #00ffff 0%, #00dddd 100%);
          box-shadow: 0 4px 12px rgba(1, 255, 255, 0.4);
          transform: translateY(-1px);
        }
      }
    }
  }
}

// 动画定义
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes borderShine {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 200%;
  }
}

@keyframes iconPulse {
  0%,
  100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-8px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-16px) scale(0);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .quick-access-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .quick-access-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .quick-access-item {
    min-height: 70px;
    padding: 6px 4px;
  }

  .item-label {
    font-size: 10px;
  }

  .item-stats {
    font-size: 8px;
  }

  .item-icon .el-icon {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .quick-access-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .quick-access-item {
    min-height: 60px;
    padding: 5px 3px;
  }

  .item-label {
    font-size: 9px;
  }

  .item-stats {
    font-size: 7px;
  }

  .item-icon .el-icon {
    font-size: 16px;
  }
}
</style>
