<template>
  <div class="vab-deep-seek">
    <vab-icon class="vab-deep-seek-icon" icon="deepSeek" is-custom-svg @click="openChatDialog" />
    <vab-dialog
      v-model="dialogVisible"
      append-to-body
      class="deep-seek-dialog"
      :close-on-click-modal="false"
      :destroy-on-close="false"
      title="DeepSeek AI 助手"
      width="800px"
    >
      <div class="deep-seek-content">
        <div class="deep-seek-chat qq-style">
          <div ref="chatHistoryRef" class="chat-history">
            <template v-if="chatHistory.length === 0">
              <div class="empty-chat">
                <el-empty description="暂无对话，开始提问吧" />
              </div>
            </template>
            <template v-else>
              <div v-for="(msg, index) in chatHistory" :key="index" class="message-wrapper">
                <div :class="['message-content', msg.role]">
                  <div class="avatar">
                    <img :alt="msg.role === 'user' ? '用户头像' : 'AI头像'" :src="msg.role === 'user' ? userAvatar : aiAvatar" />
                  </div>
                  <div class="message-box">
                    <div class="message-sender">{{ msg.role === 'user' ? '我' : 'DeepSeek AI' }}</div>
                    <div class="message-bubble">
                      <div v-if="msg.role === 'assistant' && msg.loading" class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div v-else class="message-content" v-html="formatMessage(msg.content)"></div>
                    </div>
                    <div class="message-time">{{ getCurrentTime() }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="chat-toolbar">
            <el-tooltip content="清空对话">
              <el-button circle :disabled="loading || chatHistory.length === 0" @click="clearChat">
                <el-icon><delete /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="换个头像">
              <el-button circle @click="changeAvatars">
                <el-icon><refresh-right /></el-icon>
              </el-button>
            </el-tooltip>
            <div class="toolbar-spacer"></div>
            <el-tooltip content="设置">
              <el-button circle @click="openSettings">
                <el-icon><setting /></el-icon>
              </el-button>
            </el-tooltip>
          </div>

          <div class="chat-input-area">
            <el-input
              v-model="userInput"
              placeholder="请输入问题..."
              resize="none"
              :rows="3"
              type="textarea"
              @keydown.enter="handleEnterKey"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="send-button">
          <el-button :loading="loading" type="primary" @click="sendMessage">发送</el-button>
        </div>
      </template>
    </vab-dialog>

    <el-drawer
      v-model="settingsVisible"
      append-to-body
      :destroy-on-close="false"
      direction="rtl"
      size="400px"
      title="设置"
      :with-header="true"
    >
      <div class="settings-content">
        <el-form label-position="top">
          <el-form-item label="API地址">
            <el-input v-model="apiUrl" placeholder="API地址" />
          </el-form-item>
          <el-form-item label="API密钥">
            <el-input v-model="apiKey" placeholder="API Key" show-password type="password" />
          </el-form-item>
          <el-form-item label="模型名称">
            <el-select v-model="modelName" placeholder="选择模型">
              <el-option label="DeepSeek-R1" value="deepseek-r1" />
              <el-option label="DeepSeek-Chat" value="deepseek-chat" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item label="模型状态">
            <el-tag :type="modelStatus === '已连接' ? 'success' : 'danger'">{{ modelStatus }}</el-tag>
          </el-form-item>
          <el-form-item label="温度">
            <el-slider v-model="temperature" :max="1" :min="0" :step="0.1" />
          </el-form-item>
          <el-form-item label="最大长度">
            <el-input-number v-model="maxTokens" :max="4096" :min="100" :step="100" />
          </el-form-item>
          <el-form-item label="流式输出">
            <el-switch v-model="streamOutput" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="testConnection">连接测试</el-button>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { Delete, RefreshRight, Setting } from '@element-plus/icons-vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabDeepSeek',
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const STORAGE_KEY = 'vab-deepseek-settings'

const dialogVisible = ref(false)
const settingsVisible = ref(false)
const isFirstOpen = ref(true)

const apiUrl = ref('')
const apiKey = ref('')
const modelStatus = ref('未连接')

const modelName = ref('deepseek-r1')
const temperature = ref(0.7)
const maxTokens = ref(2000)
const streamOutput = ref(true)

const userInput = ref('')
const loading = ref(false)
const chatHistory = ref<Array<{ role: 'user' | 'assistant'; content: string; loading?: boolean; isError?: boolean }>>([])
const chatHistoryRef = ref<HTMLElement | null>(null)

const userAvatar = ref(getRandomAvatar())
const aiAvatar = ref('https://www.deepseek.com/favicon.ico')

const openChatDialog = () => {
  dialogVisible.value = true

  if (isFirstOpen.value && chatHistory.value.length === 0) {
    isFirstOpen.value = false
    chatHistory.value.push({
      role: 'assistant',
      content: '你好！我是DeepSeek AI助手，有什么可以帮助你的吗？',
    })
  }

  nextTick(() => {
    scrollToBottom()
  })
}

const openSettings = () => {
  settingsVisible.value = true
}

const saveSettings = () => {
  const settings = {
    apiUrl: apiUrl.value,
    apiKey: apiKey.value,
    modelName: modelName.value,
    temperature: temperature.value,
    maxTokens: maxTokens.value,
    streamOutput: streamOutput.value,
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    $baseMessage('设置已保存', 'success', 'hey')
  } catch (error) {
    console.error('保存设置失败', error)
    $baseMessage('保存设置失败', 'error', 'hey')
  }
}

const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY)
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      apiUrl.value = settings.apiUrl || ''
      apiKey.value = settings.apiKey || ''
      modelName.value = settings.modelName || 'deepseek-r1'
      temperature.value = settings.temperature ?? 0.7
      maxTokens.value = settings.maxTokens || 2000
      streamOutput.value = settings.streamOutput ?? true
    }
  } catch (error) {
    console.error('加载设置失败', error)
  }
}

function getRandomAvatar(isAI = false) {
  const styles = ['adventurer', 'avataaars', 'bottts', 'identicon', 'micah', 'personas']
  const style = styles[Math.floor(Math.random() * styles.length)]
  const seed = Math.random().toString(36).substring(2, 10)

  if (isAI) {
    return `/public/favicon-vab.ico`
  }

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
}

function changeAvatars() {
  userAvatar.value = getRandomAvatar()
  $baseMessage('头像已更新', 'success', 'hey')
}

const testConnection = async () => {
  if (!apiUrl.value.trim()) {
    $baseMessage('请先配置API地址', 'warning', 'hey')
    return
  }

  if (!apiKey.value.trim()) {
    $baseMessage('请先配置API密钥', 'warning', 'hey')
    return
  }

  try {
    const response = await fetch(`${apiUrl.value}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.value}`,
      },
    })

    if (response.ok) {
      modelStatus.value = '已连接'
      $baseMessage('连接成功', 'success', 'hey')
    } else {
      modelStatus.value = '未连接'
      $baseMessage('连接失败', 'error', 'hey')
    }
  } catch (error) {
    modelStatus.value = '未连接'
    $baseMessage(`连接失败：${error}`, 'error', 'hey')
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return

  const userMessage = userInput.value
  chatHistory.value.push({ role: 'user', content: userMessage })

  userInput.value = ''
  scrollToBottom()

  chatHistory.value.push({ role: 'assistant', content: '', loading: true })
  loading.value = true
  scrollToBottom()

  try {
    if (!apiUrl.value.trim()) {
      settingsVisible.value = true
      throw new Error('请先在设置中配置API地址')
    }

    if (!apiKey.value.trim()) {
      settingsVisible.value = true
      throw new Error('请先在设置中配置API密钥')
    }

    if (streamOutput.value) {
      await handleStreamResponse()
    } else {
      await handleNormalResponse()
    }
  } catch (error: any) {
    const lastMsg = chatHistory.value.at(-1)
    if (lastMsg) {
      lastMsg.content = `${error.message || '未知错误'}`
      lastMsg.loading = false
      lastMsg.isError = true
    }
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const handleNormalResponse = async () => {
  const response = await fetch(`${apiUrl.value}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey.value ? { Authorization: `Bearer ${apiKey.value}` } : {}),
    },
    body: JSON.stringify({
      model: modelName.value,
      messages: chatHistory.value
        .filter((msg) => !msg.loading && !msg.isError)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      temperature: temperature.value,
      max_tokens: maxTokens.value,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API错误 (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const lastMsg = chatHistory.value.at(-1)
  if (lastMsg) {
    lastMsg.content = data.choices[0].message.content
    lastMsg.loading = false
  }
}

const handleStreamResponse = async () => {
  const response = await fetch(`${apiUrl.value}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey.value ? { Authorization: `Bearer ${apiKey.value}` } : {}),
    },
    body: JSON.stringify({
      model: modelName.value,
      messages: chatHistory.value
        .filter((msg) => !msg.loading && !msg.isError)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      temperature: temperature.value,
      max_tokens: maxTokens.value,
      stream: true,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API错误 (${response.status}): ${errorText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('无法读取响应流')

  const decoder = new TextDecoder()
  let content = ''

  if (process.env.NODE_ENV === 'development') {
    const testResponse = '这是一个测试回复，用于演示打字机效果。大语言模型可以用于各种任务，比如回答问题、生成文本、翻译语言等。'
    const lastMsg = chatHistory.value.at(-1)
    if (lastMsg) {
      content = ''
      for (let i = 0; i < testResponse.length; i++) {
        content += testResponse[i]
        lastMsg.content = content
        await new Promise((resolve) => setTimeout(resolve, 50))
        scrollToBottom()
      }
      lastMsg.loading = false
      return
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter((line) => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices[0].delta.content
            if (delta) {
              content += delta
              // 更新最后一条消息
              const lastMsg = chatHistory.value.at(-1)
              if (lastMsg) {
                lastMsg.content = content
                scrollToBottom()
              }
            }
          } catch (error) {
            console.error('解析流数据失败', error)
          }
        }
      }
    }
  } catch (error) {
    console.error('流式读取错误', error)
  }

  // 完成后更新状态
  const lastMsg = chatHistory.value.at(-1)
  if (lastMsg) {
    lastMsg.loading = false
  }
}

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const formatMessage = (text: string) => {
  if (!text) return ''
  if (chatHistory.value.find((msg) => msg.content === text && msg.isError)) {
    return `<span class="error-message">${text}</span>`
  }
  const html = marked.parse(text) as string
  return DOMPurify.sanitize(html)
}

const clearChat = () => {
  ElMessageBox.confirm('确定要清空所有对话记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      chatHistory.value = []
    })
    .catch(() => {})
}

const handleEnterKey = (e: Event) => {
  const keyboardEvent = e as KeyboardEvent
  if (keyboardEvent.ctrlKey || keyboardEvent.metaKey) {
    sendMessage()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    }
  })
}

watch(
  chatHistory,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

onMounted(() => {
  loadSettings()
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.vab-deep-seek {
  cursor: pointer;

  .vab-deep-seek-icon {
    width: var(--el-font-size-extra-large);
    height: var(--el-font-size-extra-large);
    margin-left: var(--el-margin);
    font-size: var(--el-font-size-extra-large);
    color: var(--el-color-primary) !important;

    &:hover {
      color: var(--el-color-primary);
      animation: robotPulse 0.5s;
    }
  }
}

.deep-seek-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.deep-seek-content {
  .deep-seek-chat.qq-style {
    border-radius: var(--el-border-radius-base);

    .chat-history {
      height: 400px;
      padding: 15px;
      overflow-y: auto;

      .empty-chat {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .message-wrapper {
        margin-bottom: 20px;

        .message-content {
          display: flex;

          &.user {
            flex-direction: row-reverse;

            .message-box {
              align-items: flex-end;
              margin-right: 12px;

              .message-sender {
                padding-right: 8px;
                text-align: right;
              }

              .message-bubble {
                position: relative;
                color: #fff;
                background: var(--el-color-primary-light-3);
                border-radius: var(--el-border-radius-base);
                box-shadow: 0 2px 6px rgba(var(--el-color-primary-rgb), 0.15);

                &:after {
                  position: absolute;
                  top: 15px;
                  right: -8px;
                  content: '';
                  border: 8px solid transparent;
                  border-right: 0;
                  border-left-color: var(--el-color-primary-light-3);
                }
              }

              .message-time {
                padding-right: 8px;
                text-align: right;
              }
            }
          }

          &.assistant {
            .message-box {
              margin-left: 12px;

              .message-sender {
                padding-left: 8px;
              }

              .message-bubble {
                position: relative;
                background: var(--el-background-color);
                border-radius: var(--el-border-radius-base);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

                &:after {
                  position: absolute;
                  top: 15px;
                  left: -8px;
                  content: '';
                  border: 8px solid transparent;
                  border-right-color: var(--el-background-color);
                  border-left: 0;
                }
              }

              .message-time {
                padding-left: 8px;
              }
            }
          }

          .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            overflow: hidden;
            background-color: #fff;
            border: 2px solid #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

            img {
              width: 85%;
              height: 85%;
              object-fit: contain;
            }
          }

          .message-box {
            display: flex;
            flex-direction: column;
            max-width: calc(100% - 80px);

            .message-sender {
              margin-bottom: 4px;
              font-size: 13px;
              font-weight: 500;
              color: var(--el-text-color-secondary);
            }

            .message-bubble {
              padding: 12px 16px;
              word-break: break-all;

              .message-content {
                font-size: 14px;
                line-height: 1.5;

                :deep(pre) {
                  padding: 12px;
                  margin: 8px 0;
                  overflow-x: auto;
                  font-size: 13px;
                  background-color: rgba(0, 0, 0, 0.04);
                  border-radius: 6px;
                }

                :deep(code) {
                  padding: 2px 4px;
                  font-family: monospace;
                  font-size: 13px;
                  background-color: rgba(0, 0, 0, 0.04);
                  border-radius: 4px;
                }

                :deep(p) {
                  margin: 8px 0;
                  &:first-child {
                    margin-top: 0;
                  }
                  &:last-child {
                    margin-bottom: 0;
                  }
                }

                :deep(ul),
                :deep(ol) {
                  padding-left: 20px;
                  margin: 8px 0;
                }

                :deep(a) {
                  color: var(--el-color-primary);
                  text-decoration: none;

                  &:hover {
                    text-decoration: underline;
                  }
                }

                :deep(blockquote) {
                  padding: 2px 0 2px 16px;
                  margin: 8px 0;
                  color: var(--el-text-color-secondary);
                  border-left: 4px solid var(--el-color-primary-light-5);
                }

                :deep(table) {
                  width: 100%;
                  margin: 8px 0;
                  border-collapse: collapse;

                  th,
                  td {
                    padding: 6px 10px;
                    border: 1px solid var(--el-border-color);
                  }

                  th {
                    background-color: var(--el-fill-color-light);
                  }
                }
              }

              .typing-indicator {
                display: flex;
                align-items: center;
                padding: 8px 0;

                span {
                  width: 8px;
                  height: 8px;
                  margin: 0 3px;
                  background-color: var(--el-text-color-secondary);
                  border-radius: 50%;
                  opacity: 0.7;
                  animation: typing 1s infinite ease-in-out;

                  &:nth-child(1) {
                    animation-delay: 0s;
                  }
                  &:nth-child(2) {
                    animation-delay: 0.2s;
                  }
                  &:nth-child(3) {
                    animation-delay: 0.4s;
                  }
                }
              }
            }

            .message-time {
              margin-top: 4px;
              font-size: 11px;
              color: var(--el-text-color-secondary);
              opacity: 0.8;
            }
          }
        }
      }
    }

    .chat-toolbar {
      display: flex;
      padding: 10px 0 10px 0;
      border-top: 1px solid var(--el-border-color-lighter);

      .el-button {
        //margin-right: 10px;
        transition: all 0.2s;

        &:hover {
          transform: scale(1.05);
        }
      }

      .toolbar-spacer {
        flex: 1;
      }
    }

    .chat-input-area {
      // padding: 12px 15px 15px;
      border-radius: 0 0 8px 8px;

      .el-textarea {
        //margin-bottom: 10px;

        :deep(.el-textarea__inner) {
          min-height: 80px;
          padding: 10px 14px;
          resize: none;
          border-radius: 6px;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;

          &:focus {
            box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.2);
          }
        }
      }

      .send-button {
        display: flex;
        justify-content: flex-end;

        .el-button {
          padding: 10px 24px;
          font-weight: 500;
          transition: all 0.2s;

          &:hover:not(.is-loading) {
            box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}

.settings-content {
  .slider-with-tooltip {
    width: 100%;
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
}

@keyframes robotPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes typing {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
