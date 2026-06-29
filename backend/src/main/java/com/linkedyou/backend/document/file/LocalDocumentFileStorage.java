package com.linkedyou.backend.document.file;

import com.linkedyou.backend.common.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;

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
@Component
public class LocalDocumentFileStorage implements DocumentFileStorage {

    private static final String PDF_CONTENT_TYPE = "application/pdf";

    private final Path rootPath;

    private final DataSize maxFileSize;

    public LocalDocumentFileStorage(@Value("${storage.local.root}") String rootPath,
                                    @Value("${storage.local.max-file-size:50MB}") DataSize maxFileSize) {
        this.rootPath = Path.of(rootPath).toAbsolutePath().normalize();
        this.maxFileSize = maxFileSize;
    }

    @Override
    public StoredDocumentFile storePdf(MultipartFile file) {
        validatePdf(file);
        LocalDate today = LocalDate.now();
        Path directory = rootPath
                .resolve(String.valueOf(today.getYear()))
                .resolve(String.format("%02d", today.getMonthValue()));
        String filename = UUID.randomUUID() + "-" + sanitizeFilename(file.getOriginalFilename());
        Path targetPath = directory.resolve(filename).normalize();
        if (!targetPath.startsWith(rootPath)) {
            throw new BusinessException("DOCUMENT_FILE_INVALID", "document file path is invalid");
        }

        try {
            Files.createDirectories(directory);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ex) {
            throw new BusinessException("DOCUMENT_FILE_STORE_FAILED", "document file store failed");
        }
        return new StoredDocumentFile(targetPath.toString(), file.getSize());
    }

    @Override
    public DocumentPdfFile loadPdf(String filePath) {
        Path path = resolveStoredPath(filePath);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            throw new BusinessException("DOCUMENT_FILE_NOT_FOUND", "document file is not found");
        }
        if (!path.getFileName().toString().toLowerCase(Locale.ROOT).endsWith(".pdf") || !hasPdfHeader(path)) {
            throw new BusinessException("DOCUMENT_FILE_INVALID", "only PDF files are allowed");
        }
        try {
            return new DocumentPdfFile(new FileSystemResource(path), path.getFileName().toString(), Files.size(path));
        } catch (IOException ex) {
            throw new BusinessException("DOCUMENT_FILE_READ_FAILED", "document file read failed");
        }
    }

    @Override
    public void deleteQuietly(String filePath) {
        if (!StringUtils.hasText(filePath)) {
            return;
        }
        try {
            Path path = Path.of(filePath).toAbsolutePath().normalize();
            if (path.startsWith(rootPath)) {
                Files.deleteIfExists(path);
            }
        } catch (IOException ignored) {
            // Cleanup is best-effort after a failed database write.
        }
    }

    private Path resolveStoredPath(String filePath) {
        if (!StringUtils.hasText(filePath)) {
            throw new BusinessException("DOCUMENT_FILE_NOT_AVAILABLE", "document file is not available");
        }
        Path path = Path.of(filePath).toAbsolutePath().normalize();
        if (!path.startsWith(rootPath)) {
            throw new BusinessException("DOCUMENT_FILE_INVALID", "document file path is invalid");
        }
        return path;
    }

    private void validatePdf(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("DOCUMENT_FILE_REQUIRED", "document file is required");
        }
        if (file.getSize() > maxFileSize.toBytes()) {
            throw new BusinessException("DOCUMENT_FILE_TOO_LARGE", "document file is too large");
        }
        String originalFilename = file.getOriginalFilename();
        String contentType = file.getContentType();
        if (!StringUtils.hasText(originalFilename)
                || !originalFilename.toLowerCase(Locale.ROOT).endsWith(".pdf")
                || !PDF_CONTENT_TYPE.equalsIgnoreCase(contentType)
                || !hasPdfHeader(file)) {
            throw new BusinessException("DOCUMENT_FILE_INVALID", "only PDF files are allowed");
        }
    }

    private static boolean hasPdfHeader(MultipartFile file) {
        byte[] header = new byte[5];
        try (InputStream inputStream = file.getInputStream()) {
            int read = inputStream.read(header);
            return read == 5
                    && header[0] == '%'
                    && header[1] == 'P'
                    && header[2] == 'D'
                    && header[3] == 'F'
                    && header[4] == '-';
        } catch (IOException ex) {
            return false;
        }
    }

    private static boolean hasPdfHeader(Path path) {
        byte[] header = new byte[5];
        try (InputStream inputStream = Files.newInputStream(path)) {
            int read = inputStream.read(header);
            return read == 5
                    && header[0] == '%'
                    && header[1] == 'P'
                    && header[2] == 'D'
                    && header[3] == 'F'
                    && header[4] == '-';
        } catch (IOException ex) {
            return false;
        }
    }

    private static String sanitizeFilename(String originalFilename) {
        String filename = Path.of(originalFilename).getFileName().toString();
        String sanitized = filename.replaceAll("[^A-Za-z0-9._-]", "_");
        if (!StringUtils.hasText(sanitized)) {
            return "document.pdf";
        }
        return sanitized;
    }
}
