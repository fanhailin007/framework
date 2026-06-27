package com.linkedyou.backend.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.linkedyou.backend.common.exception.BusinessException;
import com.linkedyou.backend.user.dto.UserChangePasswordRequest;
import com.linkedyou.backend.user.dto.UserCreateRequest;
import com.linkedyou.backend.user.dto.UserResponse;
import com.linkedyou.backend.user.dto.UserUpdateRequest;
import com.linkedyou.backend.user.entity.User;
import com.linkedyou.backend.user.mapper.UserMapper;
import com.linkedyou.backend.user.service.password.PasswordPolicyValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

    private final PasswordPolicyValidator passwordPolicyValidator;

    public UserManagementServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder,
                                     PasswordPolicyValidator passwordPolicyValidator) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.passwordPolicyValidator = passwordPolicyValidator;
    }

    @Override
    public List<UserResponse> list() {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>()
                .isNull(User::getDeletedAt)
                .orderByDesc(User::getCreatedAt);
        return userMapper.selectList(wrapper).stream()
                .map(UserResponse::from)
                .toList();
    }

    @Override
    public UserResponse getById(Long id) {
        return UserResponse.from(loadActiveUser(id));
    }

    @Override
    @Transactional
    public UserResponse create(UserCreateRequest request) {
        assertUsernameAvailable(request.getUserId(), null);
        passwordPolicyValidator.validate(request.getPassword());

        LocalDateTime now = LocalDateTime.now();
        User user = new User();
        user.setUserId(request.getUserId());
        user.setDisplayName(request.getDisplayName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAvatar(request.getAvatar());
        user.setActive(request.getActive() == null || request.getActive());
        user.setFailedLoginCount(0);
        user.setPasswordChangedAt(now);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        userMapper.insert(user);
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = loadActiveUser(id);
        if (StringUtils.hasText(request.getUserId()) && !request.getUserId().equals(user.getUserId())) {
            assertUsernameAvailable(request.getUserId(), id);
            user.setUserId(request.getUserId());
        }
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
        if (StringUtils.hasText(request.getPassword())) {
            passwordPolicyValidator.validate(request.getPassword());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPasswordChangedAt(LocalDateTime.now());
        }
        user.setUpdatedAt(LocalDateTime.now());

        userMapper.updateById(user);
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public void changePassword(Long id, UserChangePasswordRequest request) {
        User user = loadActiveUser(id);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("CURRENT_PASSWORD_INVALID", "current password is invalid");
        }
        passwordPolicyValidator.validate(request.getNewPassword());

        LocalDateTime now = LocalDateTime.now();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordChangedAt(now);
        user.setUpdatedAt(now);
        userMapper.updateById(user);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = loadActiveUser(id);
        LocalDateTime now = LocalDateTime.now();
        user.setDeletedAt(now);
        user.setUpdatedAt(now);
        userMapper.updateById(user);
    }

    private User loadActiveUser(Long id) {
        User user = userMapper.selectById(id);
        if (user == null || user.getDeletedAt() != null) {
            throw new BusinessException("USER_NOT_FOUND", "user not found");
        }
        return user;
    }

    private void assertUsernameAvailable(String username, Long excludeId) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>()
                .eq(User::getUserId, username)
                .isNull(User::getDeletedAt);
        if (excludeId != null) {
            wrapper.ne(User::getId, excludeId);
        }
        Long count = userMapper.selectCount(wrapper);
        if (count != null && count > 0) {
            throw new BusinessException("USERNAME_EXISTS", "username already exists");
        }
    }
}
