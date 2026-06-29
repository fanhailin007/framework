package com.linkedyou.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedyou.backend.auth.dto.LoginRequest;
import com.linkedyou.backend.auth.dto.LoginResponse;
import com.linkedyou.backend.auth.dto.RefreshTokenRequest;
import com.linkedyou.backend.auth.service.AuthService;
import com.linkedyou.backend.common.exception.BusinessException;
import com.linkedyou.backend.common.exception.GlobalExceptionHandler;
import com.linkedyou.backend.user.dto.UserChangePasswordRequest;
import com.linkedyou.backend.user.dto.UserCreateRequest;
import com.linkedyou.backend.user.dto.UserResponse;
import com.linkedyou.backend.user.service.UserManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Module Name: API Controller Module Test
 * Main Function: Verifies User Controller behavior with automated JUnit test cases.
 * Parameters: JUnit fixtures, mocks, and test method inputs declared in this test class.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserManagementService userManagementService;

    @Mock
    private AuthService authService;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(new UserController(userManagementService, authService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void listUsersReturnsApiResponse() throws Exception {
        UserResponse user = userResponse(7L, "admin");
        when(userManagementService.list()).thenReturn(List.of(user));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.message").value("success"))
                .andExpect(jsonPath("$.data[0].id").value(7))
                .andExpect(jsonPath("$.data[0].userId").value("admin"));
    }

    @Test
    void createUserDelegatesToServiceAndWrapsResponse() throws Exception {
        UserResponse created = userResponse(8L, "new-user");
        when(userManagementService.create(any(UserCreateRequest.class))).thenReturn(created);

        UserCreateRequest request = new UserCreateRequest();
        request.setUserId("new-user");
        request.setPassword("Password123!");
        request.setDisplayName("New User");
        request.setRole("Admin");
        request.setEmail("new-user@example.com");

        mockMvc.perform(post("/api/users")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(8))
                .andExpect(jsonPath("$.data.userId").value("new-user"));

        ArgumentCaptor<UserCreateRequest> captor = ArgumentCaptor.forClass(UserCreateRequest.class);
        verify(userManagementService).create(captor.capture());
        assertThat(captor.getValue().getUserId()).isEqualTo("new-user");
        assertThat(captor.getValue().getPassword()).isEqualTo("Password123!");
        assertThat(captor.getValue().getRole()).isEqualTo("Admin");
    }

    @Test
    void createUserRejectsInvalidRequestWithoutCallingService() throws Exception {
        UserCreateRequest request = new UserCreateRequest();
        request.setPassword("short");

        mockMvc.perform(post("/api/users")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message", containsString("userId")));

        verifyNoInteractions(userManagementService, authService);
    }

    @Test
    void loginDelegatesToAuthServiceAndWrapsResponse() throws Exception {
        UserResponse user = userResponse(7L, "admin");
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAccessToken("access-token");
        loginResponse.setRefreshToken("refresh-token");
        loginResponse.setUser(user);
        when(authService.login(any(LoginRequest.class))).thenReturn(loginResponse);

        LoginRequest request = new LoginRequest();
        request.setUserId("admin");
        request.setPassword("Password123!");
        request.setDeviceId("device-1");

        mockMvc.perform(post("/api/users/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("access-token"))
                .andExpect(jsonPath("$.data.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.data.user.userId").value("admin"))
                .andExpect(jsonPath("$.data.user.role").value("Admin"));

        ArgumentCaptor<LoginRequest> captor = ArgumentCaptor.forClass(LoginRequest.class);
        verify(authService).login(captor.capture());
        assertThat(captor.getValue().getUserId()).isEqualTo("admin");
        assertThat(captor.getValue().getPassword()).isEqualTo("Password123!");
    }

    @Test
    void loginRejectsInvalidRequestWithoutCallingService() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUserId("admin");

        mockMvc.perform(post("/api/users/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message", containsString("password")));

        verifyNoInteractions(userManagementService, authService);
    }

    @Test
    void logoutDelegatesToAuthServiceAndReturnsSuccessResponse() throws Exception {
        mockMvc.perform(post("/api/users/logout")
                        .header("Authorization", "Bearer access-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(authService).logout("Bearer access-token");
    }

    @Test
    void refreshTokenDelegatesToAuthServiceAndWrapsResponse() throws Exception {
        LoginResponse response = new LoginResponse();
        response.setAccessToken("new-access-token");
        response.setRefreshToken("refresh-token");
        response.setUser(userResponse(7L, "admin"));
        when(authService.refreshToken(any(RefreshTokenRequest.class))).thenReturn(response);

        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("refresh-token");

        mockMvc.perform(post("/api/users/refresh-token")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data.accessToken").value("new-access-token"))
                .andExpect(jsonPath("$.data.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.data.user.userId").value("admin"));

        ArgumentCaptor<RefreshTokenRequest> captor = ArgumentCaptor.forClass(RefreshTokenRequest.class);
        verify(authService).refreshToken(captor.capture());
        assertThat(captor.getValue().getRefreshToken()).isEqualTo("refresh-token");
    }

    @Test
    void refreshTokenRejectsInvalidRequestWithoutCallingService() throws Exception {
        RefreshTokenRequest request = new RefreshTokenRequest();

        mockMvc.perform(post("/api/users/refresh-token")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message", containsString("refreshToken")));

        verifyNoInteractions(userManagementService, authService);
    }

    @Test
    void getByIdMapsBusinessExceptionToApiResponse() throws Exception {
        when(userManagementService.getById(99L))
                .thenThrow(new BusinessException("USER_NOT_FOUND", "user not found"));

        mockMvc.perform(get("/api/users/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("USER_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("user not found"));
    }

    @Test
    void deleteUserReturnsSuccessResponse() throws Exception {
        mockMvc.perform(delete("/api/users/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data").doesNotExist());

        verify(userManagementService).delete(7L);
    }

    @Test
    void changePasswordDelegatesToServiceAndReturnsSuccessResponse() throws Exception {
        UserChangePasswordRequest request = new UserChangePasswordRequest();
        request.setCurrentPassword("OldPass123!");
        request.setNewPassword("NewPass456!");

        mockMvc.perform(put("/api/users/7/password")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data").doesNotExist());

        ArgumentCaptor<UserChangePasswordRequest> captor =
                ArgumentCaptor.forClass(UserChangePasswordRequest.class);
        verify(userManagementService).changePassword(eq(7L), captor.capture());
        assertThat(captor.getValue().getCurrentPassword()).isEqualTo("OldPass123!");
        assertThat(captor.getValue().getNewPassword()).isEqualTo("NewPass456!");
    }

    @Test
    void changePasswordRejectsInvalidRequestWithoutCallingService() throws Exception {
        UserChangePasswordRequest request = new UserChangePasswordRequest();
        request.setCurrentPassword("OldPass123!");

        mockMvc.perform(put("/api/users/7/password")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message", containsString("newPassword")));

        verifyNoInteractions(userManagementService, authService);
    }

    private static UserResponse userResponse(Long id, String username) {
        UserResponse response = new UserResponse();
        response.setId(id);
        response.setUserId(username);
        response.setDisplayName(username);
        response.setRole("Admin");
        response.setActive(true);
        return response;
    }

}
