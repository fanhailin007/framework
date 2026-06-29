# 构建、环境变量、部署

## 目标

部署文档用于规范本地开发、测试构建、生产构建、环境变量、静态资源路径、Mock、PWA 和 CI 发布流程，保证不同环境行为一致且可追踪。

## 常用命令

当前命令位于 `package.json`：

| 命令 | 说明 |
| --- | --- |
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run dev:vue-tsc` | 类型检查后启动开发服务器 |
| `pnpm run vue-tsc` | 执行 Vue/TypeScript 类型检查 |
| `pnpm run build` | 生产构建 |
| `pnpm run build:fast` | 快速构建，当前与 build 接近 |
| `pnpm run build:report` | 使用开发构建配置生成报告 |
| `pnpm run build:website` | website 构建并写版本 |
| `pnpm run preview` | 预览构建产物 |
| `pnpm run lint:eslint` | ESLint 自动修复 |
| `pnpm run lint:oxlint` | Oxlint 检查 |
| `pnpm run lint:stylelint` | 样式检查并修复 |
| `pnpm run lint:prettier` | Prettier 格式化 |
| `pnpm run template` | 运行 Plop 代码生成 |

## 环境文件

当前环境文件：

```txt
.env
.env.development
.env.test
.env.production
```

`VITE_APP_BASE_URL` 配置接口地址：

```env
VITE_APP_BASE_URL=''
```

要求：

- 修改环境文件后必须重启开发服务器。
- 生产环境不应使用空接口地址，除非明确走同域反向代理。
- 不要把真实密钥提交到仓库。
- 本地私密配置应放在 `.env.local`。

## 构建配置

核心配置位于：

- `vite.config.ts`
- `src/config/cli.config.ts`
- `library/build`

关键配置：

| 配置 | 当前默认 | 说明 |
| --- | --- | --- |
| `base` | `''` | 静态资源基础路径 |
| `outDir` | `dist` | 构建产物目录 |
| `assetsDir` | `static` | 静态资源目录 |
| `port` | `5200` | 开发端口 |
| `isHashRouterMode` | `true` | 是否使用 Hash 路由 |
| `outputHash` | `true` | 产物文件名是否带 hash |
| `pwa` | `true` | 是否启用 PWA |
| `prodEnabled` | `true` | 生产 Mock 是否开启 |
| `compress` | `false` | gzip/brotli 压缩 |
| `report` | `false` | 打包分析 |

企业项目建议：

- 生产环境默认关闭 Mock，即 `prodEnabled: false`。
- CI 中保留构建 warning，不建议吞掉所有 warning。
- 配置 bundle budget，避免主包持续膨胀。
- 对图表、编辑器、PDF、工作流等重依赖保持路由级懒加载。

## 路由部署

当前默认：

```ts
isHashRouterMode: true
base: ''
```

Hash 模式对静态部署更友好，不需要服务端额外 rewrite。

如果改为 History 模式：

```ts
isHashRouterMode: false
base: '/'
```

服务端必须配置 fallback 到 `index.html`，否则刷新深层路由会 404。

Nginx 示例：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 静态资源部署

构建产物默认在：

```txt
dist/
  static/
  index.html
```

部署要求：

- `index.html` 不做长期缓存。
- `static` 下带 hash 的资源可长期缓存。
- 如果启用 PWA，发布后要验证 service worker 更新策略。
- 如果部署在二级目录，必须正确设置 `base`。

## CI 建议

当前 `.github/workflows/main.yml` 只调用远程 HTTPS API，不执行构建质量门禁。企业项目建议改为：

```yaml
name: Frontend CI

on:
  push:
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run vue-tsc
      - run: pnpm run lint:oxlint
      - run: pnpm run build
```

接入测试后继续增加：

```yaml
- run: pnpm run test:unit
- run: pnpm run test:e2e
```

## 发布前检查清单

- `pnpm install --frozen-lockfile` 成功。
- `pnpm run vue-tsc` 成功。
- `pnpm run lint:oxlint` 成功。
- `pnpm run build` 成功。
- 生产环境 `VITE_APP_BASE_URL` 正确。
- 生产 Mock 已关闭。
- 登录、退出、刷新页面、403、404 正常。
- 静态资源路径正确。
- PWA 更新策略已验证。

## 回滚策略

前端静态部署应保留最近多个版本产物。发布失败时：

1. 将流量切回上一版本静态目录。
2. 清理 CDN 或边缘缓存中的 `index.html`。
3. 保留失败版本用于排查。
4. 记录失败原因和修复方式。
