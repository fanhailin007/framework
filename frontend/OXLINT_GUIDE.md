# Oxlint 使用指南

## 什么是 Oxlint？

Oxlint 是由 Oxidation (Ox) 公司开发的超快速 JavaScript/TypeScript linter，它比 ESLint 快很多倍，并且提供了现代化的代码质量检查。

## 主要特性

- ⚡ **极速检查**: 比 ESLint 快 50-100 倍
- 🛡️ **零配置**: 开箱即用，无需复杂配置
- 🔍 **智能检测**: 自动检测代码中的潜在问题
- 🎯 **现代化**: 专为现代 JavaScript/TypeScript 项目设计
- 🔧 **可扩展**: 支持自定义规则和配置

## 项目中的使用

### 可用的脚本命令

```bash
# 检查代码（不修复）
pnpm run lint:oxlint

# 检查并自动修复代码
pnpm run lint:oxlint:fix
```

### Git Hooks 集成

项目已配置 lint-staged，在每次提交时自动运行 oxlint：

```json
{
    "lint-staged": {
        "*.{js,ts,vue}": ["oxlint --fix", "npm run lint:prettier", "git add"]
    }
}
```

## 配置文件

项目使用 `oxlint.toml` 配置文件，包含以下规则类别：

### TypeScript 规则

- `no-unused-vars`: 禁止未使用的变量
- `no-console`: 警告 console 语句
- `no-debugger`: 禁止 debugger 语句
- `no-alert`: 禁止 alert 语句
- `no-eval`: 禁止 eval 函数

### JavaScript 规则

- 与 TypeScript 规则相同，适用于 .js 文件

### 代码质量规则

- `no-var`: 禁止使用 var
- `prefer-const`: 优先使用 const
- `no-duplicate-imports`: 禁止重复导入
- `no-unreachable`: 禁止不可达代码
- `no-constant-condition`: 禁止常量条件

### 安全规则

- `no-unsafe-finally`: 禁止不安全的 finally 块
- `no-unsafe-negation`: 禁止不安全的否定操作
- `no-unsafe-optional-chaining`: 禁止不安全的可选链操作

### 性能规则

- `no-array-constructor`: 警告数组构造函数
- `no-new-object`: 警告 new Object()
- `no-useless-return`: 禁止无用的 return 语句

## 与现有工具的关系

项目同时使用多个代码质量工具：

1. **Oxlint**: 快速语法和代码质量检查
2. **ESLint**: 详细的代码风格和最佳实践检查
3. **Prettier**: 代码格式化
4. **Stylelint**: CSS/SCSS 样式检查

### 推荐的工作流程

```bash
# 开发时快速检查
pnpm run lint:oxlint

# 提交前完整检查
pnpm run lint:eslint
pnpm run lint:oxlint
pnpm run lint:prettier
pnpm run lint:stylelint
```

## 性能对比

| 工具   | 检查时间 | 内存使用 | 配置复杂度 |
| ------ | -------- | -------- | ---------- |
| ESLint | ~10-30s  | 高       | 复杂       |
| Oxlint | ~0.1-1s  | 低       | 简单       |

## 常见问题

### Q: 为什么同时使用 ESLint 和 Oxlint？

A: ESLint 提供更详细的代码风格检查，而 Oxlint 提供快速的语法和逻辑检查。两者互补，提供更全面的代码质量保证。

### Q: 如何禁用特定规则？

A: 在 `oxlint.toml` 文件中将规则设置为 `"off"`：

```toml
[typescript]
no-console = "off"
```

### Q: 如何添加自定义规则？

A: Oxlint 目前不支持自定义规则，但提供了丰富的内置规则集。

## 更多信息

- [Oxlint 官方文档](https://oxc-project.github.io/docs/guide/lint/)
- [Oxlint GitHub 仓库](https://github.com/oxc-project/oxc)
- [Oxlint 规则列表](https://oxc-project.github.io/docs/guide/lint/rules/)
