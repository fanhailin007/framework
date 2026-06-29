<template>
  <div class="checkbox-container no-background-container">
    <vab-card title="基础用法">
      <el-checkbox v-model="checked">备选项1</el-checkbox>
    </vab-card>
    <vab-card title="禁用状态">
      <el-checkbox v-model="checked1" disabled>备选项1</el-checkbox>
      <el-checkbox v-model="checked2" disabled>备选项2</el-checkbox>
    </vab-card>
    <vab-card title="多选框组（支持右键）">
      <div @contextmenu="onContextMenu($event)">
        <el-checkbox-group v-model="checkList">
          <el-checkbox value="复选框 A">复选框 A</el-checkbox>
          <el-checkbox value="复选框 B">复选框 B</el-checkbox>
          <el-checkbox value="复选框 C">复选框 C</el-checkbox>
          <el-checkbox disabled value="禁用">禁用</el-checkbox>
          <el-checkbox disabled value="选中且禁用">选中且禁用</el-checkbox>
        </el-checkbox-group>
        <vab-context-menu v-model:show="show" :options="options">
          <vab-context-menu-item label="全选" @click="selectAll" />
          <vab-context-menu-item label="反选" @click="toggleSelect" />
          <vab-context-menu-item label="清空" @click="clearSelect" />
        </vab-context-menu>
      </div>
    </vab-card>
    <vab-card title="可选项目数量的限制">
      <el-checkbox-group v-model="checkedCities" :max="2" :min="1">
        <el-checkbox v-for="city in cities" :key="city" :label="city" :value="city" />
      </el-checkbox-group>
    </vab-card>
    <vab-card title="按钮样式">
      <el-checkbox-group v-model="checkboxGroup1">
        <el-checkbox-button v-for="city in cities" :key="city" :label="city" :value="city" />
      </el-checkbox-group>
    </vab-card>
    <vab-card title="带有边框">
      <el-checkbox v-model="checked3" border label="备选项1" />
      <el-checkbox v-model="checked4" border label="备选项2" />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
import { VabContextMenu, VabContextMenuItem } from '/@/plugins/VabContextMenu'

defineOptions({
  name: 'Checkbox',
})

const checked = ref<boolean>(true)
const checked1 = ref<boolean>(false)
const checked2 = ref<boolean>(true)
const checkList = ref<any>(['选中且禁用', '复选框 A'])
const checkedCities = ref<any>(['上海', '北京'])
const cities = ref<any>(['上海', '北京', '广州', '深圳'])
const checkboxGroup1 = ref<any>(['上海'])
const checked3 = ref<boolean>(true)
const checked4 = ref<boolean>(false)
const show = ref(false)
const options = reactive<any>({ minWidth: 160, x: 0, y: 0 })
const allOptions = ['复选框 A', '复选框 B', '复选框 C', '选中且禁用']

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  options.x = e.x
  options.y = e.y
  show.value = true
}
const selectAll = () => {
  checkList.value = [...allOptions]
}
const toggleSelect = () => {
  checkList.value = allOptions.filter((opt) => !checkList.value.includes(opt))
}
const clearSelect = () => {
  checkList.value = []
}
</script>
