package com.linkedyou.backend.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private String userId;

    @TableField("display_name")
    private String displayName;

    private String email;

    private String phone;

    private String password;

    private String avatar;

    @TableField("is_active")
    private Boolean active;

    @TableField("failed_login_count")
    private Integer failedLoginCount;

    @TableField("locked_until")
    private LocalDateTime lockedUntil;

    @TableField("password_changed_at")
    private LocalDateTime passwordChangedAt;

    @TableField("last_login_at")
    private LocalDateTime lastLoginAt;

    @TableField("last_login_ip")
    private String lastLoginIp;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

    @TableField("deleted_at")
    private LocalDateTime deletedAt;
}
