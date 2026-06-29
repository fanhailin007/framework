<template>
  <div>
    <vab-chart :option="option" />
  </div>
</template>

<script lang="ts" setup>
import { graphic } from 'echarts/core'
import { pull, random, sample } from 'lodash-es'
import { useSettingsStore } from '/@/store/modules/settings'
import { lightenColor } from '/@/utils/lightenColor'

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
let timer: ReturnType<typeof setInterval>

const option = reactive<any>({
  xAxis: {
    type: 'category',
    data: ['00:00', '1:00', '2:00', '3:00', '4:00', '5:00'],
    boundaryGap: false,
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)',
      },
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 12,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)',
        type: 'dashed',
      },
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 12,
      margin: 5,
    },
  },
  series: {
    barWidth: 20,
    name: '活跃用户',
    type: 'bar',
    data: [random(50, 200), random(10, 200), random(10, 200), random(10, 200), random(10, 200), random(50, 200)],
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: lightenColor(theme.value.color, 20) },
        { offset: 1, color: theme.value.color },
      ]),
    },
    emphasis: {
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: lightenColor(theme.value.color, 10) },
          { offset: 1, color: lightenColor(theme.value.color, -10) },
        ]),
      },
    },
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  },
})

watch(
  () => theme.value.color,
  (newColor) => {
    option.series.itemStyle.color = new graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: lightenColor(newColor, 20) },
      { offset: 1, color: newColor },
    ])

    option.series.emphasis.itemStyle.color = new graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: lightenColor(newColor, 10) },
      { offset: 1, color: lightenColor(newColor, -10) },
    ])
  },
  { immediate: true }
)

onMounted(() => {
  timer = setInterval(() => {
    option.series.data = [random(50, 100), random(10, 100), random(10, 100), random(10, 100), random(10, 100), random(50, 100)]
    option.series.type = sample(pull(['bar', 'line'], option.series.type))
  }, 3000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
:deep() {
  .echarts {
    position: absolute;
    right: 7px;
    bottom: 0;
    width: calc(100% - 160px) !important;
    height: 60px !important;
  }
}
</style>
