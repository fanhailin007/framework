package com.linkedyou.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserChangePasswordRequest {

    @NotBlank
    @Size(max = 100)
    private String currentPassword;

    @NotBlank
    @Size(max = 100)
    private String newPassword;
}
