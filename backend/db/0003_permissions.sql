-- 权限表
-- 用途：定义后端接口、按钮或数据权限点。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `permissions`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `perm_code` VARCHAR(128) NOT NULL COMMENT '权限编码，如system:user:read',
  `perm_name` VARCHAR(150) NOT NULL COMMENT '权限名称',
  `description` VARCHAR(255) NULL COMMENT '权限描述',
  `resource_type` VARCHAR(32) NOT NULL DEFAULT 'api' COMMENT '权限资源类型：api/button/data',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1启用 0停用',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_permissions_document` (`document_id`),
  KEY `idx_permissions_created_by` (`created_by_user_id`),
  KEY `idx_permissions_updated_by` (`updated_by_user_id`),
  UNIQUE KEY `uk_permissions_code` (`perm_code`),
  KEY `idx_permissions_active_deleted` (`is_active`, `deleted_at`),
  KEY `idx_permissions_resource_type` (`resource_type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='权限表';

ALTER TABLE `permissions` AUTO_INCREMENT = 1;

INSERT INTO `permissions` (
  `id`, `document_id`, `perm_code`, `perm_name`, `description`, `resource_type`, `is_active`,
  `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, NULL, 'system:user:read', '查看用户', '查看用户列表和用户详情', 'api', 1, 1, 1, '2026-06-01 09:20:00', '2026-06-01 09:20:00', NULL),
  (2, NULL, 'system:user:write', '维护用户', '创建、更新、删除用户', 'api', 1, 1, 1, '2026-06-01 09:20:00', '2026-06-01 09:20:00', NULL),
  (4, 1, 'document:read', '查看文档', '查看文档列表和文档详情', 'api', 1, 1, 1, '2026-06-01 09:20:00', '2026-06-01 09:20:00', NULL),
  (5, 1, 'document:write', '维护文档', '创建和编辑文档', 'api', 1, 1, 1, '2026-06-01 09:20:00', '2026-06-01 09:20:00', NULL),
  (6, 2, 'document:publish', '发布文档', '发布或归档文档', 'button', 1, 1, 1, '2026-06-01 09:20:00', '2026-06-01 09:20:00', NULL);
