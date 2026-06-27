package com.linkedyou.backend.document.file;

import com.linkedyou.backend.common.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.unit.DataSize;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LocalDocumentFileStorageTest {

    @TempDir
    private Path tempDir;

    @Test
    void storePdfWritesFileUnderConfiguredRoot() {
        LocalDocumentFileStorage storage = new LocalDocumentFileStorage(tempDir.toString(), DataSize.ofMegabytes(1));
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "guide.pdf",
                "application/pdf",
                "%PDF-1.7\nbody".getBytes()
        );

        StoredDocumentFile stored = storage.storePdf(file);

        assertThat(stored.fileSize()).isEqualTo(file.getSize());
        assertThat(stored.filePath()).startsWith(tempDir.toString());
        assertThat(Files.exists(Path.of(stored.filePath()))).isTrue();
    }

    @Test
    void storePdfRejectsNonPdfContent() {
        LocalDocumentFileStorage storage = new LocalDocumentFileStorage(tempDir.toString(), DataSize.ofMegabytes(1));
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "guide.pdf",
                "application/pdf",
                "not a pdf".getBytes()
        );

        assertThatThrownBy(() -> storage.storePdf(file))
                .isInstanceOf(BusinessException.class)
                .hasMessage("only PDF files are allowed")
                .extracting("code")
                .isEqualTo("DOCUMENT_FILE_INVALID");
    }

    @Test
    void storePdfRejectsOversizedFile() {
        LocalDocumentFileStorage storage = new LocalDocumentFileStorage(tempDir.toString(), DataSize.ofBytes(4));
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "guide.pdf",
                "application/pdf",
                "%PDF-1.7\nbody".getBytes()
        );

        assertThatThrownBy(() -> storage.storePdf(file))
                .isInstanceOf(BusinessException.class)
                .hasMessage("document file is too large")
                .extracting("code")
                .isEqualTo("DOCUMENT_FILE_TOO_LARGE");
    }

    @Test
    void loadPdfReturnsExistingPdfUnderConfiguredRoot() throws Exception {
        Path pdf = tempDir.resolve("guide.pdf");
        Files.writeString(pdf, "%PDF-1.7\nbody");
        LocalDocumentFileStorage storage = new LocalDocumentFileStorage(tempDir.toString(), DataSize.ofMegabytes(1));

        DocumentPdfFile loaded = storage.loadPdf(pdf.toString());

        assertThat(loaded.filename()).isEqualTo("guide.pdf");
        assertThat(loaded.contentLength()).isEqualTo(Files.size(pdf));
        assertThat(loaded.resource().exists()).isTrue();
    }

    @Test
    void loadPdfRejectsPathOutsideConfiguredRoot() throws Exception {
        Path outside = Files.createTempFile("outside", ".pdf");
        Files.writeString(outside, "%PDF-1.7\nbody");
        LocalDocumentFileStorage storage = new LocalDocumentFileStorage(tempDir.toString(), DataSize.ofMegabytes(1));

        assertThatThrownBy(() -> storage.loadPdf(outside.toString()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("document file path is invalid")
                .extracting("code")
                .isEqualTo("DOCUMENT_FILE_INVALID");
    }

    @Test
    void loadPdfRejectsMissingFile() {
        LocalDocumentFileStorage storage = new LocalDocumentFileStorage(tempDir.toString(), DataSize.ofMegabytes(1));

        assertThatThrownBy(() -> storage.loadPdf(tempDir.resolve("missing.pdf").toString()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("document file is not found")
                .extracting("code")
                .isEqualTo("DOCUMENT_FILE_NOT_FOUND");
    }
}
