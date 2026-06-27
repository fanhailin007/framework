package com.linkedyou.backend.document.service;

import com.linkedyou.backend.common.exception.BusinessException;
import com.linkedyou.backend.document.dto.DocumentCreateRequest;
import com.linkedyou.backend.document.dto.DocumentPublishRequest;
import com.linkedyou.backend.document.dto.DocumentUpdateRequest;
import com.linkedyou.backend.document.dto.DocumentUploadRequest;
import com.linkedyou.backend.document.entity.Document;
import com.linkedyou.backend.document.file.DocumentFileStorage;
import com.linkedyou.backend.document.file.DocumentPdfFile;
import com.linkedyou.backend.document.file.StoredDocumentFile;
import com.linkedyou.backend.document.mapper.DocumentMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DocumentManagementServiceTest {

    @Mock
    private DocumentMapper documentMapper;

    @Mock
    private DocumentFileStorage documentFileStorage;

    private DocumentManagementService service;

    @BeforeEach
    void setUp() {
        service = new DocumentManagementServiceImpl(documentMapper, documentFileStorage);
    }

    @Test
    void createDocumentPersistsDraftWithSerializedTags() {
        when(documentMapper.selectCount(any())).thenReturn(0L);
        when(documentMapper.insert(any(Document.class))).thenReturn(1);

        DocumentCreateRequest request = new DocumentCreateRequest();
        request.setTitle("API Guide");
        request.setSlug("api-guide");
        request.setSummary("Backend API guide");
        request.setContent("# API Guide");
        request.setOwnerUserId(2L);
        request.setCategory("guide");
        request.setTags(List.of("api", "backend"));
        request.setCreatedByUserId(2L);
        request.setUpdatedByUserId(2L);

        service.create(request);

        ArgumentCaptor<Document> captor = ArgumentCaptor.forClass(Document.class);
        verify(documentMapper).insert(captor.capture());
        Document saved = captor.getValue();
        assertThat(saved.getTitle()).isEqualTo("API Guide");
        assertThat(saved.getSlug()).isEqualTo("api-guide");
        assertThat(saved.getStatus()).isEqualTo("draft");
        assertThat(saved.getTags()).isEqualTo("[\"api\",\"backend\"]");
        assertThat(saved.getVersion()).isEqualTo(1);
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }

    @Test
    void createDocumentRejectsExistingSlug() {
        when(documentMapper.selectCount(any())).thenReturn(1L);

        DocumentCreateRequest request = new DocumentCreateRequest();
        request.setTitle("API Guide");
        request.setSlug("api-guide");

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("document slug already exists")
                .extracting("code")
                .isEqualTo("DOCUMENT_SLUG_EXISTS");

        verify(documentMapper, never()).insert(any(Document.class));
    }

    @Test
    void uploadPdfDocumentStoresFileAndPersistsDraftWithFormFields() {
        MockMultipartFile file = pdfFile();
        when(documentMapper.selectCount(any())).thenReturn(0L);
        when(documentFileStorage.storePdf(file))
                .thenReturn(new StoredDocumentFile("/Users/hailinfan/data/docs/2026/06/api-guide.pdf", 25L));
        when(documentMapper.insert(any(Document.class))).thenReturn(1);

        DocumentUploadRequest request = new DocumentUploadRequest();
        request.setFile(file);
        request.setTitle("API Guide");
        request.setSlug("api-guide");
        request.setSummary("Backend API guide");
        request.setContent("# API Guide");
        request.setOwnerUserId(2L);
        request.setCategory("guide");
        request.setTags(List.of("api", "pdf"));
        request.setCreatedByUserId(2L);
        request.setUpdatedByUserId(2L);

        service.upload(request);

        ArgumentCaptor<Document> captor = ArgumentCaptor.forClass(Document.class);
        verify(documentMapper).insert(captor.capture());
        Document saved = captor.getValue();
        assertThat(saved.getTitle()).isEqualTo("API Guide");
        assertThat(saved.getSlug()).isEqualTo("api-guide");
        assertThat(saved.getStatus()).isEqualTo("draft");
        assertThat(saved.getTags()).isEqualTo("[\"api\",\"pdf\"]");
        assertThat(saved.getFilePath()).isEqualTo("/Users/hailinfan/data/docs/2026/06/api-guide.pdf");
        assertThat(saved.getFileSize()).isEqualTo(25L);
    }

    @Test
    void uploadPdfDocumentRejectsExistingSlugWithoutStoringFile() {
        when(documentMapper.selectCount(any())).thenReturn(1L);

        DocumentUploadRequest request = new DocumentUploadRequest();
        request.setFile(pdfFile());
        request.setTitle("API Guide");
        request.setSlug("api-guide");

        assertThatThrownBy(() -> service.upload(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("document slug already exists")
                .extracting("code")
                .isEqualTo("DOCUMENT_SLUG_EXISTS");

        verify(documentFileStorage, never()).storePdf(any());
        verify(documentMapper, never()).insert(any(Document.class));
    }

    @Test
    void uploadPdfDocumentDeletesStoredFileWhenDatabaseInsertFails() {
        MockMultipartFile file = pdfFile();
        when(documentMapper.selectCount(any())).thenReturn(0L);
        when(documentFileStorage.storePdf(file))
                .thenReturn(new StoredDocumentFile("/Users/hailinfan/data/docs/2026/06/api-guide.pdf", 25L));
        when(documentMapper.insert(any(Document.class))).thenThrow(new IllegalStateException("db down"));

        DocumentUploadRequest request = new DocumentUploadRequest();
        request.setFile(file);
        request.setTitle("API Guide");
        request.setSlug("api-guide");

        assertThatThrownBy(() -> service.upload(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("db down");

        verify(documentFileStorage).deleteQuietly("/Users/hailinfan/data/docs/2026/06/api-guide.pdf");
    }

    @Test
    void listDocumentsFiltersActiveDocumentsAndOptionalStatus() {
        Document document = existingDocument();
        when(documentMapper.selectList(any())).thenReturn(List.of(document));

        assertThat(service.list("published")).hasSize(1);

        verify(documentMapper).selectList(any());
    }

    @Test
    void updateDocumentChangesProvidedFieldsAndIncrementsVersion() {
        Document existing = existingDocument();
        when(documentMapper.selectById(9L)).thenReturn(existing);
        when(documentMapper.selectCount(any())).thenReturn(0L);
        when(documentMapper.updateById(any(Document.class))).thenReturn(1);

        DocumentUpdateRequest request = new DocumentUpdateRequest();
        request.setTitle("Updated API Guide");
        request.setSlug("updated-api-guide");
        request.setTags(List.of("updated", "api"));
        request.setUpdatedByUserId(3L);

        service.update(9L, request);

        ArgumentCaptor<Document> captor = ArgumentCaptor.forClass(Document.class);
        verify(documentMapper).updateById(captor.capture());
        Document updated = captor.getValue();
        assertThat(updated.getTitle()).isEqualTo("Updated API Guide");
        assertThat(updated.getSlug()).isEqualTo("updated-api-guide");
        assertThat(updated.getTags()).isEqualTo("[\"updated\",\"api\"]");
        assertThat(updated.getVersion()).isEqualTo(3);
        assertThat(updated.getUpdatedByUserId()).isEqualTo(3L);
        assertThat(updated.getUpdatedAt()).isNotNull();
    }

    @Test
    void publishDocumentSetsPublishedStatusReviewerAndTime() {
        Document existing = existingDocument();
        when(documentMapper.selectById(9L)).thenReturn(existing);
        when(documentMapper.updateById(any(Document.class))).thenReturn(1);

        DocumentPublishRequest request = new DocumentPublishRequest();
        request.setReviewedBy(1L);
        request.setUpdatedByUserId(1L);

        service.publish(9L, request);

        ArgumentCaptor<Document> captor = ArgumentCaptor.forClass(Document.class);
        verify(documentMapper).updateById(captor.capture());
        Document published = captor.getValue();
        assertThat(published.getStatus()).isEqualTo("published");
        assertThat(published.getReviewedBy()).isEqualTo(1L);
        assertThat(published.getUpdatedByUserId()).isEqualTo(1L);
        assertThat(published.getPublishedAt()).isNotNull();
    }

    @Test
    void archiveDocumentSetsArchivedStatus() {
        Document existing = existingDocument();
        when(documentMapper.selectById(9L)).thenReturn(existing);
        when(documentMapper.updateById(any(Document.class))).thenReturn(1);

        service.archive(9L);

        ArgumentCaptor<Document> captor = ArgumentCaptor.forClass(Document.class);
        verify(documentMapper).updateById(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo("archived");
    }

    @Test
    void deleteDocumentSoftDeletesExistingDocument() {
        Document existing = existingDocument();
        when(documentMapper.selectById(9L)).thenReturn(existing);
        when(documentMapper.updateById(any(Document.class))).thenReturn(1);

        service.delete(9L);

        ArgumentCaptor<Document> captor = ArgumentCaptor.forClass(Document.class);
        verify(documentMapper).updateById(captor.capture());
        assertThat(captor.getValue().getDeletedAt()).isNotNull();
    }

    @Test
    void getByIdRejectsSoftDeletedDocument() {
        Document deleted = existingDocument();
        deleted.setDeletedAt(LocalDateTime.now());
        when(documentMapper.selectById(9L)).thenReturn(deleted);

        assertThatThrownBy(() -> service.getById(9L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("document not found")
                .extracting("code")
                .isEqualTo("DOCUMENT_NOT_FOUND");
    }

    @Test
    void openPdfLoadsStoredFileForActiveDocument() {
        Document existing = existingDocument();
        existing.setFilePath("/Users/hailinfan/data/docs/2026/06/api-guide.pdf");
        existing.setFileSize(25L);
        when(documentMapper.selectById(9L)).thenReturn(existing);
        DocumentPdfFile pdfFile = new DocumentPdfFile(
                new ByteArrayResource("%PDF-1.7\nbody".getBytes()),
                "api-guide.pdf",
                25L
        );
        when(documentFileStorage.loadPdf(existing.getFilePath())).thenReturn(pdfFile);

        DocumentPdfFile result = service.openPdf(9L);

        assertThat(result.filename()).isEqualTo("api-guide.pdf");
        assertThat(result.contentLength()).isEqualTo(25L);
        verify(documentFileStorage).loadPdf("/Users/hailinfan/data/docs/2026/06/api-guide.pdf");
    }

    @Test
    void openPdfRejectsDocumentWithoutFilePath() {
        Document existing = existingDocument();
        when(documentMapper.selectById(9L)).thenReturn(existing);

        assertThatThrownBy(() -> service.openPdf(9L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("document file is not available")
                .extracting("code")
                .isEqualTo("DOCUMENT_FILE_NOT_AVAILABLE");

        verify(documentFileStorage, never()).loadPdf(any());
    }

    private static Document existingDocument() {
        Document document = new Document();
        document.setId(9L);
        document.setDocumentId(9L);
        document.setTitle("API Guide");
        document.setSlug("api-guide");
        document.setSummary("Backend API guide");
        document.setContent("# API Guide");
        document.setStatus("draft");
        document.setOwnerUserId(2L);
        document.setCategory("guide");
        document.setTags("[\"api\"]");
        document.setVersion(2);
        document.setCreatedByUserId(2L);
        document.setUpdatedByUserId(2L);
        document.setCreatedAt(LocalDateTime.now().minusDays(1));
        document.setUpdatedAt(LocalDateTime.now().minusDays(1));
        return document;
    }

    private static MockMultipartFile pdfFile() {
        return new MockMultipartFile(
                "file",
                "api-guide.pdf",
                "application/pdf",
                "%PDF-1.7\nbody".getBytes()
        );
    }
}
