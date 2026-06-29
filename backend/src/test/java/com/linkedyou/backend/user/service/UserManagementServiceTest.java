package com.linkedyou.backend.user.service;

import com.linkedyou.backend.user.dto.UserCreateRequest;
import com.linkedyou.backend.user.dto.UserChangePasswordRequest;
import com.linkedyou.backend.user.dto.UserUpdateRequest;
import com.linkedyou.backend.common.exception.BusinessException;
import com.linkedyou.backend.user.service.password.PasswordPolicyProperties;
import com.linkedyou.backend.user.service.password.PasswordPolicyValidator;
import com.linkedyou.backend.user.entity.User;
import com.linkedyou.backend.user.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Module Name: User Management Module Test
 * Main Function: Verifies User Management Service behavior with automated JUnit test cases.
 * Parameters: JUnit fixtures, mocks, and test method inputs declared in this test class.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@ExtendWith(MockitoExtension.class)
class UserManagementServiceTest {

    @Mock
    private UserMapper userMapper;

    private UserManagementService service;

    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        PasswordPolicyProperties passwordPolicyProperties = new PasswordPolicyProperties();
        passwordPolicyProperties.setEnabled(true);
        passwordPolicyProperties.setMinLength(8);
        passwordPolicyProperties.setMaxLength(100);
        passwordPolicyProperties.setRequireUppercase(true);
        passwordPolicyProperties.setRequireLowercase(true);
        passwordPolicyProperties.setRequireDigit(true);
        passwordPolicyProperties.setRequireSpecial(true);
        service = new UserManagementServiceImpl(userMapper, passwordEncoder,
                new PasswordPolicyValidator(passwordPolicyProperties));
    }

    @Test
    void createUserPersistsActiveUserWithHashedPassword() {
        when(userMapper.selectCount(any())).thenReturn(0L);
        when(userMapper.insert(any(User.class))).thenReturn(1);

        UserCreateRequest request = new UserCreateRequest();
        request.setUserId("admin");
        request.setPassword("Password123!");
        request.setDisplayName("Administrator");
        request.setRole("Admin");
        request.setEmail("admin@example.com");
        request.setPhone("13800000000");

        var response = service.create(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userMapper).insert(captor.capture());
        User saved = captor.getValue();
        assertThat(saved.getUserId()).isEqualTo("admin");
        assertThat(saved.getDisplayName()).isEqualTo("Administrator");
        assertThat(saved.getRole()).isEqualTo("Admin");
        assertThat(saved.getActive()).isTrue();
        assertThat(saved.getPassword()).isNotEqualTo("Password123!");
        assertThat(new BCryptPasswordEncoder().matches("Password123!", saved.getPassword())).isTrue();
        assertThat(response.getUserId()).isEqualTo("admin");
        assertThat(response.getRole()).isEqualTo("Admin");
    }

    @Test
    void createUserRejectsExistingUsername() {
        when(userMapper.selectCount(any())).thenReturn(1L);

        UserCreateRequest request = new UserCreateRequest();
        request.setUserId("admin");
        request.setPassword("Password123!");

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("username already exists")
                .extracting("code")
                .isEqualTo("USERNAME_EXISTS");

        verify(userMapper, never()).insert(any(User.class));
    }

    @Test
    void getByIdRejectsMissingUser() {
        when(userMapper.selectById(99L)).thenReturn(null);

        assertThatThrownBy(() -> service.getById(99L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("user not found")
                .extracting("code")
                .isEqualTo("USER_NOT_FOUND");
    }

    @Test
    void getByIdRejectsSoftDeletedUser() {
        User deleted = existingUser();
        deleted.setDeletedAt(LocalDateTime.now());
        when(userMapper.selectById(7L)).thenReturn(deleted);

        assertThatThrownBy(() -> service.getById(7L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("user not found")
                .extracting("code")
                .isEqualTo("USER_NOT_FOUND");
    }

    @Test
    void updateUserChangesOnlyProvidedFields() {
        User existing = existingUser();
        when(userMapper.selectById(7L)).thenReturn(existing);
        when(userMapper.updateById(any(User.class))).thenReturn(1);

        UserUpdateRequest request = new UserUpdateRequest();
        request.setDisplayName("New Name");
        request.setRole("Editor");
        request.setEmail("new@example.com");

        var response = service.update(7L, request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userMapper).updateById(captor.capture());
        User updated = captor.getValue();
        assertThat(updated.getUserId()).isEqualTo("admin");
        assertThat(updated.getDisplayName()).isEqualTo("New Name");
        assertThat(updated.getRole()).isEqualTo("Editor");
        assertThat(updated.getEmail()).isEqualTo("new@example.com");
        assertThat(updated.getPassword()).isEqualTo("existing-hash");
        assertThat(response.getDisplayName()).isEqualTo("New Name");
        assertThat(response.getRole()).isEqualTo("Editor");
    }

    @Test
    void updateUserRejectsUsernameUsedByAnotherActiveUser() {
        User existing = existingUser();
        when(userMapper.selectById(7L)).thenReturn(existing);
        when(userMapper.selectCount(any())).thenReturn(1L);

        UserUpdateRequest request = new UserUpdateRequest();
        request.setUserId("other");

        assertThatThrownBy(() -> service.update(7L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("username already exists")
                .extracting("code")
                .isEqualTo("USERNAME_EXISTS");

        verify(userMapper, never()).updateById(any(User.class));
    }

    @Test
    void deleteUserSoftDeletesExistingUser() {
        User existing = existingUser();
        when(userMapper.selectById(7L)).thenReturn(existing);
        when(userMapper.updateById(any(User.class))).thenReturn(1);

        service.delete(7L);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userMapper).updateById(captor.capture());
        assertThat(captor.getValue().getDeletedAt()).isNotNull();
    }

    @Test
    void changePasswordUpdatesHashWhenCurrentPasswordMatchesAndPolicyPasses() {
        User existing = existingUser();
        existing.setPassword(passwordEncoder.encode("OldPass123!"));
        when(userMapper.selectById(7L)).thenReturn(existing);
        when(userMapper.updateById(any(User.class))).thenReturn(1);

        UserChangePasswordRequest request = new UserChangePasswordRequest();
        request.setCurrentPassword("OldPass123!");
        request.setNewPassword("NewPass456!");

        service.changePassword(7L, request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userMapper).updateById(captor.capture());
        User updated = captor.getValue();
        assertThat(passwordEncoder.matches("NewPass456!", updated.getPassword())).isTrue();
        assertThat(updated.getPasswordChangedAt()).isNotNull();
        assertThat(updated.getUpdatedAt()).isNotNull();
    }

    @Test
    void changePasswordRejectsInvalidCurrentPassword() {
        User existing = existingUser();
        existing.setPassword(passwordEncoder.encode("OldPass123!"));
        when(userMapper.selectById(7L)).thenReturn(existing);

        UserChangePasswordRequest request = new UserChangePasswordRequest();
        request.setCurrentPassword("WrongPass123!");
        request.setNewPassword("NewPass456!");

        assertThatThrownBy(() -> service.changePassword(7L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("current password is invalid")
                .extracting("code")
                .isEqualTo("CURRENT_PASSWORD_INVALID");

        verify(userMapper, never()).updateById(any(User.class));
    }

    @Test
    void changePasswordRejectsNewPasswordThatViolatesPolicy() {
        User existing = existingUser();
        existing.setPassword(passwordEncoder.encode("OldPass123!"));
        when(userMapper.selectById(7L)).thenReturn(existing);

        UserChangePasswordRequest request = new UserChangePasswordRequest();
        request.setCurrentPassword("OldPass123!");
        request.setNewPassword("weakpass");

        assertThatThrownBy(() -> service.changePassword(7L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("password does not match policy")
                .extracting("code")
                .isEqualTo("PASSWORD_POLICY_VIOLATION");

        verify(userMapper, never()).updateById(any(User.class));
    }

    private static User existingUser() {
        User user = new User();
        user.setId(7L);
        user.setUserId("admin");
        user.setDisplayName("Administrator");
        user.setRole("Admin");
        user.setEmail("admin@example.com");
        user.setPhone("13800000000");
        user.setPassword("existing-hash");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now().minusDays(1));
        user.setUpdatedAt(LocalDateTime.now().minusDays(1));
        return user;
    }
}
