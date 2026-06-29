package com.linkedyou.backend.auth.service;

/**
 * Module Name: Authentication Module
 * Main Function: Generates authentication token values used by the authentication workflow.
 * Parameters: N/A.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
public interface AuthTokenGenerator {

    String generateToken();
}
