<template>
  <el-col :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
    <vab-card :body-style="{ height: '240px' }" skeleton :title="title">
      <vab-chart :option="option" />
    </vab-card>
  </el-col>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabChartLine',
})

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
let timer: ReturnType<typeof setInterval>

const option = reactive<any>({
  grid: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40,
  },
  tooltip: {
    trigger: 'item',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: {
    data: [random(50, 100), random(10, 100), random(10, 100), random(10, 100), random(10, 100), random(50, 100), random(50, 200)],
    type: 'line',
  },
})

watch(
  () => theme.value.color,
  () => {
    option.color = [theme.value.color, '#36cbcb', '#4ecb73', '#fbd437', '#f2637b', '#8d98b3', '#975fe5']
  },
  { immediate: true }
)

onMounted(() => {
  timer = setInterval(() => {
    option.series.data = [
      random(50, 100),
      random(10, 100),
      random(10, 100),
      random(10, 100),
      random(10, 100),
      random(50, 100),
      random(50, 200),
    ]
  }, 3000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
storeToRefslettimer
