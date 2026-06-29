package com.linkedyou.backend.document.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.linkedyou.backend.document.entity.Document;
import org.apache.ibatis.annotations.Mapper;

/**
 * Module Name: Document Management Module
 * Main Function: Provides MyBatis-Plus data access operations for document records.
 * Parameters: Entity instances and MyBatis-Plus query wrappers supplied by callers.
 * Development Date: 2026-06-28
 * Developer: Codex
 * Update History:
 * 2026-06-28 - Codex - Added standardized English class header comment.
 * Updater: Codex
 */
@Mapper
public interface DocumentMapper extends BaseMapper<Document> {
}
