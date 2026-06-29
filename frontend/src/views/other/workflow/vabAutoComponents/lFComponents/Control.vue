<template>
  <el-button-group>
    <el-button plain @click="$_zoomIn">放大</el-button>
    <el-button plain @click="$_zoomOut">缩小</el-button>
    <el-button plain @click="$_zoomReset">大小适应</el-button>
    <el-button plain @click="$_translateRest">定位还原</el-button>
    <el-button plain @click="$_reset">还原</el-button>
    <el-button :disabled="undoDisable" plain @click="$_undo">上一步</el-button>
    <el-button :disabled="redoDisable" plain @click="$_redo">下一步</el-button>
    <el-button plain @click="$_download">下载图片</el-button>
    <el-button plain @click="$_catData">查看数据</el-button>
  </el-button-group>
</template>

<script lang="ts" setup>
interface Props {
  lf: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'cat-data': []
}>()

const undoDisable = ref(true)
const redoDisable = ref(true)

onMounted(() => {
  props.lf.on('history:change', ({ data: { undoAble, redoAble } }: any) => {
    undoDisable.value = !undoAble
    redoDisable.value = !redoAble
  })
})

const $_zoomIn = () => {
  props.lf.zoom(true)
}

const $_zoomOut = () => {
  props.lf.zoom(false)
}

const $_zoomReset = () => {
  props.lf.resetZoom()
}

const $_translateRest = () => {
  props.lf.resetTranslate()
}

const $_reset = () => {
  props.lf.resetZoom()
  props.lf.resetTranslate()
}

const $_undo = () => {
  props.lf.undo()
}

const $_redo = () => {
  props.lf.redo()
}

const $_download = () => {
  props.lf.getSnapshot()
}

const $_catData = () => {
  emit('cat-data')
}
</script>
