<template>
  <div class="random-theme-container">
    <el-button type="primary" @click="handleRandomTheme">随机换肤</el-button>
    <el-button type="primary" @click="resetTheme">默认主题</el-button>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'RandomTheme',
})

const handleRandomTheme = () => {
  $pub('shop-vite-random-theme')
}

const resetTheme = () => {
  $pub('shop-vite-reset-theme')
}
</script>
