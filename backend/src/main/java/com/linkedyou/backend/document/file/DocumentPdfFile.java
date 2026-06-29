package com.linkedyou.backend.document.file;

import org.springframework.core.io.Resource;

/**
 * Module Name: Document Management Module
 * Main Function: Represents immutable document pdf file data exchanged inside the document or authentication workflow.
 * Parameters: Record components: Resource resource, String filename, Long contentLength.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
public record DocumentPdfFile(Resource resource, String filename, Long contentLength) {
}
