<template>
  <div class="application-container">
    <!-- 自动安装提示 -->
    <div v-if="showAutoInstallPrompt && !hasShownAutoPrompt && !isInstalled" class="auto-install-prompt">
      <div class="prompt-content">
        <div class="prompt-header">
          <div class="prompt-icon">
            <el-icon color="white" size="24">
              <download />
            </el-icon>
          </div>
          <div class="prompt-close" @click="dismissAutoInstall">
            <el-icon size="16">
              <close />
            </el-icon>
          </div>
        </div>

        <div class="prompt-text">
          <h3>安装桌面应用</h3>
          <p>将此应用安装到桌面，享受原生应用体验</p>
        </div>

        <div class="prompt-actions">
          <el-button type="primary" @click="handleAutoInstall">立即安装</el-button>
          <el-button @click="dismissAutoInstall">稍后再说</el-button>
        </div>
      </div>
    </div>

    <div class="main-install-section">
      <!-- 安装状态卡片 -->
      <div class="status-card">
        <div class="status-header">
          <div class="status-content">
            <h2>{{ statusTitle }}</h2>
            <p>{{ statusDescription }}</p>
          </div>
        </div>

        <div class="status-actions">
          <el-button class="install-btn" :disabled="!hasInstallPrompt" size="large" type="primary" @click="handleInstall">
            {{ installButtonText }}
          </el-button>
        </div>
      </div>

      <!-- 应用信息卡片 -->
      <div class="info-section">
        <div class="app-info-card">
          <div class="card-header">
            <el-icon color="var(--el-color-primary)" size="20">
              <info-filled />
            </el-icon>
            <span>应用特性</span>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon">
                <el-icon color="white" size="20">
                  <monitor />
                </el-icon>
              </div>
              <div class="info-text">
                <h4>跨平台支持</h4>
                <p>支持 Windows、macOS、Linux、iOS、Android 等主流平台</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <el-icon color="white" size="20">
                  <document />
                </el-icon>
              </div>
              <div class="info-text">
                <h4>离线使用</h4>
                <p>安装后可离线使用，无需网络连接</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <el-icon color="white" size="20">
                  <setting />
                </el-icon>
              </div>
              <div class="info-text">
                <h4>自动更新</h4>
                <p>支持自动检测和安装新版本</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <el-icon color="white" size="20">
                  <lock />
                </el-icon>
              </div>
              <div class="info-text">
                <h4>安全可靠</h4>
                <p>HTTPS 加密传输，确保数据安全</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <el-icon color="white" size="20">
                  <check />
                </el-icon>
              </div>
              <div class="info-text">
                <h4>原生体验</h4>
                <p>接近原生应用的性能和体验</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 手动安装指南 -->
      <div class="manual-section">
        <div class="manual-card">
          <div class="card-header">
            <el-icon color="var(--el-color-primary)" size="20">
              <question-filled />
            </el-icon>
            <span>手动安装指南</span>
          </div>

          <div class="manual-content">
            <div class="manual-item">
              <div class="manual-icon pc-icon">
                <el-icon color="white" size="24">
                  <monitor />
                </el-icon>
              </div>
              <div class="manual-text">
                <h4>PC端安装</h4>
                <p>
                  点击浏览器地址栏右侧的安装按钮，或按
                  <kbd>Ctrl</kbd>
                  +
                  <kbd>Shift</kbd>
                  +
                  <kbd>R</kbd>
                  刷新页面
                </p>
              </div>
            </div>

            <div class="manual-item">
              <div class="manual-icon mobile-icon">
                <el-icon color="white" size="24">
                  <iphone />
                </el-icon>
              </div>
              <div class="manual-text">
                <h4>手机端安装</h4>
                <p>
                  iOS Safari：分享按钮 → 添加到主屏幕
                  <br />
                  Android Chrome：菜单 → 添加到主屏幕
                </p>
              </div>
            </div>
          </div>

          <div class="manual-actions">
            <el-button @click="showManualInstructions = true">查看详细说明</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 更新提示组件 -->
    <vab-update />

    <!-- 手动安装说明对话框 -->
    <el-dialog
      v-model="showManualInstructions"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      title="手动安装详细说明"
      width="600px"
    >
      <div class="manual-instructions">
        <div class="instruction-section">
          <h4>PC端安装步骤：</h4>
          <ol>
            <li>
              <strong>Chrome/Edge浏览器：</strong>
              点击地址栏右侧的
              <kbd>安装</kbd>
              按钮
            </li>
            <li>
              <strong>Firefox浏览器：</strong>
              点击地址栏右侧的
              <kbd>添加到主屏幕</kbd>
              按钮
            </li>
            <li>
              <strong>强制刷新：</strong>
              按
              <kbd>Ctrl</kbd>
              +
              <kbd>Shift</kbd>
              +
              <kbd>R</kbd>
              刷新页面后重试
            </li>
          </ol>
        </div>

        <div class="instruction-section">
          <h4>手机端安装步骤：</h4>
          <ol>
            <li>
              <strong>iOS Safari：</strong>
              点击底部
              <kbd>分享</kbd>
              按钮 →
              <kbd>添加到主屏幕</kbd>
            </li>
            <li>
              <strong>Android Chrome：</strong>
              点击右上角
              <kbd>菜单</kbd>
              →
              <kbd>添加到主屏幕</kbd>
            </li>
            <li>
              <strong>其他浏览器：</strong>
              查找类似的"添加到主屏幕"选项
            </li>
          </ol>
        </div>

        <div class="instruction-section">
          <h4>注意事项：</h4>
          <ul>
            <li>确保使用HTTPS协议访问网站</li>
            <li>某些浏览器可能需要手动启用PWA功能</li>
            <li>安装后应用会出现在桌面或应用列表中</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <el-button @click="showManualInstructions = false">关闭</el-button>
        <el-button type="primary" @click="refreshPage">刷新页面</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Check, Close, Document, Download, InfoFilled, Iphone, Lock, Monitor, QuestionFilled, Setting } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElIcon, ElMessage } from 'element-plus'

defineOptions({
  name: 'Application',
})

// 自动安装提示相关
const showAutoInstallPrompt = ref(false)
const hasShownAutoPrompt = ref(false)

// 记录已显示自动提示
const recordAutoPromptShown = () => {
  localStorage.setItem('pwa-auto-prompt-shown', 'true')
  hasShownAutoPrompt.value = true
}

// 关闭自动安装提示
const dismissAutoInstall = () => {
  showAutoInstallPrompt.value = false
  recordAutoPromptShown()
}

// 响应式数据
const showManualInstructions = ref(false)
const deferredPrompt = ref<any>(null)
const autoInstallDismissed = ref(false)

// PWA状态检测
const isInstalled = computed(() => {
  return (
    globalThis.matchMedia('(display-mode: standalone)').matches ||
    // @ts-ignore
    globalThis.navigator.standalone ||
    document.referrer.includes('android-app://')
  )
})

const canInstall = computed(() => {
  return 'serviceWorker' in navigator && 'PushManager' in globalThis
})

const hasInstallPrompt = computed(() => {
  return deferredPrompt.value !== null
})

const showInstallPrompt = computed(() => {
  return hasInstallPrompt.value && !isInstalled.value
})

// 状态计算
const statusTitle = computed(() => {
  if (isInstalled.value) return '已安装'
  if (showInstallPrompt.value) return '可安装'
  if (canInstall.value) return '等待安装'
  return '不支持安装'
})

const statusDescription = computed(() => {
  if (isInstalled.value) return '应用已成功安装到桌面'
  if (showInstallPrompt.value) return '点击安装按钮将应用添加到桌面'
  if (canInstall.value) return '应用满足安装条件，等待用户操作'
  return '当前环境不支持PWA安装'
})

const installButtonText = computed(() => {
  if (!hasInstallPrompt.value) return '等待安装提示...'
  return '📱 安装桌面应用'
})

// 方法
const handleInstall = async () => {
  if (!deferredPrompt.value) {
    showManualInstructions.value = true
    return
  }

  try {
    // 显示安装提示
    deferredPrompt.value.prompt()

    // 等待用户选择
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      ElMessage.success('PWA应用安装成功！')
      // 清除安装提示
      deferredPrompt.value = null
      showAutoInstallPrompt.value = false
    } else {
      ElMessage.info('用户取消了安装')
    }
  } catch (error) {
    console.error('安装PWA应用时出错:', error)
    ElMessage.error('安装失败，请尝试手动安装')
    showManualInstructions.value = true
  }
}

const handleAutoInstall = () => {
  showAutoInstallPrompt.value = false
  handleInstall()
}

const refreshPage = () => {
  showManualInstructions.value = false
  location.reload()
}

// 生命周期
onMounted(() => {
  // 检查是否已经手动关闭过自动安装提示
  const dismissed = localStorage.getItem('pwa-auto-install-dismissed')
  if (dismissed === 'true') {
    autoInstallDismissed.value = true
  }

  // 监听安装提示事件
  const handleBeforeInstallPrompt = (e: any) => {
    e.preventDefault()
    deferredPrompt.value = e

    // 如果用户没有手动关闭过，且支持安装，显示自动安装提示
    if (!autoInstallDismissed.value && canInstall.value && !isInstalled.value) {
      // 延迟显示，让页面先加载完成
      setTimeout(() => {
        showAutoInstallPrompt.value = true
      }, 2000)
    }

    ElMessage.success('检测到可安装的PWA应用')
  }

  // 监听应用安装完成事件
  const handleAppInstalled = () => {
    ElMessage.success('PWA应用已成功安装到桌面')
    deferredPrompt.value = null
    showAutoInstallPrompt.value = false
    // 清除本地存储的关闭标记
    localStorage.removeItem('pwa-auto-install-dismissed')
  }

  // 添加事件监听器
  globalThis.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  globalThis.addEventListener('appinstalled', handleAppInstalled)

  // 清理事件监听器
  onUnmounted(() => {
    globalThis.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    globalThis.removeEventListener('appinstalled', handleAppInstalled)
  })
})
</script>

<style lang="scss" scoped>
.application-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--el-margin);
  min-height: 100vh;
  padding: var(--el-margin);
  margin: 0 auto;

  .auto-install-prompt {
    position: fixed;
    top: var(--el-margin);
    right: var(--el-margin);
    z-index: 9999;
    background: var(--el-bg-color);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    .prompt-content {
      min-width: 320px;
      padding: var(--el-margin);

      .prompt-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--el-margin);

        .prompt-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          color: white;
          background: var(--el-color-primary);
          border-radius: 12px;
        }

        .prompt-close {
          padding: 4px;
          color: var(--el-text-color-regular);
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;

          &:hover {
            color: var(--el-text-color-primary);
            background: var(--el-fill-color-light);
          }
        }
      }

      .prompt-text {
        margin-bottom: var(--el-margin);
        text-align: center;

        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: var(--el-text-color-regular);
        }
      }

      .prompt-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
    }
  }

  .main-install-section {
    display: flex;
    flex-direction: column;
    gap: var(--el-margin);

    .status-card {
      padding: var(--el-margin);
      background: var(--el-bg-color);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(20px);

      .status-header {
        display: flex;
        gap: var(--el-margin);
        align-items: center;
        margin-bottom: var(--el-margin);

        .status-content {
          flex: 1;

          h2 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 700;
            color: var(--el-text-color-primary);
          }

          p {
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
            color: var(--el-text-color-regular);
          }
        }
      }

      .status-actions {
        text-align: center;

        .install-btn {
          min-width: 240px;
          height: 56px;
          font-size: 18px;
          font-weight: 600;
          background: var(--el-color-primary);
          border: none;
          border-radius: 16px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
          }

          &:disabled {
            color: var(--el-text-color-placeholder);
            background: var(--el-fill-color-light);
            transform: none;
          }
        }
      }
    }

    .info-section {
      .app-info-card {
        padding: var(--el-margin);
        background: var(--el-bg-color);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        backdrop-filter: blur(20px);

        .card-header {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: var(--el-margin);
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--el-margin);

          .info-item {
            display: flex;
            gap: 12px;
            align-items: center;
            padding: var(--el-margin);
            background: var(--el-fill-color-light);
            border-radius: 12px;
            transition: all 0.2s;

            &:hover {
              background: var(--el-fill-color);
              transform: translateY(-2px);
            }

            .info-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 40px;
              height: 40px;
              color: white;
              border-radius: 10px;
            }

            // 为不同类型的信息使用不同的颜色
            &:nth-child(1) .info-icon {
              background: var(--el-color-primary);
            }

            &:nth-child(2) .info-icon {
              background: var(--el-color-success);
            }

            &:nth-child(3) .info-icon {
              background: var(--el-color-warning);
            }

            &:nth-child(4) .info-icon {
              background: var(--el-color-danger);
            }

            &:nth-child(5) .info-icon {
              background: var(--el-color-info);
            }

            .info-text {
              display: flex;
              flex: 1;
              flex-direction: column;
              gap: 4px;

              h4 {
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: 600;
                color: var(--el-text-color-primary);
              }

              p {
                margin: 0;
                font-size: 12px;
                line-height: 1.6;
                color: var(--el-text-color-regular);
              }
            }
          }
        }
      }
    }

    .manual-section {
      .manual-card {
        padding: var(--el-margin);
        background: var(--el-bg-color);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        backdrop-filter: blur(20px);

        .card-header {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: var(--el-margin);
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .manual-content {
          display: flex;
          flex-direction: column;
          gap: var(--el-margin);

          .manual-item {
            display: flex;
            gap: var(--el-margin);
            align-items: flex-start;
            padding: var(--el-margin);
            background: var(--el-fill-color-light);
            border-radius: 12px;

            .manual-icon {
              display: flex;
              flex-shrink: 0;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 48px;
              color: white;
              border-radius: 12px;

              &.pc-icon {
                background: var(--el-color-primary);
              }

              &.mobile-icon {
                background: var(--el-color-success);
              }
            }

            .manual-text {
              flex: 1;

              h4 {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 600;
                color: var(--el-text-color-primary);
              }

              p {
                margin: 0;
                font-size: 14px;
                line-height: 1.6;
                color: var(--el-text-color-regular);

                kbd {
                  display: inline-block;
                  padding: 2px 6px;
                  font-size: 12px;
                  font-weight: 600;
                  line-height: 1;
                  color: var(--el-text-color-primary);
                  background-color: var(--el-fill-color);
                  border: 1px solid var(--el-border-color);
                  border-radius: 4px;
                }
              }
            }
          }
        }

        .manual-actions {
          margin-top: var(--el-margin);
          text-align: center;
        }
      }
    }
  }

  .manual-instructions {
    .instruction-section {
      margin-bottom: var(--el-margin);

      h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      ol,
      ul {
        padding-left: 20px;
        margin: 0;

        li {
          margin-bottom: 8px;
          line-height: 1.6;
          color: var(--el-text-color-regular);

          strong {
            color: var(--el-text-color-primary);
          }

          kbd {
            display: inline-block;
            padding: 2px 6px;
            font-size: 12px;
            font-weight: 600;
            line-height: 1;
            color: var(--el-text-color-primary);
            background-color: var(--el-fill-color);
            border: 1px solid var(--el-border-color);
            border-radius: 4px;
          }
        }
      }
    }
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .application-container {
    gap: var(--el-margin);
    padding: var(--el-margin);

    .auto-install-prompt {
      top: 10px;
      right: 10px;
      left: 10px;

      .prompt-content {
        min-width: auto;
        padding: var(--el-margin);
      }
    }

    .main-install-section {
      .status-card {
        padding: var(--el-margin);

        .status-header {
          flex-direction: column;
          gap: var(--el-margin);
          text-align: center;

          .status-content {
            h2 {
              font-size: 20px;
            }

            p {
              font-size: 14px;
            }
          }
        }
      }

      .info-section {
        .app-info-card {
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      }

      .manual-section {
        .manual-card {
          .manual-content {
            .manual-item {
              flex-direction: column;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
