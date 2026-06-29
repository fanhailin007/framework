# 代码生成使用说明

## 目标

代码生成用于减少重复 CRUD 页面、API、Mock 和编辑弹窗的手写成本。当前模板使用 Plop，已有一个 `curd` 生成器。

## 当前实现位置

| 文件 | 职责 |
| --- | --- |
| `plopfile.mjs` | 注册生成器 |
| `plop-template/curd/prompt.mjs` | 生成器交互和动作 |
| `plop-template/curd/index.hbs` | 列表页模板 |
| `plop-template/curd/edit.hbs` | 编辑弹窗模板 |
| `plop-template/curd/api.hbs` | API 模板 |
| `plop-template/curd/mock.hbs` | Mock 模板 |

## 使用命令

```bash
pnpm run template
```

然后选择或输入生成器要求的参数。当前 `curd` 生成器会要求输入 view 名称，名称必须是单个英文单词，不能包含中文、空格或特殊字符。

## 当前生成内容

以输入 `product` 为例，当前生成器会创建：

```txt
src/views/goods/Product.vue
src/views/goods/vabAutoComponents/ProductEdit.vue
mock/controller/product.ts
src/api/product.ts
```

注意：当前模板中 `templateName` 固定为 `goods`，因此所有生成页面都会进入 `src/views/goods`。如果要面向大规模业务使用，应先改造成可选择模块目录。

## 当前模板能力

生成的列表页包含：

- 查询表单。
- 展开/收起查询条件。
- 新增按钮。
- 删除按钮。
- Element Plus 表格。
- 多选。
- 编辑操作。
- 删除确认。
- 分页。
- 编辑弹窗组件。
- `onActivated` 表格布局刷新。

生成的 API 包含：

- `getList`
- `doEdit`
- `doDelete`

生成的 Mock 应与 API 路径对应。

## 使用要求

生成后必须手动检查：

1. 页面路由是否已注册。
2. 页面 name 是否全局唯一。
3. API 路径是否符合后端接口规范。
4. 查询字段是否符合业务字段。
5. 表格列是否符合业务字段。
6. 编辑弹窗字段是否符合业务字段。
7. 操作按钮是否补充权限点。
8. Mock 返回结构是否与真实接口一致。

## 推荐扩展方向

为了支撑大规模系统开发，建议将 `curd` 生成器升级为“业务模块生成器”。

推荐交互参数：

| 参数 | 示例 | 说明 |
| --- | --- | --- |
| `domain` | `system` | 业务域 |
| `resource` | `user` | 资源名 |
| `title` | `用户管理` | 菜单标题 |
| `routePath` | `/system/user` | 路由路径 |
| `permissionPrefix` | `system:user` | 权限前缀 |
| `fields` | `username,status` | 初始字段 |
| `withMock` | `true` | 是否生成 Mock |
| `withStore` | `false` | 是否生成 Store |

推荐生成结构：

```txt
src/modules/system/user/
  api.ts
  routes.ts
  types.ts
  pages/index.vue
  components/UserEditDialog.vue
  mocks/user.mock.ts
```

## 模板质量要求

生成器模板应逐步满足：

- 使用 TypeScript 类型，减少 `any`。
- 默认生成权限点。
- 默认生成 route meta。
- 默认生成统一分页模型。
- 默认生成 loading、empty、error 状态。
- 默认生成 Mock。
- 可选生成测试文件。

## 常见问题

### 生成后页面无法访问

检查是否已在 `src/router/modules/index.ts` 汇总对应路由。

### 生成后接口返回异常

检查 API 路径、Mock 路径、`successCode`、`statusName`、`messageName` 是否一致。

### 生成页面都进入 goods 目录

当前 `plop-template/curd/prompt.mjs` 中 `templateName` 固定为 `goods`。需要改造成命令行参数或新增多个生成器。

### 生成代码类型过宽

当前模板存在 `any`。新生成器应引导开发者输入字段定义，并生成 `types.ts`。
