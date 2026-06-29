package com.linkedyou.backend.document.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedyou.backend.common.exception.BusinessException;
import com.linkedyou.backend.document.dto.DocumentCreateRequest;
import com.linkedyou.backend.document.dto.DocumentPublishRequest;
import com.linkedyou.backend.document.dto.DocumentResponse;
import com.linkedyou.backend.document.dto.DocumentUpdateRequest;
import com.linkedyou.backend.document.dto.DocumentUploadRequest;
import com.linkedyou.backend.document.entity.Document;
import com.linkedyou.backend.document.file.DocumentFileStorage;
import com.linkedyou.backend.document.file.DocumentPdfFile;
import com.linkedyou.backend.document.file.StoredDocumentFile;
import com.linkedyou.backend.document.mapper.DocumentMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * Module Name: Document Management Module
 * Main Function: Implements document management business rules, transaction boundaries, and persistence orchestration.
 * Parameters: Method parameters defined by the service contract.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Service
public class DocumentManagementServiceImpl implements DocumentManagementService {

    private static final String STATUS_DRAFT = "draft";

    private static final String STATUS_PUBLISHED = "published";

    private static final String STATUS_ARCHIVED = "archived";

    private static final Set<String> ALLOWED_STATUSES = Set.of(STATUS_DRAFT, STATUS_PUBLISHED, STATUS_ARCHIVED);

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final DocumentMapper documentMapper;

    private final DocumentFileStorage documentFileStorage;

    public DocumentManagementServiceImpl(DocumentMapper documentMapper, DocumentFileStorage documentFileStorage) {
        this.documentMapper = documentMapper;
        this.documentFileStorage = documentFileStorage;
    }

    @Override
    public List<DocumentResponse> list(String status) {
        validateStatus(status);
        LambdaQueryWrapper<Document> wrapper = new LambdaQueryWrapper<Document>()
                .isNull(Document::getDeletedAt)
                .orderByDesc(Document::getUpdatedAt);
        if (StringUtils.hasText(status)) {
            wrapper.eq(Document::getStatus, status);
        }
        return documentMapper.selectList(wrapper).stream()
                .map(DocumentResponse::from)
                .toList();
    }

    @Override
    public DocumentResponse getById(Long id) {
        return DocumentResponse.from(loadActiveDocument(id));
    }

    @Override
    public DocumentPdfFile openPdf(Long id) {
        Document document = loadActiveDocument(id);
        if (!StringUtils.hasText(document.getFilePath())) {
            throw new BusinessException("DOCUMENT_FILE_NOT_AVAILABLE", "document file is not available");
        }
        return documentFileStorage.loadPdf(document.getFilePath());
    }

    @Override
    @Transactional
    public DocumentResponse create(DocumentCreateRequest request) {
        assertSlugAvailable(request.getSlug(), null);

        LocalDateTime now = LocalDateTime.now();
        Document document = new Document();
        document.setDocumentId(request.getDocumentId());
        document.setTitle(request.getTitle());
        document.setSlug(request.getSlug());
        document.setSummary(request.getSummary());
        document.setContent(request.getContent());
        document.setStatus(STATUS_DRAFT);
        document.setOwnerUserId(request.getOwnerUserId());
        document.setCategory(request.getCategory());
        document.setTags(toTagsJson(request.getTags()));
        document.setFilePath(request.getFilePath());
        document.setFileSize(request.getFileSize());
        document.setVersion(1);
        document.setCreatedByUserId(request.getCreatedByUserId());
        document.setUpdatedByUserId(request.getUpdatedByUserId());
        document.setCreatedAt(now);
        document.setUpdatedAt(now);

        documentMapper.insert(document);
        return DocumentResponse.from(document);
    }

    @Override
    @Transactional
    public DocumentResponse upload(DocumentUploadRequest request) {
        assertSlugAvailable(request.getSlug(), null);
        StoredDocumentFile storedFile = documentFileStorage.storePdf(request.getFile());

        try {
            LocalDateTime now = LocalDateTime.now();
            Document document = new Document();
            document.setDocumentId(request.getDocumentId());
            document.setTitle(request.getTitle());
            document.setSlug(request.getSlug());
            document.setSummary(request.getSummary());
            document.setContent(request.getContent());
            document.setStatus(STATUS_DRAFT);
            document.setOwnerUserId(request.getOwnerUserId());
            document.setCategory(request.getCategory());
            document.setTags(toTagsJson(request.getTags()));
            document.setFilePath(storedFile.filePath());
            document.setFileSize(storedFile.fileSize());
            document.setVersion(1);
            document.setCreatedByUserId(request.getCreatedByUserId());
            document.setUpdatedByUserId(request.getUpdatedByUserId());
            document.setCreatedAt(now);
            document.setUpdatedAt(now);

            documentMapper.insert(document);
            return DocumentResponse.from(document);
        } catch (RuntimeException ex) {
            documentFileStorage.deleteQuietly(storedFile.filePath());
            throw ex;
        }
    }

    @Override
    @Transactional
    public DocumentResponse update(Long id, DocumentUpdateRequest request) {
        Document document = loadActiveDocument(id);
        if (StringUtils.hasText(request.getSlug()) && !request.getSlug().equals(document.getSlug())) {
            assertSlugAvailable(request.getSlug(), id);
            document.setSlug(request.getSlug());
        }
        if (StringUtils.hasText(request.getTitle())) {
            document.setTitle(request.getTitle());
        }
        if (request.getDocumentId() != null) {
            document.setDocumentId(request.getDocumentId());
        }
        if (request.getSummary() != null) {
            document.setSummary(request.getSummary());
        }
        if (request.getContent() != null) {
            document.setContent(request.getContent());
        }
        if (request.getOwnerUserId() != null) {
            document.setOwnerUserId(request.getOwnerUserId());
        }
        if (request.getCategory() != null) {
            document.setCategory(request.getCategory());
        }
        if (request.getTags() != null) {
            document.setTags(toTagsJson(request.getTags()));
        }
        if (request.getFilePath() != null) {
            document.setFilePath(request.getFilePath());
        }
        if (request.getFileSize() != null) {
            document.setFileSize(request.getFileSize());
        }
        if (request.getUpdatedByUserId() != null) {
            document.setUpdatedByUserId(request.getUpdatedByUserId());
        }
        document.setVersion((document.getVersion() == null ? 0 : document.getVersion()) + 1);
        document.setUpdatedAt(LocalDateTime.now());

        documentMapper.updateById(document);
        return DocumentResponse.from(document);
    }

    @Override
    @Transactional
    public DocumentResponse publish(Long id, DocumentPublishRequest request) {
        Document document = loadActiveDocument(id);
        LocalDateTime now = LocalDateTime.now();
        document.setStatus(STATUS_PUBLISHED);
        document.setReviewedBy(request.getReviewedBy());
        document.setUpdatedByUserId(request.getUpdatedByUserId());
        document.setPublishedAt(now);
        document.setUpdatedAt(now);

        documentMapper.updateById(document);
        return DocumentResponse.from(document);
    }

    @Override
    @Transactional
    public DocumentResponse archive(Long id) {
        Document document = loadActiveDocument(id);
        document.setStatus(STATUS_ARCHIVED);
        document.setUpdatedAt(LocalDateTime.now());

        documentMapper.updateById(document);
        return DocumentResponse.from(document);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Document document = loadActiveDocument(id);
        LocalDateTime now = LocalDateTime.now();
        document.setDeletedAt(now);
        document.setUpdatedAt(now);
        documentMapper.updateById(document);
    }

    private Document loadActiveDocument(Long id) {
        Document document = documentMapper.selectById(id);
        if (document == null || document.getDeletedAt() != null) {
            throw new BusinessException("DOCUMENT_NOT_FOUND", "document not found");
        }
        return document;
    }

    private void assertSlugAvailable(String slug, Long excludeId) {
        LambdaQueryWrapper<Document> wrapper = new LambdaQueryWrapper<Document>()
                .eq(Document::getSlug, slug)
                .isNull(Document::getDeletedAt);
        if (excludeId != null) {
            wrapper.ne(Document::getId, excludeId);
        }
        Long count = documentMapper.selectCount(wrapper);
        if (count != null && count > 0) {
            throw new BusinessException("DOCUMENT_SLUG_EXISTS", "document slug already exists");
        }
    }

    private static void validateStatus(String status) {
        if (StringUtils.hasText(status) && !ALLOWED_STATUSES.contains(status)) {
            throw new BusinessException("DOCUMENT_STATUS_INVALID", "document status is invalid");
        }
    }

    private static String toTagsJson(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(tags);
        } catch (JsonProcessingException ex) {
            throw new BusinessException("DOCUMENT_TAGS_INVALID", "document tags are invalid");
        }
    }
}
