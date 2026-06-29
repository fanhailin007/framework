<template>
  <div class="tile-container no-background-container">
    <div class="tile-box">
      <el-row :gutter="20">
        <el-col :lg="9" :md="24" :sm="24" :xl="9" :xs="24">
          <vab-card
            :body-style="{
              height: '222px',
            }"
            class="main-portal-card"
          >
            <vab-link target="_blank" to="/portal">
              <div class="portal-content">
                <div class="portal-description">
                  <p>企业级应用门户</p>
                  <p>统一入口，便捷管理</p>
                </div>
                <vab-icon class="tile-svg" icon="illustration/Scenes02" is-custom-svg />
              </div>
            </vab-link>
          </vab-card>
        </el-col>
        <el-col :lg="5" :md="24" :sm="24" :xl="5" :xs="24">
          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/dataScreen">
              <div class="icon-panel">
                <vab-icon icon="bar-chart-box-ai-line" style="background: var(--el-color-primary)" />
                <div class="icon-panel-title">
                  数据大屏
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>

          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/other/video">
              <div class="icon-panel">
                <vab-icon icon="video-line" style="background: var(--el-color-warning)" />
                <div class="icon-panel-title">
                  视频播放器
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>
        </el-col>
        <el-col :lg="5" :md="24" :sm="24" :xl="5" :xs="24">
          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/vab/table/customTable">
              <div class="icon-panel">
                <vab-icon icon="table-2" style="background: var(--el-color-success)" />
                <div class="icon-panel-title">
                  自定义表格
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>
          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/other/echarts">
              <div class="icon-panel">
                <vab-icon icon="bubble-chart-line" style="background: var(--el-color-danger)" />
                <div class="icon-panel-title">
                  图表
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>
        </el-col>
        <el-col :lg="5" :md="24" :sm="24" :xl="5" :xs="24">
          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/other/gantt">
              <div class="icon-panel">
                <vab-icon icon="organization-chart" style="background: #6954f0" />
                <div class="icon-panel-title">
                  甘特图
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>
          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/other/workflow">
              <div class="icon-panel">
                <vab-icon icon="flow-chart" style="background: #16baa9" />
                <div class="icon-panel-title">
                  工作流
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>
        </el-col>
        <el-col :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/operate/randomTheme">
              <div class="icon-panel">
                <vab-icon icon="ai-generate" style="background: var(--el-color-primary)" />
                <div class="icon-panel-title">
                  随机换肤
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>
        </el-col>
        <el-col :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/operate/permission">
              <div class="icon-panel">
                <vab-icon icon="user-3-line" style="background: var(--el-color-danger)" />
                <div class="icon-panel-title">
                  角色权限
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>
        </el-col>
        <el-col :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
          <vab-card
            :body-style="{
              height: '100px',
            }"
          >
            <vab-link target="_blank" to="/chat/chatGPT">
              <div class="icon-panel">
                <vab-icon icon="openai-line" style="background: #0fa47f" />
                <div class="icon-panel-title">
                  chatGPT
                  <div class="icon-panel-tips">点击跳转</div>
                </div>
              </div>
            </vab-link>
          </vab-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Tile',
})
</script>

<style lang="scss" scoped>
$breakpoints: (480px 100%, 768px 100%, 960px 100%, 1280px 90%, 1440px 80%, 1680px 75%, 1920px 70%, 2560px 60%);

.tile-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--el-border-radius-base);
  transition: var(--el-transition) !important;

  :deep() {
    * {
      transition: var(--el-transition) !important;
    }
  }

  // 响应式CSS变量设置
  // 大屏幕 (1920px+)
  @media (min-width: 1920px) {
    --tile-svg-height: 200px;
    --tile-svg-right: -40px;
  }

  // 大屏幕 (1440px - 1919px)
  @media (max-width: 1919px) and (min-width: 1440px) {
    --tile-svg-height: 180px;
    --tile-svg-right: -30px;
  }

  // 中等屏幕 (1200px - 1439px)
  @media (max-width: 1439px) and (min-width: 1200px) {
    --tile-svg-height: 160px;
    --tile-svg-right: -25px;
  }

  // 小屏幕 (992px - 1199px)
  @media (max-width: 1199px) and (min-width: 992px) {
    --tile-svg-height: 140px;
    --tile-svg-right: -20px;
  }

  // 平板 (769px - 991px)
  @media (max-width: 991px) and (min-width: 769px) {
    --tile-svg-height: 120px;
    --tile-svg-right: -15px;
  }

  // 手机横屏 (481px - 768px)
  @media (max-width: 768px) and (min-width: 481px) {
    --tile-svg-height: 100px;
    --tile-svg-right: -10px;
  }

  // 手机竖屏 (480px以下)
  @media (max-width: 480px) {
    --tile-svg-height: 0px;
    --tile-svg-right: 0px;
  }

  .tile-box {
    position: relative;

    @each $bp, $width in $breakpoints {
      @media (min-width: $bp) {
        width: $width;
      }
    }

    .main-portal-card {
      .portal-content {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
      }

      .portal-description {
        z-index: 2;
        flex: 1;

        p {
          margin: 0;
          margin-bottom: 8px;
          font-size: var(--el-font-size-base);
          line-height: 1.6;
          color: var(--el-color-grey);

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .tile-svg {
        position: absolute;
        top: 50%;
        right: var(--tile-svg-right, -30px);
        z-index: 1;
        width: auto;
        height: var(--tile-svg-height, 180px);
        opacity: 1;
        transform: translateY(-50%);
        transition: all 0.3s ease;
      }

      &:hover {
        .portal-description p {
          color: var(--el-color-primary);
        }

        .tile-svg {
          opacity: 0.9;
          transform: translateY(-50%) scale(1.05);
        }
      }
    }

    a {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      padding: 20px 25px;
      color: var(--el-color-grey);
    }

    .icon-panel {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      i {
        flex-shrink: 0;
        width: 60px;
        height: 60px;
        font-size: 30px;
        line-height: 60px;
        color: var(--el-color-white);
        background: var(--el-color-primary);
        border-radius: var(--el-border-radius-base);
      }

      .icon-panel-title {
        display: inline-block;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 20px;
        color: var(--el-color-grey);
        white-space: nowrap;

        .icon-panel-tips {
          font-size: var(--el-font-size-extra-small);
          color: var(--el-color-grey);
        }
      }
    }

    :deep() {
      .el-card {
        &:hover {
          border: 1px solid var(--el-color-primary) !important;
        }

        &__body {
          position: relative;
          z-index: 1;
          overflow: hidden;
          cursor: pointer;

          &::before {
            position: absolute;
            right: 100%;
            bottom: 100%;
            z-index: -1;
            width: 100%;
            height: 230px;
            content: '';
            background: var(--el-color-primary-light-9);
            border-radius: 50%;
            transform: translate3d(50%, 50%, 0) scale3d(0, 0, 0);
            transform-origin: center;
            transition: transform 0.8s ease-in-out !important;
          }

          &:hover {
            .icon-panel-title {
              color: var(--el-color-primary);

              .icon-panel-tips {
                color: currentColor;
              }
            }

            &::before {
              transform: translate3d(50%, 50%, 0) scale3d(15, 15, 15);
            }
          }
        }
      }
    }
  }
}

// 响应式优化 - 补充样式
@media (max-width: 768px) and (min-width: 481px) {
  .tile-container {
    .tile-box {
      .main-portal-card {
        .portal-description {
          p {
            font-size: var(--el-font-size-small);
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .tile-container {
    .tile-box {
      .main-portal-card {
        .tile-svg {
          display: none;
        }

        .portal-description {
          text-align: center;
        }
      }
    }
  }
}
</style>
