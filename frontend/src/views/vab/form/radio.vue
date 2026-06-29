<template>
  <div class="radio-container no-background-container">
    <vab-card>
      <template #header>基础用法</template>
      <el-radio v-model="radio" :value="'1'">备选项1</el-radio>
      <el-radio v-model="radio" :value="'2'">备选项2</el-radio>
    </vab-card>
    <vab-card>
      <template #header>禁用状态</template>
      <el-radio v-model="radio2" disabled :value="'1'">选中且禁用</el-radio>
      <el-radio v-model="radio2" disabled :value="'2'">禁用</el-radio>
    </vab-card>
    <vab-card>
      <template #header>单选框组</template>
      <el-radio-group v-model="radio3">
        <el-radio :value="'1'">备选项1</el-radio>
        <el-radio :value="'2'">备选项2</el-radio>
        <el-radio :value="'3'">备选项3</el-radio>
      </el-radio-group>
    </vab-card>
    <vab-card>
      <template #header>按钮样式</template>
      <el-radio-group v-model="radio4">
        <el-radio-button v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </el-radio-button>
      </el-radio-group>
    </vab-card>
    <vab-card>
      <template #header>带有边框</template>
      <el-radio v-model="radio5" border :value="'1'">备选项1</el-radio>
      <el-radio v-model="radio5" border :value="'2'">备选项2</el-radio>
    </vab-card>
    <vab-card>
      <template #header>带描述信息</template>
      <el-radio-group v-model="radio6">
        <el-radio :value="'1'">
          选项A
          <div style="font-size: 12px; color: #999">这是选项A的描述</div>
        </el-radio>
        <el-radio :value="'2'">
          选项B
          <div style="font-size: 12px; color: #999">这是选项B的描述</div>
        </el-radio>
      </el-radio-group>
    </vab-card>
    <vab-card>
      <template #header>动态生成选项</template>
      <el-radio-group v-model="radio8">
        <el-radio v-for="item in dynamicOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </vab-card>
    <vab-card>
      <template #header>按钮样式禁用项</template>
      <el-radio-group v-model="radio9">
        <el-radio-button v-for="city in cities" :key="city" :disabled="city === '广州'" :value="city">
          {{ city }}
        </el-radio-button>
      </el-radio-group>
    </vab-card>
    <vab-card>
      <template #header>切换事件</template>
      <el-radio-group v-model="radio11" @change="onRadioChange">
        <el-radio :value="'A'">A</el-radio>
        <el-radio :value="'B'">B</el-radio>
        <el-radio :value="'C'">C</el-radio>
      </el-radio-group>
      <div style="margin-top: 8px; color: #409eff">当前选中：{{ radio11 }}</div>
    </vab-card>
    <vab-card>
      <template #header>带图标/图片</template>
      <el-radio-group v-model="radio12">
        <el-radio :value="'apple'">
          <img src="https://img.icons8.com/ios-filled/24/000000/mac-os.png" style="vertical-align: middle" />
          苹果
        </el-radio>
        <el-radio :value="'android'">
          <img src="https://img.icons8.com/color/24/000000/android-os.png" style="vertical-align: middle" />
          安卓
        </el-radio>
        <el-radio :value="'windows'">
          <img src="https://img.icons8.com/color/24/000000/windows-11.png" style="vertical-align: middle" />
          Windows
        </el-radio>
      </el-radio-group>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Radio',
})

const radio = ref<string>('1')
const radio2 = ref<string>('1')
const radio3 = ref<any>('1')
const cities = ref<any>(['上海', '北京', '广州', '深圳'])
const radio4 = ref<string>('上海')
const radio5 = ref<string>('1')
const radio6 = ref<string>('1')
const dynamicOptions = ref<any[]>([
  { value: 'a', label: '动态A' },
  { value: 'b', label: '动态B' },
  { value: 'c', label: '动态C' },
])
const radio8 = ref<string>('a')
const radio9 = ref<string>('上海')
const radio11 = ref<string>('A')
const radio12 = ref<string>('apple')

function onRadioChange(val: string | number | boolean | undefined) {
  // 这里只做简单演示，实际可用 ElMessage 组件提示
  console.log('当前选中：', val)
}
</script>
