# 整体架构

## 目标

本框架用于快速构建中后台、大屏、门户和运营类前端应用。架构目标是让业务团队在统一的启动流程、路由协议、权限体系、请求规范、主题布局和工程质量门禁下开发模块，降低重复搭建成本。

## 当前技术栈

| 分类 | 当前实现 |
| --- | --- |
| 构建 | Vite |
| 框架 | Vue 3 |
| 语言 | TypeScript |
| 路由 | Vue Router |
| 状态 | Pinia |
| UI | Element Plus |
| 国际化 | vue-i18n |
| 请求 | Axios |
| Mock | vite-plugin-mock |
| 代码生成 | Plop |
| 质量工具 | ESLint、Oxlint、Stylelint、Prettier、vue-tsc |

## 启动流程

入口位于 `src/main.ts`，当前启动顺序如下：

1. `createApp(App)` 创建 Vue 应用。
2. `setupVab(app)` 安装框架插件、全局组件、全局样式。
3. `setupI18n(app)` 安装国际化。
4. `setupStore(app)` 安装 Pinia。
5. `setupRouter(app)` 安装路由和权限守卫。
6. `app.mount('#app')` 挂载应用。

`src/App.vue` 只渲染 `<vab-app />`，实际布局由 `library/components/VabApp`、`library/layouts` 和路由状态驱动。

## 总体架构图

```mermaid
flowchart TB
  browser["浏览器 / 用户访问"] --> html["index.html"]
  html --> main["src/main.ts"]

  main --> app["src/App.vue"]
  main --> setupVab["library/index.ts<br/>setupVab(app)"]
  main --> i18n["src/i18n<br/>setupI18n(app)"]
  main --> store["src/store<br/>setupStore(app)"]
  main --> router["src/router<br/>setupRouter(app)"]

  subgraph framework["框架内核层 library"]
    setupVab --> vabPlugins["library/plugins<br/>全局消息 / 指令 / 错误日志 / 事件总线"]
    setupVab --> vabComponents["library/components<br/>布局壳 / 菜单 / Tabs / Theme / 通用组件"]
    setupVab --> layouts["library/layouts<br/>Vertical / Horizontal / Column / Comprehensive / Double / Fall"]
    setupVab --> styles["library/styles<br/>全局样式 / 主题变量 / 暗黑模式"]
  end

  subgraph appLayer["应用组织层 src"]
    app --> appShell["VabApp / VabRouterView"]
    router --> routeModules["src/router/modules<br/>业务路由与菜单元数据"]
    router --> permissions["src/router/permissions.ts<br/>登录拦截 / 权限守卫 / 进度条 / 标题"]
    store --> storeModules["src/store/modules<br/>user / acl / routes / settings / tabs"]
    appShell --> views["src/views<br/>页面与示例业务模块"]
    views --> api["src/api<br/>业务 API 封装"]
    api --> request["src/utils/request.ts<br/>Axios 网关"]
    request --> userStore["user store<br/>token / 用户信息 / resetAll"]
    permissions --> routeStore["routes store<br/>动态路由 / 菜单 / 面包屑"]
    permissions --> userStore
  end

  subgraph configLayer["配置与类型层"]
    config["src/config<br/>setting / net / theme / cli"]
    types["types<br/>路由 / 权限 / Store / 主题类型"]
    utils["src/utils<br/>token / routes / permission / validate / security"]
  end

  config --> router
  config --> request
  config --> storeModules
  types -.类型约束.-> router
  types -.类型约束.-> storeModules
  utils --> permissions
  utils --> request

  subgraph backendLayer["后端或本地模拟层"]
    backend["后端 API<br/>VITE_APP_BASE_URL"]
    mock["mock/controller<br/>vite-plugin-mock"]
  end

  request --> backend
  request --> mock

  subgraph buildLayer["工程构建层"]
    vite["vite.config.ts"]
    build["library/build<br/>Vite 插件 / Mock / SVG Sprite / PWA / 压缩 / 可视化"]
    plop["plop-template<br/>CRUD 代码生成"]
    quality["ESLint / Oxlint / Stylelint / Prettier / vue-tsc"]
  end

  vite --> build
  build --> main
  plop -.生成.-> views
  plop -.生成.-> api
  quality -.约束.-> appLayer
```

## 启动与访问链路图

```mermaid
flowchart LR
  create["createApp(App)"] --> setupVabNode["setupVab<br/>全局插件 / 样式 / SVG / VabIcon / 右键菜单"]
  setupVabNode --> setupI18nNode["setupI18n<br/>语言包与国际化"]
  setupI18nNode --> setupStoreNode["setupStore<br/>安装 Pinia"]
  setupStoreNode --> setupRouterNode["setupRouter<br/>创建 Router / 添加路由 / 注册守卫"]
  setupRouterNode --> mount["app.mount('#app')"]
  mount --> vabApp["VabApp<br/>框架应用壳"]
  vabApp --> layout["library/layouts<br/>按 settings 和 route meta 选择布局"]
  layout --> routerView["VabRouterView"]
  routerView --> page["src/views 页面组件"]
  page --> apiCall["src/api 业务接口"]
  apiCall --> axiosGateway["src/utils/request.ts"]
  axiosGateway --> response["统一响应处理<br/>成功 code / 401 / 402 / 403 / 错误日志"]
```

## 认证与动态路由图

```mermaid
flowchart TB
  visit["访问页面"] --> guard["router.beforeEach<br/>src/router/permissions.ts"]
  guard --> tokenCheck{"是否有 token<br/>或关闭 loginInterception"}

  tokenCheck -- "否" --> whiteList{"是否在 routesWhiteList"}
  whiteList -- "是" --> visitMode{"supportVisit 是否开启"}
  visitMode -- "是" --> visitRoutes["routesStore.setRoutes('visit')"]
  visitMode -- "否" --> allowPublic["直接放行白名单页面"]
  whiteList -- "否" --> loginRoute["跳转 /login<br/>toLoginRoute"]

  tokenCheck -- "是" --> hasRoutes{"routesStore.routes 是否已生成"}
  hasRoutes -- "是" --> allow["next()"]
  hasRoutes -- "否" --> getInfo["userStore.getUserInfo()<br/>GET /userInfo"]
  getInfo --> acl["aclStore<br/>roles / permissions"]
  acl --> setRoutes["routesStore.setRoutes(authentication)"]
  setRoutes --> authMode{"authentication"}
  authMode -- "intelligence" --> frontendRoutes["使用 src/router/modules asyncRoutes"]
  authMode -- "all" --> backendRoutes["GET /router/list<br/>convertRouter(list)"]
  frontendRoutes --> filter["filterRoutes<br/>rolesControl 权限过滤"]
  backendRoutes --> filter
  filter --> reset["resetRouter(accessRoutes)"]
  reset --> retry["next({...to, replace: true})"]

  getInfo -- "异常" --> resetAll["userStore.resetAll()<br/>清 token / 清权限 / 清 tabs"]
  resetAll --> loginRoute
```

## 分层职责

| 层级 | 当前目录 | 职责 |
| --- | --- | --- |
| 应用入口 | `src/main.ts`、`src/App.vue` | 应用创建、插件安装、根组件挂载 |
| 业务层 | `src/views`、`src/api`、`src/router/modules` | 页面、业务接口、业务路由 |
| 状态层 | `src/store/modules` | 用户、权限、路由、标签页、主题等状态 |
| 框架层 | `library/components`、`library/layouts`、`library/plugins` | 布局、通用组件、全局插件、错误日志、指令 |
| 构建层 | `vite.config.ts`、`library/build` | Vite 插件、Mock、PWA、压缩、SVG Sprite |
| 类型层 | `types` | 路由、权限、主题、Store 等全局类型 |
| Mock 层 | `mock/controller` | 本地接口模拟 |

## 推荐框架化目录

当前模板可运行，但业务示例和框架内核混合较多。大规模应用建议逐步演进为：

```txt
src/
  app/                     # 应用启动、Provider、全局注册
  framework/               # 框架核心能力
    auth/
    request/
    router/
    store/
    layout/
    theme/
    i18n/
  modules/                 # 业务模块
  components/              # 项目级公共组件
  examples/                # 示例页，生产业务可移除
```

短期内可以不大规模搬迁文件，但新增业务模块应优先按 `docs/module-standard.md` 的规范组织，避免继续扩大 `src/views` 的扁平复杂度。

## 插件体系

`library/index.ts` 负责安装框架插件：

- `@vueuse/head`
- SVG Sprite 注册。
- `VabIcon`。
- 右键菜单组件。
- `library/plugins/*.ts` 下的插件。

当前插件包括全局消息、通知、弹窗、loading、事件总线、自定义指令、错误日志等。后续建议将插件改为显式配置，避免业务系统默认加载不需要的能力。

## 关键约束

- 框架层不能直接依赖具体业务模块。
- 业务模块可以依赖框架层组件、请求封装、权限工具和布局能力。
- 新增跨模块能力时，应优先放到 `library` 或未来的 `framework` 层。
- 示例能力必须可移除，不应成为启动必需依赖。
- 企业级项目应关闭生产 Mock，并补充 CI 中的 typecheck、lint、test、build。
