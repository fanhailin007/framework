<template>
  <div class="quick-color-palette">
    <span
      v-for="color in palette"
      :key="color"
      class="quick-color-block"
      :class="{ selected: color === modelValue }"
      :style="{ background: color }"
      @click="$emit('select', color)"
    >
      <svg v-if="color === modelValue" class="checkmark" viewBox="0 0 20 20">
        <polyline fill="none" points="5,11 9,15 15,7" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
      </svg>
    </span>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabQuickColor',
})

const { modelValue } = defineProps<{ modelValue?: string }>()
const palette = ['#1e90ff', '#4e6ef2', '#3fb884', '#16baa9', '#009688', '#6954f0', '#f01414']
</script>

<style lang="scss" scoped>
.quick-color-palette {
  display: flex;
  gap: 8px;

  .quick-color-block {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border-radius: var(--el-border-radius-small);
    transition: transform 0.1s;

    &:hover {
      transform: scale(1.1);
    }

    .checkmark {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2;
      width: 14px;
      height: 14px;
      pointer-events: none;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
