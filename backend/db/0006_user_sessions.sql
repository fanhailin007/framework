-- 用户登录会话表
-- 用途：维护访问令牌、刷新令牌和退出状态。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `user_sessions`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `user_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `access_token_jti` VARCHAR(128) NULL COMMENT '访问令牌唯一ID，JWT jti',
  `refresh_token_hash` VARCHAR(255) NULL COMMENT '刷新令牌哈希',
  `device_id` VARCHAR(128) NULL COMMENT '设备ID',
  `device_name` VARCHAR(150) NULL COMMENT '设备名称',
  `ip_address` VARCHAR(45) NULL COMMENT '登录IP，兼容IPv4/IPv6',
  `user_agent` VARCHAR(500) NULL COMMENT '客户端User-Agent',
  `issued_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '签发时间',
  `expires_at` DATETIME NOT NULL COMMENT '过期时间',
  `revoked_at` DATETIME NULL COMMENT '撤销时间',
  `revoked_reason` VARCHAR(255) NULL COMMENT '撤销原因',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_sessions_access_jti` (`access_token_jti`),
  KEY `idx_user_sessions_document` (`document_id`),
  KEY `idx_user_sessions_created_by` (`created_by_user_id`),
  KEY `idx_user_sessions_updated_by` (`updated_by_user_id`),
  KEY `idx_user_sessions_user` (`user_id`),
  KEY `idx_user_sessions_refresh_hash` (`refresh_token_hash`),
  KEY `idx_user_sessions_expires_revoked` (`expires_at`, `revoked_at`),
  KEY `idx_user_sessions_deleted` (`deleted_at`),
  CONSTRAINT `fk_user_sessions_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户登录会话表';

ALTER TABLE `user_sessions` AUTO_INCREMENT = 1;

INSERT INTO `user_sessions` (
  `id`, `document_id`, `user_id`, `access_token_jti`, `refresh_token_hash`, `device_id`,
  `device_name`, `ip_address`, `user_agent`, `issued_at`, `expires_at`,
  `revoked_at`, `revoked_reason`, `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, NULL, 1, 'admin-access-jti-001', 'admin-refresh-hash-001', 'device-admin-mac', 'Admin MacBook', '127.0.0.1', 'SeedBrowser/1.0', '2026-06-26 18:30:00', '2026-07-26 18:30:00', NULL, NULL, 1, 1, '2026-06-26 18:30:00', '2026-06-26 18:30:00', NULL),
  (2, NULL, 2, 'editor-access-jti-001', 'editor-refresh-hash-001', 'device-editor-chrome', 'Editor Chrome', '127.0.0.1', 'SeedBrowser/1.0', '2026-06-25 16:20:00', '2026-07-25 16:20:00', NULL, NULL, 2, 2, '2026-06-25 16:20:00', '2026-06-25 16:20:00', NULL),
  (3, NULL, 4, 'disabled-access-jti-001', 'disabled-refresh-hash-001', 'device-disabled', 'Disabled Device', '127.0.0.1', 'SeedBrowser/1.0', '2026-06-10 10:00:00', '2026-06-11 10:00:00', '2026-06-10 11:00:00', 'disabled account test', 4, 1, '2026-06-10 10:00:00', '2026-06-10 11:00:00', '2026-06-12 10:00:00');
