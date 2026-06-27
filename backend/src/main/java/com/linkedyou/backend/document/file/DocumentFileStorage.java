package com.linkedyou.backend.document.file;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentFileStorage {

    StoredDocumentFile storePdf(MultipartFile file);

    DocumentPdfFile loadPdf(String filePath);

    void deleteQuietly(String filePath);
}
