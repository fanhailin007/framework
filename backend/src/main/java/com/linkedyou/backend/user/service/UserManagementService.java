package com.linkedyou.backend.user.service;

import com.linkedyou.backend.user.dto.UserChangePasswordRequest;
import com.linkedyou.backend.user.dto.UserCreateRequest;
import com.linkedyou.backend.user.dto.UserResponse;
import com.linkedyou.backend.user.dto.UserUpdateRequest;

import java.util.List;

/**
 * Module Name: User Management Module
 * Main Function: Defines user management business capabilities for the service layer.
 * Parameters: Method parameters defined by the service contract.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
public interface UserManagementService {

    List<UserResponse> list();

    UserResponse getById(Long id);

    UserResponse create(UserCreateRequest request);

    UserResponse update(Long id, UserUpdateRequest request);

    void changePassword(Long id, UserChangePasswordRequest request);

    void delete(Long id);
}
