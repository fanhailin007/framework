package com.linkedyou.backend.auth.service;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Module Name: Authentication Module
 * Main Function: Binds external configuration properties for auth settings.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
@Component
@ConfigurationProperties(prefix = "security.auth")
public class AuthProperties {

    private Duration accessTokenTtl = Duration.ofMinutes(30);

    private Duration refreshTokenTtl = Duration.ofDays(30);

    private int maxFailedAttempts = 5;

    private Duration lockDuration = Duration.ofMinutes(15);
}
