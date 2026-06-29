/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_UPDATE_TIME: string
  readonly VITE_APP_GITHUB_USER_NAME: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
