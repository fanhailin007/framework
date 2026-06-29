<template>
  <div class="workflow-container no-transition-container">
    <vab-alert class="hidden-sm-and-up" title="手机端不支持工作流演示" type="warning" />
    <control v-if="lf" class="vab-control hidden-xs-only" :lf="lf" @cat-data="catData" />
    <node-panel class="hidden-xs-only" :lf="lf" />
    <div id="container" ref="container" class="hidden-xs-only"></div>
    <add-panel
      v-if="showAddPanel"
      class="add-panel hidden-xs-only"
      :lf="lf"
      :node-data="addClickNode"
      :style="addPanelStyle"
      @add-node-finish="hideAddPanel"
    />
    <el-drawer v-model="dialogVisible" :before-close="closeDialog" direction="rtl" size="400px" title="设置节点属性">
      <property-dialog v-if="dialogVisible" :lf="lf" :node-data="clickNode" @set-properties-finish="closeDialog" />
    </el-drawer>
    <vab-dialog v-model="dataVisible" append-to-body class="graph-data-dialog" height="100px" title="数据">
      <data-dialog :graph-data="graphData" />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import LogicFlow from '@logicflow/core'
import '@logicflow/core/lib/style/index.css'
import { Menu, Snapshot } from '@logicflow/extension'
import '@logicflow/extension/lib/style/index.css'
import {
  registerDownload,
  registerEnd,
  registerPolyline,
  registerPush,
  registerStart,
  registerUser,
} from './vabAutoComponents/registerNode'
import { getList } from '/@/api/workflow'
import { gp } from '/@vab/plugins/vab'

defineOptions({
  name: 'Workflow',
})

interface WorkflowData {
  id: string
  type: string
  x: number
  y: number
  properties?: any
}

interface AddPanelStyle {
  top: string
  left: string
}

const data = ref<WorkflowData[]>([])
const lf = ref<any>(null)
const showAddPanel = ref(false)
const addPanelStyle = ref<AddPanelStyle>({
  top: '0px',
  left: '0px',
})
const addClickNode = ref<any>(null)
const clickNode = ref<any>(null)
const dialogVisible = ref(false)
const graphData = ref<any>(null)
const dataVisible = ref(false)
const container = ref<HTMLElement>()

const fetchData = async () => {
  const { data: responseData } = await getList()
  data.value = responseData as any
  initLf()
}

const initLf = () => {
  if (!container.value) return

  // 画布配置
  const config = {
    container: container.value,
    background: {
      backgroundColor: 'var(--el-color-white)',
    },
    grid: {
      size: 10,
      visible: false,
    },
    keyboard: {
      enabled: true,
    },
    edgeTextDraggable: true,
    guards: {
      beforeClone() {
        return true
      },
      beforeDelete() {
        return true
      },
    },
  }
  LogicFlow.use(Menu)
  LogicFlow.use(Snapshot)
  lf.value = new LogicFlow({ ...config })

  lf.value.setMenuConfig({
    nodeMenu: [],
    edgeMenu: [],
  })
  lf.value.addMenuConfig({
    nodeMenu: [
      {
        text: '分享',
        callback() {
          alert('分享成功！')
        },
      },
      {
        text: '属性',
        callback(node: any) {
          alert(`
          节点id：${node.id}
          节点类型：${node.type}
          节点坐标：(x: ${node.x}, y: ${node.y})`)
        },
      },
    ],
    edgeMenu: [
      {
        text: '属性',
        callback(edge: any) {
          alert(`
          边id：${edge.id}
          边类型：${edge.type}
          边坐标：(x: ${edge.x}, y: ${edge.y})
          源节点id：${edge.sourceNodeId}
          目标节点id：${edge.targetNodeId}`)
        },
      },
    ],
  })
  lf.value.setTheme({
    circle: {
      r: 20,
      fill: 'var(--el-color-white)',
      stroke: 'var(--el-color-grey)',
      strokeWidth: 1,
    },
    rect: {
      fill: 'var(--el-color-white)',
      stroke: 'var(--el-color-grey)',
      strokeWidth: 1,
    },
    diamond: {
      fill: 'var(--el-color-white)',
      stroke: 'var(--el-color-grey)',
      strokeWidth: 1,
    },
    ellipse: {
      fill: 'var(--el-color-white)',
      stroke: 'var(--el-color-grey)',
      strokeWidth: 1,
    },
    polygon: {
      fill: 'var(--el-color-white)',
      stroke: 'var(--el-color-grey)',
      strokeWidth: 1,
    },
    polyline: {
      stroke: 'var(--el-color-grey)',
      hoverStroke: 'var(--el-color-grey)',
      selectedStroke: 'var(--el-color-grey)',
      strokeWidth: 1,
    },
    nodeText: {
      color: 'var(--el-color-grey)',
      fontSize: 12,
    },
    edgeText: {
      color: 'var(--el-color-grey)',
      fontSize: 12,
      textWidth: 100,
      background: {
        fill: 'var(--el-color-white)',
      },
    },
  })
  registerNode()
}

const registerNode = () => {
  if (!lf.value) return
  registerStart(lf.value)
  registerUser(lf.value)
  registerEnd(lf.value)
  registerPush(lf.value, clickPlus, mouseDownPlus)
  registerDownload(lf.value)
  registerPolyline(lf.value)
  render()
}

const render = () => {
  if (!lf.value) return
  lf.value.render(data.value)
  event()
}

const event = () => {
  if (!lf.value) return
  lf.value.on('node:click', ({ data }: any) => {
    clickNode.value = data
    dialogVisible.value = true
  })
  lf.value.on('edge:click', ({ data }: any) => {
    clickNode.value = data
    dialogVisible.value = true
  })
  lf.value.on('element:click', () => {
    hideAddPanel()
  })
  lf.value.on('blank:click', () => {
    hideAddPanel()
  })
  lf.value.on('connection:not-allowed', (data: any) => {
    gp.$baseMessage(data.msg, 'error', 'hey')
  })
  lf.value.on('node:mousemove', () => {})
}

const clickPlus = (e: Event, attributes: any) => {
  e.stopPropagation()
  const event = e as MouseEvent
  const { clientX, clientY } = event
  addPanelStyle.value.top = `${clientY - 40}px`
  addPanelStyle.value.left = `${clientX}px`
  showAddPanel.value = true
  addClickNode.value = attributes
}

const mouseDownPlus = (e: Event) => {
  e.stopPropagation()
}

const hideAddPanel = () => {
  showAddPanel.value = false
  addPanelStyle.value.top = '0px'
  addPanelStyle.value.left = '0px'
  addClickNode.value = null
}

const closeDialog = () => {
  dialogVisible.value = false
}

const catData = () => {
  if (!lf.value) return
  graphData.value = lf.value.getGraphData()
  dataVisible.value = true
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.workflow-container {
  position: relative;

  .vab-control {
    position: absolute;
    top: var(--el-margin);
    left: var(--el-margin);
    z-index: 2;
  }

  #container {
    height: calc(var(--el-container-height) - var(--el-padding) * 2);
    outline: none;
  }

  .time-plus {
    cursor: pointer;
  }

  .add-panel {
    position: absolute;
    z-index: 11;
  }
}
</style>

<style lang="scss">
.graph-data-dialog {
  .el-dialog__body {
    max-height: 70vh;
    overflow-y: auto;
  }
}
</style>
