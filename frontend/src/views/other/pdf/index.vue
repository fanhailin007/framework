<template>
  <div class="pdf-container">
    <!-- 开屏加载动画 -->
    <div v-if="loading" class="pdf-loading">
      <div class="loading-content">
        <p>PDF加载中</p>
        <div class="progress-container">
          <el-progress color="#409eff" :percentage="loadingProgress" :show-text="false" :stroke-width="8" />
          <span class="progress-text">{{ Math.round(loadingProgress) }}%</span>
        </div>
      </div>
    </div>

    <!-- PDF内容 -->
    <div v-else class="pdf-content">
      <vab-pdf :source="source" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VabPdf from '/@/plugins/VabPdf'

defineOptions({
  name: 'PDF',
})

const source = ref<any>('https://gcore.jsdelivr.net/gh/zxwk1998/image/demo.pdf')
const loading = ref(true)
const loadingProgress = ref(0)

// 模拟加载进度
onMounted(() => {
  const progressInterval = setInterval(() => {
    if (loadingProgress.value < 100) {
      const increment = Math.random() * 15 + 5 // 每次增加5-20%
      loadingProgress.value = Math.min(100, loadingProgress.value + increment)
    } else {
      clearInterval(progressInterval)
      loading.value = false
    }
  }, 200)
})
</script>

<style lang="scss" scoped>
.pdf-container {
  .pdf-loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-content {
      text-align: center;
      transform: translateY(-10%); /* 微调垂直位置 */

      .loading-icon {
        margin-bottom: 20px;

        .el-icon {
          font-size: 60px;
          color: var(--el-color-primary);
          animation: pulse 2s infinite;
        }
      }

      h3 {
        margin: 0 0 30px 0;
        font-size: 24px;
        font-weight: 500;
      }

      .progress-container {
        position: relative;

        .el-progress {
          margin-bottom: 10px;
        }

        .progress-text {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .pdf-container {
    .pdf-loading {
      .loading-content {
        transform: translateY(-5%);

        .loading-icon {
          .el-icon {
            font-size: 50px;
          }
        }

        h3 {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
