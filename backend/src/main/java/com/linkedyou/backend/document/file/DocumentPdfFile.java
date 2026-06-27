package com.linkedyou.backend.document.file;

import org.springframework.core.io.Resource;

public record DocumentPdfFile(Resource resource, String filename, Long contentLength) {
}
