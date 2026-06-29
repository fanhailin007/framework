<template>
  <div class="script-test-container no-background-container">
    <vab-card
      class="result-card"
      :style="{
        minHeight: 'auto',
        height: 'auto',
      }"
      title="操作"
    >
      <el-button type="primary" @click="testBasicScript">测试</el-button>
      <el-button @click="clearContent">清空</el-button>
    </vab-card>

    <vab-card class="result-card" title="测试结果">
      <div ref="contentRef" class="result-content" v-html="content"></div>
    </vab-card>

    <vab-card class="console-card" title="控制台输出">
      <div class="console-header">
        <div class="console-title-bar">
          <div class="console-buttons">
            <span class="console-button close"></span>
            <span class="console-button minimize"></span>
            <span class="console-button maximize"></span>
          </div>
          <div class="console-title">Script Test Console</div>
        </div>
      </div>
      <div ref="consoleRef" class="console-content">
        <div v-for="(log, index) in consoleLogs" :key="index" class="console-line" :class="log.type">
          <span class="console-prompt">></span>
          <span class="timestamp">[{{ log.timestamp }}]</span>
          <span class="message">{{ log.message }}</span>
        </div>
        <div v-if="consoleLogs.length > 0" class="console-cursor">
          <span class="cursor-blink">_</span>
        </div>
      </div>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
const content = ref<string>('')
const contentRef = ref<HTMLElement>()
const consoleRef = ref<HTMLElement>()
const consoleLogs = ref<Array<{ timestamp: string; message: string; type: string }>>([])

const executeScripts = () => {
  if (!contentRef.value) return

  const scripts = contentRef.value.querySelectorAll('script')
  console.log(`找到 ${scripts.length} 个 script 标签`)

  scripts.forEach((script, index) => {
    const newScript = document.createElement('script')

    Array.from(script.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value)
    })

    newScript.textContent = script.textContent

    document.head.appendChild(newScript)

    addConsoleLog('info', `执行第 ${index + 1} 个 script 标签`)

    newScript.remove()
  })
}

const addConsoleLog = (type: string, message: string) => {
  consoleLogs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message,
    type,
  })
}

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (consoleRef.value) {
    consoleRef.value.scrollTop = consoleRef.value.scrollHeight
  }
}

// 监听日志变化，自动滚动
watch(
  consoleLogs,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

const testBasicScript = async () => {
  try {
    addConsoleLog('info', '开始测试基础脚本...')

    const response = await fetch('/script/getList')
    const result = await response.json()

    if (result.code === 200) {
      content.value = result.data.description
      addConsoleLog('success', '接口调用成功，开始执行脚本...')

      await nextTick()
      executeScripts()
    } else {
      addConsoleLog('error', `接口调用失败: ${result.msg}`)
    }
  } catch (error) {
    addConsoleLog('error', `请求错误: ${error}`)
  }
}

const clearContent = () => {
  content.value = ''
  consoleLogs.value = []
  addConsoleLog('info', '内容已清空')
}

onMounted(() => {
  addConsoleLog('info', '页面加载完成，可以开始测试')
})
</script>

<style scoped>
.script-test-container {
  padding: var(--el-padding);
}

.result-content {
  min-height: 100px;
}

.console-header {
  background: #1e1e1e;
}

.console-title-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(to bottom, #2d2d2d 0%, #1e1e1e 100%);
}

.console-buttons {
  display: flex;
  gap: 6px;
  margin-right: 12px;
}

.console-button {
  width: 12px;
  height: 12px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.console-button.close {
  background: #ff5f56;
  border: 1px solid #e0443e;
}

.console-button.minimize {
  background: #ffbd2e;
  border: 1px solid #dea123;
}

.console-button.maximize {
  background: #27ca3f;
  border: 1px solid #1aab29;
}

.console-button:hover {
  filter: brightness(1.2);
}

.console-title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #cccccc;
}

.console-content {
  max-height: 400px;
  padding: 12px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: #ffffff;
  background: #141414;
}

.console-line {
  display: flex;
  align-items: flex-start;
  margin-bottom: 4px;
}

.console-prompt {
  margin-right: 8px;
  font-weight: bold;
  color: #00ff00;
}

.timestamp {
  margin-right: 8px;
  font-size: 11px;
  color: #888888;
}

.message {
  flex: 1;
}

.console-line.info .message {
  color: #ffffff;
}

.console-line.success .message {
  color: #00ff00;
}

.console-line.error .message {
  color: #ff0000;
}

.console-line.warning .message {
  color: #ffff00;
}

.console-cursor {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.cursor-blink {
  color: #00ff00;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.result-card {
  margin-bottom: var(--el-margin);
}

.console-card {
  margin-bottom: var(--el-margin);
}
</style>
