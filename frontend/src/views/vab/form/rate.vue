<template>
  <div class="rate-container no-background-container">
    <vab-card title="基础用法">
      <el-rate v-model="value1" />
    </vab-card>
    <vab-card title="辅助文字">
      <el-rate v-model="value2" show-text />
    </vab-card>
    <vab-card title="只读">
      <el-rate v-model="value3" disabled score-template="{value}" show-score text-color="var(--el-color-warning)" />
    </vab-card>
    <vab-card title="不同尺寸">
      <el-rate v-model="value4" size="large" />
      <el-rate v-model="value5" size="small" style="margin-left: 20px" />
    </vab-card>
    <vab-card title="允许半星">
      <el-rate v-model="value6" allow-half />
    </vab-card>
    <vab-card title="自定义颜色">
      <el-rate v-model="value7" :colors="colors" />
    </vab-card>
    <vab-card title="自定义图标">
      <el-rate v-model="value8" :colors="iconColors" :icons="icons" :void-icon="voidIcon" />
    </vab-card>
    <vab-card title="可清空">
      <el-rate v-model="value9" clearable />
    </vab-card>
    <vab-card title="自定义文本">
      <el-rate v-model="value10" show-text :texts="texts" />
    </vab-card>
    <vab-card title="自定义最大分值">
      <el-rate v-model="value11" :max="10" />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
import { ChatDotRound, ChatLineRound, ChatRound } from '@element-plus/icons-vue'

defineOptions({
  name: 'Rate',
})

const value1 = ref<any>(null)
const value2 = ref<any>(null)
const value3 = ref<any>(3.7)
const value4 = ref<any>(0)
const value5 = ref<any>(0)
const value6 = ref<any>(0)
const value7 = ref<any>(0)
const value8 = ref<any>(0)
const value9 = ref<any>(3)
const value10 = ref<any>(0)
const value11 = ref<any>(0)

const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const iconColors = ref(['#409eff', '#67c23a', '#FF9900'])
const icons = [ChatRound, ChatLineRound, ChatDotRound]
const voidIcon = ChatRound
const texts = ['很差', '失望', '一般', '满意', '惊喜']
</script>
