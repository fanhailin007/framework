<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="添加动作">
      <div v-for="item in nodeList" :key="item.type">
        <el-button class="add-node-btn" type="primary" @click="$_addNode(item)">
          {{ item.label }}
        </el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="添加组">
      <el-button class="add-node-btn" type="primary" @click="$_addTemplate">模板</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
interface NodeItem {
  type: string
  label: string
}

interface NodeData {
  id: string
  x: number
  y: number

  [key: string]: any
}

interface Props {
  nodeData: NodeData
  lf: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  addNodeFinish: []
}>()

const nodeList: NodeItem[] = [
  {
    type: 'user',
    label: '用户',
  },
  {
    type: 'push',
    label: '推送',
  },
]

const $_addNode = (item: NodeItem) => {
  const { lf, nodeData } = props
  const { id, x, y } = nodeData
  const nextNode = lf.addNode({
    type: item.type,
    x: x + 150,
    y: y + 150,
  })
  const nextId = nextNode.id
  lf.createEdge({ sourceNodeId: id, targetNodeId: nextId })
  emit('addNodeFinish')
}

const $_addTemplate = () => {
  const { lf, nodeData } = props
  const { id, x, y } = nodeData
  const timeNode = lf.addNode({
    type: 'download',
    x,
    y: y + 150,
  })
  const userNode = lf.addNode({
    type: 'user',
    x: x + 150,
    y: y + 150,
  })
  const pushNode = lf.addNode({
    type: 'push',
    x: x + 150,
    y: y + 300,
    properties: {},
  })
  const endNode = lf.addNode({
    type: 'end',
    x: x + 300,
    y: y + 150,
  })
  const endNode2 = lf.addNode({
    type: 'end',
    x: x + 300,
    y: y + 300,
  })
  lf.createEdge({ sourceNodeId: id, targetNodeId: timeNode.id })
  lf.createEdge({ sourceNodeId: timeNode.id, targetNodeId: userNode.id })
  lf.createEdge({
    sourceNodeId: userNode.id,
    targetNodeId: endNode.id,
    endPoint: { x: x + 280, y: y + 150 },
    text: {
      value: 'Y',
      x: x + 230,
      y: y + 140,
    },
  })
  lf.createEdge({
    sourceNodeId: userNode.id,
    targetNodeId: pushNode.id,
    text: {
      value: 'N',
      x: x + 160,
      y: y + 230,
    },
  })
  lf.createEdge({
    sourceNodeId: pushNode.id,
    targetNodeId: endNode2.id,
    endPoint: { x: x + 280, y: y + 300 },
  })
  emit('addNodeFinish')
}
</script>

<style scoped>
.add-node-btn {
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>
