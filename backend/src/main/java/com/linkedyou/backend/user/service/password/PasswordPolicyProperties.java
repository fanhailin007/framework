package com.linkedyou.backend.user.service.password;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "security.password-policy")
public class PasswordPolicyProperties {

    private boolean enabled = true;

    private int minLength = 8;

    private int maxLength = 100;

    private boolean requireUppercase = true;

    private boolean requireLowercase = true;

    private boolean requireDigit = true;

    private boolean requireSpecial = true;

    private boolean rejectWhitespace = true;
}
