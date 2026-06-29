package com.linkedyou.backend.auth.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.linkedyou.backend.auth.entity.UserLoginLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * Module Name: Authentication Module
 * Main Function: Provides MyBatis-Plus data access operations for user login log records.
 * Parameters: Entity instances and MyBatis-Plus query wrappers supplied by callers.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Mapper
public interface UserLoginLogMapper extends BaseMapper<UserLoginLog> {
}
