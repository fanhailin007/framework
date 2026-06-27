# Postman API Tests

本目录包含当前后端已实现 API 的 Postman 测试集合。

## 文件

| 文件 | 说明 |
| --- | --- |
| `LinkedYou_Backend.postman_collection.json` | API 测试集合 |
| `LinkedYou_Local.postman_environment.json` | 本地环境变量，默认 `baseUrl=http://localhost:8080` |
| `sample.pdf` | 文档上传接口测试使用的最小 PDF 样例 |

## 运行方式

1. 在 Postman 中导入 collection 和 environment。
2. 选择 `LinkedYou Local` 环境。
3. 启动后端服务。
4. 按集合顺序运行 `Users` 或 `Documents` 文件夹，也可以运行整个集合。

集合会先创建一个唯一测试用户，并把返回的 `id` 保存为 `createdUserId`，后续详情、更新、更改密码、删除和删除后查询测试都会复用该变量。示例密码符合默认 `security.password-policy` 规则。

`Documents` 文件夹会创建一个唯一 slug 的测试文档，并把返回的 `id` 保存为 `createdDocumentId`，后续列表、详情、更新、发布、归档、删除和删除后查询测试都会复用该变量。

`Upload Document PDF - success` 用例使用 `postman/sample.pdf` 上传 PDF，并把返回的 `id` 保存为 `uploadedDocumentId`。`Read Uploaded Document PDF - success` 会复用该变量读取 PDF 二进制内容，验证前端可用 inline 方式展示。
