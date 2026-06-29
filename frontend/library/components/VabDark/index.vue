<template>
  <vab-icon
    v-if="route.path !== '/goods/posterDesign'"
    class="vab-dark"
    :icon="mode === 'dark' ? 'moon-line' : 'sun-line'"
    @click="_toggleDark($event)"
  />
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabDark',
})

const route = useRoute()
const settingsStore = useSettingsStore()
const { theme, mode } = storeToRefs(settingsStore)
const { updateMode } = settingsStore
const originalBodyClass = ref('')

const _toggleDark = async (event: MouseEvent) => {
  if (typeof document.startViewTransition === 'function') {
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    let isDark: boolean
    const transition = document.startViewTransition(() => {
      const root = document.documentElement
      isDark = root.classList.contains('dark')
      root.classList.remove(isDark ? 'dark' : 'light')
      root.classList.add(isDark ? 'light' : 'dark')
      handleSetScheme(isDark ? 'light' : 'dark')

      // 处理 body 类
      const body = document.body
      if (isDark) {
        // 从暗黑切换到日间模式，恢复原来的 class
        if (originalBodyClass.value) {
          body.className = originalBodyClass.value
        }
      } else {
        // 从日间切换到暗黑模式，保存原来的 class 并设置为 vab-theme-default
        originalBodyClass.value = body.className
        body.className = 'vab-theme-default'
      }
    })
    await transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 600,
          easing: 'ease-in',
          pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      )
    })
  } else {
    const toggleDark = useToggle(handleUseDark())
    await toggleDark()

    // 处理没有过渡效果时的 body 类
    const body = document.body
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark) {
      // 切换到暗黑模式
      originalBodyClass.value = body.className
      body.className = 'vab-theme-default'
    } else {
      // 切换到日间模式
      if (originalBodyClass.value) {
        body.className = originalBodyClass.value
      }
    }
  }
  await updateMode(localStorage.getItem('vueuse-color-scheme'))
}

const handleUseDark = () => {
  return useDark()
}

const handleGetScheme = (): string => {
  return localStorage.getItem('vueuse-color-scheme') || 'light'
}

const handleSetScheme = (value: string) => {
  return localStorage.setItem('vueuse-color-scheme', value)
}

onBeforeMount(() => {
  // 还原默认
  $sub('shop-vite-reset-dark', () => {
    mode.value = handleGetScheme()
    if (handleGetScheme() === 'dark') {
      handleSetScheme('light')
      handleUseDark()
      mode.value = 'light'
      // 恢复 body 的原始 class
      if (originalBodyClass.value) {
        document.body.className = originalBodyClass.value
      }
    }
  })

  handleUseDark()
  if (handleGetScheme() === 'auto') handleSetScheme('light')
  mode.value = handleGetScheme()

  // 初始化时处理 body 的 class
  if (handleGetScheme() === 'dark') {
    originalBodyClass.value = document.body.className
    document.body.className = 'vab-theme-default'
  }
})
</script>

<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root) {
  z-index: 999;
}

::view-transition-new(root) {
  z-index: 1;
}

.dark {
  &::view-transition-old(root) {
    z-index: 1;
  }

  &::view-transition-new(root) {
    z-index: 999;
  }
}

.vab-dark {
  position: relative;
  margin-left: var(--el-margin);
  cursor: pointer;
  transition: var(--el-transition);

  i {
    display: inline-block;
  }

  &.ri-sun-line {
    font-size: var(--el-font-size-large);
  }

  &.ri-sun-line:hover {
    transform: rotate(90deg);
  }

  &.ri-moon-line:hover {
    filter: drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 16px #fffbe6);
    transform: scale(1.2);
  }
}
</style>
