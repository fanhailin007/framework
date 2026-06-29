package com.linkedyou.backend.common.logging;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.time.temporal.Temporal;
import java.util.Arrays;
import java.util.Collection;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Module Name: Common Logging Module
 * Main Function: Adds cross-cutting logging behavior around controller and service execution.
 * Parameters: N/A.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Aspect
@Component
public class LayerLoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LayerLoggingAspect.class);

    private static final int MAX_FIELD_COUNT = 12;

    @Around("execution(public * com.linkedyou.backend.controller..*(..))")
    public Object logControllerInvocation(ProceedingJoinPoint joinPoint) throws Throwable {
        return logInvocation("controller", joinPoint);
    }

    @Around("execution(public * com.linkedyou.backend..service..*(..))")
    public Object logServiceInvocation(ProceedingJoinPoint joinPoint) throws Throwable {
        return logInvocation("service", joinPoint);
    }

    Object logInvocation(String layer, ProceedingJoinPoint joinPoint) throws Throwable {
        String method = methodName(joinPoint);
        String arguments = formatArguments(joinPoint.getArgs());
        long startedAt = System.nanoTime();
        log.info("{} entry method={} args={}", layer, method, arguments);
        try {
            Object result = joinPoint.proceed();
            long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAt);
            log.info("{} exit method={} elapsedMs={} result={}", layer, method, elapsedMs, formatResult(result));
            return result;
        } catch (Throwable ex) {
            long elapsedMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAt);
            log.warn("{} exception method={} elapsedMs={} exception={} message={}",
                    layer, method, elapsedMs, ex.getClass().getSimpleName(), ex.getMessage());
            throw ex;
        }
    }

    String formatArguments(Object[] args) {
        if (args == null || args.length == 0) {
            return "[]";
        }
        return Arrays.stream(args)
                .map(this::formatArgument)
                .collect(Collectors.joining(", ", "[", "]"));
    }

    private String methodName(ProceedingJoinPoint joinPoint) {
        if (joinPoint.getSignature() instanceof MethodSignature signature) {
            return signature.getDeclaringTypeName() + "." + signature.getName();
        }
        return joinPoint.getSignature().toShortString();
    }

    private String formatArgument(Object value) {
        if (value == null) {
            return "null";
        }
        if (value instanceof CharSequence text) {
            return "String(length=" + text.length() + ")";
        }
        if (isSimpleValue(value)) {
            return String.valueOf(value);
        }
        if (value instanceof Collection<?> collection) {
            return value.getClass().getSimpleName() + "(size=" + collection.size() + ")";
        }
        if (value instanceof Map<?, ?> map) {
            return value.getClass().getSimpleName() + "(size=" + map.size() + ")";
        }
        return formatObjectFields(value);
    }

    private String formatObjectFields(Object value) {
        Field[] fields = value.getClass().getDeclaredFields();
        String body = Arrays.stream(fields)
                .filter(field -> !Modifier.isStatic(field.getModifiers()))
                .limit(MAX_FIELD_COUNT)
                .map(field -> field.getName() + "=" + fieldValue(value, field))
                .collect(Collectors.joining(", "));
        return value.getClass().getSimpleName() + "{" + body + "}";
    }

    private String fieldValue(Object owner, Field field) {
        if (isSensitiveField(field.getName())) {
            return "***";
        }
        try {
            field.setAccessible(true);
            Object value = field.get(owner);
            if (value == null || isSimpleValue(value)) {
                return Objects.toString(value);
            }
            if (value instanceof CharSequence text) {
                return text.toString();
            }
            if (value instanceof Collection<?> collection) {
                return value.getClass().getSimpleName() + "(size=" + collection.size() + ")";
            }
            if (value instanceof Map<?, ?> map) {
                return value.getClass().getSimpleName() + "(size=" + map.size() + ")";
            }
            return value.getClass().getSimpleName();
        } catch (RuntimeException | IllegalAccessException ex) {
            return "<unavailable>";
        }
    }

    private String formatResult(Object result) {
        if (result == null) {
            return "null";
        }
        if (isSimpleValue(result)) {
            return String.valueOf(result);
        }
        if (result instanceof CharSequence text) {
            return "String(length=" + text.length() + ")";
        }
        if (result instanceof Collection<?> collection) {
            return result.getClass().getSimpleName() + "(size=" + collection.size() + ")";
        }
        if (result instanceof Map<?, ?> map) {
            return result.getClass().getSimpleName() + "(size=" + map.size() + ")";
        }
        return result.getClass().getSimpleName();
    }

    private boolean isSimpleValue(Object value) {
        return value instanceof Number
                || value instanceof Boolean
                || value instanceof Enum<?>
                || value instanceof Temporal;
    }

    private boolean isSensitiveField(String fieldName) {
        String normalized = fieldName.toLowerCase(Locale.ROOT);
        return normalized.contains("password")
                || normalized.contains("token")
                || normalized.contains("secret")
                || normalized.contains("credential")
                || normalized.contains("authorization")
                || normalized.contains("cookie")
                || normalized.contains("code")
                || normalized.contains("hash");
    }
}
