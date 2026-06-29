<template>
  <div id="workbench-container" class="workbench-container vab-data-fullscreen">
    <div class="hidden-sm-and-up" style="padding: 20px">
      <vab-alert title="移动端不支持工作台演示" type="warning" />
    </div>
    <div class="hidden-xs-only">
      <workbench-header
        :style="{
          height: headerContentHeight,
          'line-height': headerContentHeight,
        }"
      />
      <div style="padding: 30px 40px 0 40px">
        <el-row :gutter="20">
          <el-col :span="6" :xs="24">
            <div class="workbench-card" :style="{ height: leftCardHeight1 }">
              <div class="card-title">快捷入口</div>
              <quick-access />
            </div>
            <div class="workbench-card" :style="{ height: leftCardHeight2 }">
              <div class="card-title">公告</div>
              <workbench-notice />
            </div>
            <div class="workbench-card" :style="{ height: leftCardHeight3 }">
              <div class="card-title">实时监控</div>
              <real-time-monitor />
            </div>
          </el-col>
          <el-col :span="12" :xs="24">
            <div class="workbench-card" :style="{ height: topCardHeight }">
              <div
                style="
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                  height: 100%;
                  background: rgba(0, 0, 0, 0.87);
                "
              >
                <vab-player-hls :config="configHls" style="width: 100%; height: 100%; background: transparent" @player="playerInstance" />
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    background: rgba(1, 2, 37, 0.7);
                    border-radius: 5px;
                  "
                ></div>
              </div>
            </div>
            <div class="workbench-card hidden-xs-only" :style="{ height: bottomCardHeight }">
              <data-screen-bottom />
            </div>
          </el-col>
          <el-col :span="6" :xs="24">
            <div class="workbench-card" :style="{ height: rightCardHeight1 }">
              <div class="card-title">待办事项</div>
              <todo-list />
            </div>
            <div class="workbench-card" :style="{ height: rightCardHeight2 }">
              <div class="card-title">系统状态</div>
              <system-status />
            </div>
            <div class="workbench-card" :style="{ height: rightCardHeight3 }">
              <div class="card-title">统计分析</div>
              <data-screen-right-3 style="flex-grow: 1; min-height: 0" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <vab-theme-setting />
  </div>
</template>

<script lang="ts" setup>
import { uniqueId } from 'lodash-es'

defineOptions({
  name: 'Workbench',
})

const topCardHeight = ref<any>('calc((var(--vh, 1vh) * 100 - 320px)')
const bottomCardHeight = ref<any>('174px')

const leftCardHeight1 = ref<any>('calc((var(--vh, 1vh) * 100 - 165px) / 3.5)')
const leftCardHeight2 = ref<any>('calc((var(--vh, 1vh) * 100 - 165px) / 3)')
const leftCardHeight3 = ref<any>('calc((var(--vh, 1vh) * 100 - 165px) / 2.63)')

const rightCardHeight1 = ref<any>('calc((var(--vh, 1vh) * 100 - 165px) / 3)')
const rightCardHeight2 = ref<any>('calc((var(--vh, 1vh) * 100 - 165px) / 2.63)')
const rightCardHeight3 = ref<any>('calc((var(--vh, 1vh) * 100 - 165px) / 3.5)')

const configHls = reactive<any>({
  url: 'https://gcalic.v.myalicdn.com/gc/bsszjs_1/index.m3u8?contentid=2820180516001',
  id: uniqueId('uuid_hls_'),
  lang: 'zh',
  volume: 0,
  autoplay: true,
  screenShot: true,
  playbackRate: [0.5, 0.75, 1, 1.5, 2],
  width: '100%',
  height: '100%',
})

let _Player: any
const playerInstance = (player: any) => {
  _Player = player
}

const headerContentHeight = ref<any>('60px')

onMounted(() => {
  setTimeout(() => {
    $baseMessage('点击右上角【全屏】按钮使用效果更佳', 'success', 'hey')
  }, 1000)
  document.querySelectorAll('body')[0].className = ''
})

onActivated(() => {
  _Player && _Player.play()
})
onDeactivated(() => {
  _Player && _Player.pause()
})
</script>

<style lang="scss" scoped>
#workbench-container.workbench-container.vab-data-fullscreen {
  overflow: auto;
  color: #fff;
  background: #01022e !important;

  :deep() {
    .vab-theme-setting {
      background: #01022e;
      border: 1px solid #101f58;

      section {
        > div {
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4) {
            display: none;
          }
        }
      }
    }
  }

  .workbench-card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 160px;
    padding: var(--el-padding);
    margin-bottom: 20px;
    background: rgba(0, 0, 0, 0.2);
    border: 3px solid #01ffff;
    border-radius: 5px;

    .card-title {
      height: 20px;
      padding-left: 10px;
      line-height: 20px;
      text-align: left;
      border-left: 3px solid #01ffff;
    }

    &::before {
      position: absolute;
      top: -3px;
      bottom: -3px;
      left: 30px;
      z-index: 0;
      width: calc(100% - 60px);
      pointer-events: none;
      content: '';
      border-top: 3px solid #101f58;
      border-bottom: 3px solid #101f58;
    }

    &::after {
      position: absolute;
      top: 30px;
      right: -3px;
      left: -3px;
      z-index: 0;
      height: calc(100% - 60px);
      pointer-events: none;
      content: '';
      border-right: 3px solid #101f58;
      border-left: 3px solid #101f58;
    }
  }

  .notice-timeline {
    padding: 0;

    :deep(.el-timeline-item__tail) {
      border-left: 2px solid #101f58 !important;
    }

    :deep(.el-timeline-item__node) {
      background: #01ffff !important;
      border: 2px solid #01ffff !important;
      box-shadow: 0 0 8px #01ffff44;
    }

    :deep(.el-timeline-item__wrapper) {
      color: #64c5d9;
    }

    :deep(.el-timeline-item__timestamp) {
      font-size: 13px;
      color: #fff;
      opacity: 0.6;
    }

    :deep(.el-timeline-item__content) {
      padding: 2px 0 2px 0;
      border-radius: 3px;
      transition: background 0.2s;
    }

    :deep(.el-timeline-item__content:hover) {
      background: rgba(1, 255, 255, 0.06);
    }
  }

  .notice-timeline-title {
    font-weight: 500;
    color: #01ffff;
  }
}
</style>
