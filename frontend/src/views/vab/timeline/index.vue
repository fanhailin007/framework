<template>
  <div class="timeline-container no-background-container">
    <el-row class="mb-20" :gutter="20">
      <el-col :lg="8" :md="12" :sm="12" :xl="8" :xs="24">
        <vab-card>
          <template #header>常规风格</template>
          <el-timeline>
            <el-timeline-item v-for="(item, index) in activities" :key="index" :color="item.color" :timestamp="item.timestamp">
              <template v-if="!item.color" #dot>
                <vab-icon v-if="item.icon" :icon="item.icon" />
                <vab-dot v-if="item.waver" :type="item.waver" />
              </template>
              <vab-card v-if="item.card">
                {{ item.content }}
              </vab-card>
              <template v-else>
                {{ item.content }}
              </template>
            </el-timeline-item>
          </el-timeline>
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="12" :xl="8" :xs="24">
        <vab-card>
          <template #header>卡片风格</template>
          <el-timeline>
            <el-timeline-item v-for="(item, index) in activities" :key="index" :color="item.color" :timestamp="item.timestamp">
              <template v-if="!item.color" #dot>
                <vab-icon v-if="item.icon" :icon="item.icon" />
                <vab-dot v-if="item.waver" :type="item.waver" />
              </template>
              <div class="vab-info-card" :class="{ ['vab-info-card-' + item.cardType]: true }">
                {{ item.content }}
              </div>
            </el-timeline-item>
          </el-timeline>
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="12" :xl="8" :xs="24">
        <vab-card>
          <template #header>用户活动时间线</template>
          <el-timeline>
            <el-timeline-item v-for="(item, index) in userActivities" :key="index" :color="item.color" :timestamp="item.timestamp">
              <div class="user-activity-item">
                <div class="activity-avatar">
                  <el-avatar :size="40" :src="item.avatar">
                    {{ item.userName.charAt(0) }}
                  </el-avatar>
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <span class="user-name">{{ item.userName }}</span>
                    <span class="activity-action">{{ item.action }}</span>
                  </div>
                  <div class="activity-desc">{{ item.description }}</div>
                  <div class="activity-time">{{ item.timeAgo }}</div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="12" :xl="8" :xs="24">
        <vab-card>
          <template #header>系统日志时间线</template>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in systemLogs"
              :key="index"
              :color="getLogColor(item.level)"
              :timestamp="item.timestamp"
              :type="item.level as any"
            >
              <div class="log-item">
                <div class="log-header">
                  <el-tag size="small" :type="getLogTagType(item.level) as any">
                    {{ item.level.toUpperCase() }}
                  </el-tag>
                  <span class="log-module">{{ item.module }}</span>
                </div>
                <div class="log-message">{{ item.message }}</div>
                <div v-if="item.details" class="log-details">
                  <el-button size="small" @click="toggleLogDetails(index)">查看详情</el-button>
                  <div v-if="item.showDetails" class="log-details-content">
                    <pre>{{ item.details }}</pre>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="12" :xl="8" :xs="24">
        <vab-card>
          <template #header>工作流程时间线</template>

          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in workflowTimeline"
              :key="index"
              :color="getWorkflowColor(item.status)"
              :timestamp="item.timestamp"
              :type="item.status === 'completed' ? 'success' : item.status === 'pending' ? 'warning' : 'primary'"
            >
              <div class="workflow-item">
                <div class="workflow-step">
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-content">
                    <div class="step-title">{{ item.title }}</div>
                    <div class="step-desc">{{ item.description }}</div>
                    <div v-if="item.progress !== undefined" class="step-progress">
                      <el-progress :percentage="item.progress" :status="item.status === 'completed' ? 'success' : ''" :stroke-width="6" />
                    </div>
                  </div>
                </div>
                <div v-if="item.actions" class="workflow-actions">
                  <el-button
                    v-for="action in item.actions"
                    :key="action.name"
                    size="small"
                    :type="action.type"
                    @click="handleWorkflowAction(action, index)"
                  >
                    {{ action.name }}
                  </el-button>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </vab-card>
      </el-col>
      <el-col :lg="8" :md="12" :sm="12" :xl="8" :xs="24">
        <vab-card>
          <template #header>垂直时间线</template>
          <div class="vertical-timeline">
            <el-timeline>
              <el-timeline-item v-for="(item, index) in verticalTimeline" :key="index" placement="top" :timestamp="item.timestamp">
                <div class="vertical-timeline-item">
                  <div class="timeline-icon">
                    <el-avatar :size="40" :src="item.avatar">
                      {{ item.userName.charAt(0) }}
                    </el-avatar>
                  </div>
                  <div class="timeline-content">
                    <div class="content-title">{{ item.title }}</div>
                    <div class="content-body">{{ item.content }}</div>
                    <div class="content-footer">
                      <el-tag size="small" :type="item.tagType">
                        {{ item.tag }}
                      </el-tag>
                      <span class="time-ago">{{ item.timeAgo }}</span>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import avatarImg from '/@/assets/avatar.svg'

defineOptions({
  name: 'Timeline',
})

// 定义类型
type TimelineItem = {
  content: string
  timestamp: string
  icon?: string
  cardType?: string
  color?: string
  waver?: string
  card?: boolean
}

const activities = ref<TimelineItem[]>([
  {
    content: '支持使用默认图标',
    timestamp: '2021-04-12 20:46',
    icon: 'account-circle-line',
    cardType: 'warning',
  },
  {
    content: '支持使用默认图标',
    timestamp: '2021-04-18 20:46',
    icon: 'archive-line',
    cardType: 'danger',
  },
  {
    content: '支持自定义颜色',
    timestamp: '2021-04-03 20:46',
    color: '#13ce66',
    cardType: 'success',
  },
  {
    content: '支持默认颜色',
    timestamp: '2021-04-03 20:46',
    color: '#e4e7ed',
  },
  {
    content: '支持success闪动',
    timestamp: '2021-04-05 20:46',
    waver: 'success',
  },
  {
    content: '支持error闪动',
    timestamp: '2021-04-05 20:46',
    waver: 'danger',
  },
])

// 用户活动时间线
const userActivities = ref([
  {
    userName: '张三',
    avatar: avatarImg,
    action: '发布了新文章',
    description: '《Vue3 最佳实践指南》已发布，获得了 25 个赞',
    timestamp: '2024-01-15 14:30',
    timeAgo: '2小时前',
    color: '#409eff',
  },
  {
    userName: '李四',
    avatar: avatarImg,
    action: '评论了文章',
    description: '在《React vs Vue 对比分析》文章下发表了评论',
    timestamp: '2024-01-15 13:15',
    timeAgo: '3小时前',
    color: '#67c23a',
  },
  {
    userName: '王五',
    avatar: avatarImg,
    action: '上传了文件',
    description: '上传了项目文档 package.json，文件大小 2.3KB',
    timestamp: '2024-01-15 12:00',
    timeAgo: '4小时前',
    color: '#e6a23c',
  },
  {
    userName: '赵六',
    avatar: avatarImg,
    action: '加入了项目',
    description: '加入了"电商平台开发"项目，担任前端开发角色',
    timestamp: '2024-01-15 11:30',
    timeAgo: '5小时前',
    color: '#f56c6c',
  },
])

// 系统日志时间线
const systemLogs = ref([
  {
    level: 'info',
    module: '用户管理',
    message: '用户登录成功：admin@example.com',
    timestamp: '2024-01-15 15:30:25',
    details: 'IP: 192.168.1.100\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    showDetails: false,
  },
  {
    level: 'warning',
    module: '数据库',
    message: '数据库连接池使用率超过80%',
    timestamp: '2024-01-15 15:25:10',
    details: '当前连接数: 45/50\n建议增加连接池大小或优化查询',
    showDetails: false,
  },
  {
    level: 'danger',
    module: '文件上传',
    message: '文件上传失败：文件大小超过限制',
    timestamp: '2024-01-15 15:20:45',
    details: '文件: document.pdf\n大小: 15.2MB\n限制: 10MB',
    showDetails: false,
  },
  {
    level: 'success',
    module: '备份系统',
    message: '数据库备份完成',
    timestamp: '2024-01-15 15:15:30',
    details: '备份文件: backup_20240115.sql\n大小: 2.5GB\n耗时: 15分钟',
    showDetails: false,
  },
])

// 工作流程时间线
const workflowTimeline = ref([
  {
    title: '提交申请',
    description: '用户提交了请假申请，等待主管审批',
    timestamp: '2024-01-15 09:00',
    status: 'completed',
    progress: 100,
    actions: [{ name: '查看详情', type: 'primary' as any }],
  },
  {
    title: '主管审批',
    description: '主管正在审批请假申请',
    timestamp: '2024-01-15 10:30',
    status: 'pending',
    progress: 60,
    actions: [
      { name: '同意', type: 'success' as any },
      { name: '拒绝', type: 'danger' as any },
    ],
  },
  {
    title: 'HR确认',
    description: '等待HR部门确认和记录',
    timestamp: '2024-01-15 11:00',
    status: 'pending',
    progress: 0,
    actions: [],
  },
  {
    title: '完成',
    description: '请假申请流程完成',
    timestamp: '2024-01-15 12:00',
    status: 'pending',
    progress: 0,
    actions: [],
  },
])

// 垂直时间线
const verticalTimeline = ref([
  {
    title: '项目启动',
    content: '新项目正式启动，团队组建完成',
    timestamp: '2024-01-01',
    avatar: avatarImg,
    userName: '项目经理',
    tag: '里程碑',
    tagType: 'primary' as any,
    timeAgo: '14天前',
  },
  {
    title: '需求确认',
    content: '客户需求确认完成，开始技术方案设计',
    timestamp: '2024-01-05',
    avatar: avatarImg,
    userName: '产品经理',
    tag: '重要',
    tagType: 'success' as any,
    timeAgo: '10天前',
  },
  {
    title: '开发开始',
    content: '开发团队开始编码工作',
    timestamp: '2024-01-10',
    avatar: avatarImg,
    userName: '开发工程师',
    tag: '进行中',
    tagType: 'warning' as any,
    timeAgo: '5天前',
  },
  {
    title: '测试阶段',
    content: '进入测试阶段，发现并修复问题',
    timestamp: '2024-01-15',
    avatar: avatarImg,
    userName: '测试工程师',
    tag: '测试',
    tagType: 'danger' as any,
    timeAgo: '今天',
  },
])

// 获取日志颜色
const getLogColor = (level: string) => {
  const colors: Record<string, string> = {
    info: '#409eff',
    warning: '#e6a23c',
    error: '#f56c6c',
    success: '#67c23a',
  }
  return colors[level] || '#909399'
}

// 获取日志标签类型
const getLogTagType = (level: string) => {
  const types: Record<string, string> = {
    info: 'info',
    warning: 'warning',
    error: 'danger',
    success: 'success',
  }
  return types[level] || 'info'
}

// 获取工作流颜色
const getWorkflowColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: '#67c23a',
    pending: '#e6a23c',
    waiting: '#909399',
  }
  return colors[status] || '#909399'
}

// 切换日志详情显示
const toggleLogDetails = (index: number) => {
  systemLogs.value[index].showDetails = !systemLogs.value[index].showDetails
}

// 处理工作流操作
const handleWorkflowAction = (action: any, index: number) => {
  console.log('工作流操作:', action.name, '步骤:', index + 1)
  // 这里可以添加具体的业务逻辑
}
</script>

<style lang="scss" scoped>
.timeline-container {
  .mb-20 {
    margin-bottom: 20px;
  }

  :deep() {
    .el-card {
      display: flex;
      flex-direction: column;
      height: 700px;

      .el-card__header {
        position: relative;
        flex-shrink: 0;

        .card-header-radio {
          position: absolute;
          top: 20px;
          right: var(--el-margin);
        }
      }

      .el-card__body {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: hidden;

        .el-timeline {
          flex: 1;
          padding-top: 10px;
          padding-right: 8px;
          overflow-y: auto;

          &::-webkit-scrollbar {
            width: 6px;
          }

          &::-webkit-scrollbar-track {
            background: var(--el-border-color-lighter);
            border-radius: 3px;
          }

          &::-webkit-scrollbar-thumb {
            background: var(--el-border-color);
            border-radius: 3px;

            &:hover {
              background: var(--el-border-color-dark);
            }
          }
        }
      }

      .el-timeline-item__dot {
        [class*='ri'] {
          width: 12px;
          height: 12px;
          margin-left: -3px;
          background: var(--el-color-white);
        }

        .vab-dot {
          left: -1px;
          width: 12px;
          height: 12px;
          margin: auto !important;
        }
      }
    }
  }

  .vab-info-card {
    position: relative;
    width: 80%;
    padding: var(--el-padding);
    color: var(--el-color-info);
    background: var(--el-border-color);
    border-radius: calc(var(--el-border-radius-base) + 2px);

    &:after {
      position: absolute;
      top: 8px;
      left: -10px;
      width: 0;
      height: 0;
      overflow: hidden;
      content: '';
      border-color: var(--el-border-color) transparent transparent;
      border-style: solid dashed dashed;
      border-width: 10px;
    }

    &-success {
      color: var(--el-color-white);
      background: var(--el-color-success);

      &:after {
        border-color: var(--el-color-success) transparent transparent;
      }
    }

    &-error {
      color: var(--el-color-white);
      background: var(--el-color-error);

      &:after {
        border-color: var(--el-color-error) transparent transparent;
      }
    }

    &-warning {
      color: var(--el-color-white);
      background: var(--el-color-warning);

      &:after {
        border-color: var(--el-color-warning) transparent transparent;
      }
    }
  }

  // 时间线内容样式
  .timeline-content {
    .content-title {
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .content-desc {
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
  }

  // 用户活动样式
  .user-activity-item {
    display: flex;
    gap: 12px;

    .activity-avatar {
      flex-shrink: 0;

      :deep(.el-avatar) {
        padding: 6px;
        background: var(--el-bg-color-page);
        border: 1px solid var(--el-border-color-lighter);
      }
    }

    .activity-content {
      flex: 1;

      .activity-header {
        margin-bottom: 4px;

        .user-name {
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .activity-action {
          margin-left: 8px;
          color: var(--el-text-color-regular);
        }
      }

      .activity-desc {
        margin-bottom: 4px;
        font-size: 14px;
        color: var(--el-text-color-regular);
      }

      .activity-time {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  // 日志样式
  .log-item {
    .log-header {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;

      .log-module {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .log-message {
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--el-text-color-primary);
    }

    .log-details {
      .log-details-content {
        padding: 12px;
        margin-top: 8px;
        background: var(--el-bg-color-page);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;

        pre {
          margin: 0;
          font-size: 12px;
          color: var(--el-text-color-regular);
          word-break: break-all;
          white-space: pre-wrap;
        }
      }
    }
  }

  // 工作流样式
  .workflow-item {
    .workflow-step {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;

      .step-number {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 1;
        color: white;
        background: var(--el-color-primary);
        border-radius: 50%;
      }

      .step-content {
        flex: 1;

        .step-title {
          margin-bottom: 4px;
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .step-desc {
          margin-bottom: 8px;
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }
    }

    .workflow-actions {
      display: flex;
    }
  }

  // 垂直时间线样式
  .vertical-timeline {
    .vertical-timeline-item {
      display: flex;
      gap: 16px;

      .timeline-icon {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;

        :deep(.el-avatar) {
          padding: 6px;
          background: var(--el-bg-color-page);
          border: 1px solid var(--el-border-color-lighter);
        }
      }

      .timeline-content {
        flex: 1;

        .content-title {
          margin-bottom: 8px;
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .content-body {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--el-text-color-regular);
        }

        .content-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .time-ago {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }
}
</style>
