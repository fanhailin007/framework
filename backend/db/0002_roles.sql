-- 角色表
-- 用途：定义后端权限角色，不包含菜单授权。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `roles`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `role_code` VARCHAR(64) NOT NULL COMMENT '角色编码，如Admin、Editor',
  `role_name` VARCHAR(100) NOT NULL COMMENT '角色名称',
  `description` VARCHAR(255) NULL COMMENT '角色描述',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序号',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用：1启用 0停用',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_roles_document` (`document_id`),
  KEY `idx_roles_created_by` (`created_by_user_id`),
  KEY `idx_roles_updated_by` (`updated_by_user_id`),
  UNIQUE KEY `uk_roles_code` (`role_code`),
  KEY `idx_roles_active_deleted` (`is_active`, `deleted_at`),
  KEY `idx_roles_sort_order` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';

ALTER TABLE `roles` AUTO_INCREMENT = 1;

INSERT INTO `roles` (
  `id`, `document_id`, `role_code`, `role_name`, `description`, `sort_order`, `is_active`,
  `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, NULL, 'Admin', '管理员', '拥有用户、角色、权限和文档管理能力', 1, 1, 1, 1, '2026-06-01 09:10:00', '2026-06-01 09:10:00', NULL),
  (2, NULL, 'Editor', '编辑', '拥有文档创建和编辑能力', 2, 1, 1, 1, '2026-06-01 09:10:00', '2026-06-01 09:10:00', NULL),
  (3, NULL, 'Viewer', '查看者', '拥有基础只读能力', 3, 1, 1, 1, '2026-06-01 09:10:00', '2026-06-01 09:10:00', NULL),
  (4, NULL, 'DisabledRole', '停用角色', '用于测试停用角色过滤', 99, 0, 1, 1, '2026-06-01 09:10:00', '2026-06-01 09:10:00', NULL);
