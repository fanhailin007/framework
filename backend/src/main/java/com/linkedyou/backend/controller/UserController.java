package com.linkedyou.backend.controller;

import com.linkedyou.backend.auth.dto.LoginRequest;
import com.linkedyou.backend.auth.dto.LoginResponse;
import com.linkedyou.backend.auth.dto.RefreshTokenRequest;
import com.linkedyou.backend.auth.service.AuthService;
import com.linkedyou.backend.common.api.ApiResponse;
import com.linkedyou.backend.user.dto.UserChangePasswordRequest;
import com.linkedyou.backend.user.dto.UserCreateRequest;
import com.linkedyou.backend.user.dto.UserResponse;
import com.linkedyou.backend.user.dto.UserUpdateRequest;
import com.linkedyou.backend.user.service.UserManagementService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.validation.annotation.Validated;
import org.springframework.util.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Module Name: API Controller Module
 * Main Function: Exposes REST API endpoints and delegates user requests to the service layer.
 * Parameters: HTTP path variables, headers, query values, and request body DTOs handled by endpoint methods.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Validated
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserManagementService userManagementService;

    private final AuthService authService;

    public UserController(UserManagementService userManagementService, AuthService authService) {
        this.userManagementService = userManagementService;
        this.authService = authService;
    }

    @GetMapping({"", "/getList"})
    public ApiResponse<List<UserResponse>> list() {
        return ApiResponse.success(userManagementService.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable @PositiveOrZero Long id) {
        return ApiResponse.success(userManagementService.getById(id));
    }

    @PostMapping
    public ApiResponse<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        return ApiResponse.success(userManagementService.create(request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                            HttpServletRequest servletRequest) {
        fillClientInfo(request, servletRequest);
        return ApiResponse.success(authService.login(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false)
                                    String authorizationHeader) {
        authService.logout(authorizationHeader);
        return ApiResponse.success();
    }

    @PostMapping("/refresh-token")
    public ApiResponse<LoginResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success(authService.refreshToken(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponse> update(@PathVariable @PositiveOrZero Long id,
                                            @Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.success(userManagementService.update(id, request));
    }

    @PutMapping("/{id}/password")
    public ApiResponse<Void> changePassword(@PathVariable @PositiveOrZero Long id,
                                            @Valid @RequestBody UserChangePasswordRequest request) {
        userManagementService.changePassword(id, request);
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable @PositiveOrZero Long id) {
        userManagementService.delete(id);
        return ApiResponse.success();
    }

    private void fillClientInfo(LoginRequest request, HttpServletRequest servletRequest) {
        if (!StringUtils.hasText(request.getIpAddress())) {
            request.setIpAddress(resolveIpAddress(servletRequest));
        }
        if (!StringUtils.hasText(request.getUserAgent())) {
            request.setUserAgent(servletRequest.getHeader("User-Agent"));
        }
    }

    private String resolveIpAddress(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            return forwardedFor.split(",", 2)[0].trim();
        }
        return request.getRemoteAddr();
    }
}
