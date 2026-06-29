<template>
  <div class="magnifier-container">
    <!-- 移动端提示 -->
    <div class="hidden-sm-and-up">
      <vab-alert title="手机端不支持放大镜演示" type="warning" />
    </div>

    <!-- 主要内容区域 -->
    <div class="hidden-xs-only">
      <div class="main-layout">
        <!-- 图片展示区域 -->
        <div class="image-area">
          <div class="image-section">
            <div class="image-wrapper">
              <vab-magnifier
                :height="height"
                :out-zoomer="showType"
                :scale="scale"
                :type="type"
                :url="landscape"
                :width="width"
                :zoomer-style="{
                  'background-color': taobao ? 'transparent' : 'rgba(0,0,0,0)',
                }"
              >
                <template v-if="taobao" #zoomer>
                  <div class="image-zoom-wrap"></div>
                </template>
              </vab-magnifier>
            </div>
          </div>
        </div>

        <!-- 控制面板 -->
        <div class="control-area">
          <vab-card>
            <div class="control-section">
              <!-- 当前状态显示 -->
              <div class="status-section">
                <div class="status-item">
                  <span class="status-label">放大倍数：</span>
                  <el-tag type="primary">{{ scale }}x</el-tag>
                </div>
                <div class="status-item">
                  <span class="status-label">放大镜宽度：</span>
                  <el-tag type="success">{{ width }}px</el-tag>
                </div>
              </div>

              <!-- 放大镜设置 -->
              <div class="control-group">
                <div class="control-row">
                  <span class="control-label">放大倍数</span>
                  <div class="control-buttons">
                    <el-button :disabled="scale >= 5" @click="addScale">
                      <el-icon>
                        <plus />
                      </el-icon>
                    </el-button>
                    <el-button :disabled="scale <= 0.5" @click="subScale">
                      <el-icon>
                        <minus />
                      </el-icon>
                    </el-button>
                  </div>
                </div>

                <div class="control-row">
                  <span class="control-label">放大镜宽度</span>
                  <div class="control-buttons">
                    <el-button :disabled="width >= 300" @click="addSelectorWidth">
                      <el-icon>
                        <plus />
                      </el-icon>
                    </el-button>
                    <el-button :disabled="width <= 50" @click="subSelectorWidth">
                      <el-icon>
                        <minus />
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 模式切换 -->
              <div class="control-group">
                <!-- 放大镜类型切换 -->
                <div class="switch-group">
                  <div class="switch-label">
                    <span class="label-text">放大镜类型</span>
                    <span class="label-desc">
                      {{ type === 'circle' ? '圆形放大镜' : '方形放大镜' }}
                    </span>
                  </div>
                  <div class="switch-controls">
                    <el-radio-group v-model="type" @change="changeType">
                      <el-radio-button value="circle">圆形</el-radio-button>
                      <el-radio-button value="square">方形</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>

                <!-- 放大方式切换 -->
                <div class="switch-group">
                  <div class="switch-label">
                    <span class="label-text">放大方式</span>
                    <span class="label-desc">
                      {{ showType ? '外部放大显示' : '内部放大显示' }}
                    </span>
                  </div>
                  <div class="switch-controls">
                    <el-radio-group v-model="showType" @change="changeShowType">
                      <el-radio-button :value="false">内部</el-radio-button>
                      <el-radio-button :value="true">外部</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>

                <!-- 淘宝模式切换 -->
                <div class="switch-group">
                  <div class="switch-label">
                    <span class="label-text">淘宝模式</span>
                    <span class="label-desc">
                      {{ taobao ? '启用淘宝风格放大镜' : '标准放大镜模式' }}
                    </span>
                  </div>
                  <div class="switch-controls">
                    <el-switch v-model="taobao" @change="changeToTaobao" />
                  </div>
                </div>

                <!-- 快速预设 -->
                <div class="preset-section">
                  <div class="preset-buttons">
                    <el-button :type="isPresetActive('standard') ? 'primary' : 'default'" @click="setPreset('standard')">
                      标准模式
                    </el-button>
                    <el-button :type="isPresetActive('external') ? 'primary' : 'default'" @click="setPreset('external')">
                      外部放大
                    </el-button>
                    <el-button :type="isPresetActive('taobao') ? 'primary' : 'default'" @click="setPreset('taobao')">淘宝模式</el-button>
                  </div>
                </div>
              </div>

              <!-- 重置按钮 -->
              <div class="reset-section">
                <el-button class="reset-button" type="danger" @click="reset">重置所有设置</el-button>
              </div>

              <!-- 使用提示 -->
              <div class="tips-section">
                <el-alert :closable="false" description="使用鼠标滚轮可以快速调整放大倍数" show-icon title="使用提示" />
              </div>
            </div>
          </vab-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Minus, Plus } from '@element-plus/icons-vue'
import landscape from '/@/assets/common_images/landscape.jpg'

defineOptions({
  name: 'Magnifier',
})

const scale = ref<number>(2)
const type = ref<'circle' | 'square'>('circle')
const showType = ref<boolean>(false)
const width = ref<number>(168)
const taobao = ref<boolean>(false)
const height = ref<number>(-1)

const addSelectorWidth = () => {
  if (width.value < 300) {
    width.value += 20
  }
}

const subSelectorWidth = () => {
  if (width.value > 50) {
    width.value -= 20
  }
}

const addScale = () => {
  if (scale.value < 5) {
    scale.value += 0.5
  }
}

const subScale = () => {
  if (scale.value > 0.5) {
    scale.value -= 0.5
  }
}

const changeType = () => {
  // 值已经通过v-model自动更新，这里可以添加其他逻辑
}

const changeShowType = () => {
  // 值已经通过v-model自动更新，这里可以添加其他逻辑
}

const changeToTaobao = () => {
  // 当启用淘宝模式时，自动启用外部放大
  if (taobao.value) {
    showType.value = true
  }
}

const setPreset = (preset: 'standard' | 'external' | 'taobao') => {
  switch (preset) {
    case 'standard': {
      type.value = 'circle'
      showType.value = false
      taobao.value = false
      scale.value = 2
      width.value = 168
      break
    }
    case 'external': {
      type.value = 'circle'
      showType.value = true
      taobao.value = false
      scale.value = 2
      width.value = 168
      break
    }
    case 'taobao': {
      type.value = 'circle'
      showType.value = true
      taobao.value = true
      scale.value = 2
      width.value = 168
      break
    }
  }
}

const isPresetActive = (preset: 'standard' | 'external' | 'taobao') => {
  switch (preset) {
    case 'standard': {
      return type.value === 'circle' && !showType.value && !taobao.value
    }
    case 'external': {
      return type.value === 'circle' && showType.value && !taobao.value
    }
    case 'taobao': {
      return type.value === 'circle' && showType.value && taobao.value
    }
    default: {
      return false
    }
  }
}

const reset = () => {
  scale.value = 2
  type.value = 'circle'
  showType.value = false
  width.value = 168
  taobao.value = false
  height.value = -1
}

onBeforeMount(() => {
  const handleWheel = (event: WheelEvent) => {
    // 只在鼠标悬停在图片区域时阻止默认滚动行为
    const imageWrapper = document.querySelector('.image-wrapper')
    if (imageWrapper && imageWrapper.contains(event.target as Node)) {
      event.preventDefault()
      const newScale = scale.value + (event.deltaY > 0 ? -0.1 : 0.1)
      if (newScale >= 0.5 && newScale <= 5) {
        scale.value = Math.round(newScale * 100) / 100
      }
    }
  }

  // 使用现代的wheel事件
  document.addEventListener('wheel', handleWheel, { passive: false })

  // 清理事件监听器
  onUnmounted(() => {
    document.removeEventListener('wheel', handleWheel)
  })
})
</script>

<style lang="scss" scoped>
.magnifier-container {
  min-height: 100vh;
  padding: 20px;

  .main-layout {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  :deep(.el-card__body) {
    height: 800px;
  }

  .image-area {
    min-width: 0; // 防止flex子项溢出
  }

  .control-area {
    flex-shrink: 0; // 防止控制面板被压缩
    width: 400px;
    height: 100%;
  }

  .image-section {
    border-radius: var(--el-border-radius-base);
  }

  .control-section {
    padding: 16px;
    margin-bottom: 20px;
    border-radius: var(--el-border-radius-base);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color);

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .section-actions {
      display: flex;
      gap: 8px;
    }
  }

  .image-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    height: 800px;
    margin: 0 auto;
  }

  .status-section {
    margin-bottom: 20px;

    .status-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      margin-bottom: 10px;

      .status-label {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
  }

  .control-group {
    margin-bottom: 20px;

    .control-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      margin-bottom: 10px;

      .control-label {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .control-buttons {
        display: flex;
      }
    }

    .mode-buttons {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;

      .mode-button {
        flex: 1;
        height: 36px;
        font-weight: 500;
      }
    }

    .switch-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      margin-bottom: 16px;
      border-radius: var(--el-border-radius-base);

      .switch-label {
        flex: 1;
        margin-right: 12px;

        .label-text {
          display: block;
          margin-bottom: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .label-desc {
          display: block;
          font-size: 0.8rem;
          color: var(--el-text-color-regular);
        }
      }

      .switch-controls {
        flex-shrink: 0;

        .el-radio-group {
          .el-radio-button {
            .el-radio-button__inner {
              padding: 8px 16px;
              font-size: 0.85rem;
            }
          }
        }
      }
    }

    .preset-section {
      padding-top: 16px;
      margin-top: 20px;
      border-top: 1px solid var(--el-border-color);

      .preset-title {
        margin: 0 0 12px 0;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .preset-buttons {
        display: flex;
        flex-wrap: wrap;

        .el-button {
          flex: 1;
          min-width: 80px;
          font-size: 0.85rem;
        }
      }
    }

    .special-button {
      width: 100%;
      height: 40px;
      font-weight: 500;
    }
  }

  .reset-section {
    margin-bottom: 20px;

    .reset-button {
      width: 100%;
      height: 40px;
      font-weight: 500;
    }
  }

  .tips-section {
    .el-alert {
      border: none;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .magnifier-container {
    padding: 10px;

    .main-layout {
      flex-direction: column;
      gap: 16px;
    }

    .control-area {
      width: 100%;
    }

    .mode-buttons {
      flex-direction: column;
    }
  }
}

// 淘宝放大镜样式
.image-zoom-wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  cursor: move;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURT1uzv///62t27cAAAACdFJOU/8A5bcwSgAAABBJREFUeNpiYGBkYGQECDAAAA0ABMZIs2EAAAAASUVORK5CYII=)
    repeat scroll 0 0 transparent;
}
</style>
