<template>
  <div class="illustration-container no-background-container">
    <el-row :gutter="20">
      <el-col>
        <vab-card>
          <el-form @submit.prevent>
            <el-form-item label="换肤">
              <vab-color-picker />
            </el-form-item>
            <el-form-item label="svg大小（px）">
              <el-slider v-model="queryForm.num" :max="350" :min="150" style="width: 190px" />
            </el-form-item>
          </el-form>
        </vab-card>
      </el-col>
      <el-col v-for="(item, index) in illustrationsArray" :key="index" :lg="span" :md="12" :sm="12" :xl="span" :xs="24">
        <vab-card class="illustration-card" @click="handleCopyIcon(item)">
          <vab-icon
            class="vab-illustration"
            :icon="item"
            is-custom-svg
            :style="{
              width: queryForm.num + 'px',
              height: queryForm.num + 'px',
            }"
          />
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import clip from '/@/utils/clipboard'

const illustrationsArray: string[] = []
const span = ref<number>(4)

const files: any = import.meta.glob('../../icon/illustration/*.svg', {
  eager: true,
})

for (const key in files) {
  const _key = key.slice(11)
  illustrationsArray.unshift(_key.slice(0, Math.max(0, _key.length - 4)))
}

const queryForm = reactive<any>({
  num: 150,
})

const handleCopyIcon = (item: any) => {
  clip(`<vab-icon icon="${item}" is-custom-svg/>`)
}

watch(
  queryForm,
  () => {
    if (queryForm.num < 200) span.value = 4
    else span.value = 6
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.illustration-container {
  .vab-illustration {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  :deep() {
    .el-form-item:last-child {
      margin-bottom: 0;
    }

    .vab-color-picker {
      margin-left: 0 !important;
    }

    .illustration-card {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
