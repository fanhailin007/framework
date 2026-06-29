<template>
  <div class="property-dialog">
    <user v-if="nodeData.type === 'user'" :lf="lf" :node-data="nodeData" @on-close="handleClose" />
    <common-property v-else :lf="lf" :node-data="nodeData" @on-close="handleClose" />
  </div>
</template>

<script lang="ts" setup>
interface NodeData {
  id: string
  type: string

  [key: string]: any
}

interface Props {
  nodeData: NodeData
  lf: any
}

defineProps<Props>()
const emit = defineEmits<{
  setPropertiesFinish: []
}>()

const handleClose = () => {
  emit('setPropertiesFinish')
}
</script>

<style>
.property-dialog {
  padding: var(--el-padding);
}
</style>
