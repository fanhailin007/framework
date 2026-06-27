# 文档管理设计文档

本文档描述当前后端文档管理模块的设计。内容基于已经落地的代码和 `documents` 表结构，不包含全文检索或复杂审批流。

## 1. 目标

文档管理模块用于维护文档元数据、正文、附件路径和发布状态，提供基础增删改查、发布、归档和软删除能力。

当前已实现范围：

| 能力 | 状态 |
| --- | --- |
| 查询文档列表 | 已实现，可按 `status` 过滤 |
| 查询文档详情 | 已实现 |
| 创建文档 | 已实现，默认草稿 |
| 更新文档 | 已实现，版本号递增 |
| 发布文档 | 已实现，记录审核人和发布时间 |
| 归档文档 | 已实现 |
| 删除文档 | 已实现，采用软删除 |
| 文件上传 | 已实现，目前只允许 PDF |
| 文件读取预览 | 已实现，返回 `application/pdf` 二进制内容 |

## 2. 包结构

```text
com.linkedyou.backend
├── controller/
│   └── DocumentController.java
└── document/
    ├── dto/
    │   ├── DocumentCreateRequest.java
    │   ├── DocumentUpdateRequest.java
    │   ├── DocumentPublishRequest.java
    │   ├── DocumentUploadRequest.java
    │   └── DocumentResponse.java
    ├── entity/
    │   └── Document.java
    ├── file/
    │   ├── DocumentFileStorage.java
    │   ├── DocumentPdfFile.java
    │   ├── LocalDocumentFileStorage.java
    │   └── StoredDocumentFile.java
    ├── mapper/
    │   └── DocumentMapper.java
    └── service/
        ├── DocumentManagementService.java
        └── DocumentManagementServiceImpl.java
```

## 3. API 设计

基础路径：

```text
/api/documents
```

| 方法 | 路径 | Controller 方法 | 说明 |
| --- | --- | --- | --- |
| `GET` | `/api/documents` | `list(String status)` | 查询未软删除文档列表，可按状态过滤 |
| `GET` | `/api/documents/{id}` | `getById(Long id)` | 查询文档详情 |
| `GET` | `/api/documents/{id}/pdf` | `openPdf(Long id)` | 读取 PDF 文件，供前端 inline 展示 |
| `POST` | `/api/documents` | `create(DocumentCreateRequest request)` | 创建草稿文档 |
| `POST` | `/api/documents/upload` | `upload(DocumentUploadRequest request)` | 上传 PDF 并创建草稿文档 |
| `PUT` | `/api/documents/{id}` | `update(Long id, DocumentUpdateRequest request)` | 更新文档 |
| `POST` | `/api/documents/{id}/publish` | `publish(Long id, DocumentPublishRequest request)` | 发布文档 |
| `POST` | `/api/documents/{id}/archive` | `archive(Long id)` | 归档文档 |
| `DELETE` | `/api/documents/{id}` | `delete(Long id)` | 软删除文档 |

统一响应结构：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {}
}
```

失败响应示例：

```json
{
  "success": false,
  "code": "DOCUMENT_NOT_FOUND",
  "message": "document not found",
  "data": null
}
```

## 4. 数据模型

文档数据来源于 `documents` 表。

| 字段 | 说明 | 当前用途 |
| --- | --- | --- |
| `id` | 主键 | 文档唯一标识 |
| `document_id` | 文档ID | 可选业务文档 ID |
| `title` | 文档标题 | 创建、查询、更新 |
| `slug` | 文档唯一标识 | 创建、查询、更新、唯一性校验 |
| `summary` | 摘要 | 创建、查询、更新 |
| `content` | 正文 | 创建、查询、更新 |
| `status` | 状态 | `draft`、`published`、`archived` |
| `owner_user_id` | 所属用户ID | 创建、查询、更新 |
| `category` | 分类 | 创建、查询、更新 |
| `tags` | 标签 JSON | 创建、查询、更新 |
| `file_path` | 附件路径 | 创建、查询、更新 |
| `file_size` | 附件大小 | 创建、查询、更新、上传 |
| `version` | 版本号 | 创建时为 1，更新时递增 |
| `published_at` | 发布时间 | 发布时写入 |
| `reviewed_by` | 审核人ID | 发布时写入 |
| `created_by_user_id` | 创建者用户ID | 审计追踪 |
| `updated_by_user_id` | 更新者用户ID | 审计追踪 |
| `created_at` | 创建时间 | 创建时写入 |
| `updated_at` | 更新时间 | 创建、更新、发布、归档、删除时写入 |
| `deleted_at` | 软删除时间 | 删除时写入，查询时过滤 |

## 5. 业务规则

| 规则 | 实现 |
| --- | --- |
| 查询只返回未软删除文档 | 查询条件包含 `deleted_at is null` |
| 文档不存在时抛业务异常 | 抛出 `BusinessException("DOCUMENT_NOT_FOUND", "document not found")` |
| slug 唯一性校验 | 创建和修改 slug 时检查未软删除文档中是否重复 |
| 创建文档默认草稿 | `status` 写入 `draft` |
| 更新文档递增版本 | `version` 每次更新递增 1 |
| 发布文档 | `status` 写入 `published`，记录 `reviewed_by` 和 `published_at` |
| 归档文档 | `status` 写入 `archived` |
| 删除采用软删除 | 写入 `deleted_at`，不物理删除 |
| 标签存储 | API 使用字符串数组，数据库 `tags` 字段保存 JSON 字符串 |
| PDF 上传 | 只允许 `.pdf`、`application/pdf` 且文件头为 `%PDF-` 的文件 |
| 文件落盘 | 文件保存到 `storage.local.root` 下按年月分组的目录 |
| 文件读取 | 只读取 `storage.local.root` 下的 PDF，避免路径穿越 |
| 前端展示 | 读取接口返回 `Content-Type: application/pdf` 和 `Content-Disposition: inline` |
| 文件大小限制 | 使用 `storage.local.max-file-size` 配置 |
| DB 写入失败清理 | 上传后数据库写入失败时删除已保存文件 |

## 6. 测试覆盖

| 测试类 | 覆盖内容 |
| --- | --- |
| `DocumentManagementServiceTest` | 创建、slug 重复、列表、更新、发布、归档、软删除、软删除后不可查询 |
| `DocumentControllerTest` | 统一响应、multipart 上传、PDF 读取响应、参数校验、业务异常映射、Service 调用 |
| `LocalDocumentFileStorageTest` | PDF 文件保存、PDF 读取、路径越界拒绝、非 PDF 拒绝、文件过大拒绝 |

## 7. 当前限制

| 限制 | 说明 |
| --- | --- |
| 未分页 | `GET /api/documents` 当前返回全部未软删除文档 |
| 上传格式单一 | 当前上传接口只允许 PDF |
| 未鉴权 | 当前未判断调用者是否有文档操作权限 |
