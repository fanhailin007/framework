package com.linkedyou.backend.auth.service;

import com.linkedyou.backend.auth.dto.LoginRequest;
import com.linkedyou.backend.auth.dto.LoginResponse;
import com.linkedyou.backend.auth.dto.RefreshTokenRequest;
import com.linkedyou.backend.auth.entity.UserLoginLog;
import com.linkedyou.backend.auth.entity.UserSession;
import com.linkedyou.backend.auth.mapper.UserLoginLogMapper;
import com.linkedyou.backend.auth.mapper.UserSessionMapper;
import com.linkedyou.backend.common.exception.BusinessException;
import com.linkedyou.backend.user.entity.User;
import com.linkedyou.backend.user.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Module Name: Authentication Module Test
 * Main Function: Verifies Auth Service behavior with automated JUnit test cases.
 * Parameters: JUnit fixtures, mocks, and test method inputs declared in this test class.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserSessionMapper userSessionMapper;

    @Mock
    private UserLoginLogMapper userLoginLogMapper;

    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        AuthProperties properties = new AuthProperties();
        properties.setAccessTokenTtl(Duration.ofMinutes(30));
        properties.setRefreshTokenTtl(Duration.ofDays(30));
        properties.setMaxFailedAttempts(3);
        properties.setLockDuration(Duration.ofMinutes(15));
        authService = new AuthServiceImpl(userMapper, userSessionMapper, userLoginLogMapper, passwordEncoder,
                new FixedAuthTokenGenerator(), properties);
    }

    @Test
    void loginCreatesSessionLogAndResetsFailureStateWhenPasswordMatches() {
        User user = activeUser();
        user.setFailedLoginCount(2);
        user.setPassword(passwordEncoder.encode("Password123!"));
        when(userMapper.selectOne(any())).thenReturn(user);
        when(userMapper.updateById(any(User.class))).thenReturn(1);
        when(userSessionMapper.insert(any(UserSession.class))).thenReturn(1);
        when(userLoginLogMapper.insert(any(UserLoginLog.class))).thenReturn(1);

        LoginResponse response = authService.login(loginRequest("admin", "Password123!", "device-1"));

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(response.getUser().getUserId()).isEqualTo("admin");
        assertThat(response.getUser().getRole()).isEqualTo("Admin");
        assertThat(response.getExpiresAt()).isAfter(response.getIssuedAt());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userMapper).updateById(userCaptor.capture());
        User updated = userCaptor.getValue();
        assertThat(updated.getFailedLoginCount()).isZero();
        assertThat(updated.getLockedUntil()).isNull();
        assertThat(updated.getLastLoginAt()).isNotNull();
        assertThat(updated.getLastLoginIp()).isEqualTo("127.0.0.1");

        ArgumentCaptor<UserSession> sessionCaptor = ArgumentCaptor.forClass(UserSession.class);
        verify(userSessionMapper).insert(sessionCaptor.capture());
        UserSession session = sessionCaptor.getValue();
        assertThat(session.getUserId()).isEqualTo(7L);
        assertThat(session.getAccessTokenJti()).isEqualTo("access-token");
        assertThat(session.getRefreshTokenHash()).isNotBlank();
        assertThat(session.getRefreshTokenHash()).isNotEqualTo("refresh-token");
        assertThat(session.getDeviceId()).isEqualTo("device-1");

        ArgumentCaptor<UserLoginLog> logCaptor = ArgumentCaptor.forClass(UserLoginLog.class);
        verify(userLoginLogMapper).insert(logCaptor.capture());
        assertThat(logCaptor.getValue().getLoginResult()).isEqualTo("success");
        assertThat(logCaptor.getValue().getUsername()).isEqualTo("admin");
    }

    @Test
    void loginWritesFailedLogAndRejectsMissingUser() {
        when(userMapper.selectOne(any())).thenReturn(null);
        when(userLoginLogMapper.insert(any(UserLoginLog.class))).thenReturn(1);

        assertThatThrownBy(() -> authService.login(loginRequest("missing", "Password123!", null)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("invalid user id or password")
                .extracting("code")
                .isEqualTo("LOGIN_FAILED");

        verify(userMapper, never()).updateById(any(User.class));
        verify(userSessionMapper, never()).insert(any(UserSession.class));
        ArgumentCaptor<UserLoginLog> logCaptor = ArgumentCaptor.forClass(UserLoginLog.class);
        verify(userLoginLogMapper).insert(logCaptor.capture());
        assertThat(logCaptor.getValue().getLoginResult()).isEqualTo("failed");
        assertThat(logCaptor.getValue().getFailureReason()).isEqualTo("user not found");
    }

    @Test
    void loginIncrementsFailedCountAndLocksUserWhenPasswordIsInvalid() {
        User user = activeUser();
        user.setFailedLoginCount(2);
        user.setPassword(passwordEncoder.encode("Password123!"));
        when(userMapper.selectOne(any())).thenReturn(user);
        when(userMapper.updateById(any(User.class))).thenReturn(1);
        when(userLoginLogMapper.insert(any(UserLoginLog.class))).thenReturn(1);

        assertThatThrownBy(() -> authService.login(loginRequest("admin", "WrongPass123!", null)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("invalid user id or password")
                .extracting("code")
                .isEqualTo("LOGIN_FAILED");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userMapper).updateById(userCaptor.capture());
        assertThat(userCaptor.getValue().getFailedLoginCount()).isEqualTo(3);
        assertThat(userCaptor.getValue().getLockedUntil()).isNotNull();
        verify(userSessionMapper, never()).insert(any(UserSession.class));

        ArgumentCaptor<UserLoginLog> logCaptor = ArgumentCaptor.forClass(UserLoginLog.class);
        verify(userLoginLogMapper).insert(logCaptor.capture());
        assertThat(logCaptor.getValue().getLoginResult()).isEqualTo("failed");
        assertThat(logCaptor.getValue().getFailureReason()).isEqualTo("invalid password");
    }

    @Test
    void loginRejectsDisabledUserAndWritesDisabledLog() {
        User user = activeUser();
        user.setActive(false);
        user.setPassword(passwordEncoder.encode("Password123!"));
        when(userMapper.selectOne(any())).thenReturn(user);
        when(userLoginLogMapper.insert(any(UserLoginLog.class))).thenReturn(1);

        assertThatThrownBy(() -> authService.login(loginRequest("admin", "Password123!", null)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("account is disabled")
                .extracting("code")
                .isEqualTo("ACCOUNT_DISABLED");

        verify(userMapper, never()).updateById(any(User.class));
        verify(userSessionMapper, never()).insert(any(UserSession.class));
        ArgumentCaptor<UserLoginLog> logCaptor = ArgumentCaptor.forClass(UserLoginLog.class);
        verify(userLoginLogMapper).insert(logCaptor.capture());
        assertThat(logCaptor.getValue().getLoginResult()).isEqualTo("disabled");
    }

    @Test
    void loginRejectsLockedUserAndWritesLockedLog() {
        User user = activeUser();
        user.setLockedUntil(LocalDateTime.now().plusMinutes(5));
        user.setPassword(passwordEncoder.encode("Password123!"));
        when(userMapper.selectOne(any())).thenReturn(user);
        when(userLoginLogMapper.insert(any(UserLoginLog.class))).thenReturn(1);

        assertThatThrownBy(() -> authService.login(loginRequest("admin", "Password123!", null)))
                .isInstanceOf(BusinessException.class)
                .hasMessage("account is locked")
                .extracting("code")
                .isEqualTo("ACCOUNT_LOCKED");

        verify(userMapper, never()).updateById(any(User.class));
        verify(userSessionMapper, never()).insert(any(UserSession.class));
        ArgumentCaptor<UserLoginLog> logCaptor = ArgumentCaptor.forClass(UserLoginLog.class);
        verify(userLoginLogMapper).insert(logCaptor.capture());
        assertThat(logCaptor.getValue().getLoginResult()).isEqualTo("locked");
    }

    @Test
    void logoutRevokesActiveSession() {
        UserSession session = activeSession();
        when(userSessionMapper.selectOne(any())).thenReturn(session);
        when(userSessionMapper.updateById(any(UserSession.class))).thenReturn(1);

        authService.logout("Bearer access-token");

        ArgumentCaptor<UserSession> captor = ArgumentCaptor.forClass(UserSession.class);
        verify(userSessionMapper).updateById(captor.capture());
        UserSession revoked = captor.getValue();
        assertThat(revoked.getRevokedAt()).isNotNull();
        assertThat(revoked.getRevokedReason()).isEqualTo("logout");
        assertThat(revoked.getUpdatedAt()).isNotNull();
    }

    @Test
    void logoutRejectsMissingBearerToken() {
        assertThatThrownBy(() -> authService.logout(null))
                .isInstanceOf(BusinessException.class)
                .hasMessage("token is invalid")
                .extracting("code")
                .isEqualTo("TOKEN_INVALID");

        verify(userSessionMapper, never()).selectOne(any());
        verify(userSessionMapper, never()).updateById(any(UserSession.class));
    }

    @Test
    void logoutRejectsExpiredSession() {
        UserSession expired = activeSession();
        expired.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        when(userSessionMapper.selectOne(any())).thenReturn(expired);

        assertThatThrownBy(() -> authService.logout("Bearer access-token"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("token is invalid")
                .extracting("code")
                .isEqualTo("TOKEN_INVALID");

        verify(userSessionMapper, never()).updateById(any(UserSession.class));
    }

    @Test
    void refreshTokenRefreshesAccessTokenWithoutRotatingRefreshToken() {
        UserSession session = activeSession();
        session.setAccessTokenJti("old-access-token");
        session.setRefreshTokenHash("stored-refresh-token-hash");
        User user = activeUser();
        when(userSessionMapper.selectOne(any())).thenReturn(session);
        when(userMapper.selectOne(any())).thenReturn(user);
        when(userSessionMapper.updateById(any(UserSession.class))).thenReturn(1);

        LoginResponse response = authService.refreshToken(refreshTokenRequest("refresh-token"));

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(response.getRefreshExpiresAt()).isEqualTo(session.getExpiresAt());
        assertThat(response.getUser().getUserId()).isEqualTo("admin");

        ArgumentCaptor<UserSession> captor = ArgumentCaptor.forClass(UserSession.class);
        verify(userSessionMapper).updateById(captor.capture());
        UserSession updated = captor.getValue();
        assertThat(updated.getAccessTokenJti()).isEqualTo("access-token");
        assertThat(updated.getRefreshTokenHash()).isEqualTo("stored-refresh-token-hash");
        assertThat(updated.getExpiresAt()).isEqualTo(session.getExpiresAt());
        assertThat(updated.getIssuedAt()).isNotNull();
        assertThat(updated.getUpdatedAt()).isNotNull();
    }

    @Test
    void refreshTokenRejectsExpiredSession() {
        UserSession expired = activeSession();
        expired.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        when(userSessionMapper.selectOne(any())).thenReturn(expired);

        assertThatThrownBy(() -> authService.refreshToken(refreshTokenRequest("refresh-token")))
                .isInstanceOf(BusinessException.class)
                .hasMessage("token is invalid")
                .extracting("code")
                .isEqualTo("TOKEN_INVALID");

        verify(userMapper, never()).selectOne(any());
        verify(userSessionMapper, never()).updateById(any(UserSession.class));
    }

    private static LoginRequest loginRequest(String userId, String password, String deviceId) {
        LoginRequest request = new LoginRequest();
        request.setUserId(userId);
        request.setPassword(password);
        request.setDeviceId(deviceId);
        request.setDeviceName("MacBook");
        request.setIpAddress("127.0.0.1");
        request.setUserAgent("JUnit");
        return request;
    }

    private static RefreshTokenRequest refreshTokenRequest(String refreshToken) {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken(refreshToken);
        return request;
    }

    private static User activeUser() {
        User user = new User();
        user.setId(7L);
        user.setUserId("admin");
        user.setDisplayName("Administrator");
        user.setRole("Admin");
        user.setEmail("admin@example.com");
        user.setActive(true);
        user.setFailedLoginCount(0);
        return user;
    }

    private static UserSession activeSession() {
        UserSession session = new UserSession();
        session.setId(11L);
        session.setUserId(7L);
        session.setAccessTokenJti("access-token");
        session.setExpiresAt(LocalDateTime.now().plusDays(1));
        return session;
    }

    /**
     * Module Name: Authentication Module Test
     * Main Function: Verifies Fixed Auth Token Generator behavior with automated JUnit test cases.
     * Parameters: JUnit fixtures, mocks, and test method inputs declared in this test class.
     * Development Date: 2026-06-28
     * Developer: Codex
     * Update History:
     * 2026-06-28 - Codex - Added standardized English class header comment.
     * Updater: Codex
     */
    private static class FixedAuthTokenGenerator implements AuthTokenGenerator {

        private final AtomicInteger calls = new AtomicInteger();

        @Override
        public String generateToken() {
            return calls.getAndIncrement() == 0 ? "access-token" : "refresh-token";
        }
    }
}
