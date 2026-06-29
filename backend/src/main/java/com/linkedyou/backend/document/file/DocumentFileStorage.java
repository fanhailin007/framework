package com.linkedyou.backend.document.file;

import org.springframework.web.multipart.MultipartFile;

/**
 * Module Name: Document Management Module
 * Main Function: Defines or implements document file storage operations for uploaded PDF files.
 * Parameters: N/A.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
public interface DocumentFileStorage {

    StoredDocumentFile storePdf(MultipartFile file);

    DocumentPdfFile loadPdf(String filePath);

    void deleteQuietly(String filePath);
}
