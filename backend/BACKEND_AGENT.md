# LinkedYou 后端开发规约 Agent

本文档是本仓库后端代码生成与修改的强约束规约。以后所有后端相关生成、重构、修复和测试补充，都必须优先遵守本文档；若用户在当前对话中给出更具体的要求，以用户要求为准，但不能破坏本文档规定的安全、分层和边界原则。

## 1. 项目范围

- 项目名称：`LinkedYouBackEnd`
- 基础包名：`com.linkedyou.backend`
- 技术栈：Spring Boot 3.5.6、Spring Web MVC、MyBatis-Plus 3.5.7、MySQL、Log4j2、JUnit 5、Spring Boot Test。
- 构建方式：优先使用 Maven Wrapper，即 `./mvnw`。
- 后端职责：提供 REST API、业务规则、数据库访问、统一响应、异常处理、认证授权、文档管理等后端能力。
- 前端职责：菜单定义、前端路由、菜单展示隐藏。后端不生成菜单 Controller、菜单 Service、菜单 Mapper 或动态菜单接口。

## 2. 生成前检查

每次生成或修改后端代码前，必须先检查当前代码与文档中已有约定：

- 查看相关包结构，复用已有命名、分层和工具类。
- 查看 `docs/architecture.md`、`docs/project-java-components.md`、相关设计文档和 `db/*.sql`。
- 确认 `pom.xml` 中 Java 编译版本与本机 JDK 是否一致。当前文档曾记录 Java 版本存在不一致风险，涉及编译配置时必须优先处理或明确说明。
- 不得凭空引入新框架、新鉴权方案、新响应结构或新目录风格。
- 不得覆盖用户已有改动；修改前应理解现有文件内容。

## 3. 包结构规范

后端代码统一放在 `src/main/java/com/linkedyou/backend` 下。

推荐结构：

```text
com.linkedyou.backend
├── BackendApplication.java
├── controller/
├── common/
│   ├── api/
│   ├── config/
│   ├── exception/
│   └── security/
├── user/
│   ├── dto/
│   ├── entity/
│   ├── mapper/
│   └── service/
├── auth/
├── role/c zxvbdz
├── permission/
└── document/
```

分层规则：

- `controller`：只承接 HTTP 请求、参数校验触发、调用 Service、封装响应。
- `service`：承载业务规则、事务边界、跨表校验、状态流转。
- `mapper`：只负责 MyBatis-Plus 数据访问，不写业务规则。
- `entity`：只表达数据库表结构映射，不直接作为 API 响应暴露敏感字段。
- `dto`：表达请求与响应模型，禁止用 Entity 直接接收外部请求。
- `common`：只放跨模块复用能力，如统一响应、异常、配置、安全工具。

## 4. API 生成规范

- Controller 统一放在 `com.linkedyou.backend.controller`。
- API 路径统一以 `/api` 开头。
- 用户相关 API 优先集中在 `UserController`，包括用户管理、注册、登录、登出、刷新 Token、修改密码等。
- Controller 方法必须返回统一响应结构 `ApiResponse`。
- 入参 DTO 必须使用 Jakarta Validation 注解表达必填、长度、格式等校验。
- Controller 不得直接调用 Mapper，不得拼 SQL，不得写密码哈希、权限判断等业务逻辑。
- 新增列表查询时，默认考虑分页；若不分页，必须有明确理由。
- 删除用户、文档等业务数据时，优先软删除，除非数据库设计和用户要求明确需要物理删除。

## 5. Service 规范

- Service 接口定义业务能力，Service 实现类放在对应模块的 `service` 包下。
- 实现类命名使用 `XxxServiceImpl`。
- 涉及多步写操作、状态变更、跨表写入时必须加事务。
- 业务校验必须集中在 Service，包含唯一性、存在性、状态合法性、权限边界等。
- 业务失败使用 `BusinessException`，不要直接向 Controller 抛出数据库异常或框架异常。
##- 密码必须通过 `PasswordEncoder` 处理，当前默认使用 BCrypt。
- 响应 DTO 的组装应避免泄露数据库内部字段，例如 `password`、Token 哈希、软删除时间等。

## 6. Entity / Mapper / DTO 规范

Entity：

- 使用 MyBatis-Plus 注解映射表名、主键和特殊字段。
- 字段命名按 Java 驼峰，数据库字段按现有 SQL 命名映射。
- 不在 Entity 中放复杂业务方法。
- 不把密码、Token、验证码等敏感字段输出到响应 DTO。

Mapper：

- Mapper 接口继承 `BaseMapper<Entity>`。
- 简单 CRUD 优先使用 MyBatis-Plus Wrapper。
- 自定义 SQL 必须有明确必要性，并与 `db/*.sql` 的表结构一致。

DTO：

- 请求 DTO 和响应 DTO 必须分离。
- 创建、更新请求分开建模；更新请求允许只传需要修改的字段。
- 响应 DTO 只包含前端需要的安全字段。
- DTO 字段校验必须贴近业务，不只依赖数据库约束兜底。

## 7. 统一响应、异常和校验

- 所有成功和失败响应优先复用 `common.api.ApiResponse`。
- 业务异常优先使用 `common.exception.BusinessException`。
- 全局异常处理统一放在 `common.exception.GlobalExceptionHandler`。
- 参数校验错误必须由全局异常处理统一返回。
- 不在 Controller 中到处写重复的 `try/catch`。
- 不向前端返回堆栈、SQL、数据库连接信息、服务器路径等内部细节。

## 8. 安全规范

- 密码永远不能明文存储、明文日志输出或明文返回。
- Token、验证码、会话标识等敏感值不得直接写入日志。
- 数据库账号密码、文件存储路径等配置后续应优先改为环境变量或 profile 配置；新增配置不得继续扩大明文敏感信息范围。
- 登录、验证码、刷新 Token、权限判断等认证能力落地前，必须先确认 `db/create_auth_tables.sql` 和角色权限表结构。
- 菜单授权不属于后端职责；后端只处理用户、角色、权限等业务权限数据。

## 9. 数据库与 SQL 规范

- 新增 Entity、Mapper 或业务字段前，必须先核对 `db/*.sql`。
- 表结构变更必须同步更新对应 SQL 脚本和文档。
- 软删除字段优先使用已有 `deleted_at` 语义。
- 账号启停字段优先使用已有 `is_active` 语义。
- 时间字段使用清晰语义，如 `created_at`、`updated_at`、`deleted_at`、`last_login_at`。
- 唯一性约束要同时在数据库和 Service 层做校验。
- 不生成与当前数据库设计无关的表、字段或枚举。
- 创建数据表的时候id字段从0开始自增
- 生成数据表设计文件时每个表单独使用一个sql文件
- 在生成数据表时同时为该表创建用于测试的数据，使用一条insert 创建多条数据
- 创建的测试数据需要具有多样性。
- 所有表都必须有软删除字段
- 所有表都都必须有一个文档id字段
- 所有的表都必须有创建者和更新者ID字段

## 10. 日志规范

- 使用项目现有 Log4j2 配置。
- 在controller和service的入口和出口分别生成相对应的log
- 日志应记录关键业务事件和排障信息，但不得泄露密码、Token、验证码、数据库密码、用户隐私字段。
- 异常日志应保留服务端排障信息，前端响应只返回可控错误信息。
- 不使用 `System.out.println` 作为业务日志。

## 11. 测试规范

新增或修改业务代码时，必须按风险补充测试：

- Service 业务规则必须有单元测试。
- Controller 行为复杂或包含校验分支时，应补充 Web 层测试。
- Mapper 自定义 SQL 必须有集成或数据访问测试。
- 认证、权限、密码、软删除、状态流转等关键路径必须覆盖正常和异常分支。
- 修改完成后优先运行 `./mvnw test`。如果因 Java 版本、数据库连接或环境限制无法运行，必须明确说明原因。

## 12. 文档同步规范

以下变更必须同步更新文档：

- 新增模块、Controller、Service、Mapper、Entity。
- 修改 API 路径、请求字段、响应字段或错误语义。
- 修改数据库表结构、配置项、运行方式。
- 调整认证、权限、文件存储、日志或异常处理策略。

优先更新：

- `docs/architecture.md`
- `docs/project-java-components.md`
- 相关模块设计文档
- `db/*.sql`

## 13. 禁止事项

- 禁止生成菜单后端模块或动态菜单接口。
- 禁止 Controller 直接访问数据库。
- 禁止 Entity 直接作为外部请求模型。
- 禁止返回密码哈希、Token 哈希、验证码、软删除内部字段等敏感信息。
- 禁止无理由引入新框架、新依赖或新响应结构。
- 禁止绕过 `ApiResponse`、`BusinessException`、`GlobalExceptionHandler` 另建一套异常响应体系。
- 禁止使用硬编码方式新增更多敏感配置。
- 禁止为通过测试而删除、弱化或绕过业务规则。
- 禁止修改与当前任务无关的代码、配置或格式。

## 14. 默认完成标准

后端任务完成前至少确认：

- 代码符合现有包结构和分层职责。
- API 使用统一响应和校验。
- 业务规则位于 Service。
- 数据访问位于 Mapper。
- 敏感字段没有返回或打印。
- SQL、配置和文档已按需同步。
- 测试已补充或说明无需补充的理由。
- 已运行可行的验证命令，或明确说明未能运行的具体原因。

## 15. 代码的提交

