import type { App } from 'vue'
import { errorFilter, errorLog } from '/@/config'
import pinia from '/@/store'
import { useErrorLogStore } from '/@/store/modules/errorLog'
import { isArray } from '/@/utils/validate'

export const needErrorLog = () => {
  const errorLogArray = isArray(errorLog) ? [...errorLog] : [errorLog]
  return errorLogArray.includes(import.meta.env.MODE)
}

export const addErrorLog = (err: Error | any) => {
  const errorFilterArray = isArray(errorFilter) ? [...errorFilter] : [errorFilter]
  const shouldFilter = errorFilterArray.some((filter) => err.message && err.message.includes(filter))
  if (shouldFilter) return
  // 区分请求错误和其他错误
  if (!err.isRequest) {
    console.error('Vue Shop Vite 错误拦截:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    })
  }

  const url = globalThis.location.href
  const { addErrorLog } = useErrorLogStore(pinia)
  addErrorLog({ err, url })
}

export default {
  install: (app: App<Element>) => {
    if (needErrorLog()) app.config.errorHandler = addErrorLog
  },
}
