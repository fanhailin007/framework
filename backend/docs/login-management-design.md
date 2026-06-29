# 用户登录模块设计文档

本文档描述当前后端用户登录模块。登录 HTTP 入口放在 `UserController`，业务实现放在 `auth` 包。

## 1. 已实现范围

| 能力 | 状态 |
| --- | --- |
| `userId + password` 登录 | 已实现 |
| BCrypt 密码校验 | 已实现 |
| 启用状态校验 | 已实现 |
| 锁定状态校验 | 已实现 |
| 连续失败计数 | 已实现 |
| 达到失败阈值后锁定账号 | 已实现 |
| 登录成功写入 `user_sessions` | 已实现 |
| 登录成功、失败、禁用、锁定写入 `user_login_logs` | 已实现 |
| 返回 access token、refresh token 和用户信息 | 已实现，当前 token 为不透明随机 token |
| 登出 | 已实现，撤销 `user_sessions` 中的当前会话 |
| 刷新 Token | 已实现，使用 refresh token 刷新 access token；当前不轮换 refresh token |
| 接口鉴权拦截 | 未实现 |

## 2. API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/users/login` | 用户登录 |
| `POST` | `/api/users/refresh-token` | 刷新 access token |
| `POST` | `/api/users/logout` | 用户登出 |

请求示例：

```json
{
  "userId": "admin",
  "password": "Password123!",
  "deviceId": "postman-device",
  "deviceName": "Postman Runtime"
}
```

成功响应中的 `data` 包含：

| 字段 | 说明 |
| --- | --- |
| `accessToken` | 访问 token，当前为 URL-safe 随机字符串 |
| `refreshToken` | 刷新 token，数据库只保存 SHA-256 摘要 |
| `tokenType` | 当前固定为 `Bearer` |
| `issuedAt` | 签发时间 |
| `expiresAt` | access token 过期时间 |
| `refreshExpiresAt` | refresh token 过期时间 |
| `user` | 登录用户信息，不包含密码 |

## 3. 业务规则

登录流程：

1. 根据 `user_id` 查询未软删除用户。
2. 用户不存在时写入失败日志，返回 `LOGIN_FAILED`。
3. 用户禁用时写入禁用日志，返回 `ACCOUNT_DISABLED`。
4. 用户仍在锁定时间内时写入锁定日志，返回 `ACCOUNT_LOCKED`。
5. 密码错误时增加 `failed_login_count`，达到阈值后写入 `locked_until`，写入失败日志，返回 `LOGIN_FAILED`。
6. 密码正确时写入 `user_sessions`，重置失败状态，更新 `last_login_at` 和 `last_login_ip`，写入成功日志，并返回 token 和用户信息。

密码错误统一返回 `LOGIN_FAILED`，不区分用户不存在和密码错误，避免泄露账号枚举信息。

登出流程：

1. 从 `Authorization` 请求头解析 `Bearer` access token。
2. 按 `access_token_jti` 查询 `user_sessions` 中未撤销、未软删除的会话。
3. 会话不存在、缺少过期时间或已过期时返回 `TOKEN_INVALID`。
4. 会话有效时写入 `revoked_at`、`revoked_reason = logout` 和 `updated_at`。

刷新 access token 流程：

1. 接收请求体中的 `refreshToken`。
2. 对 refresh token 计算 SHA-256 Base64URL 摘要。
3. 按 `refresh_token_hash` 查询 `user_sessions` 中未撤销、未软删除的会话。
4. 会话不存在、缺少过期时间或 refresh token 已过期时返回 `TOKEN_INVALID`。
5. 查询未软删除用户；用户不存在返回 `USER_NOT_FOUND`，用户禁用返回 `ACCOUNT_DISABLED`。
6. 生成新的 access token，更新当前会话的 `access_token_jti`、`issued_at`、`updated_by_user_id` 和 `updated_at`。
7. 当前实现不轮换 refresh token，不修改 `refresh_token_hash` 和 `expires_at`，响应中返回原 refresh token。

## 4. 配置

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `security.auth.access-token-ttl` | `30m` | access token 有效期 |
| `security.auth.refresh-token-ttl` | `30d` | refresh token 有效期 |
| `security.auth.max-failed-attempts` | `5` | 连续密码错误锁定阈值 |
| `security.auth.lock-duration` | `15m` | 锁定时长 |

## 5. 数据库写入

| 表 | 写入时机 |
| --- | --- |
| `users` | 登录成功更新最后登录信息；密码错误更新失败次数和锁定时间 |
| `user_sessions` | 登录成功写入会话、设备、IP、User-Agent 和 token 信息 |
| `user_login_logs` | 登录成功、失败、禁用、锁定均写入 |

`user_sessions.refresh_token_hash` 保存 refresh token 的 SHA-256 Base64URL 摘要，不保存 refresh token 明文。

## 6. 测试

| 测试类 | 覆盖 |
| --- | --- |
| `AuthServiceTest` | 登录成功、用户不存在、密码错误锁定、禁用账号、锁定账号、登出成功、缺少 Bearer token、过期会话拒绝、刷新 access token、不轮换 refresh token、过期 refresh token 拒绝 |
| `UserControllerTest` | `/api/users/login` 成功响应和请求校验，`/api/users/refresh-token` 成功响应和请求校验，`/api/users/logout` 成功响应 |

## 7. 后续扩展

| 待扩展项 | 说明 |
| --- | --- |
| refresh token 轮换 | 如需更高安全性，后续可在刷新 access token 时同时生成新 refresh token 并覆盖 `refresh_token_hash` |
| 接口鉴权 | 增加拦截器或过滤器，校验 Bearer token |
| 权限校验 | 基于 Bearer token 和后续权限策略判断接口访问能力 |
