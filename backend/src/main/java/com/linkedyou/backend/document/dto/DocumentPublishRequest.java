package com.linkedyou.backend.document.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

/**
 * Module Name: Document Management Module
 * Main Function: Carries validated request data for document publish operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
public class DocumentPublishRequest {

    @PositiveOrZero
    private Long reviewedBy;

    @PositiveOrZero
    private Long updatedByUserId;
}
