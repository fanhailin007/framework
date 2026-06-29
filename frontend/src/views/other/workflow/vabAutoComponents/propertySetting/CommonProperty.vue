<template>
  <div>
    <el-form label-width="80px" :model="formData" @submit.prevent>
      <el-form-item label="名称">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="活动区域">
        <el-input v-model="formData.region" />
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input v-model="formData.type" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
interface FormData {
  name: string
  region: string
  type: string
}

interface NodeData {
  id: string
  properties?: FormData

  [key: string]: any
}

interface Props {
  nodeData: NodeData
  lf: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  onClose: []
}>()

const formData = ref<FormData>({
  name: '',
  region: '',
  type: '',
})

onMounted(() => {
  const { properties } = props.nodeData
  if (properties) {
    formData.value = Object.assign({}, formData.value, properties)
  }
})

const onSubmit = () => {
  const { id } = props.nodeData
  props.lf.setProperties(id, formData.value)
  emit('onClose')
}
</script>
