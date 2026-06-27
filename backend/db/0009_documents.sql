-- 文档管理表
-- 用途：支持文档元数据、正文、附件路径、发布审核和软删除。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `documents`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `documents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `document_id` BIGINT UNSIGNED NULL COMMENT '文档ID',
  `title` VARCHAR(255) NOT NULL COMMENT '文档标题',
  `slug` VARCHAR(255) NOT NULL COMMENT '文档唯一标识',
  `summary` VARCHAR(512) NULL COMMENT '摘要',
  `content` LONGTEXT NULL COMMENT '文档内容，Markdown或HTML',
  `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft' COMMENT '状态：草稿/发布/归档',
  `owner_user_id` BIGINT UNSIGNED NULL COMMENT '创建人ID',
  `category` VARCHAR(100) NULL COMMENT '分类',
  `tags` JSON NULL COMMENT '标签数组',
  `file_path` VARCHAR(500) NULL COMMENT '附件路径',
  `file_size` BIGINT UNSIGNED NULL COMMENT '附件大小，单位字节',
  `version` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '版本号',
  `published_at` DATETIME NULL COMMENT '发布时间',
  `reviewed_by` BIGINT UNSIGNED NULL COMMENT '审核人ID',
  `created_by_user_id` BIGINT UNSIGNED NULL COMMENT '创建者用户ID',
  `updated_by_user_id` BIGINT UNSIGNED NULL COMMENT '更新者用户ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME NULL COMMENT '软删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_documents_slug` (`slug`),
  KEY `idx_documents_document` (`document_id`),
  KEY `idx_documents_created_by` (`created_by_user_id`),
  KEY `idx_documents_updated_by` (`updated_by_user_id`),
  KEY `idx_documents_owner` (`owner_user_id`),
  KEY `idx_documents_reviewer` (`reviewed_by`),
  KEY `idx_documents_status_deleted` (`status`, `deleted_at`),
  CONSTRAINT `fk_documents_owner_user`
    FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_documents_reviewer_user`
    FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文档管理表';

ALTER TABLE `documents` AUTO_INCREMENT = 1;

INSERT INTO `documents` (
  `id`, `document_id`, `title`, `slug`, `summary`, `content`, `status`, `owner_user_id`,
  `category`, `tags`, `file_path`, `file_size`, `version`, `published_at`,
  `reviewed_by`, `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
) VALUES
  (1, 1, '草稿测试文档', 'draft-test-document', '用于测试草稿状态的文档', '# 草稿测试文档\n\n这是一篇草稿。', 'draft', 2, 'guide', JSON_ARRAY('seed', 'draft'), NULL, NULL, 1, NULL, NULL, 2, 2, '2026-06-20 10:00:00', '2026-06-20 10:00:00', NULL),
  (2, 2, '已发布测试文档', 'published-test-document', '用于测试发布状态和审核人的文档', '# 已发布测试文档\n\n这是一篇已发布文档。', 'published', 2, 'guide', JSON_ARRAY('seed', 'published'), '/docs/published-test.pdf', 204800, 2, '2026-06-22 12:00:00', 1, 2, 1, '2026-06-21 10:00:00', '2026-06-22 12:00:00', NULL),
  (3, 3, '归档测试文档', 'archived-test-document', '用于测试归档状态的文档', '# 归档测试文档\n\n这是一篇归档文档。', 'archived', 1, 'archive', JSON_ARRAY('seed', 'archived'), NULL, NULL, 3, '2026-06-10 12:00:00', 1, 1, 1, '2026-06-09 10:00:00', '2026-06-23 12:00:00', NULL),
  (4, 4, '软删除测试文档', 'deleted-test-document', '用于测试软删除过滤的文档', '# 软删除测试文档\n\n这是一篇软删除文档。', 'draft', 3, 'trash', JSON_ARRAY('seed', 'deleted'), NULL, NULL, 1, NULL, NULL, 3, 1, '2026-06-11 10:00:00', '2026-06-12 10:00:00', '2026-06-12 10:00:00');
