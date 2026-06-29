# 组件开发规范

## 目标

组件规范用于统一公共组件、业务组件和示例组件的边界，避免所有组件混在一起导致复用困难。大规模项目中，组件必须有清晰职责、稳定 API、可测试、可替换。

## 当前组件分布

| 目录 | 当前职责 |
| --- | --- |
| `library/components` | 框架级通用组件，例如布局、菜单、标签页、分页、查询表单 |
| `library/layouts` | 框架布局 |
| `src/plugins` | 业务或增强插件，例如图表、二维码、播放器、PDF |
| `src/views/**/vabAutoComponents` | 页面配套组件或演示组件 |
| `src/views/**/components` | 局部业务组件 |

## 组件分层

建议按三类维护：

| 类型 | 放置位置 | 说明 |
| --- | --- | --- |
| 框架组件 | `library/components` | 多项目通用，不能依赖具体业务 |
| 业务组件 | `src/modules/<module>/components` 或 `src/views/<module>/components` | 只服务某个业务域 |
| 示例组件 | `examples` 或 `src/views/**/vabAutoComponents` | 用于展示能力，不作为业务依赖 |

## 框架组件要求

框架组件必须满足：

- 不依赖具体业务 API。
- props、emits、slots 清晰。
- 样式遵循主题变量。
- 支持 i18n 或不内置业务文案。
- 不直接读写业务 Store。
- 可在不同页面复用。

示例：

```vue
<vab-pagination
  :current-page="query.pageNo"
  :page-size="query.pageSize"
  :total="total"
  @current-change="handleCurrentChange"
  @size-change="handleSizeChange"
/>
```

## 业务组件要求

业务组件可以依赖业务类型、业务 API 和业务权限，但应保持职责单一。

示例：

```txt
src/modules/system/user/components/
  UserEditDialog.vue       # 用户新增编辑
  UserStatusTag.vue        # 用户状态展示
  UserRoleSelector.vue     # 用户角色选择
```

要求：

- 组件名使用 PascalCase。
- 复杂表单组件通过 `defineExpose` 暴露必要方法时，方法名必须稳定。
- 组件事件使用动词或业务事件名，例如 `saved`、`deleted`、`refresh`。
- 业务组件不要直接修改父组件的查询条件，应通过事件通知。

## Props 规范

Props 必须定义类型和默认值：

```ts
interface Props {
  modelValue: boolean
  userId?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  userId: '',
  readonly: false,
})
```

不要使用宽泛的 `any` 作为组件公开 API。确实无法避免时，应在注释中说明数据来源。

## Emits 规范

Emits 必须声明事件和参数：

```ts
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
  refresh: []
}>()
```

常用事件：

| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | 双向绑定 |
| `saved` | 保存成功 |
| `refresh` | 请求父级刷新 |
| `closed` | 弹窗关闭 |

## Slots 规范

框架组件应优先通过 slot 扩展内容：

```vue
<template #actions>
  <el-button type="primary">新增</el-button>
</template>
```

Slot 文档应说明：

- slot 名称。
- slot props。
- 默认渲染内容。

## 样式规范

- 组件样式默认使用 `scoped`。
- 框架组件优先使用 CSS 变量。
- 不在业务组件中硬编码全局主题色。
- 不在组件内部覆盖大范围 Element Plus 全局样式。
- 页面级布局样式放页面，组件只维护自己的视觉边界。

## 国际化

框架组件不应写死业务文案。必须写文案时：

- 使用 `vue-i18n`。
- 或通过 props/slots 传入。

业务组件可写业务文案，但多语言系统中必须同步更新 `src/i18n/zh.json` 和 `src/i18n/en.json`。

## 可访问性和交互

核心组件应考虑：

- 键盘可操作。
- loading 状态。
- disabled 状态。
- empty 状态。
- 错误状态。
- 文案不溢出。
- 小屏幕布局不重叠。

## 文档要求

每个框架组件应至少记录：

- 用途。
- Props。
- Emits。
- Slots。
- 使用示例。
- 依赖项。

当前项目尚未接入 Storybook 或 Histoire，后续建议将 `library/components` 中的核心组件纳入组件工作台。
