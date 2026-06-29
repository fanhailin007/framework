<template>
  <div class="iot-container">
    <div class="hidden-sm-and-up" style="padding: var(--el-padding)">
      <vab-alert title="手机端不支持物联网演示" type="warning" />
    </div>
    <div class="hidden-xs-only">
      <div class="left-panel">
        <el-avatar :size="50" :src="avatar" />
        <div class="username">{{ username }}</div>
        <ul class="menu">
          <li v-for="(item, index) in menuList" :key="index" :class="item.active ? 'menu-item-active' : ''" @click="openWindow(item)">
            <vab-icon :icon="item.icon" />
            <div>{{ item.title }}</div>
          </li>
        </ul>
        <div class="environment-info">
          <div class="info-item">
            <div class="info-label">温度</div>
            <div class="info-value">{{ environmentData.temperature }}°C</div>
          </div>
          <div class="info-item">
            <div class="info-label">湿度</div>
            <div class="info-value">{{ environmentData.humidity }}%</div>
          </div>
          <div class="info-item">
            <div class="info-label">PM2.5</div>
            <div class="info-value">{{ environmentData.pm25 }}</div>
          </div>
        </div>
      </div>
      <el-scrollbar>
        <div class="right-panel">
          <div class="right-panel-content">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-row :gutter="20">
                  <el-col :lg="24">
                    <vab-card
                      :body-style="{
                        height: '160px',
                      }"
                      class="top-card"
                    >
                      <page-header />
                    </vab-card>
                  </el-col>
                  <el-col v-for="(item, index) in iotList" :key="index" :span="8">
                    <vab-card class="left-card" @click="handleDeviceClick(item)">
                      <div class="device-title">{{ item.title }}</div>
                      <el-image :src="item.icon" />
                      <div class="device-status" :class="item.statusClass">
                        {{ item.status }}
                      </div>
                    </vab-card>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row :gutter="20">
                  <el-col v-for="(item, index) in serviceList" :key="index" :span="12">
                    <vab-card class="right-card">
                      <h3>{{ item.title }}</h3>
                      <vab-icon :icon="item.icon" is-custom-svg />
                      <el-button plain round size="large" @click="handleServiceClick(item)">
                        点击跳转
                        <el-icon class="el-icon--right">
                          <arrow-right />
                        </el-icon>
                      </el-button>
                    </vab-card>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import iot_1 from '/@/assets/iot_images/iot_1.png'
import iot_2 from '/@/assets/iot_images/iot_2.png'
import iot_3 from '/@/assets/iot_images/iot_3.png'
import iot_4 from '/@/assets/iot_images/iot_4.png'
import iot_5 from '/@/assets/iot_images/iot_5.png'
import iot_6 from '/@/assets/iot_images/iot_6.png'
import { useUserStore } from '/@/store/modules/user'

defineOptions({
  name: 'Iot',
})

interface MenuListType {
  icon: string
  title: string
  path: string
  active?: boolean
}

interface IotListType {
  icon: string
  title: string
  status: string
  statusClass: string
}

interface ServiceListType {
  icon: string
  title: string
}

interface EnvironmentDataType {
  temperature: number
  humidity: number
  pm25: number
}

const userStore = useUserStore()
const { avatar, username } = storeToRefs(userStore)
const router = useRouter()

// 环境数据
const environmentData = ref<EnvironmentDataType>({
  temperature: 24,
  humidity: 65,
  pm25: 32,
})

// 菜单列表
const menuList = ref<MenuListType[]>([
  {
    icon: 'earthquake-fill',
    title: '物联网',
    path: '/template/iot',
    active: true,
  },
  {
    icon: 'building-line',
    title: '门户',
    path: '/portal',
  },
  {
    icon: 'bar-chart-box-ai-line',
    title: '数据大屏',
    path: '/dataScreen',
  },
    {
    icon: 'artboard-line',
    title: '工作台',
    path: '/workbench',
  },
  {
    icon: 'admin-fill',
    title: '后台管理',
    path: '/index',
  },
])

// IoT设备列表
const iotList = ref<IotListType[]>([
  {
    title: '空调',
    icon: iot_1,
    status: '运行中',
    statusClass: 'status-running',
  },
  {
    title: '扫地机器人',
    icon: iot_2,
    status: '待机',
    statusClass: 'status-standby',
  },
  {
    title: '摄像头',
    icon: iot_3,
    status: '运行中',
    statusClass: 'status-running',
  },
  {
    title: '空气净化器',
    icon: iot_4,
    status: '运行中',
    statusClass: 'status-running',
  },
  {
    title: '灯',
    icon: iot_5,
    status: '已关闭',
    statusClass: 'status-off',
  },
  {
    title: '门锁',
    icon: iot_6,
    status: '已锁定',
    statusClass: 'status-locked',
  },
])

// 服务列表
const serviceList = ref<ServiceListType[]>([
  { title: '数据看板', icon: 'article' },
  { title: '日志查询', icon: 'wtt' },
  { title: '模组', icon: 'video' },
  { title: '服务商', icon: 'wenda' },
])

const openWindow = (item: MenuListType) => {
  router.push(item.path)
}

const handleDeviceClick = (item: IotListType) => {
  $baseNotify(`设备: ${item.title}`, `状态: ${item.status}`, 'info')
}

const handleServiceClick = (item: ServiceListType) => {
  $baseAlert(`即将跳转到${item.title}页面！`)
}

// 模拟环境数据更新
onMounted(() => {
  document.querySelectorAll('body')[0].className = ''

  // 模拟环境数据变化
  setInterval(() => {
    environmentData.value = {
      temperature: Math.floor(Math.random() * 10) + 20, // 20-29°C
      humidity: Math.floor(Math.random() * 20) + 50, // 50-69%
      pm25: Math.floor(Math.random() * 20) + 20, // 20-39
    }
  }, 10000)
})
</script>

<style lang="scss" scoped>
$breakpoints: (480px 95%, 768px 95%, 960px 95%, 1280px 95%, 1440px 95%, 1680px 95%, 1920px 80%, 2560px 70%);
.iot-container {
  position: fixed;
  inset: 0;
  z-index: var(--el-z-index);
  margin: 0 !important;
  padding: 0 !important;
  transition: var(--el-transition);
  background-image: linear-gradient(to bottom, #4f6479, #b6bcc4) !important;

  * {
    transition: var(--el-transition);
  }

  .left-panel {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: var(--el-z-index);
    width: 80px;
    color: var(--el-color-white);
    text-align: center;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)) !important;

    :deep() {
      .el-avatar {
        margin-top: 15px;
        padding: 5px;
        background: none !important;
        border-radius: 50%;
      }
    }

    .username {
      margin-top: 5px;
      padding: 0 5px;
      font-size: 12px;
      color: var(--el-color-white);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .menu {
      margin-top: 20px;
      padding: 0;
      list-style: none;

      li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 100px;
        margin-bottom: 10px;
        padding-top: 5px;
        padding-right: 20px;
        padding-bottom: 5px;
        cursor: pointer;

        &:hover,
        &.menu-item-active {
          color: var(--el-color-primary);
          background-color: var(--el-color-white);
          border-top-right-radius: 50px;
          border-bottom-right-radius: 50px;

          [class*='ri-'] {
            color: var(--el-color-primary);
          }
        }

        [class*='ri-'] {
          width: 100%;
          font-size: var(--el-font-size-extra-large);
        }
      }
    }

    .environment-info {
      position: absolute;
      bottom: 20px;
      width: 100%;
      padding: 10px 0;
      font-size: 12px;
      color: var(--el-color-white);

      .info-item {
        margin-bottom: 10px;

        .info-label {
          font-weight: bold;
        }

        .info-value {
          font-size: 14px;
        }
      }
    }
  }

  .right-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100vw - 80px);
    height: calc(var(--vh, 1vh) * 100);
    margin-left: 80px;

    &-content {
      display: flex;
      align-items: center;
      min-height: 80vh;
      margin: auto;
      border-radius: 15px;

      @each $bp, $width in $breakpoints {
        @media (min-width: $bp) {
          width: $width;
        }
      }

      .top-card {
        background: transparent;
      }

      .left-card {
        cursor: pointer;
        color: #f2f2f2;
        background: rgba(255, 255, 255, 0.3);
        transition: transform 0.3s;

        &:hover {
          .el-image {
            transform: translateY(-5px);
          }
        }

        :deep() {
          .el-card__body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
          }

          .el-image {
            display: block;
            width: 100px;
            margin: auto;
          }
        }

        .device-title {
          font-weight: bold;
          font-size: 16px;
          margin-top: 0;
          margin-bottom: 10px;
          color: #fff;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          text-align: left;
          width: 100%;
          padding: 0 10px;
        }

        .device-status {
          padding: 3px 10px;
          font-size: 12px;
          font-weight: bold;
          border-radius: 12px;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          text-align: left;
          width: fit-content;
          margin-top: 5px;

          &.status-running {
            color: #fff;
            background-color: #2ecc71;
            box-shadow: 0 2px 4px rgba(46, 204, 113, 0.3);
          }

          &.status-standby {
            color: #fff;
            background-color: #3498db;
            box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
          }

          &.status-off {
            color: #fff;
            background-color: #7f8c8d;
            box-shadow: 0 2px 4px rgba(127, 140, 141, 0.3);
          }

          &.status-locked {
            color: #fff;
            background-color: #9b59b6;
            box-shadow: 0 2px 4px rgba(155, 89, 182, 0.3);
          }
        }
      }

      .right-card {
        background: rgba(255, 255, 255, 0.3);

        h3 {
          margin-top: 0;
          color: #fff;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          text-align: left;
        }

        :deep() {
          .el-card__body {
            position: relative;
            height: 284px;
          }

          .el-button {
            &--large {
              &.is-plain {
                &.is-round {
                  position: absolute;
                  right: var(--el-margin);
                  bottom: var(--el-margin);
                  color: var(--el-color-white);
                  background-image: linear-gradient(to left, #718391, #9ba5b2) !important;
                  border: 1px solid #9ba5b2;

                  &:hover {
                    border: 1px solid var(--el-color-white);
                  }
                }
              }
            }
          }

          [class*='vab-icon'] {
            width: 140px;
            height: 140px;
            cursor: pointer;
            color: var(--el-color-grey);
            background-image: linear-gradient(to left, var(--el-color-grey), #718391) !important;
            background-clip: text;
            transition: all 0.3s;
            -webkit-text-fill-color: transparent;
          }

          &:hover {
            [class*='vab-icon'] {
              scale: 1.2;
              transition: all 0.3s;
            }
          }
        }
      }

      :deep() {
        > .el-row {
          width: calc(100% + 20px);

          .el-card {
            border: 0;
            border-radius: 15px;
          }

          .page-header {
            margin-left: -40px;
            background: transparent !important;
            border: 0 !important;

            .el-card__body {
              background-color: transparent !important;

              .el-avatar {
                display: none;
              }

              * {
                color: var(--el-color-white) !important;
              }

              .page-header-tip-title {
                margin-bottom: 10px;
                font-size: calc(var(--el-font-size-extra-large) + 4px) !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
