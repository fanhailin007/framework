<template>
  <div class="step-form-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">分步表单</h2>
      <p class="page-description">通过分步引导完成复杂表单填写，提升用户体验</p>
    </div>

    <!-- 主容器 -->
    <div class="form-container">
      <el-row :gutter="40">
        <!-- 左侧步骤导航 -->
        <el-col :lg="6" :md="8" :sm="24" :xs="24">
          <div class="step-navigation">
            <div class="nav-header">
              <h3>填写步骤</h3>
              <div class="progress-info">
                <span class="progress-text">完成进度</span>
                <span
                  class="progress-percent"
                  :class="{
                    completed: Math.min(active, steps.length) === steps.length,
                  }"
                >
                  {{ Math.round((Math.min(active, steps.length) / steps.length) * 100) }}%
                </span>
              </div>
            </div>

            <div class="step-list">
              <div
                v-for="(step, index) in steps"
                :key="index"
                class="step-item"
                :class="{
                  active: active === index,
                  completed: active > index || active === steps.length,
                  disabled: active < index && active !== steps.length,
                }"
                @click="handleStepClick(index)"
              >
                <div class="step-icon">
                  <el-icon v-if="active > index || active === steps.length">
                    <check />
                  </el-icon>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="step-content">
                  <div class="step-title">{{ step.title }}</div>
                  <div class="step-description">{{ step.description }}</div>
                </div>
                <div class="step-status">
                  <el-icon v-if="active > index || active === steps.length" class="completed-icon">
                    <check />
                  </el-icon>
                  <el-icon v-else-if="active === index" class="current-icon">
                    <loading />
                  </el-icon>
                </div>
              </div>
            </div>

            <!-- 步骤提示 -->
            <div class="step-tips">
              <div class="tip-item">
                <el-icon>
                  <info-filled />
                </el-icon>
                <span>每个步骤都需要完成才能继续</span>
              </div>
              <div class="tip-item">
                <el-icon>
                  <clock />
                </el-icon>
                <span>预计完成时间：3-5分钟</span>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧表单内容 -->
        <el-col :lg="18" :md="16" :sm="24" :xs="24">
          <div class="form-content">
            <!-- 步骤指示器 -->
            <div class="step-indicator">
              <el-steps :active="active" align-center class="steps" finish-status="success">
                <el-step
                  v-for="(step, index) in steps"
                  :key="index"
                  :description="step.description"
                  :icon="step.icon"
                  :title="step.title"
                />
              </el-steps>
            </div>

            <!-- 表单卡片 -->
            <vab-card class="form-card">
              <template #header>
                <div class="card-header">
                  <div class="header-left">
                    <h3 class="card-title">{{ steps[active].title }}</h3>
                    <p class="card-subtitle">{{ steps[active].description }}</p>
                  </div>
                  <div class="header-right">
                    <el-tag class="status-tag" :type="getStepStatusType(active)">
                      {{ getStepStatusText(active) }}
                    </el-tag>
                  </div>
                </div>
              </template>

              <!-- 步骤内容 -->
              <div class="step-content-wrapper">
                <step1 v-if="active === 0" ref="step1Ref" />
                <step2 v-if="active === 1" ref="step2Ref" :info-data="form" />
                <step3 v-if="active === 2" ref="step3Ref" :info-data="form" />
              </div>

              <!-- 底部操作按钮 -->
              <div class="form-actions">
                <div class="action-left">
                  <el-button v-if="active > 0" :icon="ArrowLeft" @click="handlePrev">上一步</el-button>
                </div>
                <div class="action-center">
                  <el-button v-if="active < 2" :icon="ArrowRight" :loading="loading" type="primary" @click="handleNext">下一步</el-button>
                  <el-button v-if="active === 2" :icon="Check" :loading="loading" type="success" @click="handleComplete">完成</el-button>
                </div>
                <div class="action-right">
                  <el-button :icon="Refresh" @click="handleReset">重置</el-button>
                  <el-button :icon="Download" @click="handleSave">保存草稿</el-button>
                </div>
              </div>
            </vab-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight, Check, CircleCheck, Clock, CreditCard, Download, InfoFilled, Refresh, User } from '@element-plus/icons-vue'

defineOptions({
  name: 'StepForm',
})

// 响应式数据
const active = ref<number>(0)
const form = reactive<any>({})
const loading = ref<boolean>(false)

// 子组件引用
const step1Ref = ref()
const step2Ref = ref()
const step3Ref = ref()

// 步骤配置
const steps = ref([
  {
    title: '基本信息',
    description: '填写个人基本信息',
    icon: User,
    status: 'pending',
  },
  {
    title: '支付信息',
    description: '确认支付相关信息',
    icon: CreditCard,
    status: 'pending',
  },
  {
    title: '完成确认',
    description: '确认所有信息无误',
    icon: CircleCheck,
    status: 'pending',
  },
])

// 处理步骤点击
const handleStepClick = (index: number) => {
  if (active.value === steps.value.length) {
    $baseMessage('表单已完成，无法修改步骤', 'info', 'hey')
    return
  }
  if (index <= active.value) {
    active.value = index
  } else {
    $baseMessage('请先完成当前步骤', 'warning', 'hey')
  }
}

// 上一步
const handlePrev = () => {
  if (active.value > 0) {
    active.value--
  }
}

// 下一步
const handleNext = async () => {
  try {
    loading.value = true

    // 根据当前步骤进行验证
    if (active.value === 0) {
      const step1Data = await step1Ref.value?.validate()
      Object.assign(form, step1Data)
    } else if (active.value === 1) {
      const step2Data = await step2Ref.value?.validate()
      Object.assign(form, step2Data)
    }

    // 进入下一步
    if (active.value < 2) {
      active.value++
    }
  } catch {
    $baseMessage('请完善当前步骤的信息', 'warning', 'hey')
  } finally {
    loading.value = false
  }
}

// 完成
const handleComplete = () => {
  loading.value = true
  setTimeout(() => {
    // 将所有步骤标记为完成状态
    active.value = steps.value.length
    $baseMessage('表单提交成功！', 'success', 'hey')
    loading.value = false
  }, 2000)
}

// 重置
const handleReset = () => {
  $baseConfirm('确定要重置所有已填写的内容吗？', null, () => {
    active.value = 0
    Object.keys(form).forEach((key) => delete form[key])
    $baseMessage('表单已重置', 'success', 'hey')
  })
}

// 保存草稿
const handleSave = () => {
  loading.value = true
  setTimeout(() => {
    $baseMessage('草稿保存成功', 'success', 'hey')
    loading.value = false
  }, 1000)
}

// 获取步骤状态类型
const getStepStatusType = (index: number) => {
  if (active.value > index || active.value === steps.value.length) return 'success'
  if (active.value === index) return 'primary'
  return 'info'
}

// 获取步骤状态文本
const getStepStatusText = (index: number) => {
  if (active.value > index || active.value === steps.value.length) return '已完成'
  if (active.value === index) return '进行中'
  return '待完成'
}
</script>

<style lang="scss" scoped>
.step-form-container {
  min-height: 100vh;
  padding: 20px;
  background: var(--el-fill-color-extra-light);

  .page-header {
    margin-bottom: 30px;
    text-align: center;

    .page-title {
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: bold;
      color: var(--el-text-color-primary);
    }

    .page-description {
      margin: 0;
      font-size: 16px;
      color: var(--el-text-color-regular);
    }
  }

  .form-container {
    .step-navigation {
      position: sticky;
      top: 20px;
      padding: 20px;
      border-radius: 8px;

      .nav-header {
        padding-bottom: 15px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
          color: var(--el-text-color-primary);
        }

        .progress-info {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .progress-text {
            font-size: 14px;
            color: var(--el-text-color-regular);
          }

          .progress-percent {
            font-size: 16px;
            font-weight: bold;
            color: var(--el-color-primary);

            &.completed {
              color: var(--el-color-success);
            }
          }
        }
      }

      .step-list {
        .step-item {
          display: flex;
          align-items: center;
          padding: 15px;
          margin-bottom: 10px;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 6px;
          transition: all 0.3s ease;

          &:hover {
            background: var(--el-fill-color-light);
          }

          &.active {
            background: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);
          }

          &.completed {
            background: var(--el-color-success-light-9);
            border-color: var(--el-color-success);
          }

          &.disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }

          .step-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            margin-right: 12px;
            font-size: 14px;
            font-weight: bold;
            color: white;
            background: var(--el-color-primary);
            border-radius: 50%;

            .el-icon {
              font-size: 16px;
            }
          }

          &.active .step-icon {
            background: var(--el-color-primary);
          }

          &.completed .step-icon {
            background: var(--el-color-success);
          }

          .step-content {
            flex: 1;
            min-width: 0;

            .step-title {
              margin-bottom: 4px;
              font-size: 14px;
              font-weight: bold;
              color: var(--el-text-color-primary);
            }

            .step-description {
              font-size: 12px;
              color: var(--el-text-color-regular);
            }
          }

          .step-status {
            .completed-icon {
              font-size: 16px;
              color: var(--el-color-success);
            }

            .current-icon {
              font-size: 16px;
              color: var(--el-color-primary);
            }
          }
        }
      }

      .step-tips {
        padding-top: 15px;
        margin-top: 20px;
        border-top: 1px solid var(--el-border-color-lighter);

        .tip-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          color: var(--el-text-color-secondary);

          .el-icon {
            margin-right: 6px;
            font-size: 14px;
          }
        }
      }
    }

    .form-content {
      .step-indicator {
        margin-bottom: 20px;

        .steps {
          :deep() {
            .el-step__title.is-process {
              color: var(--el-color-primary);
            }

            .el-step__description.is-process {
              color: var(--el-color-primary);
            }

            .el-step__head {
              &.is-process {
                color: var(--el-color-primary);
                border-color: var(--el-color-primary);

                .el-step__icon.is-text {
                  color: var(--el-color-primary);
                  border: 1px solid;
                }
              }

              &.is-finish {
                .el-step__icon.is-text {
                  color: var(--el-color-white);
                  background: var(--el-color-primary);
                }

                .el-step__line {
                  background: var(--el-color-primary);
                }
              }
            }
          }
        }
      }

      .form-card {
        :deep(.el-card__header) {
          padding: 20px;
        }

        .card-header {
          display: flex;
          align-items: center;
          width: 100%;

          .header-left {
            flex: 1;

            .card-title {
              margin: 0 0 5px 0;
              font-size: 18px;
              color: var(--el-text-color-primary);
            }

            .card-subtitle {
              margin: 0;
              font-size: 14px;
              color: var(--el-text-color-regular);
            }
          }

          .header-right {
            margin-left: auto;

            .status-tag {
              font-weight: 500;
            }
          }
        }

        .step-content-wrapper {
          min-height: 300px;
          padding: 20px 0;
        }

        .form-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid var(--el-border-color-lighter);

          .action-left,
          .action-center,
          .action-right {
            display: flex;
            gap: 10px;
          }
        }
      }
    }
  }
}
</style>
