-- 验证码表
-- 用途：注册、重置密码、登录和绑定场景的验证码运行态数据。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `verification_codes`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `verification_codes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `target_type` ENUM('phone', 'email') NOT NULL COMMENT '验证码接收目标类型',
  `target` VARCHAR(191) NOT NULL COMMENT '手机号或邮箱',
  `scene` ENUM('register', 'reset_password', 'login', 'bind') NOT NULL COMMENT '业务场景',
  `code_hash` VARCHAR(255) NOT NULL COMMENT '验证码哈希',
  `expires_at` DATETIME NOT NULL COMMENT '过期时间',
  `used_at` DATETIME NULL COMMENT '使用时间',
  `request_ip` VARCHAR(45) NULL COMMENT '请求IP，兼容IPv4/IPv6',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_verification_codes_document` (`document_id`),
  KEY `idx_verification_codes_created_by` (`created_by_user_id`),
  KEY `idx_verification_codes_updated_by` (`updated_by_user_id`),
  KEY `idx_verification_codes_target_scene` (`target_type`, `target`, `scene`, `expires_at`),
  KEY `idx_verification_codes_expires` (`expires_at`),
  KEY `idx_verification_codes_deleted` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='验证码表';

ALTER TABLE `verification_codes` AUTO_INCREMENT = 1;

INSERT INTO `verification_codes` (
  `id`, `document_id`, `target_type`, `target`, `scene`, `code_hash`, `expires_at`,
  `used_at`, `request_ip`, `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, NULL, 'email', 'new_user@example.com', 'register', 'register-code-hash-001', '2026-07-01 10:00:00', NULL, '127.0.0.1', NULL, NULL, '2026-06-27 09:50:00', '2026-06-27 09:50:00', NULL),
  (2, NULL, 'email', 'admin@example.com', 'reset_password', 'reset-code-hash-001', '2026-06-27 11:00:00', '2026-06-27 10:10:00', '127.0.0.1', 1, 1, '2026-06-27 09:55:00', '2026-06-27 10:10:00', NULL),
  (3, NULL, 'phone', '13900000002', 'login', 'login-code-hash-001', '2026-07-01 10:05:00', NULL, '127.0.0.1', 2, 2, '2026-06-27 10:00:00', '2026-06-27 10:00:00', NULL),
  (4, NULL, 'phone', '13900000999', 'bind', 'bind-code-hash-001', '2026-07-01 10:10:00', NULL, '127.0.0.1', NULL, NULL, '2026-06-27 10:05:00', '2026-06-28 10:05:00', '2026-06-28 10:05:00');
