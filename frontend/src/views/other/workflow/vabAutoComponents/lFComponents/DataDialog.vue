<template>
  <div>
    <vab-json-viewer copyable :expand-depth="5" sort :value="data" />
  </div>
</template>

<script lang="ts" setup>
import VabJsonViewer from 'vue-json-viewer'

interface GraphData {
  edges: any[]
  nodes: any[]
}

interface Props {
  graphData: GraphData
}

const props = defineProps<Props>()

const data = ref<any[]>([])

onMounted(() => {
  data.value = JSON.parse(
    JSON.stringify([
      {
        edges: props.graphData.edges,
        nodes: props.graphData.nodes,
      },
    ])
  )
})
</script>
