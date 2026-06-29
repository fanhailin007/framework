package com.linkedyou.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Module Name: Authentication Module
 * Main Function: Carries validated request data for login operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
public class LoginRequest {

    @NotBlank
    @Size(max = 64)
    private String userId;

    @NotBlank
    @Size(max = 100)
    private String password;

    @Size(max = 128)
    private String deviceId;

    @Size(max = 150)
    private String deviceName;

    @Size(max = 45)
    private String ipAddress;

    @Size(max = 500)
    private String userAgent;
}
