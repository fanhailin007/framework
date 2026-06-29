package com.linkedyou.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Module Name: Authentication Module
 * Main Function: Carries validated request data for refresh token operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added refresh token request DTO.
 * Updater: Codex
 */
@Data
public class RefreshTokenRequest {

    @NotBlank
    @Size(max = 512)
    private String refreshToken;
}
