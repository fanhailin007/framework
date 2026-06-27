# 当前项目 Java 组件资料

本文档整理当前后端项目的 Java 运行环境、构建工具、项目源码组件、配置文件、数据库脚本和 Maven 依赖信息。整理时间：2026-06-26。

## 1. 项目基本信息

| 项目项 | 当前值 |
| --- | --- |
| 项目目录 | `/Users/hailinfan/work/workspace/framework/backend` |
| Maven 坐标 | `com.linkedyou:LinkedYouBackEnd:1.0-SNAPSHOT` |
| 项目名称 | `LinkedYouBackEnd` |
| 项目描述 | `LinkdYou System Backend` |
| 打包类型 | `jar` |
| 主类 | `com.linkedyou.backend.BackendApplication` |
| 主类路径 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/BackendApplication.java` |
| 当前主要功能 | 用户管理 CRUD、更改密码、统一响应、基础异常处理、BCrypt 密码哈希、密码规则校验 |

## 2. Java 安装与版本信息

### 2.1 当前运行 Java

| 项目 | 当前值 |
| --- | --- |
| Java 版本 | `openjdk version "21.0.9" 2025-10-21 LTS` |
| 发行版 | `Temurin-21.0.9+10` |
| Vendor | `Eclipse Adoptium` |
| Java Runtime 路径 | `/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home` |
| `java` 可执行文件 | `/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home/bin/java` |
| `javac` 版本 | `javac 21.0.9` |
| `javac` 可执行文件 | `/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home/bin/javac` |
| `JAVA_HOME` | `/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home` |

### 2.2 本机已安装 JDK

| 版本 | 架构 | 发行方 | 安装路径 |
| --- | --- | --- | --- |
| `21.0.9` | `arm64` | Eclipse Adoptium | `/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home` |
| `20.0.1` | `arm64` | Oracle Corporation | `/Users/hailinfan/Library/Java/JavaVirtualMachines/openjdk-20.0.1/Contents/Home` |
| `18.0.1.1` | `arm64` | Oracle Corporation | `/Users/hailinfan/Library/Java/JavaVirtualMachines/openjdk-18.0.1.1/Contents/Home` |
| `18.0.1.1` | `arm64` | Oracle Corporation | `/Library/Java/JavaVirtualMachines/jdk-18.0.1.1.jdk/Contents/Home` |
| `17.0.2` | `arm64` | Oracle Corporation | `/Users/hailinfan/Library/Java/JavaVirtualMachines/openjdk-17.0.2/Contents/Home` |

### 2.3 项目 Java 编译配置

| 配置项 | 当前值 | 来源 |
| --- | --- | --- |
| `maven.compiler.source` | `25` | `pom.xml` |
| `maven.compiler.target` | `25` | `pom.xml` |
| 当前运行 JDK | `21.0.9` | `java -version` |

注意：当前 `pom.xml` 配置为 Java 25，但当前运行 JDK 是 21.0.9。这是版本不一致风险。如果后续触发完整重新编译，JDK 21 可能无法编译目标为 25 的源码。建议将 `maven.compiler.source` / `target` 调整为当前可用 JDK 版本，例如 `21`，或安装并切换到 JDK 25。

## 3. Maven 安装与版本信息

| 项目 | 当前值 |
| --- | --- |
| Maven 使用方式 | Maven Wrapper |
| Wrapper 脚本 | `/Users/hailinfan/work/workspace/framework/backend/mvnw` |
| Windows Wrapper 脚本 | `/Users/hailinfan/work/workspace/framework/backend/mvnw.cmd` |
| Wrapper 配置 | `/Users/hailinfan/work/workspace/framework/backend/.mvn/wrapper/maven-wrapper.properties` |
| Wrapper 版本 | `3.3.4` |
| Maven 发行版 | `Apache Maven 3.9.16` |
| Maven home | `/Users/hailinfan/.m2/wrapper/dists/apache-maven-3.9.16/56ba1f9f` |
| Maven 下载地址 | `https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.16/apache-maven-3.9.16-bin.zip` |
| 本地 Maven 仓库 | `/Users/hailinfan/.m2/repository` |
| 当前 Maven 使用 Java | `21.0.9` |
| OS | `mac os x 26.5.1 aarch64` |

## 4. Spring Boot 与核心框架版本

| 组件 | 版本 | 作用 | 本机依赖路径 |
| --- | --- | --- | --- |
| Spring Boot Parent | `3.5.6` | 依赖版本管理 | `/Users/hailinfan/.m2/repository/org/springframework/boot/spring-boot-starter-parent/3.5.6` |
| Spring Boot | `3.5.6` | 应用启动与框架基础 | `/Users/hailinfan/.m2/repository/org/springframework/boot/spring-boot/3.5.6/spring-boot-3.5.6.jar` |
| Spring Boot Autoconfigure | `3.5.6` | 自动配置 | `/Users/hailinfan/.m2/repository/org/springframework/boot/spring-boot-autoconfigure/3.5.6/spring-boot-autoconfigure-3.5.6.jar` |
| Spring Framework | `6.2.11` | Web、Context、Core、JDBC、AOP 等基础能力 | `/Users/hailinfan/.m2/repository/org/springframework` |
| Embedded Tomcat | `10.1.46` | Spring Web 默认嵌入式容器 | `/Users/hailinfan/.m2/repository/org/apache/tomcat/embed` |
| MyBatis-Plus | `3.5.7` | ORM / Mapper 层 | `/Users/hailinfan/.m2/repository/com/baomidou` |
| MyBatis | `3.5.16` | SQL 映射基础 | `/Users/hailinfan/.m2/repository/org/mybatis/mybatis/3.5.16/mybatis-3.5.16.jar` |
| MyBatis Spring | `3.0.3` | MyBatis 与 Spring 集成 | `/Users/hailinfan/.m2/repository/org/mybatis/mybatis-spring/3.0.3/mybatis-spring-3.0.3.jar` |
| MySQL Connector/J | `8.4.0` | MySQL JDBC 驱动 | `/Users/hailinfan/.m2/repository/com/mysql/mysql-connector-j/8.4.0/mysql-connector-j-8.4.0.jar` |
| HikariCP | `6.3.3` | JDBC 连接池 | `/Users/hailinfan/.m2/repository/com/zaxxer/HikariCP/6.3.3/HikariCP-6.3.3.jar` |
| Log4j2 | `2.24.3` | 日志实现 | `/Users/hailinfan/.m2/repository/org/apache/logging/log4j` |
| SLF4J API | `2.0.17` | 日志门面 | `/Users/hailinfan/.m2/repository/org/slf4j/slf4j-api/2.0.17/slf4j-api-2.0.17.jar` |
| Lombok | `1.18.40` | Getter/Setter 等代码生成 | `/Users/hailinfan/.m2/repository/org/projectlombok/lombok/1.18.40/lombok-1.18.40.jar` |
| Spring Security Crypto | `6.5.5` | BCrypt 密码哈希 | `/Users/hailinfan/.m2/repository/org/springframework/security/spring-security-crypto/6.5.5/spring-security-crypto-6.5.5.jar` |
| Passay | `1.6.6` | 密码规则校验 | `/Users/hailinfan/.m2/repository/org/passay/passay/1.6.6/passay-1.6.6.jar` |
| Hibernate Validator | `8.0.3.Final` | Bean Validation 实现 | `/Users/hailinfan/.m2/repository/org/hibernate/validator/hibernate-validator/8.0.3.Final/hibernate-validator-8.0.3.Final.jar` |
| Jakarta Validation API | `3.0.2` | 参数校验 API | `/Users/hailinfan/.m2/repository/jakarta/validation/jakarta.validation-api/3.0.2/jakarta.validation-api-3.0.2.jar` |
| Jakarta Annotation API | `2.1.1` | Jakarta 注解 API | `/Users/hailinfan/.m2/repository/jakarta/annotation/jakarta.annotation-api/2.1.1/jakarta.annotation-api-2.1.1.jar` |

## 5. `pom.xml` 直接依赖

| 依赖 | 版本 | Scope | 用途 |
| --- | --- | --- | --- |
| `org.springframework.boot:spring-boot-starter-validation` | Spring Boot 管理，当前解析为 `3.5.6` | `compile` | 参数校验 |
| `org.springframework.boot:spring-boot-starter-web` | Spring Boot 管理，当前解析为 `3.5.6` | `compile` | Web MVC、REST API、内嵌 Tomcat |
| `org.springframework.boot:spring-boot-starter-log4j2` | Spring Boot 管理，当前解析为 `3.5.6` | `compile` | Log4j2 日志 |
| `org.springframework.boot:spring-boot-starter-aop` | Spring Boot 管理，当前解析为 `3.5.6` | `compile` | Spring AOP |
| `org.springframework.boot:spring-boot-starter` | Spring Boot 管理，当前解析为 `3.5.6` | `compile` | Spring Boot 基础启动能力，排除了默认 logging |
| `org.projectlombok:lombok` | `1.18.40` | `provided` | 编译期代码生成 |
| `com.baomidou:mybatis-plus-spring-boot3-starter` | `3.5.7` | `compile` | MyBatis-Plus Spring Boot 3 集成 |
| `com.mysql:mysql-connector-j` | `8.4.0` | `runtime` | MySQL JDBC 驱动 |
| `org.springframework.security:spring-security-crypto` | Spring Boot 管理，当前解析为 `6.5.5` | `compile` | BCrypt 密码哈希 |
| `org.passay:passay` | `1.6.6` | `compile` | 密码规则校验 |
| `org.junit.jupiter:junit-jupiter` | `5.10.2` 直接声明；部分子模块由 Boot 解析为 `5.12.2` | `test` | JUnit 5 测试 |
| `org.springframework.boot:spring-boot-starter-test` | Spring Boot 管理，当前解析为 `3.5.6` | `test` | Spring Boot 测试工具、Mockito、AssertJ 等 |
| `jakarta.annotation:jakarta.annotation-api` | `2.1.1` | `compile` | Jakarta 注解 |

## 6. Java 源码组件清单

### 6.1 应用启动组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `BackendApplication` | Spring Boot 启动类 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/BackendApplication.java` | 启动后端应用 |

### 6.2 Controller 组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `UserController` | REST Controller | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/controller/UserController.java` | 用户相关 HTTP API 统一入口，当前提供用户 CRUD 和更改密码 |

当前 `UserController` API：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/users` | 查询未软删除用户列表 |
| `GET` | `/api/users/{id}` | 查询单个用户 |
| `POST` | `/api/users` | 创建用户 |
| `PUT` | `/api/users/{id}` | 更新用户 |
| `PUT` | `/api/users/{id}/password` | 更改用户密码 |
| `DELETE` | `/api/users/{id}` | 软删除用户 |

### 6.3 用户模块组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `User` | Entity | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/entity/User.java` | 映射 `users` 表 |
| `UserMapper` | MyBatis-Plus Mapper | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/mapper/UserMapper.java` | 继承 `BaseMapper<User>`，负责用户表 CRUD |
| `UserManagementService` | Service 接口 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/service/UserManagementService.java` | 定义用户管理业务接口 |
| `UserManagementServiceImpl` | Service 实现 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/service/UserManagementServiceImpl.java` | 实现用户列表、详情、创建、更新、更改密码、软删除、用户ID唯一性校验、BCrypt 密码哈希 |
| `PasswordPolicyProperties` | 配置属性 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/service/password/PasswordPolicyProperties.java` | 绑定 `security.password-policy` 密码规则配置 |
| `PasswordPolicyValidator` | 密码规则校验 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/service/password/PasswordPolicyValidator.java` | 使用 Passay 按配置校验新密码 |
| `UserCreateRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/dto/UserCreateRequest.java` | 创建用户请求参数 |
| `UserUpdateRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/dto/UserUpdateRequest.java` | 更新用户请求参数 |
| `UserChangePasswordRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/dto/UserChangePasswordRequest.java` | 更改密码请求参数 |
| `UserResponse` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/user/dto/UserResponse.java` | 用户响应数据，排除 `password` |

### 6.4 通用组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `ApiResponse` | 通用响应对象 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/api/ApiResponse.java` | 统一 API 响应结构 |
| `PasswordConfig` | Spring 配置 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/config/PasswordConfig.java` | 注册 `PasswordEncoder`，当前使用 `BCryptPasswordEncoder` |
| `BusinessException` | 业务异常 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/exception/BusinessException.java` | 带业务错误码的运行时异常 |
| `GlobalExceptionHandler` | 全局异常处理 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/exception/GlobalExceptionHandler.java` | 统一处理业务异常、参数校验异常和未捕获异常 |

### 6.5 测试组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `BackendApplicationTests` | Spring Boot 上下文测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/BackendApplicationTests.java` | 验证应用上下文可以加载 |
| `UserManagementServiceTest` | Service 单元测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/user/service/UserManagementServiceTest.java` | 覆盖用户创建、更新、软删除核心行为 |

## 7. 资源配置文件

| 文件 | 路径 | 说明 |
| --- | --- | --- |
| `application.yml` | `/Users/hailinfan/work/workspace/framework/backend/src/main/resources/application.yml` | 应用名、MySQL 数据源、本地存储、密码规则、MyBatis-Plus 全局配置 |
| `application.properties` | `/Users/hailinfan/work/workspace/framework/backend/src/main/resources/application.properties` | 也配置了 `spring.application.name=backend`，与 `application.yml` 存在重复 |
| `log4j2.xml` | `/Users/hailinfan/work/workspace/framework/backend/src/main/resources/log4j2.xml` | Console 和 RollingFile 日志输出配置 |

### 7.1 数据源配置

| 配置 | 当前值 |
| --- | --- |
| 数据库类型 | MySQL |
| JDBC URL | `jdbc:mysql://10.211.55.20:3306/LinkedyouDev?...` |
| 数据库主机 | `10.211.55.20` |
| 数据库端口 | `3306` |
| 数据库名 | `LinkedyouDev` |
| 用户名 | `root` |
| 密码 | `password` |
| Driver | `com.mysql.cj.jdbc.Driver` |
| 时区 | `Asia/Tokyo` |
| 字符编码 | `utf8` |

### 7.2 本地存储配置

| 配置 | 当前值 |
| --- | --- |
| `storage.local.root` | `/Users/hailinfan/data/docs` |
| `storage.local.max-file-size` | `50MB` |

### 7.3 密码规则配置

| 配置 | 当前值 | 说明 |
| --- | --- | --- |
| `security.password-policy.enabled` | `true` | 是否启用密码规则校验 |
| `security.password-policy.min-length` | `8` | 最小长度 |
| `security.password-policy.max-length` | `100` | 最大长度 |
| `security.password-policy.require-uppercase` | `true` | 是否要求大写字母 |
| `security.password-policy.require-lowercase` | `true` | 是否要求小写字母 |
| `security.password-policy.require-digit` | `true` | 是否要求数字 |
| `security.password-policy.require-special` | `true` | 是否要求特殊字符 |
| `security.password-policy.reject-whitespace` | `true` | 是否拒绝空白字符 |

### 7.4 日志配置

| 配置 | 当前值 |
| --- | --- |
| 日志实现 | Log4j2 |
| 控制台输出 | 启用 |
| 文件输出 | `logs/app.log` |
| 日志滚动路径 | `logs/app-%d{yyyy-MM-dd}-%i.log.gz` |
| 时间滚动 | 每 1 天 |
| 大小滚动 | `10MB` |
| Root 日志级别 | `info` |

## 8. 数据库脚本

| 脚本 | 路径 | 说明 |
| --- | --- | --- |
| `0000_init_all.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0000_init_all.sql` | 数据库统一初始化入口，按外键顺序重建表并加载测试数据 |
| `0001_users.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0001_users.sql` | 用户表，支撑用户管理、登录账号状态和安全字段 |
| `0002_roles.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0002_roles.sql` | 角色表 |
| `0003_permissions.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0003_permissions.sql` | 权限表 |
| `0004_user_roles.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0004_user_roles.sql` | 用户与角色关联表 |
| `0005_role_permissions.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0005_role_permissions.sql` | 角色与权限关联表 |
| `0006_user_sessions.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0006_user_sessions.sql` | 登录会话和 Token 运行态表 |
| `0007_user_login_logs.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0007_user_login_logs.sql` | 登录审计日志表 |
| `0008_verification_codes.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0008_verification_codes.sql` | 验证码表 |
| `0009_documents.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0009_documents.sql` | 文档管理表 |

菜单由前端手动定义，后端初始化脚本不创建 `menus` 或 `role_menus` 表。`0000_init_all.sql` 会清理历史残留菜单表，但不会重建。

所有 `0001` 至 `0009` 业务表均按 `BACKEND_AGENT.md` 数据库定义规范包含 `document_id`、`created_by_user_id`、`updated_by_user_id`、`created_at`、`updated_at`、`deleted_at` 通用字段，并随脚本一并加载多样化测试数据。`0001_users.sql` 中所有种子测试用户的统一明文密码为 `Password123!`，`password` 字段保存该密码的 BCrypt 哈希。

## 8.1 Postman 测试集合

| 文件 | 路径 | 说明 |
| --- | --- | --- |
| `LinkedYou_Backend.postman_collection.json` | `/Users/hailinfan/work/workspace/framework/backend/postman/LinkedYou_Backend.postman_collection.json` | 当前已实现用户 API 的 Postman 测试集合，覆盖创建、列表、详情、更新、更改密码、删除和异常响应 |
| `LinkedYou_Local.postman_environment.json` | `/Users/hailinfan/work/workspace/framework/backend/postman/LinkedYou_Local.postman_environment.json` | 本地 Postman 环境，默认 `baseUrl=http://localhost:8080` |

## 8.2 OpenAPI 3.0 文档

| 文件 | 路径 | 说明 |
| --- | --- | --- |
| `openapi.yaml` | `/Users/hailinfan/work/workspace/framework/backend/docs/openapi.yaml` | 当前已实现用户 API 的 OpenAPI 3.0.3 规范文件，可导入 Swagger Editor、Swagger UI 或 Postman |

## 9. 构建输出路径

| 输出 | 路径 | 说明 |
| --- | --- | --- |
| 编译 class 输出 | `/Users/hailinfan/work/workspace/framework/backend/target/classes` | 主代码编译输出 |
| 测试 class 输出 | `/Users/hailinfan/work/workspace/framework/backend/target/test-classes` | 测试代码编译输出 |
| 测试报告 | `/Users/hailinfan/work/workspace/framework/backend/target/surefire-reports` | Maven Surefire 测试报告 |
| 应用日志 | `/Users/hailinfan/work/workspace/framework/backend/logs/app.log` | 当前运行日志文件 |

## 10. 测试与验证状态

最近一次已知测试命令：

```bash
./mvnw test
```

最近一次已知结果：

| 测试类 | 数量 | 结果 |
| --- | --- | --- |
| `BackendApplicationTests` | 1 | 通过 |
| `UserManagementServiceTest` | 10 | 通过 |
| `UserControllerTest` | 7 | 通过 |
| `LayerLoggingAspectTest` | 3 | 通过 |
| 合计 | 21 | 通过 |

注意：该测试记录来自本次更改密码 API 和密码规则配置完成后的 `./mvnw test` 运行结果。

## 11. 当前风险与建议

| 风险 | 说明 | 建议 |
| --- | --- | --- |
| Java 版本不一致 | 当前 JDK 是 21.0.9，但 `pom.xml` 配置 Java 25 | 统一到 Java 21，或安装 JDK 25 并切换 `JAVA_HOME` |
| 应用名重复配置 | `application.yml` 为 `linkedyou`，`application.properties` 为 `backend` | 保留一个配置来源 |
| YAML 配置疑似错误 | `allow-bean-definition-overriding=true:` 不是常见 YAML 写法 | 改为 `allow-bean-definition-overriding: true` |
| 数据库明文配置 | MySQL 用户名密码写在 `application.yml` | 改为环境变量或 profile 配置 |
| 用户列表未分页 | 当前 `GET /api/users` 返回全部未删除用户 | 后续增加分页 |
| 认证尚未实现 | 已有用户管理和密码哈希，但未实现登录接口 | 后续仍在 `UserController` 下补登录、登出、刷新 Token |

## 12. 相关文档

| 文档 | 路径 | 说明 |
| --- | --- | --- |
| 后端架构说明 | `/Users/hailinfan/work/workspace/framework/backend/docs/architecture.md` | 当前后端整体架构 |
| 用户管理设计文档 | `/Users/hailinfan/work/workspace/framework/backend/docs/user-management-design.md` | 用户管理模块设计 |
| 本文档 | `/Users/hailinfan/work/workspace/framework/backend/docs/project-java-components.md` | Java 环境、组件、依赖、路径整理 |
