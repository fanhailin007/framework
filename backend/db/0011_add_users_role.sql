-- Add or rename user role field on existing users table.
-- Purpose: return the user's role information in user and login responses.

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET @role_column_exists := (
  SELECT COUNT(1)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'role'
);

SET @department_column_exists := (
  SELECT COUNT(1)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'department'
);

SET @role_column_sql := CASE
  WHEN @role_column_exists = 0 AND @department_column_exists > 0
    THEN 'ALTER TABLE `users` CHANGE COLUMN `department` `role` VARCHAR(100) NULL COMMENT ''用户角色'''
  WHEN @role_column_exists = 0
    THEN 'ALTER TABLE `users` ADD COLUMN `role` VARCHAR(100) NULL COMMENT ''用户角色'' AFTER `display_name`'
  ELSE 'SELECT ''users.role already exists'' AS message'
END;

PREPARE role_column_stmt FROM @role_column_sql;
EXECUTE role_column_stmt;
DEALLOCATE PREPARE role_column_stmt;

UPDATE `users`
SET `role` = CASE `user_id`
  WHEN 'admin' THEN 'Admin'
  WHEN 'editor' THEN 'EcOperator'
  WHEN 'viewer' THEN 'ReOperator'
  WHEN 'disabled_user' THEN 'TaxOperator'
  WHEN 'deleted_user' THEN 'FinancialManagement'
  ELSE `role`
END
WHERE `role` IS NULL
   OR `user_id` IN ('admin', 'editor', 'viewer', 'disabled_user', 'deleted_user');
