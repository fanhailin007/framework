package com.linkedyou.backend.common.logging;

import com.linkedyou.backend.user.dto.UserCreateRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Module Name: Common Logging Module Test
 * Main Function: Verifies Layer Logging Aspect behavior with automated JUnit test cases.
 * Parameters: JUnit fixtures, mocks, and test method inputs declared in this test class.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
class LayerLoggingAspectTest {

    private final LayerLoggingAspect aspect = new LayerLoggingAspect();

    @Test
    void controllerLoggingReturnsProceedResult() throws Throwable {
        ProceedingJoinPoint joinPoint = joinPoint("list", new Object[0]);
        when(joinPoint.proceed()).thenReturn("ok");

        Object result = aspect.logControllerInvocation(joinPoint);

        assertThat(result).isEqualTo("ok");
        verify(joinPoint).proceed();
    }

    @Test
    void serviceLoggingPropagatesException() throws Throwable {
        ProceedingJoinPoint joinPoint = joinPoint("create", new Object[0]);
        IllegalStateException failure = new IllegalStateException("boom");
        when(joinPoint.proceed()).thenThrow(failure);

        assertThatThrownBy(() -> aspect.logServiceInvocation(joinPoint))
                .isSameAs(failure);

        verify(joinPoint).proceed();
    }

    @Test
    void argumentSummaryMasksSensitiveFields() {
        UserCreateRequest request = new UserCreateRequest();
        request.setUserId("admin");
        request.setPassword("Password123!");

        String summary = aspect.formatArguments(new Object[]{request, "plain-token-value", "123456"});

        assertThat(summary).contains("userId=admin");
        assertThat(summary).contains("password=***");
        assertThat(summary).doesNotContain("Password123!");
        assertThat(summary).doesNotContain("plain-token-value");
        assertThat(summary).doesNotContain("123456");
    }

    private static ProceedingJoinPoint joinPoint(String methodName, Object[] args) {
        ProceedingJoinPoint joinPoint = mock(ProceedingJoinPoint.class);
        MethodSignature signature = mock(MethodSignature.class);
        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getDeclaringTypeName()).thenReturn("com.linkedyou.backend.TestComponent");
        when(signature.getName()).thenReturn(methodName);
        when(joinPoint.getArgs()).thenReturn(args);
        return joinPoint;
    }
}
