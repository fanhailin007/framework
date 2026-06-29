package com.linkedyou.backend.document.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedyou.backend.document.entity.Document;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Module Name: Document Management Module
 * Main Function: Carries sanitized response data for document operations.
 * Parameters: Fields declared in this type.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Data
public class DocumentResponse {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private Long id;

    private Long documentId;

    private String title;

    private String slug;

    private String summary;

    private String content;

    private String status;

    private Long ownerUserId;

    private String category;

    private List<String> tags;

    private String filePath;

    private Long fileSize;

    private Integer version;

    private LocalDateTime publishedAt;

    private Long reviewedBy;

    private Long createdByUserId;

    private Long updatedByUserId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static DocumentResponse from(Document document) {
        DocumentResponse response = new DocumentResponse();
        response.setId(document.getId());
        response.setDocumentId(document.getDocumentId());
        response.setTitle(document.getTitle());
        response.setSlug(document.getSlug());
        response.setSummary(document.getSummary());
        response.setContent(document.getContent());
        response.setStatus(document.getStatus());
        response.setOwnerUserId(document.getOwnerUserId());
        response.setCategory(document.getCategory());
        response.setTags(parseTags(document.getTags()));
        response.setFilePath(document.getFilePath());
        response.setFileSize(document.getFileSize());
        response.setVersion(document.getVersion());
        response.setPublishedAt(document.getPublishedAt());
        response.setReviewedBy(document.getReviewedBy());
        response.setCreatedByUserId(document.getCreatedByUserId());
        response.setUpdatedByUserId(document.getUpdatedByUserId());
        response.setCreatedAt(document.getCreatedAt());
        response.setUpdatedAt(document.getUpdatedAt());
        return response;
    }

    private static List<String> parseTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }
        try {
            return OBJECT_MAPPER.readValue(tags, new TypeReference<>() {
            });
        } catch (Exception ex) {
            return List.of();
        }
    }
}
