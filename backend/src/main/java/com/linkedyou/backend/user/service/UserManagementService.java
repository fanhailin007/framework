package com.linkedyou.backend.user.service;

import com.linkedyou.backend.user.dto.UserChangePasswordRequest;
import com.linkedyou.backend.user.dto.UserCreateRequest;
import com.linkedyou.backend.user.dto.UserResponse;
import com.linkedyou.backend.user.dto.UserUpdateRequest;

import java.util.List;

public interface UserManagementService {

    List<UserResponse> list();

    UserResponse getById(Long id);

    UserResponse create(UserCreateRequest request);

    UserResponse update(Long id, UserUpdateRequest request);

    void changePassword(Long id, UserChangePasswordRequest request);

    void delete(Long id);
}
