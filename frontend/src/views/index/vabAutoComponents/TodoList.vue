<template>
  <div class="todo-list-container">
    <!-- 统计头部 -->
    <div class="todo-stats">
      <div class="stat-item">
        <div class="stat-number">{{ completedCount }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">{{ totalCount }}</div>
        <div class="stat-label">总任务</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">{{ progressPercent }}%</div>
        <div class="stat-label">完成率</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-text">{{ completedCount }}/{{ totalCount }}</div>
    </div>

    <!-- 待办列表 -->
    <div class="todo-list">
      <div
        v-for="(todo, index) in todoItems"
        :key="todo.id"
        class="todo-item"
        :class="{
          'todo-completed': todo.completed,
          'todo-urgent': todo.priority === 'high',
          'todo-normal': todo.priority === 'medium',
          'todo-low': todo.priority === 'low',
        }"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="toggleTodo(todo)"
      >
        <!-- 背景效果 -->
        <div class="item-background">
          <div class="item-glow"></div>
          <div class="item-border"></div>
        </div>

        <!-- 优先级标识 -->
        <div class="priority-indicator" :class="`priority-${todo.priority}`"></div>

        <!-- 主要内容 -->
        <div class="item-content">
          <div class="checkbox-wrapper">
            <div class="custom-checkbox" :class="{ checked: todo.completed }">
              <el-icon v-if="todo.completed" size="12">
                <check />
              </el-icon>
            </div>
          </div>

          <div class="todo-info">
            <div class="todo-title" :class="{ completed: todo.completed }">
              {{ todo.title }}
            </div>
            <div class="todo-meta">
              <span class="todo-time">{{ todo.time }}</span>
              <span class="todo-category">{{ todo.category }}</span>
            </div>
          </div>

          <div class="todo-actions">
            <el-button size="small" text @click.stop="editTodo()">
              <el-icon size="14">
                <edit />
              </el-icon>
            </el-button>
            <el-button size="small" text @click.stop="deleteTodo(todo)">
              <el-icon size="14">
                <delete />
              </el-icon>
            </el-button>
          </div>
        </div>

        <!-- 粒子效果 -->
        <div class="item-particles">
          <div v-for="i in 4" :key="i" class="particle" :style="{ '--particle-index': i }"></div>
        </div>
      </div>
    </div>

    <!-- 添加新任务按钮 -->
    <div class="add-todo-btn" @click="showAddDialog = true">
      <el-icon size="16">
        <plus />
      </el-icon>
      <span>添加任务</span>
    </div>

    <!-- 添加任务对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :append-to-body="false"
      :center="false"
      class="todo-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :show-close="true"
      title="添加新任务"
      width="400px"
    >
      <div class="dialog-content">
        <el-form class="todo-form" label-width="80px" :model="newTodo">
          <el-form-item label="任务标题">
            <el-input v-model="newTodo.title" class="todo-input" placeholder="请输入任务标题" />
          </el-form-item>
          <el-form-item label="优先级">
            <el-radio-group v-model="newTodo.priority" class="priority-radio-group">
              <el-radio class="priority-radio priority-high" label="high">
                <span class="radio-label">高</span>
              </el-radio>
              <el-radio class="priority-radio priority-medium" label="medium">
                <span class="radio-label">中</span>
              </el-radio>
              <el-radio class="priority-radio priority-low" label="low">
                <span class="radio-label">低</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分类">
            <el-input v-model="newTodo.category" class="todo-input" placeholder="任务分类" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="showAddDialog = false">取消</el-button>
          <el-button class="confirm-btn" type="primary" @click="addTodo">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Check, Delete, Edit, Plus } from '@element-plus/icons-vue'

defineOptions({
  name: 'TodoList',
})

interface TodoItem {
  id: number
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  category: string
  time: string
  createTime: Date
}

const todoItems = ref<TodoItem[]>([
  {
    id: 1,
    title: '完成周报撰写',
    completed: false,
    priority: 'high',
    category: '工作',
    time: '今天 14:00',
    createTime: new Date(),
  },
  {
    id: 2,
    title: '项目进度评审会议',
    completed: false,
    priority: 'high',
    category: '会议',
    time: '明天 10:00',
    createTime: new Date(),
  },
  {
    id: 3,
    title: '代码审查和优化',
    completed: true,
    priority: 'medium',
    category: '开发',
    time: '昨天 16:30',
    createTime: new Date(),
  },
  {
    id: 4,
    title: '客户需求沟通',
    completed: false,
    priority: 'medium',
    category: '沟通',
    time: '今天 15:30',
    createTime: new Date(),
  },
  {
    id: 5,
    title: '系统性能测试',
    completed: false,
    priority: 'low',
    category: '测试',
    time: '明天 14:00',
    createTime: new Date(),
  },
  {
    id: 6,
    title: '文档更新整理',
    completed: true,
    priority: 'low',
    category: '文档',
    time: '昨天 18:00',
    createTime: new Date(),
  },
])

const showAddDialog = ref(false)
const newTodo = reactive({
  title: '',
  priority: 'medium',
  category: '',
})

// 计算属性
const totalCount = computed(() => todoItems.value.length)
const completedCount = computed(() => todoItems.value.filter((item) => item.completed).length)
const progressPercent = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

// 方法
const toggleTodo = (todo: TodoItem) => {
  todo.completed = !todo.completed
  // 添加完成动画效果
  if (todo.completed) {
    $baseMessage(`任务"${todo.title}"已完成！`, 'success')
  }
}

const editTodo = () => {
  // 这里可以实现编辑功能
  $baseMessage('编辑功能开发中...', 'info')
}

const deleteTodo = (todo: TodoItem) => {
  const index = todoItems.value.findIndex((item) => item.id === todo.id)
  if (index !== -1) {
    todoItems.value.splice(index, 1)
    $baseMessage(`任务"${todo.title}"已删除`, 'success')
  }
}

const addTodo = () => {
  if (!newTodo.title.trim()) {
    $baseMessage('请输入任务标题', 'warning')
    return
  }

  const todo: TodoItem = {
    id: Date.now(),
    title: newTodo.title,
    completed: false,
    priority: newTodo.priority as 'high' | 'medium' | 'low',
    category: newTodo.category || '其他',
    time: '今天 12:00',
    createTime: new Date(),
  }

  todoItems.value.unshift(todo)
  showAddDialog.value = false

  // 重置表单
  newTodo.title = ''
  newTodo.priority = 'medium'
  newTodo.category = ''

  $baseMessage('任务添加成功！', 'success')
}

// 自动更新任务时间
const updateTaskTimes = () => {
  todoItems.value.forEach((todo) => {
    const now = new Date()
    const diff = now.getTime() - todo.createTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 24) {
      todo.time = `今天 ${todo.createTime.getHours().toString().padStart(2, '0')}:${todo.createTime.getMinutes().toString().padStart(2, '0')}`
    } else if (hours < 48) {
      todo.time = `昨天 ${todo.createTime.getHours().toString().padStart(2, '0')}:${todo.createTime.getMinutes().toString().padStart(2, '0')}`
    } else {
      todo.time = `${Math.floor(hours / 24)}天前`
    }
  })
}

onMounted(() => {
  updateTaskTimes()
  // 每分钟更新一次时间
  setInterval(updateTaskTimes, 60000)
})
</script>

<style lang="scss" scoped>
.todo-list-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  height: 100%;
  padding: 10px;
}

// 统计头部
.todo-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(1, 255, 255, 0.05) 100%);
  border: 1px solid rgba(1, 255, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);

  .stat-item {
    text-align: center;

    .stat-number {
      font-size: 20px;
      font-weight: bold;
      color: #01ffff;
      text-shadow: 0 0 10px rgba(1, 255, 255, 0.6);
    }

    .stat-label {
      margin-top: 2px;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .stat-divider {
    width: 1px;
    height: 30px;
    background: linear-gradient(to bottom, transparent, rgba(1, 255, 255, 0.5), transparent);
  }
}

// 进度条
.progress-container {
  position: relative;

  .progress-bar {
    width: 100%;
    height: 6px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(1, 255, 255, 0.2);
    border-radius: 3px;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #01ffff 0%, #00cccc 100%);
      border-radius: 3px;
      box-shadow: 0 0 10px rgba(1, 255, 255, 0.5);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .progress-text {
    position: absolute;
    top: -20px;
    right: 0;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
}

// 待办列表
.todo-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding-right: 2px;
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

.todo-item {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 8px 10px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(1, 255, 255, 0.05) 100%);
  border: 1px solid rgba(1, 255, 255, 0.3);
  border-radius: 6px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out forwards;

  &:hover {
    border-color: rgba(1, 255, 255, 0.6);
    box-shadow: 0 5px 15px rgba(1, 255, 255, 0.2);
    transform: translateX(5px);

    .item-glow {
      opacity: 1;
    }

    .item-particles .particle {
      animation: particleFloat 2s ease-in-out infinite;
    }
  }

  &.todo-completed {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 255, 0, 0.05) 100%);
    border-color: rgba(0, 255, 0, 0.3);
    opacity: 0.6;

    .todo-title {
      color: rgba(255, 255, 255, 0.5);
      text-decoration: line-through;
    }
  }

  &.todo-urgent {
    border-left: 3px solid #ff4757;

    .priority-indicator {
      background: #ff4757;
    }
  }

  &.todo-normal {
    border-left: 3px solid #ffa502;

    .priority-indicator {
      background: #ffa502;
    }
  }

  &.todo-low {
    border-left: 3px solid #2ed573;

    .priority-indicator {
      background: #2ed573;
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
  background: radial-gradient(circle, rgba(1, 255, 255, 0.1) 0%, transparent 70%);
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
  background: linear-gradient(45deg, transparent 30%, rgba(1, 255, 255, 0.05) 50%, transparent 70%);
  background-size: 200% 200%;
  border: 1px solid rgba(1, 255, 255, 0.1);
  border-radius: 6px;
  animation: borderShine 4s linear infinite;
}

.priority-indicator {
  position: absolute;
  top: 50%;
  left: 0;
  width: 3px;
  height: 60%;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px currentColor;
  transform: translateY(-50%);
}

.item-content {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
  padding: 0;
}

.checkbox-wrapper {
  flex-shrink: 0;
  margin-top: 1px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(1, 255, 255, 0.5);
  border-radius: 3px;
  transition: all 0.3s ease;

  &.checked {
    background: #01ffff;
    border-color: #01ffff;
    box-shadow: 0 0 10px rgba(1, 255, 255, 0.5);

    .el-icon {
      color: #000;
    }
  }

  .el-icon {
    font-size: 10px;
    color: transparent;
    transition: color 0.3s ease;
  }
}

.todo-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.todo-title {
  margin-bottom: 2px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 0 5px rgba(1, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.todo-meta {
  display: flex;
  gap: 6px;
  font-size: 8px;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.6);

  .todo-time {
    color: #01ffff;
  }

  .todo-category {
    padding: 0px 3px;
    background: rgba(1, 255, 255, 0.1);
    border: 1px solid rgba(1, 255, 255, 0.2);
    border-radius: 2px;
  }
}

.todo-actions {
  display: flex;
  flex-shrink: 0;
  gap: 3px;
  margin-top: 1px;
  opacity: 0;
  transition: opacity 0.3s ease;

  .el-button {
    padding: 2px;
    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: #01ffff;
      background: rgba(1, 255, 255, 0.1);
    }

    .el-icon {
      font-size: 12px;
    }
  }
}

.todo-item:hover .todo-actions {
  opacity: 1;
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
  }
}

// 添加按钮
.add-todo-btn {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 11px;
  color: rgba(1, 255, 255, 0.8);
  cursor: pointer;
  background: linear-gradient(135deg, rgba(1, 255, 255, 0.1) 0%, rgba(1, 255, 255, 0.05) 100%);
  border: 1px dashed rgba(1, 255, 255, 0.4);
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    color: #01ffff;
    background: linear-gradient(135deg, rgba(1, 255, 255, 0.2) 0%, rgba(1, 255, 255, 0.1) 100%);
    border-color: rgba(1, 255, 255, 0.6);
    box-shadow: 0 4px 12px rgba(1, 255, 255, 0.2);
    transform: translateY(-1px);
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

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0);
  }
}

// 对话框样式
:deep(.todo-dialog) {
  position: relative;
  overflow: visible;
  background: linear-gradient(135deg, rgba(1, 2, 37, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%) !important;
  border: 3px solid #01ffff !important;
  border-radius: 5px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;

  &::before {
    position: absolute;
    top: -3px;
    bottom: -3px;
    left: 30px;
    z-index: 0;
    width: calc(100% - 60px);
    pointer-events: none;
    content: '';
    border-top: 3px solid #101f58;
    border-bottom: 3px solid #101f58;
  }

  &::after {
    position: absolute;
    top: 30px;
    right: -3px;
    left: -3px;
    z-index: 0;
    height: calc(100% - 60px);
    pointer-events: none;
    content: '';
    border-right: 3px solid #101f58;
    border-left: 3px solid #101f58;
  }

  .el-dialog__header {
    position: relative;
    padding: 15px 20px !important;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: #fff !important;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        width: 24px;
        height: 24px;
        font-size: 18px;
        line-height: 22px;
        color: #fff !important;
        border: 1px solid transparent;
        transition: none;

        &:hover {
          color: #01ffff !important;
        }
      }
    }
  }

  .el-dialog__body {
    padding: 20px !important;
    color: #fff !important;
  }

  .el-dialog__footer {
    padding: 15px 20px !important;
  }

  // 表单样式
  .dialog-content {
    .todo-form {
      .el-form-item {
        margin-bottom: 18px;

        .el-form-item__label {
          font-weight: 500;
          color: #fff !important;
        }

        .el-form-item__content {
          .todo-input {
            .el-input__wrapper {
              background: rgba(0, 0, 0, 0.3) !important;
              border: 1px solid #01ffff !important;
              border-radius: 5px;
              box-shadow: none !important;
              transition: all 0.3s ease;

              &:hover {
                border-color: #01ffff !important;
                box-shadow: 0 0 10px rgba(1, 255, 255, 0.3) !important;
              }

              &.is-focus {
                border-color: #01ffff !important;
                box-shadow: 0 0 15px rgba(1, 255, 255, 0.5) !important;
              }

              .el-input__inner {
                color: #fff !important;
                background: transparent !important;

                &::placeholder {
                  color: rgba(255, 255, 255, 0.6) !important;
                }
              }
            }
          }

          .todo-select {
            .el-input__wrapper {
              background: rgba(0, 0, 0, 0.3) !important;
              border: 1px solid #01ffff !important;
              border-radius: 5px;
              box-shadow: none !important;
              transition: all 0.3s ease;

              &:hover {
                border-color: #01ffff !important;
                box-shadow: 0 0 10px rgba(1, 255, 255, 0.3) !important;
              }

              &.is-focus {
                border-color: #01ffff !important;
                box-shadow: 0 0 15px rgba(1, 255, 255, 0.5) !important;
              }

              .el-input__inner {
                color: #fff !important;
                background: transparent !important;
              }
            }
          }
        }
      }
    }
  }

  // 按钮样式
  .dialog-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;

    .cancel-btn {
      padding: 8px 20px;
      font-weight: 500;
      color: #fff !important;
      background: rgba(0, 0, 0, 0.3) !important;
      border: 1px solid #01ffff !important;
      border-radius: 5px;
      transition: all 0.3s ease;

      &:hover {
        color: #01ffff !important;
        background: rgba(1, 255, 255, 0.1) !important;
        border-color: #01ffff !important;
        box-shadow: 0 0 10px rgba(1, 255, 255, 0.3);
      }
    }

    .confirm-btn {
      padding: 8px 20px;
      font-weight: 600;
      color: #000 !important;
      background: #01ffff !important;
      border: none !important;
      border-radius: 5px;
      transition: all 0.3s ease;

      &:hover {
        background: #00ffff !important;
        box-shadow: 0 4px 15px rgba(1, 255, 255, 0.5);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  // 下拉选项样式
  :deep(.el-select-dropdown) {
    background: #01022e !important;
    border: 1px solid #01ffff !important;
    border-radius: 5px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8) !important;

    .el-select-dropdown__item {
      color: #fff !important;
      background: transparent !important;

      &:hover {
        color: #01ffff !important;
        background: rgba(1, 255, 255, 0.1) !important;
      }

      &.selected {
        font-weight: 600;
        color: #01ffff !important;
        background: rgba(1, 255, 255, 0.2) !important;
      }
    }
  }
}

// 单选按钮样式
.priority-radio-group {
  display: flex;
  gap: 15px;

  .priority-radio {
    margin: 0;

    :deep(.el-radio__input) {
      .el-radio__inner {
        width: 16px;
        height: 16px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #01ffff;
        border-radius: 50%;
        transition: all 0.3s ease;

        &:hover {
          border-color: #01ffff;
          box-shadow: 0 0 8px rgba(1, 255, 255, 0.4);
        }

        &::after {
          width: 6px;
          height: 6px;
          background: #01ffff;
          border-radius: 50%;
        }
      }

      &.is-checked {
        .el-radio__inner {
          background: rgba(1, 255, 255, 0.1);
          border-color: #01ffff;
          box-shadow: 0 0 12px rgba(1, 255, 255, 0.6);

          &::after {
            background: #01ffff;
            box-shadow: 0 0 6px rgba(1, 255, 255, 0.8);
          }
        }
      }
    }

    :deep(.el-radio__label) {
      padding-left: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
    }

    &.priority-high {
      :deep(.el-radio__input.is-checked) {
        .el-radio__inner {
          border-color: #ff4757;
          box-shadow: 0 0 12px rgba(255, 71, 87, 0.6);

          &::after {
            background: #ff4757;
            box-shadow: 0 0 6px rgba(255, 71, 87, 0.8);
          }
        }
      }

      .radio-label {
        color: #ff4757;
        text-shadow: 0 0 5px rgba(255, 71, 87, 0.5);
      }
    }

    &.priority-medium {
      :deep(.el-radio__input.is-checked) {
        .el-radio__inner {
          border-color: #ffa502;
          box-shadow: 0 0 12px rgba(255, 165, 2, 0.6);

          &::after {
            background: #ffa502;
            box-shadow: 0 0 6px rgba(255, 165, 2, 0.8);
          }
        }
      }

      .radio-label {
        color: #ffa502;
        text-shadow: 0 0 5px rgba(255, 165, 2, 0.5);
      }
    }

    &.priority-low {
      :deep(.el-radio__input.is-checked) {
        .el-radio__inner {
          border-color: #2ed573;
          box-shadow: 0 0 12px rgba(46, 213, 115, 0.6);

          &::after {
            background: #2ed573;
            box-shadow: 0 0 6px rgba(46, 213, 115, 0.8);
          }
        }
      }

      .radio-label {
        color: #2ed573;
        text-shadow: 0 0 5px rgba(46, 213, 115, 0.5);
      }
    }
  }
}
</style>
