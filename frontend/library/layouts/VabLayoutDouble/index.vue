<template>
  <div
    class="vab-layout-double"
    :class="{
      isFixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <vab-side-bar />
    <div v-if="device === 'mobile' && !collapse" class="vab-modal" @click="foldSideBar"></div>
    <div
      class="vab-main"
      :class="{
        'is-collapse-main': collapse,
        'is-no-tabs': !showTabs,
      }"
    >
      <div
        class="vab-layout-header"
        :class="{
          'fixed-header': fixedHeader,
          'is-no-tabs': !showTabs,
        }"
      >
        <vab-nav />
        <vab-tabs v-show="showTabs" />
      </div>
      <vab-app-main />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabLayoutDouble',
})

defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
  fixedHeader: {
    type: Boolean,
    default: true,
  },
  showTabs: {
    type: Boolean,
    default: true,
  },
  device: {
    type: String,
    default: 'desktop',
  },
})

const settingsStore = useSettingsStore()
const { foldSideBar } = settingsStore
</script>

<style lang="scss" scoped>
.vab-layout-double {
  :deep() {
    .vab-side-bar:not(.is-collapse) {
      .el-menu--inline {
        padding-left: 15px;
      }

      .el-sub-menu {
        margin: 0;

        & > .el-sub-menu__title {
          padding-left: 10px;
        }
      }

      .el-menu-item {
        display: inline-block;
        width: calc(100% / 2 - 15px);
        height: 38px;
        padding: 0 0 0 15px;
        margin: 5px 5px 0 5px;
        line-height: 38px;

        .vab-dot,
        .el-tag {
          display: none;
        }

        .vab-icon {
          margin-top: 12px;
        }

        // 建议隐藏所有的子集图标
        // [class*='ri-'],
        // .vab-icon {
        // display: none;
        // }
      }
    }
  }
}
</style>
