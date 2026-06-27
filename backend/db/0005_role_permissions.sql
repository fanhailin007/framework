-- 角色-权限关联表
-- 用途：维护后端角色拥有的权限点。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `role_permissions`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `role_permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `permission_id` BIGINT UNSIGNED NOT NULL COMMENT '权限ID',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
  KEY `idx_role_permissions_document` (`document_id`),
  KEY `idx_role_permissions_created_by` (`created_by_user_id`),
  KEY `idx_role_permissions_updated_by` (`updated_by_user_id`),
  KEY `idx_role_permissions_permission` (`permission_id`),
  KEY `idx_role_permissions_deleted` (`deleted_at`),
  CONSTRAINT `fk_role_permissions_role`
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_role_permissions_permission`
    FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色-权限关联表';

ALTER TABLE `role_permissions` AUTO_INCREMENT = 1;

INSERT INTO `role_permissions` (
  `id`, `document_id`, `role_id`, `permission_id`,
  `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, NULL, 1, 1, 1, 1, '2026-06-01 10:10:00', '2026-06-01 10:10:00', NULL),
  (2, NULL, 1, 2, 1, 1, '2026-06-01 10:10:00', '2026-06-01 10:10:00', NULL),
  (3, NULL, 1, 3, 1, 1, '2026-06-01 10:10:00', '2026-06-01 10:10:00', NULL),
  (4, 1, 1, 4, 1, 1, '2026-06-01 10:10:00', '2026-06-01 10:10:00', NULL),
  (5, 1, 1, 5, 1, 1, '2026-06-01 10:10:00', '2026-06-01 10:10:00', NULL),
  (6, 2, 1, 6, 1, 1, '2026-06-01 10:10:00', '2026-06-01 10:10:00', NULL),
  (7, 1, 2, 4, 1, 1, '2026-06-01 10:10:00', '2026-06-01 10:10:00', NULL),
  (8, 1, 2, 5, 1, 1, '2026-06-01 10:10:00', '2026-06-01 10:10:00', NULL),
  (9, 1, 3, 4, 1, 1, '2026-06-01 10:10:00', '2026-06-20 10:10:00', '2026-06-20 10:10:00');
