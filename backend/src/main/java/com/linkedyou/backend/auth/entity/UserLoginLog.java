package com.linkedyou.backend.auth.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Module Name: Authentication Module
 * Main Function: Maps the user login log database table structure to a Java entity.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
@TableName("user_login_logs")
public class UserLoginLog {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("document_id")
    private Long documentId;

    @TableField("user_id")
    private Long userId;

    private String username;

    @TableField("login_result")
    private String loginResult;

    @TableField("failure_reason")
    private String failureReason;

    @TableField("ip_address")
    private String ipAddress;

    @TableField("user_agent")
    private String userAgent;

    @TableField("created_by_user_id")
    private Long createdByUserId;

    @TableField("updated_by_user_id")
    private Long updatedByUserId;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

    @TableField("deleted_at")
    private LocalDateTime deletedAt;
}
