package com.linkedyou.backend.auth.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.linkedyou.backend.auth.dto.LoginRequest;
import com.linkedyou.backend.auth.dto.LoginResponse;
import com.linkedyou.backend.auth.dto.RefreshTokenRequest;
import com.linkedyou.backend.auth.entity.UserLoginLog;
import com.linkedyou.backend.auth.entity.UserSession;
import com.linkedyou.backend.auth.mapper.UserLoginLogMapper;
import com.linkedyou.backend.auth.mapper.UserSessionMapper;
import com.linkedyou.backend.common.exception.BusinessException;
import com.linkedyou.backend.user.dto.UserResponse;
import com.linkedyou.backend.user.entity.User;
import com.linkedyou.backend.user.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * Module Name: Authentication Module
 * Main Function: Implements auth business rules, transaction boundaries, and persistence orchestration.
 * Parameters: Method parameters defined by the service contract.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static final String BEARER_PREFIX = "Bearer ";

    private final UserMapper userMapper;

    private final UserSessionMapper userSessionMapper;

    private final UserLoginLogMapper userLoginLogMapper;

    private final PasswordEncoder passwordEncoder;

    private final AuthTokenGenerator tokenGenerator;

    private final AuthProperties properties;

    public AuthServiceImpl(UserMapper userMapper, UserSessionMapper userSessionMapper,
                           UserLoginLogMapper userLoginLogMapper, PasswordEncoder passwordEncoder,
                           AuthTokenGenerator tokenGenerator,
                           AuthProperties properties) {
        this.userMapper = userMapper;
        this.userSessionMapper = userSessionMapper;
        this.userLoginLogMapper = userLoginLogMapper;
        this.passwordEncoder = passwordEncoder;
        this.tokenGenerator = tokenGenerator;
        this.properties = properties;
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        LocalDateTime now = LocalDateTime.now();
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUserId, request.getUserId())
                .isNull(User::getDeletedAt));

        if (user == null) {
            writeLog(null, request, "failed", "user not found", now);
            throw new BusinessException("LOGIN_FAILED", "invalid user id or password");
        }
        if (Boolean.FALSE.equals(user.getActive())) {
            writeLog(user, request, "disabled", "account disabled", now);
            throw new BusinessException("ACCOUNT_DISABLED", "account is disabled");
        }
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(now)) {
            writeLog(user, request, "locked", "account locked", now);
            throw new BusinessException("ACCOUNT_LOCKED", "account is locked");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            handleInvalidPassword(user, request, now);
            throw new BusinessException("LOGIN_FAILED", "invalid user id or password");
        }

        LoginTokens tokens = createSession(user, request, now);
        user.setFailedLoginCount(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(now);
        user.setLastLoginIp(request.getIpAddress());
        user.setUpdatedAt(now);
        userMapper.updateById(user);
        writeLog(user, request, "success", null, now);

        LoginResponse response = new LoginResponse();
        response.setAccessToken(tokens.accessToken());
        response.setRefreshToken(tokens.refreshToken());
        response.setIssuedAt(now);
        response.setExpiresAt(tokens.expiresAt());
        response.setRefreshExpiresAt(tokens.refreshExpiresAt());
        response.setUser(UserResponse.from(user));
        return response;
    }

    @Override
    @Transactional
    public void logout(String authorizationHeader) {
        String accessToken = resolveBearerToken(authorizationHeader);
        LocalDateTime now = LocalDateTime.now();
        UserSession session = userSessionMapper.selectOne(new LambdaQueryWrapper<UserSession>()
                .eq(UserSession::getAccessTokenJti, accessToken)
                .isNull(UserSession::getRevokedAt)
                .isNull(UserSession::getDeletedAt));
        if (session == null || session.getExpiresAt() == null || !session.getExpiresAt().isAfter(now)) {
            throw new BusinessException("TOKEN_INVALID", "token is invalid");
        }

        session.setRevokedAt(now);
        session.setRevokedReason("logout");
        session.setUpdatedAt(now);
        userSessionMapper.updateById(session);
    }

    @Override
    @Transactional
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        if (request == null || !StringUtils.hasText(request.getRefreshToken())) {
            throw new BusinessException("TOKEN_INVALID", "token is invalid");
        }

        LocalDateTime now = LocalDateTime.now();
        UserSession session = userSessionMapper.selectOne(new LambdaQueryWrapper<UserSession>()
                .eq(UserSession::getRefreshTokenHash, hashToken(request.getRefreshToken()))
                .isNull(UserSession::getRevokedAt)
                .isNull(UserSession::getDeletedAt));
        if (session == null || session.getExpiresAt() == null || !session.getExpiresAt().isAfter(now)) {
            throw new BusinessException("TOKEN_INVALID", "token is invalid");
        }

        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getId, session.getUserId())
                .isNull(User::getDeletedAt));
        if (user == null) {
            throw new BusinessException("USER_NOT_FOUND", "user not found");
        }
        if (Boolean.FALSE.equals(user.getActive())) {
            throw new BusinessException("ACCOUNT_DISABLED", "account is disabled");
        }

        String accessToken = tokenGenerator.generateToken();
        LocalDateTime accessExpiresAt = now.plus(properties.getAccessTokenTtl());
        session.setAccessTokenJti(accessToken);
        session.setIssuedAt(now);
        session.setUpdatedByUserId(user.getId());
        session.setUpdatedAt(now);
        userSessionMapper.updateById(session);

        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(request.getRefreshToken());
        response.setIssuedAt(now);
        response.setExpiresAt(accessExpiresAt);
        response.setRefreshExpiresAt(session.getExpiresAt());
        response.setUser(UserResponse.from(user));
        return response;
    }

    private void handleInvalidPassword(User user, LoginRequest request, LocalDateTime now) {
        int failedCount = user.getFailedLoginCount() == null ? 1 : user.getFailedLoginCount() + 1;
        user.setFailedLoginCount(failedCount);
        if (failedCount >= properties.getMaxFailedAttempts()) {
            user.setLockedUntil(now.plus(properties.getLockDuration()));
        }
        user.setUpdatedAt(now);
        userMapper.updateById(user);
        writeLog(user, request, "failed", "invalid password", now);
    }

    private String resolveBearerToken(String authorizationHeader) {
        if (!StringUtils.hasText(authorizationHeader) || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            throw new BusinessException("TOKEN_INVALID", "token is invalid");
        }
        String token = authorizationHeader.substring(BEARER_PREFIX.length()).trim();
        if (!StringUtils.hasText(token)) {
            throw new BusinessException("TOKEN_INVALID", "token is invalid");
        }
        return token;
    }

    private LoginTokens createSession(User user, LoginRequest request, LocalDateTime now) {
        String accessToken = tokenGenerator.generateToken();
        String refreshToken = tokenGenerator.generateToken();
        LocalDateTime accessExpiresAt = now.plus(properties.getAccessTokenTtl());
        LocalDateTime refreshExpiresAt = now.plus(properties.getRefreshTokenTtl());

        UserSession session = new UserSession();
        session.setUserId(user.getId());
        session.setAccessTokenJti(accessToken);
        session.setRefreshTokenHash(hashToken(refreshToken));
        session.setDeviceId(request.getDeviceId());
        session.setDeviceName(request.getDeviceName());
        session.setIpAddress(request.getIpAddress());
        session.setUserAgent(request.getUserAgent());
        session.setIssuedAt(now);
        session.setExpiresAt(refreshExpiresAt);
        session.setCreatedByUserId(user.getId());
        session.setUpdatedByUserId(user.getId());
        session.setCreatedAt(now);
        session.setUpdatedAt(now);
        userSessionMapper.insert(session);

        return new LoginTokens(accessToken, refreshToken, accessExpiresAt, refreshExpiresAt);
    }

    private void writeLog(User user, LoginRequest request, String result, String reason, LocalDateTime now) {
        UserLoginLog log = new UserLoginLog();
        log.setUserId(user == null ? null : user.getId());
        log.setUsername(request.getUserId());
        log.setLoginResult(result);
        log.setFailureReason(reason);
        log.setIpAddress(request.getIpAddress());
        log.setUserAgent(request.getUserAgent());
        log.setCreatedByUserId(user == null ? null : user.getId());
        log.setUpdatedByUserId(user == null ? null : user.getId());
        log.setCreatedAt(now);
        log.setUpdatedAt(now);
        userLoginLogMapper.insert(log);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 digest is not available", ex);
        }
    }

    /**
     * Module Name: Authentication Module
     * Main Function: Represents immutable login tokens data exchanged inside the document or authentication workflow.
     * Parameters: Record components declared in the LoginTokens record signature.
     * Development Date: 2026-06-28
     * Developer: Codex
     * Update History:
     * 2026-06-28 - Codex - Added standardized English class header comment.
     * Updater: Codex
     */
    private record LoginTokens(String accessToken, String refreshToken, LocalDateTime expiresAt,
                               LocalDateTime refreshExpiresAt) {
    }
}
