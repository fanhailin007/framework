package com.linkedyou.backend.auth.service;

import com.linkedyou.backend.auth.dto.LoginRequest;
import com.linkedyou.backend.auth.dto.LoginResponse;
import com.linkedyou.backend.auth.dto.RefreshTokenRequest;

/**
 * Module Name: Authentication Module
 * Main Function: Defines auth business capabilities for the service layer.
 * Parameters: Method parameters defined by the service contract.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
public interface AuthService {

    LoginResponse login(LoginRequest request);

    void logout(String authorizationHeader);

    LoginResponse refreshToken(RefreshTokenRequest request);
}
