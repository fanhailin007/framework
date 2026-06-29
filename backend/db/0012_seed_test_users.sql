-- 测试用户数据
-- 用途：为 users 表生成 110 条可重复执行的测试账号。
-- 测试用户统一明文密码：Password123!；password 字段存储 BCrypt 哈希。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

INSERT INTO `users` (
  `document_id`, `user_id`, `display_name`, `role`, `email`, `phone`, `password`, `avatar`,
  `is_active`, `failed_login_count`, `locked_until`, `password_changed_at`,
  `last_login_at`, `last_login_ip`, `created_by_user_id`, `updated_by_user_id`,
  `created_at`, `updated_at`, `deleted_at`
)
WITH RECURSIVE `seq` (`n`) AS (
  SELECT 1
  UNION ALL
  SELECT `n` + 1 FROM `seq` WHERE `n` < 110
)
SELECT
  NULL,
  CONCAT('test_user_', LPAD(`n`, 3, '0')),
  CONCAT('测试用户', LPAD(`n`, 3, '0')),
  CASE MOD(`n`, 7)
    WHEN 1 THEN 'Admin'
    WHEN 2 THEN 'EcOperator'
    WHEN 3 THEN 'ReOperator'
    WHEN 4 THEN 'FiOperator'
    WHEN 5 THEN 'TaxOperator'
    WHEN 6 THEN 'analysize'
    ELSE 'FinancialManagement'
  END,
  CONCAT('test_user_', LPAD(`n`, 3, '0'), '@example.com'),
  CONCAT('13910000', LPAD(`n`, 3, '0')),
  '$2a$10$jlaB2Q8Hmo35OMhWEebU7udnjDCTrUbzsnTc.AJGo9MlzZIqXy0um',
  NULL,
  1,
  0,
  NULL,
  '2026-06-28 09:00:00',
  NULL,
  NULL,
  1,
  1,
  '2026-06-28 09:00:00',
  '2026-06-28 09:00:00',
  NULL
FROM `seq`
ON DUPLICATE KEY UPDATE
  `display_name` = VALUES(`display_name`),
  `role` = VALUES(`role`),
  `email` = VALUES(`email`),
  `phone` = VALUES(`phone`),
  `password` = VALUES(`password`),
  `is_active` = VALUES(`is_active`),
  `failed_login_count` = VALUES(`failed_login_count`),
  `locked_until` = VALUES(`locked_until`),
  `password_changed_at` = VALUES(`password_changed_at`),
  `updated_by_user_id` = VALUES(`updated_by_user_id`),
  `updated_at` = VALUES(`updated_at`),
  `deleted_at` = VALUES(`deleted_at`);
