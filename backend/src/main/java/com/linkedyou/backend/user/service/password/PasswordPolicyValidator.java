package com.linkedyou.backend.user.service.password;

import com.linkedyou.backend.common.exception.BusinessException;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.LengthRule;
import org.passay.PasswordData;
import org.passay.PasswordValidator;
import org.passay.Rule;
import org.passay.RuleResult;
import org.passay.WhitespaceRule;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PasswordPolicyValidator {

    private final PasswordPolicyProperties properties;

    public PasswordPolicyValidator(PasswordPolicyProperties properties) {
        this.properties = properties;
    }

    public void validate(String password) {
        if (!properties.isEnabled()) {
            return;
        }

        List<Rule> rules = new ArrayList<>();
        rules.add(new LengthRule(properties.getMinLength(), properties.getMaxLength()));
        if (properties.isRequireUppercase()) {
            rules.add(new CharacterRule(EnglishCharacterData.UpperCase, 1));
        }
        if (properties.isRequireLowercase()) {
            rules.add(new CharacterRule(EnglishCharacterData.LowerCase, 1));
        }
        if (properties.isRequireDigit()) {
            rules.add(new CharacterRule(EnglishCharacterData.Digit, 1));
        }
        if (properties.isRequireSpecial()) {
            rules.add(new CharacterRule(EnglishCharacterData.Special, 1));
        }
        if (properties.isRejectWhitespace()) {
            rules.add(new WhitespaceRule());
        }

        PasswordValidator validator = new PasswordValidator(rules);
        RuleResult result = validator.validate(new PasswordData(password));
        if (!result.isValid()) {
            throw new BusinessException("PASSWORD_POLICY_VIOLATION",
                    "password does not match policy: " + String.join("; ", validator.getMessages(result)));
        }
    }
}
