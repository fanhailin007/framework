-- 用户登录日志表
-- 用途：记录登录成功、失败、锁定和禁用等审计事件。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `user_login_logs`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `user_login_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `user_id` BIGINT UNSIGNED NULL COMMENT '用户ID，登录失败且未匹配用户时为空',
  `username` VARCHAR(64) NOT NULL COMMENT '登录用户名快照',
  `login_result` ENUM('success', 'failed', 'locked', 'disabled') NOT NULL COMMENT '登录结果',
  `failure_reason` VARCHAR(255) NULL COMMENT '失败原因',
  `ip_address` VARCHAR(45) NULL COMMENT '登录IP，兼容IPv4/IPv6',
  `user_agent` VARCHAR(500) NULL COMMENT '客户端User-Agent',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_login_logs_document` (`document_id`),
  KEY `idx_user_login_logs_created_by` (`created_by_user_id`),
  KEY `idx_user_login_logs_updated_by` (`updated_by_user_id`),
  KEY `idx_user_login_logs_user` (`user_id`),
  KEY `idx_user_login_logs_username_time` (`username`, `created_at`),
  KEY `idx_user_login_logs_result_time` (`login_result`, `created_at`),
  KEY `idx_user_login_logs_deleted` (`deleted_at`),
  CONSTRAINT `fk_user_login_logs_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户登录日志表';

ALTER TABLE `user_login_logs` AUTO_INCREMENT = 1;

INSERT INTO `user_login_logs` (
  `id`, `document_id`, `user_id`, `username`, `login_result`, `failure_reason`,
  `ip_address`, `user_agent`, `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, NULL, 1, 'admin', 'success', NULL, '127.0.0.1', 'SeedBrowser/1.0', 1, 1, '2026-06-26 18:30:00', '2026-06-26 18:30:00', NULL),
  (2, NULL, 2, 'editor', 'success', NULL, '127.0.0.1', 'SeedBrowser/1.0', 2, 2, '2026-06-25 16:20:00', '2026-06-25 16:20:00', NULL),
  (3, NULL, NULL, 'missing_user', 'failed', 'user not found', '127.0.0.1', 'SeedBrowser/1.0', NULL, NULL, '2026-06-24 15:00:00', '2026-06-24 15:00:00', NULL),
  (4, NULL, 4, 'disabled_user', 'disabled', 'account disabled', '127.0.0.1', 'SeedBrowser/1.0', 4, 1, '2026-06-24 15:10:00', '2026-06-24 15:10:00', NULL),
  (5, NULL, 4, 'disabled_user', 'locked', 'too many failed attempts', '127.0.0.1', 'SeedBrowser/1.0', 4, 1, '2026-06-24 15:20:00', '2026-06-25 15:20:00', '2026-06-25 15:20:00');
