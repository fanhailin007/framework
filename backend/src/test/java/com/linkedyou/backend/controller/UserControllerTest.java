package com.linkedyou.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserManagementService userManagementService;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(new UserController(userManagementService))
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

        verifyNoInteractions(userManagementService);
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

        verifyNoInteractions(userManagementService);
    }

    private static UserResponse userResponse(Long id, String username) {
        UserResponse response = new UserResponse();
        response.setId(id);
        response.setUserId(username);
        response.setDisplayName(username);
        response.setActive(true);
        return response;
    }
}
