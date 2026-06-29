package com.linkedyou.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedyou.backend.common.exception.BusinessException;
import com.linkedyou.backend.common.exception.GlobalExceptionHandler;
import com.linkedyou.backend.document.dto.DocumentCreateRequest;
import com.linkedyou.backend.document.dto.DocumentPublishRequest;
import com.linkedyou.backend.document.dto.DocumentResponse;
import com.linkedyou.backend.document.dto.DocumentUploadRequest;
import com.linkedyou.backend.document.file.DocumentPdfFile;
import com.linkedyou.backend.document.service.DocumentManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Module Name: API Controller Module Test
 * Main Function: Verifies Document Controller behavior with automated JUnit test cases.
 * Parameters: JUnit fixtures, mocks, and test method inputs declared in this test class.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@ExtendWith(MockitoExtension.class)
class DocumentControllerTest {

    @Mock
    private DocumentManagementService documentManagementService;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(new DocumentController(documentManagementService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void listDocumentsReturnsApiResponse() throws Exception {
        DocumentResponse document = documentResponse(9L, "api-guide");
        when(documentManagementService.list("published")).thenReturn(List.of(document));

        mockMvc.perform(get("/api/documents").param("status", "published"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data[0].id").value(9))
                .andExpect(jsonPath("$.data[0].slug").value("api-guide"));
    }

    @Test
    void createDocumentDelegatesToServiceAndWrapsResponse() throws Exception {
        DocumentResponse created = documentResponse(10L, "new-guide");
        when(documentManagementService.create(any(DocumentCreateRequest.class))).thenReturn(created);

        DocumentCreateRequest request = new DocumentCreateRequest();
        request.setTitle("New Guide");
        request.setSlug("new-guide");
        request.setTags(List.of("guide", "new"));

        mockMvc.perform(post("/api/documents")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.slug").value("new-guide"));

        ArgumentCaptor<DocumentCreateRequest> captor = ArgumentCaptor.forClass(DocumentCreateRequest.class);
        verify(documentManagementService).create(captor.capture());
        assertThat(captor.getValue().getTitle()).isEqualTo("New Guide");
        assertThat(captor.getValue().getSlug()).isEqualTo("new-guide");
    }

    @Test
    void createDocumentRejectsInvalidRequestWithoutCallingService() throws Exception {
        DocumentCreateRequest request = new DocumentCreateRequest();
        request.setSlug("missing-title");

        mockMvc.perform(post("/api/documents")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message", containsString("title")));

        verifyNoInteractions(documentManagementService);
    }

    @Test
    void uploadDocumentDelegatesMultipartFormToServiceAndWrapsResponse() throws Exception {
        DocumentResponse uploaded = documentResponse(11L, "upload-guide");
        uploaded.setFilePath("/Users/hailinfan/data/docs/2026/06/upload-guide.pdf");
        uploaded.setFileSize(25L);
        when(documentManagementService.upload(any(DocumentUploadRequest.class))).thenReturn(uploaded);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "upload-guide.pdf",
                "application/pdf",
                "%PDF-1.7\nbody".getBytes()
        );

        mockMvc.perform(multipart("/api/documents/upload")
                        .file(file)
                        .param("title", "Upload Guide")
                        .param("slug", "upload-guide")
                        .param("summary", "Uploaded from frontend")
                        .param("content", "# Upload Guide")
                        .param("ownerUserId", "2")
                        .param("category", "guide")
                        .param("tags", "upload")
                        .param("tags", "pdf")
                        .param("createdByUserId", "2")
                        .param("updatedByUserId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(11))
                .andExpect(jsonPath("$.data.slug").value("upload-guide"))
                .andExpect(jsonPath("$.data.filePath").value("/Users/hailinfan/data/docs/2026/06/upload-guide.pdf"))
                .andExpect(jsonPath("$.data.fileSize").value(25));

        ArgumentCaptor<DocumentUploadRequest> captor = ArgumentCaptor.forClass(DocumentUploadRequest.class);
        verify(documentManagementService).upload(captor.capture());
        assertThat(captor.getValue().getFile().getOriginalFilename()).isEqualTo("upload-guide.pdf");
        assertThat(captor.getValue().getTitle()).isEqualTo("Upload Guide");
        assertThat(captor.getValue().getSlug()).isEqualTo("upload-guide");
        assertThat(captor.getValue().getTags()).containsExactly("upload", "pdf");
    }

    @Test
    void uploadDocumentRejectsMissingFileWithoutCallingService() throws Exception {
        mockMvc.perform(multipart("/api/documents/upload")
                        .param("title", "Upload Guide")
                        .param("slug", "upload-guide"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message", containsString("file")));

        verifyNoInteractions(documentManagementService);
    }

    @Test
    void getByIdMapsBusinessExceptionToApiResponse() throws Exception {
        when(documentManagementService.getById(99L))
                .thenThrow(new BusinessException("DOCUMENT_NOT_FOUND", "document not found"));

        mockMvc.perform(get("/api/documents/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("DOCUMENT_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("document not found"));
    }

    @Test
    void openPdfReturnsInlinePdfResponse() throws Exception {
        DocumentPdfFile pdfFile = new DocumentPdfFile(
                new ByteArrayResource("%PDF-1.7\nbody".getBytes()),
                "api-guide.pdf",
                13L
        );
        when(documentManagementService.openPdf(9L)).thenReturn(pdfFile);

        mockMvc.perform(get("/api/documents/9/pdf"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/pdf"))
                .andExpect(header().string("Content-Disposition", "inline; filename=\"api-guide.pdf\""))
                .andExpect(header().longValue("Content-Length", 13L))
                .andExpect(content().bytes("%PDF-1.7\nbody".getBytes()));
    }

    @Test
    void publishDocumentDelegatesToServiceAndReturnsSuccessResponse() throws Exception {
        DocumentResponse published = documentResponse(9L, "api-guide");
        published.setStatus("published");
        when(documentManagementService.publish(eq(9L), any(DocumentPublishRequest.class))).thenReturn(published);

        DocumentPublishRequest request = new DocumentPublishRequest();
        request.setReviewedBy(1L);
        request.setUpdatedByUserId(1L);

        mockMvc.perform(post("/api/documents/9/publish")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("published"));

        verify(documentManagementService).publish(eq(9L), any(DocumentPublishRequest.class));
    }

    @Test
    void archiveDocumentReturnsSuccessResponse() throws Exception {
        DocumentResponse archived = documentResponse(9L, "api-guide");
        archived.setStatus("archived");
        when(documentManagementService.archive(9L)).thenReturn(archived);

        mockMvc.perform(post("/api/documents/9/archive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("archived"));
    }

    @Test
    void deleteDocumentReturnsSuccessResponse() throws Exception {
        mockMvc.perform(delete("/api/documents/9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(documentManagementService).delete(9L);
    }

    private static DocumentResponse documentResponse(Long id, String slug) {
        DocumentResponse response = new DocumentResponse();
        response.setId(id);
        response.setDocumentId(id);
        response.setTitle("API Guide");
        response.setSlug(slug);
        response.setStatus("draft");
        response.setTags(List.of("api"));
        return response;
    }
}
