-- LinkedYou backend database initialization entrypoint.
-- Run from project root:
--   mysql -h <host> -u <user> -p -D <database> < db/0000_init_all.sql

SET NAMES utf8mb4;
SET time_zone = '+09:00';

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `menus`;
DROP TABLE IF EXISTS `user_login_logs`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `verification_codes`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

SOURCE db/0001_users.sql;
SOURCE db/0012_seed_test_users.sql;
SOURCE db/0003_permissions.sql;
SOURCE db/0006_user_sessions.sql;
SOURCE db/0007_user_login_logs.sql;
SOURCE db/0008_verification_codes.sql;
SOURCE db/0009_documents.sql;
