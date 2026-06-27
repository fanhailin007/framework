package com.linkedyou.backend.document.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.linkedyou.backend.document.entity.Document;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DocumentMapper extends BaseMapper<Document> {
}
