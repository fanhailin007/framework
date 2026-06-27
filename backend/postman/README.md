# Postman API Tests

本目录包含当前后端已实现 API 的 Postman 测试集合。

## 文件

| 文件 | 说明 |
| --- | --- |
| `LinkedYou_Backend.postman_collection.json` | API 测试集合 |
| `LinkedYou_Local.postman_environment.json` | 本地环境变量，默认 `baseUrl=http://localhost:8080` |

## 运行方式

1. 在 Postman 中导入 collection 和 environment。
2. 选择 `LinkedYou Local` 环境。
3. 启动后端服务。
4. 按集合顺序运行 `Users` 文件夹。

集合会先创建一个唯一测试用户，并把返回的 `id` 保存为 `createdUserId`，后续详情、更新、更改密码、删除和删除后查询测试都会复用该变量。示例密码符合默认 `security.password-policy` 规则。
