package com.linkedyou.backend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateRequest {

    @NotBlank
    @Size(max = 64)
    private String userId;

    @NotBlank
    @Size(min = 8, max = 100)
    private String password;

    @Size(max = 100)
    private String displayName;

    @Email
    @Size(max = 191)
    private String email;

    @Size(max = 32)
    private String phone;

    @Size(max = 255)
    private String avatar;

    private Boolean active;
}
