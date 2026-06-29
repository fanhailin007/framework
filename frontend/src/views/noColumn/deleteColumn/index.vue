<template>
  <div class="delete-column-container">
    <el-form label-position="top">
      <el-form-item label="是否开启页面间距">
        <el-button-group>
          <el-button :type="hasPadding ? 'primary' : 'default'" @click="hasPadding = true">开启</el-button>
          <el-button :type="!hasPadding ? 'primary' : 'default'" @click="hasPadding = false">关闭</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="是否开启页脚">
        <el-button-group>
          <el-button :type="hasFooter ? 'primary' : 'default'" @click="hasFooter = true">开启</el-button>
          <el-button :type="!hasFooter ? 'primary' : 'default'" @click="hasFooter = false">关闭</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'DeleteColumn',
})

const route = useRoute()

const hasPadding = ref(true)
const hasFooter = ref(true)
const updateContainerStyle = () => {
  if (hasPadding.value) {
    let minHeight = `calc(var(--vh, 1vh) * 100 - var(--el-nav-height) - var(--el-tabs-height)`
    if (hasFooter.value) {
      minHeight += ' - var(--el-footer-height) - var(--el-padding)'
    }
    minHeight += ' - var(--el-padding) * 2)'
    useStyleTag(
      `
            section > [class*=container] { min-height: ${minHeight} !important; }
            .vab-footer { ${hasFooter.value ? '' : 'display: none !important;'} }
        `,
      { id: 'vab-app-main-padding-zero' }
    )
  } else {
    let minHeight = `calc(var(--vh, 1vh) * 100 - var(--el-nav-height) - var(--el-tabs-height)`
    if (hasFooter.value) {
      minHeight += ' - var(--el-footer-height)'
    }
    minHeight += ')'
    useStyleTag(
      `
            .vab-app-main { padding: 0 !important; border: none !important; border-radius: 0 !important; }
            .vab-footer { margin-top: 0 !important; border: none !important;${hasFooter.value ? ' border-top: 1px solid var(--el-border-color) !important;' : ''} border-radius: 0 !important; ${hasFooter.value ? '' : 'display: none !important;'} }
            section > [class*=container] { border: none !important; border-radius: 0 !important; min-height: ${minHeight} !important; }
            `,
      { id: 'vab-app-main-padding-zero' }
    )
  }
}

watch(
  () => route.name,
  (newName) => {
    if (newName !== 'DeleteColumn') {
      useStyleTag('', { id: 'vab-app-main-padding-zero' })
      useStyleTag('', { id: 'vab-footer-visible' })
      hasPadding.value = true
      hasFooter.value = true
    }
  },
  { immediate: true }
)

watch([hasFooter, hasPadding], updateContainerStyle, { immediate: true })
</script>
