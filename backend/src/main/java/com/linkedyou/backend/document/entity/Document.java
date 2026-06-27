package com.linkedyou.backend.document.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("documents")
public class Document {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("document_id")
    private Long documentId;

    private String title;

    private String slug;

    private String summary;

    private String content;

    private String status;

    @TableField("owner_user_id")
    private Long ownerUserId;

    private String category;

    private String tags;

    @TableField("file_path")
    private String filePath;

    @TableField("file_size")
    private Long fileSize;

    private Integer version;

    @TableField("published_at")
    private LocalDateTime publishedAt;

    @TableField("reviewed_by")
    private Long reviewedBy;

    @TableField("created_by_user_id")
    private Long createdByUserId;

    @TableField("updated_by_user_id")
    private Long updatedByUserId;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

    @TableField("deleted_at")
    private LocalDateTime deletedAt;
}
