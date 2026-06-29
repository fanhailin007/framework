<template>
  <div class="description-container no-background-container">
    <vab-card>
      <el-radio-group v-model="size">
        <el-radio value="large">默认</el-radio>
        <el-radio value="default">中等</el-radio>
        <el-radio value="small">小</el-radio>
      </el-radio-group>
      <el-descriptions border :column="3" :size="size" title="带边框">
        <template #extra>
          <el-button size="small" type="primary">操作</el-button>
        </template>
        <el-descriptions-item>
          <template #label>用户名</template>
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>电话</template>
          18100000000
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>地点</template>
          苏州
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>备注</template>
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>地址</template>
          江苏省苏州市吴中区吴中大道1188号
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions :column="3" :size="size" title="不带边框">
        <template #extra>
          <el-button size="small" type="primary">操作</el-button>
        </template>
        <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
        <el-descriptions-item label="电话">18100000000</el-descriptions-item>
        <el-descriptions-item label="地点">苏州</el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="地址">江苏省苏州市吴中区吴中大道1188号</el-descriptions-item>
      </el-descriptions>

      <el-descriptions border :column="4" direction="vertical" :size="size" title="带边框的垂直列表">
        <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
        <el-descriptions-item label="电话">18100000000</el-descriptions-item>
        <el-descriptions-item label="地点" :span="2">苏州</el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="地址">江苏省苏州市吴中区吴中大道1188号</el-descriptions-item>
      </el-descriptions>

      <el-descriptions :column="4" direction="vertical" :size="size" title="无边框的垂直列表">
        <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
        <el-descriptions-item label="电话">18100000000</el-descriptions-item>
        <el-descriptions-item label="地点" :span="2">苏州</el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="地址">江苏省苏州市吴中区吴中大道1188号</el-descriptions-item>
      </el-descriptions>
    </vab-card>

    <vab-card>
      手风琴
      <el-switch v-model="accordion" inline-prompt @change="handleAccordion" />

      <el-collapse v-model="activeName" :accordion="accordion">
        <el-collapse-item name="1" title="一致性">
          <div>与现实生活一致：与现实生活的流程和逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计风格、图标和文本、元素的位置等。</div>
        </el-collapse-item>
        <el-collapse-item name="2" title="反馈">
          <div>操作反馈：让用户清楚地感知到他们的操作，通过样式更新和交互效果；</div>
          <div>视觉反馈：通过更新或重新排列页面元素来反映当前状态。</div>
        </el-collapse-item>
        <el-collapse-item name="3" title="效率">
          <div>简化流程：保持操作流程简单直观；</div>
          <div>明确清晰：清楚地表达您的意图，让用户能够快速理解和做出决策；</div>
          <div>易于识别：界面应该直观明了，帮助用户识别，避免记忆和回忆。</div>
        </el-collapse-item>
        <el-collapse-item name="4" title="可控性">
          <div>决策：关于操作的建议是可以接受的，但不要为用户做决定；</div>
          <div>可控结果：用户应该被授予操作的自由，包括取消、中止或终止当前操作。</div>
        </el-collapse-item>
      </el-collapse>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Description',
})
const size = ref<any>('default')
const accordion: Ref<boolean> = ref<boolean>(false)
const activeName = ref<any>(['1', '2', '3', '4'])

const handleAccordion = (value: any) => {
  if (value) activeName.value = '1'
  else activeName.value = ['1', '2', '3', '4']
}
</script>

<style lang="scss" scoped>
.description-container {
  :deep() {
    .el-descriptions {
      padding-top: var(--el-padding) !important;
    }

    .el-collapse {
      margin-top: var(--el-margin) !important;
    }
  }
}
</style>
