<template>
  <div class="new-container no-background-container">
    <el-row v-infinite-scroll="loadMore" :gutter="20" :infinite-scroll-disabled="loading || noMore">
      <el-col v-for="(item, index) in list" :key="index" :lg="6" :md="12" :sm="12" :xl="6" :xs="24">
        <vab-card :body-style="{ padding: 0 }">
          <div class="card-body" @click="handleDetail(item)">
            <div class="image-group">
              <img
                alt=""
                class="image"
                :src="item.image"
                :style="
                  item.fullImage
                    ? {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        inset: 0,
                      }
                    : ''
                "
              />
            </div>
            <div :class="item.fullImage ? 'full-box' : ''">
              <div class="logo">
                <el-avatar :size="18" :src="item.logo" />
                <div class="user">{{ item.user }}</div>
                <vab-icon icon="time-line" />
                <div class="time">{{ item.time }}</div>
              </div>
              <div class="title">{{ item.title }}</div>
            </div>
          </div>
        </vab-card>
      </el-col>
    </el-row>
    <div v-if="loading" style="padding: 10px; text-align: center">加载中...</div>
    <div v-if="noMore" style="padding: 10px; text-align: center">没有更多了</div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { getList } from '/@/api/news'

const router = useRouter()
const list = ref<any[]>([])
const pageNo = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const noMore = ref(false)

const fetchData = async (reset = false) => {
  if (loading.value || noMore.value) return
  loading.value = true
  const { data } = await getList({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
  })
  if (reset) {
    list.value = data.list
  } else {
    list.value = list.value.concat(data.list)
  }
  if (list.value.length >= data.total || data.list.length < pageSize.value) {
    noMore.value = true
  }
  loading.value = false
}

const loadMore = async () => {
  if (loading.value || noMore.value) return
  pageNo.value++
  await fetchData()
}

const handleDetail = (query: any) => {
  router.push({ path: '/template/newsDetail', query })
}

onBeforeMount(() => {
  list.value = []
  pageNo.value = 1
  noMore.value = false
  fetchData(true)
})
</script>

<style lang="scss" scoped>
.new-container {
  .card-body {
    position: relative;
    height: 320px;
    cursor: pointer;

    .image-group {
      height: 200px;
      overflow: hidden;

      .image {
        width: 100%;
        height: 200px;
        transition: all ease-in-out 0.3s !important;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    .full-box {
      position: absolute;
      bottom: var(--el-margin);
      color: var(--el-color-white);
    }

    .logo {
      display: flex;
      align-items: center;
      margin: 10px 15px;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;

      .user {
        margin-left: 5px;
      }

      [class*='ri-'] {
        margin-right: 3px;
        margin-left: 5px;
      }
    }

    .title {
      margin: 10px 15px;
      overflow: hidden;
      font-size: var(--el-font-size-large);
      font-weight: 600;
      line-height: 24px;
      color: currentcolor;
    }
  }
}
</style>
