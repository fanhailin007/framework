package com.linkedyou.backend.auth.dto;

import com.linkedyou.backend.user.dto.UserResponse;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Module Name: Authentication Module
 * Main Function: Carries sanitized response data for login operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
public class LoginResponse {

    private String accessToken;

    private String refreshToken;

    private String tokenType = "Bearer";

    private LocalDateTime issuedAt;

    private LocalDateTime expiresAt;

    private LocalDateTime refreshExpiresAt;

    private UserResponse user;
}
