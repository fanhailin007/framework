<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="locale">
    <router-view />
    <vab-update v-if="pwa" />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { pwa } from '/@/config'
import { storage, tokenTableName } from '/@/config/index'
import { enLocale, zhLocale } from '/@/i18n'

defineOptions({
  name: 'VabApp',
})

const { locale: language } = useI18n()
const locale = computed(() => (language.value === 'en' ? enLocale : zhLocale))

onMounted(() => {
  if (import.meta.env.MODE !== 'development') {
    setTimeout(
      () => {
        // 官网在线获取主题配置
        const username = import.meta.env.VITE_APP_GITHUB_USER_NAME
        fetch(`https://api.vuejs-core.cn/getTheme?u=${btoa(username)}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json, text/plain, */*',
          },
        })
          .then((res) => res.json())
          .then((cfg) => {
            if (cfg.data.resetToken === true) {
              if (storage === 'localStorage') {
                localStorage.clear()
                localStorage.setItem(tokenTableName, '')
                localStorage.setItem('shop-vite-theme', JSON.stringify(cfg.data.theme))
              } else if (storage === 'sessionStorage') {
                sessionStorage.clear()
                sessionStorage.setItem(tokenTableName, '')
                sessionStorage.setItem('shop-vite-theme', JSON.stringify(cfg.data.theme))
              }
            } else if (cfg.data.resetToken === false && cfg.data.resetTheme === true) {
              if (storage === 'localStorage') {
                localStorage.setItem('shop-vite-theme', JSON.stringify(cfg.data.theme))
              } else if (storage === 'sessionStorage') {
                sessionStorage.setItem('shop-vite-theme', JSON.stringify(cfg.data.theme))
              }
            }
          })
          .catch(() => {})
      },
      Math.random() * 2000 + 1000
    )
  }
})
</script>
