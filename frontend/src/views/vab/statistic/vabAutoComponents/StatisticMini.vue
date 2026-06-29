<template>
  <el-row :gutter="20">
    <el-col :lg="3" :md="6" :sm="12" :xl="3" :xs="12">
      <div class="mini-stat">
        <div class="mini-icon primary">
          <el-icon :size="16">
            <user />
          </el-icon>
        </div>
        <div class="mini-content">
          <div class="mini-value">{{ miniData.users }}</div>
          <div class="mini-label">用户</div>
        </div>
      </div>
    </el-col>
    <el-col :lg="3" :md="6" :sm="12" :xl="3" :xs="12">
      <div class="mini-stat">
        <div class="mini-icon success">
          <el-icon :size="16">
            <shopping-cart />
          </el-icon>
        </div>
        <div class="mini-content">
          <div class="mini-value">{{ miniData.orders }}</div>
          <div class="mini-label">订单</div>
        </div>
      </div>
    </el-col>
    <el-col :lg="3" :md="6" :sm="12" :xl="3" :xs="12">
      <div class="mini-stat">
        <div class="mini-icon warning">
          <el-icon :size="16">
            <money />
          </el-icon>
        </div>
        <div class="mini-content">
          <div class="mini-value">¥{{ miniData.revenue }}</div>
          <div class="mini-label">收入</div>
        </div>
      </div>
    </el-col>
    <el-col :lg="3" :md="6" :sm="12" :xl="3" :xs="12">
      <div class="mini-stat">
        <div class="mini-icon info">
          <el-icon :size="16">
            <monitor />
          </el-icon>
        </div>
        <div class="mini-content">
          <div class="mini-value">{{ miniData.views }}</div>
          <div class="mini-label">访问</div>
        </div>
      </div>
    </el-col>
    <el-col :lg="3" :md="6" :sm="12" :xl="3" :xs="12">
      <div class="mini-stat">
        <div class="mini-icon danger">
          <el-icon :size="16">
            <star />
          </el-icon>
        </div>
        <div class="mini-content">
          <div class="mini-value">{{ miniData.rating }}</div>
          <div class="mini-label">评分</div>
        </div>
      </div>
    </el-col>
    <el-col :lg="3" :md="6" :sm="12" :xl="3" :xs="12">
      <div class="mini-stat">
        <div class="mini-icon primary">
          <el-icon :size="16">
            <chat-dot-round />
          </el-icon>
        </div>
        <div class="mini-content">
          <div class="mini-value">{{ miniData.comments }}</div>
          <div class="mini-label">评论</div>
        </div>
      </div>
    </el-col>
    <el-col :lg="3" :md="6" :sm="12" :xl="3" :xs="12">
      <div class="mini-stat">
        <div class="mini-icon success">
          <el-icon :size="16">
            <share />
          </el-icon>
        </div>
        <div class="mini-content">
          <div class="mini-value">{{ miniData.shares }}</div>
          <div class="mini-label">分享</div>
        </div>
      </div>
    </el-col>
    <el-col :lg="3" :md="6" :sm="12" :xl="3" :xs="12">
      <div class="mini-stat">
        <div class="mini-icon warning">
          <el-icon :size="16">
            <download />
          </el-icon>
        </div>
        <div class="mini-content">
          <div class="mini-value">{{ miniData.downloads }}</div>
          <div class="mini-label">下载</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ChatDotRound, Download, Money, Monitor, Share, ShoppingCart, Star, User } from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticMini',
})

// 迷你数据
const miniData = ref({
  users: 2847,
  orders: 156,
  revenue: 45678,
  views: 12543,
  rating: 4.8,
  comments: 89,
  shares: 234,
  downloads: 567,
})
</script>

<style lang="scss" scoped>
// 迷你统计
.mini-stat {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .mini-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    color: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: scale(1.1);
    }

    &.primary {
      background: var(--el-color-primary);
    }

    &.success {
      background: var(--el-color-success);
    }

    &.warning {
      background: var(--el-color-warning);
    }

    &.info {
      background: var(--el-color-info);
    }

    &.danger {
      background: var(--el-color-danger);
    }
  }

  .mini-content {
    .mini-value {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.2;
      color: var(--el-text-color-primary);
    }

    .mini-label {
      font-size: 12px;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
