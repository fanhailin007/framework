package com.linkedyou.backend.controller;

import com.linkedyou.backend.common.api.ApiResponse;
import com.linkedyou.backend.document.dto.DocumentCreateRequest;
import com.linkedyou.backend.document.dto.DocumentPublishRequest;
import com.linkedyou.backend.document.dto.DocumentResponse;
import com.linkedyou.backend.document.dto.DocumentUpdateRequest;
import com.linkedyou.backend.document.dto.DocumentUploadRequest;
import com.linkedyou.backend.document.file.DocumentPdfFile;
import com.linkedyou.backend.document.service.DocumentManagementService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentManagementService documentManagementService;

    public DocumentController(DocumentManagementService documentManagementService) {
        this.documentManagementService = documentManagementService;
    }

    @GetMapping
    public ApiResponse<List<DocumentResponse>> list(@RequestParam(required = false) String status) {
        return ApiResponse.success(documentManagementService.list(status));
    }

    @GetMapping("/{id}")
    public ApiResponse<DocumentResponse> getById(@PathVariable @Positive Long id) {
        return ApiResponse.success(documentManagementService.getById(id));
    }

    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<Resource> openPdf(@PathVariable @Positive Long id) {
        DocumentPdfFile pdfFile = documentManagementService.openPdf(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfFile.contentLength())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(pdfFile.filename()).build().toString())
                .body(pdfFile.resource());
    }

    @PostMapping
    public ApiResponse<DocumentResponse> create(@Valid @RequestBody DocumentCreateRequest request) {
        return ApiResponse.success(documentManagementService.create(request));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<DocumentResponse> upload(@Valid DocumentUploadRequest request) {
        return ApiResponse.success(documentManagementService.upload(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<DocumentResponse> update(@PathVariable @Positive Long id,
                                                @Valid @RequestBody DocumentUpdateRequest request) {
        return ApiResponse.success(documentManagementService.update(id, request));
    }

    @PostMapping("/{id}/publish")
    public ApiResponse<DocumentResponse> publish(@PathVariable @Positive Long id,
                                                 @Valid @RequestBody DocumentPublishRequest request) {
        return ApiResponse.success(documentManagementService.publish(id, request));
    }

    @PostMapping("/{id}/archive")
    public ApiResponse<DocumentResponse> archive(@PathVariable @Positive Long id) {
        return ApiResponse.success(documentManagementService.archive(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable @Positive Long id) {
        documentManagementService.delete(id);
        return ApiResponse.success();
    }
}
