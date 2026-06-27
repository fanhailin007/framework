package com.linkedyou.backend.document.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class DocumentUpdateRequest {

    @Positive
    private Long documentId;

    @Size(max = 255)
    private String title;

    @Size(max = 255)
    private String slug;

    @Size(max = 512)
    private String summary;

    private String content;

    @Positive
    private Long ownerUserId;

    @Size(max = 100)
    private String category;

    private List<@Size(max = 100) String> tags;

    @Size(max = 500)
    private String filePath;

    @Positive
    private Long fileSize;

    @Positive
    private Long updatedByUserId;
}
