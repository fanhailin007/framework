package com.linkedyou.backend.controller;

import com.linkedyou.backend.common.api.ApiResponse;
import com.linkedyou.backend.user.dto.UserChangePasswordRequest;
import com.linkedyou.backend.user.dto.UserCreateRequest;
import com.linkedyou.backend.user.dto.UserResponse;
import com.linkedyou.backend.user.dto.UserUpdateRequest;
import com.linkedyou.backend.user.service.UserManagementService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserManagementService userManagementService;

    public UserController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> list() {
        return ApiResponse.success(userManagementService.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable @Positive Long id) {
        return ApiResponse.success(userManagementService.getById(id));
    }

    @PostMapping
    public ApiResponse<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        return ApiResponse.success(userManagementService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponse> update(@PathVariable @Positive Long id,
                                            @Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.success(userManagementService.update(id, request));
    }

    @PutMapping("/{id}/password")
    public ApiResponse<Void> changePassword(@PathVariable @Positive Long id,
                                            @Valid @RequestBody UserChangePasswordRequest request) {
        userManagementService.changePassword(id, request);
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable @Positive Long id) {
        userManagementService.delete(id);
        return ApiResponse.success();
    }
}
