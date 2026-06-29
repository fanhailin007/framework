package com.linkedyou.backend.user.dto;

import com.linkedyou.backend.user.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Module Name: User Management Module
 * Main Function: Carries sanitized response data for user operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
public class UserResponse {

    private Long id;

    private String userId;

    private String displayName;

    private String role;

    private String email;

    private String phone;

    private String avatar;

    private Boolean active;

    private LocalDateTime lastLoginAt;

    private String lastLoginIp;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static UserResponse from(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUserId(user.getUserId());
        response.setDisplayName(user.getDisplayName());
        response.setRole(user.getRole());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setAvatar(user.getAvatar());
        response.setActive(user.getActive());
        response.setLastLoginAt(user.getLastLoginAt());
        response.setLastLoginIp(user.getLastLoginIp());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
