package com.linkedyou.backend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Module Name: User Management Module
 * Main Function: Carries validated request data for user update operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
public class UserUpdateRequest {

    @Size(max = 64)
    private String userId;

    @Size(min = 8, max = 100)
    private String password;

    @Size(max = 100)
    private String displayName;

    @Size(max = 100)
    private String role;

    @Email
    @Size(max = 191)
    private String email;

    @Size(max = 32)
    private String phone;

    @Size(max = 255)
    private String avatar;

    private Boolean active;
}
