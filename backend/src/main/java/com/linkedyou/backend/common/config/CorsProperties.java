package com.linkedyou.backend.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Module Name: Common Configuration Module
 * Main Function: Binds external configuration properties for CORS settings.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added centralized CORS configuration properties.
 * Updater: Codex
 */
@Data
@Component
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    private List<String> allowedOrigins = List.of(
            "http://localhost:5200",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5200",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000"
    );

    private List<String> allowedMethods = List.of("GET", "POST", "PUT", "DELETE", "OPTIONS");

    private List<String> allowedHeaders = List.of("Content-Type", "Authorization");

    private List<String> exposedHeaders = List.of("Content-Disposition");

    private boolean allowCredentials = true;

    private long maxAge = 3600;
}
