-- 用户-角色关联表
-- 用途：维护用户拥有的后端业务角色。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `user_roles`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `user_roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  KEY `idx_user_roles_document` (`document_id`),
  KEY `idx_user_roles_created_by` (`created_by_user_id`),
  KEY `idx_user_roles_updated_by` (`updated_by_user_id`),
  KEY `idx_user_roles_role` (`role_id`),
  KEY `idx_user_roles_deleted` (`deleted_at`),
  CONSTRAINT `fk_user_roles_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_roles_role`
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户-角色关联表';

ALTER TABLE `user_roles` AUTO_INCREMENT = 1;

INSERT INTO `user_roles` (
  `id`, `document_id`, `user_id`, `role_id`,
  `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, NULL, 1, 1, 1, 1, '2026-06-01 10:00:00', '2026-06-01 10:00:00', NULL),
  (2, NULL, 2, 2, 1, 1, '2026-06-01 10:00:00', '2026-06-01 10:00:00', NULL),
  (3, NULL, 3, 3, 1, 1, '2026-06-01 10:00:00', '2026-06-01 10:00:00', NULL),
  (4, NULL, 4, 3, 1, 1, '2026-06-01 10:00:00', '2026-06-20 10:00:00', '2026-06-20 10:00:00');
