<template>
  <div class="print-container no-background-container">
    <vab-card
      :body-style="{
        paddingBottom: 0,
      }"
      title="打印控制"
    >
      <vab-query-form>
        <vab-query-form-top-panel>
          <el-form inline>
            <el-form-item label="页面大小">
              <el-select v-model="printSettings.pageSize" style="width: 100%">
                <el-option label="A4" value="A4" />
                <el-option label="A3" value="A3" />
                <el-option label="Letter" value="Letter" />
                <el-option label="Legal" value="Legal" />
              </el-select>
            </el-form-item>
            <el-form-item label="打印方向">
              <el-select v-model="printSettings.orientation" style="width: 100%">
                <el-option label="纵向" value="portrait" />
                <el-option label="横向" value="landscape" />
              </el-select>
            </el-form-item>
          </el-form>
        </vab-query-form-top-panel>
        <vab-query-form-bottom-panel>
          <el-button type="warning" @click="printDocument">打印文档</el-button>
          <el-button type="success" @click="printTable">打印表格</el-button>
          <el-button type="primary" @click="printImage">打印图片</el-button>
          <el-button type="info" @click="customPrint">自定义打印</el-button>
          <el-button type="danger" @click="printSelected">打印选中内容</el-button>
        </vab-query-form-bottom-panel>
      </vab-query-form>
    </vab-card>

    <!-- 文档打印区域 -->
    <vab-card title="文档打印">
      <div ref="documentRef" style="padding: 20px; background: var(--el-bg-color); border-radius: var(--el-border-radius-base)">
        <h1 style="margin-bottom: 20px; font-size: 28px; font-weight: bold; color: var(--el-color-primary); text-align: center">
          Vue Shop Vite 打印文档的标题
        </h1>

        <div>
          <p style="margin-bottom: 10px; font-size: 16px; font-style: italic; line-height: 1.8; color: var(--el-text-color-regular)">
            这是一个用于演示打印功能的文档内容。您可以在这里添加任何需要打印的文本内容。
          </p>
        </div>

        <h2
          style="
            padding-bottom: 8px;
            margin: 30px 0 15px 0;
            font-size: 22px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            border-bottom: 2px solid var(--el-color-primary-light-5);
          "
        >
          ✨ 功能特点
        </h2>
        <ul style="padding-left: 25px; font-size: 15px; line-height: 1.8; color: var(--el-text-color-regular)">
          <li style="position: relative; margin-bottom: 8px">
            <span style="margin-right: 8px; font-weight: 600; color: var(--el-color-success)">✓</span>
            支持多种打印格式
          </li>
          <li style="position: relative; margin-bottom: 8px">
            <span style="margin-right: 8px; font-weight: 600; color: var(--el-color-success)">✓</span>
            自定义打印设置
          </li>
          <li style="position: relative; margin-bottom: 8px">
            <span style="margin-right: 8px; font-weight: 600; color: var(--el-color-success)">✓</span>
            打印预览功能
          </li>
          <li style="position: relative; margin-bottom: 8px">
            <span style="margin-right: 8px; font-weight: 600; color: var(--el-color-success)">✓</span>
            响应式设计
          </li>
        </ul>
      </div>
    </vab-card>

    <vab-card title="表格打印">
      <div ref="tableRef">
        <el-table border :data="tableData" highlight-current-row stripe style="width: 100%">
          <el-table-column label="姓名" prop="name" width="120" />
          <el-table-column label="地址" prop="address" />
        </el-table>
      </div>
    </vab-card>

    <vab-card title="图片打印">
      <div ref="imageRef" style="padding: 20px; text-align: center">
        <img
          alt="风景图片"
          :src="landscape"
          style="
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: var(--el-border-radius-base);
            box-shadow: 0 2px 8px var(--el-border-color);
          "
        />
      </div>
    </vab-card>

    <!-- 自定义打印对话框 -->
    <el-dialog v-model="customPrintVisible" :close-on-press-escape="true" title="自定义打印" width="60%">
      <el-form label-width="100px" :model="customPrintForm">
        <el-form-item label="打印标题">
          <el-input v-model="customPrintForm.title" placeholder="请输入打印标题" />
        </el-form-item>
        <el-form-item label="打印内容">
          <el-input v-model="customPrintForm.content" placeholder="请输入要打印的内容（支持HTML标签）" :rows="8" type="textarea" />
        </el-form-item>
        <el-form-item label="页脚信息">
          <el-input v-model="customPrintForm.footer" placeholder="请输入页脚信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="customPrintVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCustomPrint">确认打印</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import landscape from '/@/assets/common_images/landscape.jpg'
import VabPrint from '/@/plugins/VabPrint'

defineOptions({
  name: 'Print',
})

// 响应式数据
const imageRef = ref<HTMLElement>()
const tableRef = ref<HTMLElement>()
const documentRef = ref<HTMLElement>()

// 打印设置
const printSettings = reactive({
  pageSize: 'A4',
  orientation: 'portrait',
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '马云',
    address: '上海市普陀区金沙江路',
  },
  {
    id: 2,
    name: '马化腾',
    address: '深圳市南山区科技园',
  },
  {
    id: 3,
    name: '李彦宏',
    address: '北京市海淀区中关村',
  },
  {
    id: 4,
    name: '刘强东',
    address: '北京市朝阳区京东总部',
  },
])

// 对话框状态
const customPrintVisible = ref(false)

// 自定义打印表单
const customPrintForm = reactive({
  title: '自定义打印内容',
  content: `<h1>Vue Shop Vite</h1>
<p>这是一个自定义打印内容的示例。</p>
<ul>
    <li>支持HTML标签</li>
    <li>自定义样式</li>
    <li>灵活配置</li>
</ul>`,
  footer: `打印时间：${new Date().toLocaleString()}`,
})

// 当前时间
const currentTime = ref(new Date().toLocaleString())

// 更新时间
setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)

// 打印图片
const printImage = async () => {
  try {
    await VabPrint(imageRef.value, {
      title: '图片打印',
      footer: `打印时间：${new Date().toLocaleString()}`,
      pageSize: printSettings.pageSize,
      orientation: printSettings.orientation,
      customStyle: `
                img {
                    width: 100%;
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }
                .print-container {
                    text-align: center;
                    padding: 20px;
                }
            `,
      beforePrint: () => {
        $baseMessage('正在准备打印...', 'info')
      },
      afterPrint: () => {
        $baseMessage('图片打印成功', 'success')
      },
      onError: (error: any) => {
        $baseMessage('图片打印失败', 'error')
        console.error('打印错误:', error)
      },
    })
  } catch (error) {
    $baseMessage('图片打印失败', 'error')
    console.error('打印错误:', error)
  }
}

// 打印表格
const printTable = async () => {
  try {
    await VabPrint(tableRef.value, {
      title: '表格打印',
      footer: `打印时间：${new Date().toLocaleString()} | 共 ${tableData.value.length} 条记录`,
      pageSize: printSettings.pageSize,
      orientation: printSettings.orientation,
      customStyle: `
                .el-table { width: 100%; border-collapse: collapse; }
                .el-table th, .el-table td { border: 1px solid #ebeef5; padding: 8px; }
                .el-table th { background-color: #f5f7fa; font-weight: bold; }
            `,
      beforePrint: () => {
        $baseMessage('正在准备打印表格...', 'info')
      },
      afterPrint: () => {
        $baseMessage('表格打印成功', 'success')
      },
      onError: (error: any) => {
        $baseMessage('表格打印失败', 'error')
        console.error('打印错误:', error)
      },
    })
  } catch (error) {
    $baseMessage('表格打印失败', 'error')
    console.error('打印错误:', error)
  }
}

// 打印文档
const printDocument = async () => {
  try {
    await VabPrint(documentRef.value, {
      title: 'Vue Shop Vite 打印文档',
      footer: `打印时间：${new Date().toLocaleString()} | 文档版本：v1.0.0`,
      pageSize: printSettings.pageSize,
      orientation: printSettings.orientation,
      beforePrint: () => {
        $baseMessage('正在准备打印文档...', 'info')
      },
      afterPrint: () => {
        $baseMessage('文档打印成功', 'success')
      },
      onError: (error: any) => {
        $baseMessage('文档打印失败', 'error')
        console.error('打印错误:', error)
      },
    })
  } catch (error) {
    $baseMessage('文档打印失败', 'error')
    console.error('打印错误:', error)
  }
}

// 自定义打印
const customPrint = () => {
  customPrintVisible.value = true
}

// 处理自定义打印
const handleCustomPrint = async () => {
  try {
    const content = `
            <div style="padding: 20px; font-family: 'Microsoft YaHei', Arial, sans-serif; background: var(--el-bg-color);">
                <h1 style="text-align: center; color: var(--el-color-primary); margin-bottom: 30px;">${customPrintForm.title}</h1>
                <div style="margin: 20px 0; line-height: 1.6; color: var(--el-text-color-regular);">
                    ${customPrintForm.content}
                </div>
                <div style="margin-top: 40px; text-align: center; color: var(--el-text-color-secondary); font-size: 12px; border-top: 1px solid var(--el-border-color); padding-top: 20px;">
                    ${customPrintForm.footer}
                </div>
            </div>
        `
    await VabPrint(content, {
      pageSize: printSettings.pageSize,
      orientation: printSettings.orientation,
      beforePrint: () => {
        $baseMessage('正在准备自定义打印...', 'info')
      },
      afterPrint: () => {
        $baseMessage('自定义内容打印成功', 'success')
        customPrintVisible.value = false
      },
      onError: (error: any) => {
        $baseMessage('自定义打印失败', 'error')
        console.error('打印错误:', error)
      },
    })
  } catch (error) {
    $baseMessage('自定义打印失败', 'error')
    console.error('打印错误:', error)
  }
}

// 打印选中内容
const printSelected = () => {
  ElMessageBox.confirm('请先选择要打印的内容，然后点击确认', '打印选中内容', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(() => {
      const selection = globalThis.getSelection()
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0)
        const container = document.createElement('div')
        container.appendChild(range.cloneContents())

        VabPrint(container, {
          title: '选中内容打印',
          footer: `打印时间：${new Date().toLocaleString()}`,
          pageSize: printSettings.pageSize,
          orientation: printSettings.orientation,
          beforePrint: () => {
            $baseMessage('正在准备打印选中内容...', 'info')
          },
          afterPrint: () => {
            $baseMessage('选中内容打印成功', 'success')
          },
          onError: (error: any) => {
            $baseMessage('选中内容打印失败', 'error')
            console.error('打印错误:', error)
          },
        })
      } else {
        $baseMessage('请先选择要打印的内容', 'warning')
      }
    })
    .catch(() => {
      // 用户取消
    })
}
</script>
