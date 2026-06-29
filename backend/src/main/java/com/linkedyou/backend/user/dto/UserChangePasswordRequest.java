package com.linkedyou.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Module Name: User Management Module
 * Main Function: Carries validated request data for user change password operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
public class UserChangePasswordRequest {

    @NotBlank
    @Size(max = 100)
    private String currentPassword;

    @NotBlank
    @Size(max = 100)
    private String newPassword;
}
