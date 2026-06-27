package com.linkedyou.backend.document.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class DocumentPublishRequest {

    @Positive
    private Long reviewedBy;

    @Positive
    private Long updatedByUserId;
}
