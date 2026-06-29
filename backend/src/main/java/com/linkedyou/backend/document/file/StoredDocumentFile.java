package com.linkedyou.backend.document.file;

/**
 * Module Name: Document Management Module
 * Main Function: Represents immutable stored document file data exchanged inside the document or authentication workflow.
 * Parameters: Record components: String filePath, Long fileSize.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
public record StoredDocumentFile(String filePath, Long fileSize) {
}
