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
| 当前主要功能 | 用户管理 CRUD、用户登录、更改密码、登录会话与审计日志、文档管理 CRUD、PDF 上传与读取、文档发布归档、统一响应、基础异常处理、BCrypt 密码哈希、密码规则校验 |

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
| `UserController` | REST Controller | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/controller/UserController.java` | 用户相关 HTTP API 统一入口，当前提供用户 CRUD、登录、登出、access token 刷新和更改密码 |
| `DocumentController` | REST Controller | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/controller/DocumentController.java` | 文档相关 HTTP API 统一入口，当前提供文档 CRUD、PDF 上传读取、发布、归档和软删除 |

当前 `UserController` API：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/users` | 查询未软删除用户列表 |
| `GET` | `/api/users/{id}` | 查询单个用户 |
| `POST` | `/api/users` | 创建用户 |
| `POST` | `/api/users/login` | 用户登录，写入会话和登录审计日志 |
| `POST` | `/api/users/refresh-token` | 使用 refresh token 刷新 access token，当前不轮换 refresh token |
| `POST` | `/api/users/logout` | 用户登出，撤销当前会话 |
| `PUT` | `/api/users/{id}` | 更新用户 |
| `PUT` | `/api/users/{id}/password` | 更改用户密码 |
| `DELETE` | `/api/users/{id}` | 软删除用户 |

当前 `DocumentController` API：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/documents` | 查询未软删除文档列表，可按状态过滤 |
| `GET` | `/api/documents/{id}` | 查询单个文档 |
| `GET` | `/api/documents/{id}/pdf` | 读取 PDF 文件并返回给前端展示 |
| `POST` | `/api/documents` | 创建草稿文档 |
| `POST` | `/api/documents/upload` | 上传 PDF 并创建草稿文档 |
| `PUT` | `/api/documents/{id}` | 更新文档并递增版本号 |
| `POST` | `/api/documents/{id}/publish` | 发布文档，记录审核人和发布时间 |
| `POST` | `/api/documents/{id}/archive` | 归档文档 |
| `DELETE` | `/api/documents/{id}` | 软删除文档 |

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

### 6.4 认证模块组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `UserSession` | Entity | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/entity/UserSession.java` | 映射 `user_sessions` 表 |
| `UserLoginLog` | Entity | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/entity/UserLoginLog.java` | 映射 `user_login_logs` 表 |
| `UserSessionMapper` | MyBatis-Plus Mapper | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/mapper/UserSessionMapper.java` | 继承 `BaseMapper<UserSession>`，负责登录会话表 CRUD |
| `UserLoginLogMapper` | MyBatis-Plus Mapper | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/mapper/UserLoginLogMapper.java` | 继承 `BaseMapper<UserLoginLog>`，负责登录审计日志表 CRUD |
| `AuthService` | Service 接口 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/service/AuthService.java` | 定义用户登录、登出和 access token 刷新业务接口 |
| `AuthServiceImpl` | Service 实现 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/service/AuthServiceImpl.java` | 校验用户、密码、启停和锁定状态，写入会话、登录日志并返回 token；登出时撤销当前会话；刷新时更新 access token 且不轮换 refresh token |
| `AuthProperties` | 配置属性 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/service/AuthProperties.java` | 绑定 `security.auth` 登录锁定和 token 生命周期配置 |
| `AuthTokenGenerator` | Token 生成接口 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/service/AuthTokenGenerator.java` | 定义随机 token 生成能力 |
| `RandomAuthTokenGenerator` | Token 生成实现 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/service/RandomAuthTokenGenerator.java` | 使用 `SecureRandom` 生成 URL-safe 不透明 token |
| `LoginRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/dto/LoginRequest.java` | 登录请求参数 |
| `RefreshTokenRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/dto/RefreshTokenRequest.java` | 刷新 access token 请求参数 |
| `LoginResponse` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/auth/dto/LoginResponse.java` | 登录响应数据，包含 token、过期时间和用户信息 |

### 6.5 文档模块组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `Document` | Entity | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/entity/Document.java` | 映射 `documents` 表 |
| `DocumentMapper` | MyBatis-Plus Mapper | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/mapper/DocumentMapper.java` | 继承 `BaseMapper<Document>`，负责文档表 CRUD |
| `DocumentManagementService` | Service 接口 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/service/DocumentManagementService.java` | 定义文档管理业务接口 |
| `DocumentManagementServiceImpl` | Service 实现 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/service/DocumentManagementServiceImpl.java` | 实现文档列表、详情、创建、更新、发布、归档、软删除、slug 唯一性校验 |
| `DocumentCreateRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/dto/DocumentCreateRequest.java` | 创建文档请求参数 |
| `DocumentUpdateRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/dto/DocumentUpdateRequest.java` | 更新文档请求参数 |
| `DocumentPublishRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/dto/DocumentPublishRequest.java` | 发布文档请求参数 |
| `DocumentUploadRequest` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/dto/DocumentUploadRequest.java` | 上传 PDF 并创建文档的 multipart 表单参数 |
| `DocumentResponse` | DTO | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/dto/DocumentResponse.java` | 文档响应数据，排除软删除时间 |
| `DocumentFileStorage` | 文件存储接口 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/file/DocumentFileStorage.java` | 定义文档文件保存和清理能力 |
| `DocumentPdfFile` | PDF 文件读取结果 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/file/DocumentPdfFile.java` | 返回 PDF Resource、文件名和文件大小 |
| `LocalDocumentFileStorage` | 本地文件存储实现 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/file/LocalDocumentFileStorage.java` | 按 `storage.local.root` 保存和读取 PDF，校验扩展名、Content-Type、文件头、路径和大小 |
| `StoredDocumentFile` | 文件存储结果 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/document/file/StoredDocumentFile.java` | 返回落盘路径和文件大小 |

### 6.6 通用组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `ApiResponse` | 通用响应对象 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/api/ApiResponse.java` | 统一 API 响应结构 |
| `PasswordConfig` | Spring 配置 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/config/PasswordConfig.java` | 注册 `PasswordEncoder`，当前使用 `BCryptPasswordEncoder` |
| `CorsConfig` | Spring MVC 配置 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/config/CorsConfig.java` | 为 `/api/**` 注册统一 CORS 规则 |
| `CorsProperties` | 配置属性 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/config/CorsProperties.java` | 绑定 `app.cors` 跨域配置 |
| `BusinessException` | 业务异常 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/exception/BusinessException.java` | 带业务错误码的运行时异常 |
| `GlobalExceptionHandler` | 全局异常处理 | `/Users/hailinfan/work/workspace/framework/backend/src/main/java/com/linkedyou/backend/common/exception/GlobalExceptionHandler.java` | 统一处理业务异常、参数校验异常和未捕获异常 |

### 6.7 测试组件

| 组件 | 类型 | 路径 | 职责 |
| --- | --- | --- | --- |
| `BackendApplicationTests` | Spring Boot 上下文测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/BackendApplicationTests.java` | 验证应用上下文可以加载 |
| `UserManagementServiceTest` | Service 单元测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/user/service/UserManagementServiceTest.java` | 覆盖用户创建、更新、软删除核心行为 |
| `UserControllerTest` | Controller 单元测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/controller/UserControllerTest.java` | 覆盖用户 API、登录、登出和刷新 access token API 统一响应、校验和异常映射 |
| `AuthServiceTest` | Service 单元测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/auth/service/AuthServiceTest.java` | 覆盖登录成功、登录失败、禁用账号、锁定账号、会话和登录日志写入、登出撤销会话、刷新 access token |
| `DocumentManagementServiceTest` | Service 单元测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/document/service/DocumentManagementServiceTest.java` | 覆盖文档创建、上传、PDF 读取、更新、发布、归档、软删除和 slug 唯一性 |
| `DocumentControllerTest` | Controller 单元测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/controller/DocumentControllerTest.java` | 覆盖文档 API 统一响应、multipart 上传、PDF 二进制响应、校验和异常映射 |
| `LocalDocumentFileStorageTest` | 文件存储单元测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/document/file/LocalDocumentFileStorageTest.java` | 覆盖 PDF 保存、PDF 读取、路径越界拒绝、非 PDF 拒绝和文件大小限制 |
| `LayerLoggingAspectTest` | AOP 单元测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/common/logging/LayerLoggingAspectTest.java` | 覆盖 Controller 和 Service 入口、出口、异常日志 |
| `CorsConfigTest` | Web 配置测试 | `/Users/hailinfan/work/workspace/framework/backend/src/test/java/com/linkedyou/backend/common/config/CorsConfigTest.java` | 覆盖本地前端 Origin 的 CORS 预检请求响应头 |

## 7. 资源配置文件

| 文件 | 路径 | 说明 |
| --- | --- | --- |
| `application.yml` | `/Users/hailinfan/work/workspace/framework/backend/src/main/resources/application.yml` | 应用名、MySQL 数据源、本地存储、CORS、密码规则、MyBatis-Plus 全局配置 |
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

### 7.3 登录认证配置

| 配置 | 当前值 | 说明 |
| --- | --- | --- |
| `security.auth.access-token-ttl` | `30m` | access token 有效期 |
| `security.auth.refresh-token-ttl` | `30d` | refresh token 有效期，当前只在登录会话表记录 |
| `security.auth.max-failed-attempts` | `5` | 连续密码错误锁定阈值 |
| `security.auth.lock-duration` | `15m` | 达到失败阈值后的锁定时长 |

### 7.4 密码规则配置

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

### 7.5 CORS 配置

| 配置 | 当前值 | 说明 |
| --- | --- | --- |
| `app.cors.allowed-origins` | `http://localhost:5200`、`http://localhost:5173`、`http://localhost:3000`、`http://127.0.0.1:5200`、`http://127.0.0.1:5173`、`http://127.0.0.1:3000` | 允许访问 `/api/**` 的前端源 |
| `app.cors.allowed-methods` | `GET`、`POST`、`PUT`、`DELETE`、`OPTIONS` | 允许的 HTTP 方法 |
| `app.cors.allowed-headers` | `Content-Type`、`Authorization` | 允许的请求头 |
| `app.cors.exposed-headers` | `Content-Disposition` | 允许前端读取的响应头 |
| `app.cors.allow-credentials` | `true` | 是否允许携带凭证 |
| `app.cors.max-age` | `3600` | 预检请求缓存秒数 |

### 7.6 日志配置

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
| `0003_permissions.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0003_permissions.sql` | 权限表 |
| `0006_user_sessions.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0006_user_sessions.sql` | 登录会话和 Token 运行态表 |
| `0007_user_login_logs.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0007_user_login_logs.sql` | 登录审计日志表 |
| `0008_verification_codes.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0008_verification_codes.sql` | 验证码表 |
| `0009_documents.sql` | `/Users/hailinfan/work/workspace/framework/backend/db/0009_documents.sql` | 文档管理表 |

菜单由前端手动定义，后端初始化脚本不创建菜单表。

所有业务表均按 `BACKEND_AGENT.md` 数据库定义规范包含 `document_id`、`created_by_user_id`、`updated_by_user_id`、`created_at`、`updated_at`、`deleted_at` 通用字段，并随脚本一并加载多样化测试数据。`0001_users.sql` 中所有种子测试用户的统一明文密码为 `Password123!`，`password` 字段保存该密码的 BCrypt 哈希。

## 8.1 Postman 测试集合

| 文件 | 路径 | 说明 |
| --- | --- | --- |
| `LinkedYou_Backend.postman_collection.json` | `/Users/hailinfan/work/workspace/framework/backend/postman/LinkedYou_Backend.postman_collection.json` | 当前已实现用户、登录和文档 API 的 Postman 测试集合，覆盖创建、登录、PDF 上传读取、列表、详情、更新、状态流转、删除和异常响应 |
| `LinkedYou_Local.postman_environment.json` | `/Users/hailinfan/work/workspace/framework/backend/postman/LinkedYou_Local.postman_environment.json` | 本地 Postman 环境，默认 `baseUrl=http://localhost:8080` |
| `sample.pdf` | `/Users/hailinfan/work/workspace/framework/backend/postman/sample.pdf` | Postman 文档上传测试使用的最小 PDF 样例 |

## 8.2 OpenAPI 3.0 文档

| 文件 | 路径 | 说明 |
| --- | --- | --- |
| `openapi.yaml` | `/Users/hailinfan/work/workspace/framework/backend/docs/openapi.yaml` | 当前已实现用户、登录和文档 API 的 OpenAPI 3.0.3 规范文件，可导入 Swagger Editor、Swagger UI 或 Postman |

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
./mvnw clean test
```

最近一次已知结果：

| 测试类 | 数量 | 结果 |
| --- | --- | --- |
| `BackendApplicationTests` | 1 | 通过 |
| `UserManagementServiceTest` | 10 | 通过 |
| `UserControllerTest` | 12 | 通过 |
| `AuthServiceTest` | 10 | 通过 |
| `DocumentManagementServiceTest` | 13 | 通过 |
| `DocumentControllerTest` | 10 | 通过 |
| `LocalDocumentFileStorageTest` | 6 | 通过 |
| `LayerLoggingAspectTest` | 3 | 通过 |
| `CorsConfigTest` | 2 | 通过 |
| 合计 | 67 | 通过 |

注意：该测试记录来自本次统一 CORS 配置完成后的 `./mvnw clean test` 运行结果。

## 11. 当前风险与建议

| 风险 | 说明 | 建议 |
| --- | --- | --- |
| Java 版本不一致 | 当前 JDK 是 21.0.9，但 `pom.xml` 配置 Java 25 | 统一到 Java 21，或安装 JDK 25 并切换 `JAVA_HOME` |
| 应用名重复配置 | `application.yml` 为 `linkedyou`，`application.properties` 为 `backend` | 保留一个配置来源 |
| YAML 配置疑似错误 | `allow-bean-definition-overriding=true:` 不是常见 YAML 写法 | 改为 `allow-bean-definition-overriding: true` |
| 数据库明文配置 | MySQL 用户名密码写在 `application.yml` | 改为环境变量或 profile 配置 |
| 用户列表未分页 | 当前 `GET /api/users` 返回全部未删除用户 | 后续增加分页 |
| 文档列表未分页 | 当前 `GET /api/documents` 返回全部未删除文档 | 后续增加分页 |
| 接口鉴权待补齐 | 登录、登出、access token 刷新和会话写入已实现。业务 API 的 token 校验待补齐 | 后续增加鉴权拦截器和 refresh token 轮换 |

## 12. 相关文档

| 文档 | 路径 | 说明 |
| --- | --- | --- |
| 后端架构说明 | `/Users/hailinfan/work/workspace/framework/backend/docs/architecture.md` | 当前后端整体架构 |
| 用户管理设计文档 | `/Users/hailinfan/work/workspace/framework/backend/docs/user-management-design.md` | 用户管理模块设计 |
| 用户登录设计文档 | `/Users/hailinfan/work/workspace/framework/backend/docs/login-management-design.md` | 用户登录、会话和登录审计模块设计 |
| 文档管理设计文档 | `/Users/hailinfan/work/workspace/framework/backend/docs/document-management-design.md` | 文档管理模块设计 |
| 本文档 | `/Users/hailinfan/work/workspace/framework/backend/docs/project-java-components.md` | Java 环境、组件、依赖、路径整理 |
