-- Remove legacy role-related database objects.
-- Purpose: align existing development databases with the backend after role support was removed.

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
SET FOREIGN_KEY_CHECKS = 1;

SET @column_exists := (
  SELECT COUNT(1)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'roles'
);

SET @drop_roles_column_sql := IF(
  @column_exists > 0,
  'ALTER TABLE `users` DROP COLUMN `roles`',
  'SELECT ''users.roles does not exist'' AS message'
);

PREPARE drop_roles_column_stmt FROM @drop_roles_column_sql;
EXECUTE drop_roles_column_stmt;
DEALLOCATE PREPARE drop_roles_column_stmt;

DELETE FROM `permissions`
WHERE `perm_code` = 'system:role:manage';
