-- 统一用户角色数据
-- 用途：将 users.role 更新为前端 userConfig.roleOptions 中定义的角色值。

SET NAMES utf8mb4;
SET time_zone = '+09:00';

UPDATE `users`
SET `role` = CASE
  WHEN `user_id` = 'admin' THEN 'Admin'
  WHEN `user_id` = 'editor' THEN 'EcOperator'
  WHEN `user_id` = 'viewer' THEN 'ReOperator'
  WHEN `user_id` = 'disabled_user' THEN 'TaxOperator'
  WHEN `user_id` = 'deleted_user' THEN 'FinancialManagement'
  WHEN `user_id` LIKE 'test_user\_%' THEN CASE MOD(CAST(SUBSTRING(`user_id`, 11) AS UNSIGNED), 7)
    WHEN 1 THEN 'Admin'
    WHEN 2 THEN 'EcOperator'
    WHEN 3 THEN 'ReOperator'
    WHEN 4 THEN 'FiOperator'
    WHEN 5 THEN 'TaxOperator'
    WHEN 6 THEN 'analysize'
    ELSE 'FinancialManagement'
  END
  ELSE CASE MOD(`id`, 7)
    WHEN 1 THEN 'Admin'
    WHEN 2 THEN 'EcOperator'
    WHEN 3 THEN 'ReOperator'
    WHEN 4 THEN 'FiOperator'
    WHEN 5 THEN 'TaxOperator'
    WHEN 6 THEN 'analysize'
    ELSE 'FinancialManagement'
  END
END
WHERE `role` IS NULL
   OR `role` NOT IN (
     'Admin',
     'EcOperator',
     'ReOperator',
     'FiOperator',
     'TaxOperator',
     'analysize',
     'FinancialManagement'
   )
   OR `user_id` IN ('admin', 'editor', 'viewer', 'disabled_user', 'deleted_user')
   OR `user_id` LIKE 'test_user\_%';
