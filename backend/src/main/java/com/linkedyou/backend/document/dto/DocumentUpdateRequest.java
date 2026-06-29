package com.linkedyou.backend.document.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/**
 * Module Name: Document Management Module
 * Main Function: Carries validated request data for document update operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
public class DocumentUpdateRequest {

    @PositiveOrZero
    private Long documentId;

    @Size(max = 255)
    private String title;

    @Size(max = 255)
    private String slug;

    @Size(max = 512)
    private String summary;

    private String content;

    @PositiveOrZero
    private Long ownerUserId;

    @Size(max = 100)
    private String category;

    private List<@Size(max = 100) String> tags;

    @Size(max = 500)
    private String filePath;

    @Positive
    private Long fileSize;

    @PositiveOrZero
    private Long updatedByUserId;
}
