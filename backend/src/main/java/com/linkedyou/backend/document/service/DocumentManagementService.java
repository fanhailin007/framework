package com.linkedyou.backend.document.service;

import com.linkedyou.backend.document.dto.DocumentCreateRequest;
import com.linkedyou.backend.document.dto.DocumentPublishRequest;
import com.linkedyou.backend.document.dto.DocumentResponse;
import com.linkedyou.backend.document.dto.DocumentUpdateRequest;
import com.linkedyou.backend.document.dto.DocumentUploadRequest;
import com.linkedyou.backend.document.file.DocumentPdfFile;

import java.util.List;

/**
 * Module Name: Document Management Module
 * Main Function: Defines document management business capabilities for the service layer.
 * Parameters: Method parameters defined by the service contract.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
public interface DocumentManagementService {

    List<DocumentResponse> list(String status);

    DocumentResponse getById(Long id);

    DocumentPdfFile openPdf(Long id);

    DocumentResponse create(DocumentCreateRequest request);

    DocumentResponse upload(DocumentUploadRequest request);

    DocumentResponse update(Long id, DocumentUpdateRequest request);

    DocumentResponse publish(Long id, DocumentPublishRequest request);

    DocumentResponse archive(Long id);

    void delete(Long id);
}
