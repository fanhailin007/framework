<template>
  <vab-card :body-style="{ padding: '20px 20px 20px 0' }">
    <template #header>
      <vab-icon icon="medal-line" />
      榜单
    </template>
    <div class="medal-list">
      <div v-for="(item, index) in iconList" :key="index" class="medal-list-item">
        <div class="medal-list-item-rank"></div>
        <div class="medal-list-item-img">
          <div :style="{ background: item.color }">
            <vab-icon :icon="item.icon" />
          </div>
        </div>
        <div class="medal-list-item-right">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-type">{{ item.type }}</div>
        </div>
      </div>
    </div>
  </vab-card>
</template>

<script lang="ts" setup>
const iconList = ref<any>([
  {
    icon: 'apple-line',
    color: 'var(--el-color-primary)',
    title: '把青春华章写在祖国大地上',
    type: '热门',
  },
  {
    icon: 'qq-line',
    color: 'var(--el-color-success)',
    title: '科技创新引领未来发展',
    type: '推荐',
  },
  {
    icon: 'wechat-line',
    color: 'var(--el-color-warning)',
    title: '数字化转型助力企业升级',
    type: '精选',
  },
  {
    icon: 'twitter-line',
    color: 'var(--el-color-danger)',
    title: '人工智能改变生活方式',
    type: '热门',
  },
  {
    icon: 'twitch-line',
    color: '#ffc069',
    title: '可持续发展理念深入人心',
    type: '推荐',
  },
])
</script>

<style lang="scss" scoped>
.medal-list {
  &-item {
    position: relative;
    clear: both;
    display: flex;
    width: 100%;
    height: 80px;
    background: var(--el-color-white);
    border-radius: 0;

    $position: (
      1: -5px -122px,
      2: -64px -83px,
      3: -123px -5px,
      4: -123px -39px,
      5: -123px -73px,
    );

    @each $key, $item in $position {
      &:nth-child(#{$key}) {
        .medal-list-item-rank {
          background-position: $item;
        }
      }
    }

    &-img {
      float: left;
      margin: 10px 16px 25px 56px;
    }

    &-img > div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      margin: auto;
      line-height: 56px;
      text-align: center;
      border-radius: 12px;

      i {
        display: block;
        margin: auto;
        font-size: 30px;
        color: var(--el-color-white);
      }
    }

    &-rank {
      position: absolute;
      top: 26px;
      left: 20px;
      width: 24px;
      height: 24px;
      background-image: url('/@/assets/rank_images/rank.png');
      background-size: 152px 151px;
    }

    &-right {
      height: 48px;
      margin: 15px 0 0 -5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .item-title {
        margin-bottom: 10px;

        color: var(--el-color-grey);
      }

      .item-type {
        display: inline-block;
        padding: 0 8px;
        font-size: var(--el-font-size-extra-small);
        line-height: 20px;
        color: var(--el-color-white);
        background: var(--el-color-warning);
        border-radius: var(--el-border-radius-base);
      }
    }
  }
}
</style>
