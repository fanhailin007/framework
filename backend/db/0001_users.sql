-- 用户表
-- 用途：用户管理、注册登录账号、账号安全状态和软删除。
-- 测试用户统一明文密码：Password123!；password 字段存储 BCrypt 哈希，不存明文。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `user_id` VARCHAR(64) NOT NULL COMMENT '登录用户名',
  `display_name` VARCHAR(100) NULL COMMENT '显示名称/昵称',
  `email` VARCHAR(191) NULL COMMENT '邮箱',
  `phone` VARCHAR(32) NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT 'BCrypt密码哈希',
  `avatar` VARCHAR(255) NULL COMMENT '头像路径',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1启用 0停用',
  `failed_login_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '连续登录失败次数',
  `locked_until` DATETIME NULL COMMENT '锁定截止时间',
  `password_changed_at` DATETIME NULL COMMENT '密码最后修改时间',
  `last_login_at` DATETIME NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) NULL COMMENT '最后登录IP，兼容IPv4/IPv6',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_users_document` (`document_id`),
  KEY `idx_users_created_by` (`created_by_user_id`),
  KEY `idx_users_updated_by` (`updated_by_user_id`),
  UNIQUE KEY `uk_users_user_id` (`user_id`),
  UNIQUE KEY `uk_users_email` (`email`),
  UNIQUE KEY `uk_users_phone` (`phone`),
  KEY `idx_users_active_deleted` (`is_active`, `deleted_at`),
  KEY `idx_users_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';

ALTER TABLE `users` AUTO_INCREMENT = 1;

INSERT INTO `users` (
  `id`, `document_id`, `user_id`, `display_name`, `email`, `phone`, `password`, `avatar`,
  `is_active`, `failed_login_count`, `locked_until`, `password_changed_at`,
  `last_login_at`, `last_login_ip`, `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, NULL, 'admin', '系统管理员', 'admin@example.com', '13900000001', '$2a$10$jlaB2Q8Hmo35OMhWEebU7udnjDCTrUbzsnTc.AJGo9MlzZIqXy0um', '/avatars/admin.png', 1, 0, NULL, '2026-06-01 09:00:00', '2026-06-26 18:30:00', '127.0.0.1', 1, 1, '2026-06-01 09:00:00', '2026-06-26 18:30:00', NULL),
  (2, NULL, 'editor', '内容编辑', 'editor@example.com', '13900000002', '$2a$10$jlaB2Q8Hmo35OMhWEebU7udnjDCTrUbzsnTc.AJGo9MlzZIqXy0um', '/avatars/editor.png', 1, 1, NULL, '2026-06-02 09:00:00', '2026-06-25 16:20:00', '127.0.0.1', 1, 1, '2026-06-02 09:00:00', '2026-06-25 16:20:00', NULL),
  (3, NULL, 'viewer', '只读用户', 'viewer@example.com', '13900000003', '$2a$10$jlaB2Q8Hmo35OMhWEebU7udnjDCTrUbzsnTc.AJGo9MlzZIqXy0um', '/avatars/viewer.png', 1, 0, NULL, '2026-06-03 09:00:00', NULL, NULL, 1, 1, '2026-06-03 09:00:00', '2026-06-03 09:00:00', NULL),
  (4, NULL, 'disabled_user', '停用用户', 'disabled@example.com', '13900000004', '$2a$10$jlaB2Q8Hmo35OMhWEebU7udnjDCTrUbzsnTc.AJGo9MlzZIqXy0um', NULL, 0, 3, '2026-07-01 00:00:00', '2026-06-04 09:00:00', NULL, NULL, 1, 1, '2026-06-04 09:00:00', '2026-06-04 09:00:00', NULL),
  (5, NULL, 'deleted_user', '已删除用户', 'deleted@example.com', '13900000005', '$2a$10$jlaB2Q8Hmo35OMhWEebU7udnjDCTrUbzsnTc.AJGo9MlzZIqXy0um', NULL, 1, 0, NULL, '2026-06-05 09:00:00', NULL, NULL, 1, 1, '2026-06-05 09:00:00', '2026-06-06 09:00:00', '2026-06-06 09:00:00');
