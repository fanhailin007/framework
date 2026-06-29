<template>
  <el-scrollbar wrap-class="scroll-wrap-portal">
    <div class="portal-main">
      <portal-header active-menu="portal" />
      <div class="carousel-background" :style="{ background: background }"></div>
      <main class="hidden-xs-only" style="padding-top: 85px">
        <el-row :gutter="0">
          <el-col :span="6">
            <div class="left-tab">
              <el-menu active-text-color="var(--el-color-white)" background-color="#39364d" text-color="var(--el-color-white)">
                <el-menu-item v-for="item in portalData.menuItems" :key="item.index" :index="item.index" @click="openWindow(item.url)">
                  <template #title>{{ item.title }}</template>
                </el-menu-item>
              </el-menu>
            </div>
          </el-col>
          <el-col :span="18">
            <el-carousel arrow="always" height="420px" :interval="3000" @change="handleChange">
              <el-carousel-item v-for="item in portalData.carouselItems" :key="item.url" @click="openWindow(item.url)" />
            </el-carousel>
          </el-col>
          <el-col :span="24">
            <div style="background-color: #f5f7fa">
              <div class="description-box">
                <el-row>
                  <el-col v-for="(item, index) in portalData.descriptionItems" :key="index" :span="6">
                    <div class="show-box">
                      <div v-if="item.type === 'title'" style="float: left">
                        <h1>
                          <span class="clip">{{ item.title }}</span>
                        </h1>
                        <p class="text">{{ item.subtitle }}</p>
                      </div>
                      <div v-else>
                        <div class="system-class-icon" :style="{ background: item.backgroundColor }">
                          <vab-icon :icon="item.icon" />
                        </div>
                        <div class="describe">{{ item.title }}</div>
                      </div>
                    </div>
                    <vab-divider v-if="index < portalData.descriptionItems.length - 1" direction="vertical" />
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </main>
      <main>
        <el-carousel arrow="always" class="hidden-sm-and-up" height="200px" :interval="3000" style="margin-top: 70px">
          <el-carousel-item v-for="item in portalData.carouselItems" :key="item.url" @click="openWindow(item.url)" />
        </el-carousel>
        <el-row :gutter="20">
          <el-col :lg="8" :md="8" :sm="24" :xl="8" :xs="24">
            <div class="news-tit">
              <h2>{{ portalData.newsTitles[0] }}</h2>
            </div>
            <el-image class="news-img" :src="banner_1" />
          </el-col>
          <el-col :lg="16" :md="16" :sm="24" :xl="16" :xs="24">
            <div class="news-tit">
              <h2>{{ portalData.newsTitles[1] }}</h2>
            </div>
            <icon-list />
          </el-col>
          <el-col :lg="8" :md="8" :sm="24" :xl="8" :xs="24">
            <div class="news-tit">
              <h2>{{ portalData.newsTitles[2] }}</h2>
            </div>
            <el-calendar v-model="date" style="border: 1px solid var(--el-border-color)" />
          </el-col>
          <el-col :lg="16" :md="16" :sm="24" :xl="16" :xs="24">
            <div class="news-tit">
              <h2>{{ portalData.newsTitles[3] }}</h2>
            </div>
            <el-form inline :model="newMessage" @submit.prevent="submitMessage">
              <el-form-item>
                <el-input v-model="newMessage.name" maxlength="12" placeholder="昵称" style="width: 120px; margin-right: 10px" />
                <el-input v-model="newMessage.content" maxlength="60" placeholder="留言内容" style="width: 240px; margin-right: 10px" />
                <el-button type="primary" @click="submitMessage">留言</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="pagedMessages" :height="260" style="margin-bottom: 8px; border: 1px solid var(--el-border-color)">
              <el-table-column label="昵称" prop="name" width="100" />
              <el-table-column label="留言" prop="content" />
              <el-table-column label="时间" prop="date" width="120" />
              <el-table-column label="点赞" width="80">
                <template #default="scope">
                  <el-button size="small" text @click="likeMessage(scope.$index + (currentPage - 1) * portalData.pageSize)">
                    👍 {{ scope.row.likes }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button v-if="messages.length > pagedMessages.length" style="width: 100%" @click="loadMore">加载更多</el-button>
          </el-col>
        </el-row>
        <portal-divider active-menu="portal" style="margin-top: 12px" />
      </main>

      <vab-footer />
    </div>
    <el-backtop target="#app .scroll-wrap-portal" />
    <vab-theme-setting />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import banner_1 from '/@/assets/portal_images/banner_1.jpg'
import carousel_1 from '/@/assets/portal_images/carousel_1.jpg'
import carousel_2 from '/@/assets/portal_images/carousel_2.jpg'
import carousel_3 from '/@/assets/portal_images/carousel_3.jpg'

defineOptions({
  name: 'Portal',
})

// 所有数据集中管理
const portalData = reactive({
  // 菜单数据
  menuItems: [
    {
      index: '1',
      title: 'Vue Admin Pro：企业级中后台前端框架',
      url: 'https://vuejs-core.cn/admin-pro',
    },
    {
      index: '2',
      title: 'Vue Admin Plus：企业级中后台前端框架',
      url: 'https://vuejs-core.cn/admin-plus',
    },
    {
      index: '3',
      title: 'Vue Shop Vite：全新一代前端模板',
      url: 'https://vuejs-core.cn/shop-vite',
    },
  ],

  // 轮播图数据
  carouselItems: [
    {
      url: 'https://vuejs-core.cn/admin-pro',
      background: carousel_2,
    },
    {
      url: 'https://vuejs-core.cn/admin-plus',
      background: carousel_1,
    },
    {
      url: 'https://vuejs-core.cn/shop-vite',
      background: carousel_3,
    },
  ],

  // 描述信息数据
  descriptionItems: [
    {
      title: 'Vue Shop Vite',
      subtitle: '全新一代的前端模板',
      type: 'title',
    },
    {
      icon: 'bubble-chart-line',
      title: '高效 Efficient',
      backgroundColor: '#20c2dc',
    },
    {
      icon: 'medal-fill',
      title: '专业 Major',
      backgroundColor: '#f7753f',
    },
    {
      icon: 'seedling-fill',
      title: '美观 Beautiful',
      backgroundColor: '#6a59f4',
    },
  ],

  // 新闻标题数据
  newsTitles: ['今日要闻', '动态资讯', '工作日程', '互动留言'],

  // 分页配置
  pageSize: 5,
})

const background = ref<string>('')

const handleChange = (value: any) => {
  switch (value) {
    case 0: {
      background.value = `url('${portalData.carouselItems[0].background}')`
      break
    }
    case 1: {
      background.value = `url('${portalData.carouselItems[1].background}')`
      break
    }
    case 2: {
      background.value = `url('${portalData.carouselItems[2].background}')`
      break
    }
    default: {
      background.value = `url('${portalData.carouselItems[0].background}')`
      break
    }
  }
}

const openWindow = (url: string) => {
  window.open(url)
}

const date = ref<any>(new Date())

// 留言数据
const messages = ref<any[]>([])
const currentPage = ref(1)
const pagedMessages = computed(() => messages.value.slice(0, currentPage.value * portalData.pageSize))

const newMessage = reactive({ name: '', content: '' })

function submitMessage() {
  if (!newMessage.name.trim() || !newMessage.content.trim()) return
  messages.value.unshift({
    name: newMessage.name,
    content: newMessage.content,
    date: new Date().toLocaleString().slice(5, 16),
    likes: 0,
  })
  newMessage.name = ''
  newMessage.content = ''
}

function likeMessage(idx: number) {
  messages.value[idx].likes++
}

function loadMore() {
  currentPage.value++
}
</script>

<style lang="scss" scoped>
.portal-main {
  --portal-radius: 15px;

  @media screen and (max-width: 768px) {
    --portal-radius: 5px !important;
    main {
      width: 100% !important;
      padding: var(--el-padding) !important;

      :deep() {
        .el-carousel--horizontal {
          border-radius: var(--portal-radius) !important;
        }

        .icon-panel {
          border-radius: var(--portal-radius) !important;
        }
      }
    }
  }

  .carousel-background {
    position: absolute;
    top: 0;
    width: 100%;
    height: 180px;
    background: url('/@/assets/portal_images/carousel_2.jpg');
    opacity: 0.5;
    filter: blur(100px);
  }

  main {
    width: 1152px;
    padding: var(--el-padding) 0 0 0;
    margin-right: auto;
    margin-left: auto;
    border-top: 1px solid #f3f5f6;

    .left-tab {
      width: 100%;
      height: 420px;
      padding-top: 15px;
      background: #39364d;
      border-top-left-radius: 15px;

      :deep() {
        .el-menu-item.is-active {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    :deep() {
      .el-carousel--horizontal {
        border-top-right-radius: 15px;
      }

      .el-calendar {
        padding: 0;
        margin-bottom: var(--el-margin);
        border-radius: var(--portal-radius);

        &-table {
          padding: 0;
        }

        &-day {
          height: 42px;
          line-height: 42px;
          text-align: center;
        }
      }

      .el-table {
        margin-bottom: var(--el-margin);
        border-radius: var(--portal-radius);
      }
    }

    .description-box {
      width: 100%;
      height: 120px;
      padding: 10px 20px 20px 20px;
      background: #fff;
      border: 1px solid var(--el-border-color);
      border-bottom-right-radius: 15px;
      border-bottom-left-radius: 15px;

      :deep() {
        .vab-divider--vertical {
          float: right;
          height: 6.5em;
          margin-top: -20px;
        }
      }

      h1 {
        margin-top: -10px;

        .clip {
          font-size: 32px;
          line-height: 0;
          background: linear-gradient(120deg, #bd34fe 30%, #41d1ff);
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .text {
        margin-top: -10px;
        font-size: 24px;
        font-weight: bold;
      }

      .show-box {
        padding-top: 25px;
        padding-left: 20px;

        .system-class-icon {
          float: left;
          width: 50px;
          height: 50px;
          line-height: 50px;
          color: var(--el-color-white);
          text-align: center;
          border-radius: 100%;

          [class*='ri'] {
            font-size: 24px;
          }
        }

        .describe {
          float: left;
          margin-top: 15px;
          margin-left: 20px;
          font-family: PingFangSC-Medium, serif;
          font-size: var(--el-font-size-medium);
          line-height: 22px;
          color: var(--el-color-grey);
          letter-spacing: 0.76px;
          white-space: nowrap;
        }
      }
    }

    .news-tit {
      h2 {
        font-size: 16px;
      }
    }

    .news-img {
      border: 1px solid var(--el-border-color);
      border-radius: var(--portal-radius);
    }
  }
}

:deep() {
  .el-carousel__item:nth-of-type(1) {
    background: url('/@/assets/portal_images/carousel_2.jpg');
    background-size: cover;
  }

  .el-carousel__item:nth-of-type(2) {
    background: url('/@/assets/portal_images/carousel_1.jpg');
    background-size: cover;
  }

  .el-carousel__item:nth-of-type(3) {
    background: url('/@/assets/portal_images/carousel_3.jpg');
    background-size: cover;
  }

  .vab-footer {
    margin-top: 0;
    background: var(--el-background-color);
    border: 0;
  }

  .vab-theme-setting {
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
</style>
