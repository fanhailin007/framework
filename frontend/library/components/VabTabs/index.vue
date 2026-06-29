<template>
  <div class="vab-tabs">
    <div class="vab-tabs-draggable">
      <el-tabs
        v-model="tabActive"
        class="vab-tabs-content"
        :class="{ ['vab-tabs-content-' + theme.tabsBarStyle]: true }"
        @tab-click="handleTabClick"
        @tab-remove="handleTabRemove"
      >
        <el-tab-pane v-for="item in visitedRoutes" :key="item.path" :closable="!isNoClosable(item as any)" :name="item.path">
          <template #label>
            <span class="vab-tabs-title">
              <template v-if="theme.showTabsIcon">
                <vab-icon v-if="refreshingTabs.has((item as VisitedRoute).path)" class="refreshing-icon" icon="refresh-line" />
                <vab-icon
                  v-else-if="(item as VisitedRoute).meta && (item as VisitedRoute).meta.icon"
                  :icon="(item as VisitedRoute).meta.icon"
                  :is-custom-svg="(item as VisitedRoute).meta.isCustomSvg"
                />
                <vab-icon v-else :icon="(item as VisitedRoute).parentIcon ?? 'menu-line'" />
              </template>
              <span v-if="!isNoClosable(item as VisitedRoute)" @dblclick="handleTabRemove((item as VisitedRoute).path)">
                {{ translate(((item as VisitedRoute).meta.title ?? '') as string) }}
              </span>
              <span v-else>{{ translate(((item as VisitedRoute).meta.title ?? '') as string) }}</span>
            </span>
            <span class="tab-context-catcher" @contextmenu.prevent="openMenu(item)"></span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dropdown
      placement="bottom-end"
      popper-class="vab-tabs-more-dropdown"
      @command="handleCommand"
      @visible-change="handleVisibleChange"
    >
      <span class="vab-tabs-more" :class="{ 'vab-tabs-more-active': active }">
        <span class="vab-tabs-more-icon">
          <i class="box box-t"></i>
          <i class="box box-b"></i>
        </span>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="tabs-more">
          <el-dropdown-item command="refresh">
            <vab-icon icon="refresh-line" />
            <span>{{ translate('刷新') }}</span>
          </el-dropdown-item>
          <el-dropdown-item
            :disabled="
              (tabActive === '/index' &&
                isNoClosable(visitedRoutes.find((item: VisitedRoute) => item.path === tabActive) as VisitedRoute)) ||
              false
            "
            @click="toggleTabFixedDropdown"
          >
            <vab-icon
              :icon="
                isNoClosable(visitedRoutes.find((item: VisitedRoute) => item.path === tabActive) as VisitedRoute)
                  ? 'lock-unlock-line'
                  : 'lock-line'
              "
            />
            <span>
              {{
                isNoClosable(visitedRoutes.find((item: VisitedRoute) => item.path === tabActive) as VisitedRoute)
                  ? translate('取消固定')
                  : translate('开启固定')
              }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeOthersTabs">
            <vab-icon icon="close-line" />
            <span>{{ translate('关闭其他') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="closeLeftTabs">
            <vab-icon icon="arrow-left-line" />
            <span>{{ translate('关闭左侧') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="closeRightTabs">
            <vab-icon icon="arrow-right-line" />
            <span>{{ translate('关闭右侧') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="closeAllTabs">
            <vab-icon icon="close-line" />
            <span>{{ translate('关闭全部') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="setting">
            <vab-icon icon="settings-5-line" />
            <span>{{ translate('标签设置') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ul v-if="visible" class="contextmenu el-dropdown-menu" :style="{ left: left + 'px', top: top + 'px' }">
      <li class="el-dropdown-menu__item" @click="refresh">
        <vab-icon icon="refresh-line" />
        <span>{{ translate('刷新') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{ 'is-disabled': hoverRoute?.path === '/index' && hoverRoute?.meta?.noClosable }"
        @click="toggleTabFixed"
      >
        <vab-icon :icon="hoverRoute?.meta?.noClosable ? 'lock-unlock-line' : 'lock-line'" />
        <span>{{ hoverRoute?.meta?.noClosable ? translate('取消固定') : translate('开启固定') }}</span>
      </li>
      <li class="el-dropdown-menu__item" :class="{ 'is-disabled': visitedRoutes.length === 1 }" @click="closeOthersTabs">
        <vab-icon icon="close-line" />
        <span>{{ translate('关闭其他') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{ 'is-disabled': !hoverRoute || visitedRoutes.indexOf(hoverRoute) === -1 }"
        @click="closeLeftTabs"
      >
        <vab-icon icon="arrow-left-line" />
        <span>{{ translate('关闭左侧') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{
          'is-disabled':
            !hoverRoute || visitedRoutes.indexOf(hoverRoute) === -1 || visitedRoutes.indexOf(hoverRoute) === visitedRoutes.length - 1,
        }"
        @click="closeRightTabs"
      >
        <vab-icon icon="arrow-right-line" />
        <span>{{ translate('关闭右侧') }}</span>
      </li>
      <li class="el-dropdown-menu__item" @click="closeAllTabs">
        <vab-icon icon="close-line" />
        <span>{{ translate('关闭全部') }}</span>
      </li>
    </ul>

    <vab-tabs-setting ref="tabsSettingRef" />
  </div>
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { translate } from '/@/i18n'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { moveElement } from '/@/utils/index'
import { handleActivePath, handleTabs } from '/@/utils/routes'

// 新增类型定义
interface VisitedRoute {
  path: string
  name: string
  meta: {
    title?: string
    noClosable?: boolean
    icon?: string
    isCustomSvg?: boolean
  }
  parentIcon?: string

  [key: string]: any
}

// 定义VabRoute类型
type VabRoute = RouteLocationNormalizedLoaded & {
  meta?: {
    title?: string
    noClosable?: boolean
    icon?: string
    isCustomSvg?: boolean
  }
}

defineOptions({
  name: 'VabTabs',
})

const props = defineProps({
  layout: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()
const { theme, device } = storeToRefs(settingsStore)
const routesStore = useRoutesStore()
const { getRoutes: routes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { getVisitedRoutes: visitedRoutes } = storeToRefs(tabsStore)
const _visitedRoutes = ref<VisitedRoute[]>([...(visitedRoutes.value as VisitedRoute[])])
const {
  addVisitedRoute,
  delVisitedRoute,
  delOthersVisitedRoutes,
  delLeftVisitedRoutes,
  delRightVisitedRoutes,
  delAllVisitedRoutes,
  handleCaughtRoutes,
  updateVisitedRoutes,
  changeTabsMeta,
} = tabsStore
const tabActive = ref<string>('')
const active = ref<boolean>(false)
const hoverRoute = ref<VisitedRoute | null>(null)
const visible = ref<boolean>(false)
const top = ref<number>(0)
const left = ref<number>(0)
const tabsSettingRef = ref<{ handleOpenSetting: () => void } | null>(null)

// 添加刷新图标状态管理
const refreshingTabs = ref<Set<string>>(new Set())

const isActive = (path: string) => path === handleActivePath(route, true)
const isNoClosable = (tag: VisitedRoute | null | undefined) => tag && tag.meta && tag.meta.noClosable

const handleTabClick = (tab: any) => {
  if (!isActive(tab.name)) router.push(visitedRoutes.value[tab.index])
}
const handleVisibleChange = (value: boolean) => (active.value = value)

const initNoCLosableTabs = (routes: any[]) => {
  routes.forEach((_route: { meta: { noClosable: any }; children: any }) => {
    if (_route.meta && _route.meta.noClosable) addTabs(_route as any)
    if (_route.children) initNoCLosableTabs(_route.children)
  })
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'refresh': {
      refresh()
      break
    }
    case 'closeOthersTabs': {
      closeOthersTabs()
      break
    }
    case 'closeLeftTabs': {
      closeLeftTabs()
      break
    }
    case 'closeRightTabs': {
      closeRightTabs()
      break
    }
    case 'closeAllTabs': {
      closeAllTabs()
      break
    }
    case 'setting': {
      tabsSettingRef.value?.handleOpenSetting()
      break
    }
  }
}

/**
 * 刷新当前标签页
 */
const refresh = async () => {
  let path = ''
  if (hoverRoute.value) {
    await router.push(hoverRoute.value)
    await $pub('reload-router-view', hoverRoute.value.name)
    path = hoverRoute.value.path
  } else {
    await $pub('reload-router-view')
    path = handleActivePath(route, true)
  }
  // 统一触发tab刷新动画
  $pub('refresh-current-tab', path)
  await $pub('refresh-rotate')
  await closeMenu()
}

/**
 * 添加标签页
 * @param tag route
 * @returns {Promise<void>}
 */
const addTabs = async (tag: VabRoute | RouteLocationNormalizedLoaded) => {
  const tab = handleTabs(tag)
  if (tab) {
    await addVisitedRoute(tab)
    tabActive.value = tab.path
  }
}

/**
 * 根据原生路径删除标签中的标签
 * @param rawPath 原生路径
 * @returns {Promise<void>}
 */
const handleTabRemove = async (rawPath: string | number) => {
  const path = String(rawPath)
  await delVisitedRoute(path)
  if (isActive(path)) await toLastTab()
}

/**
 * 删除其他标签页
 * @returns {Promise<void>}
 */
const closeOthersTabs = async () => {
  if (hoverRoute.value) {
    await router.push(hoverRoute.value)
    await delOthersVisitedRoutes(hoverRoute.value.path)
  } else {
    await delOthersVisitedRoutes(handleActivePath(route, true))
  }
  await closeMenu()
}
/**
 * 删除左侧标签页
 * @returns {Promise<void>}
 */
const closeLeftTabs = async () => {
  if (hoverRoute.value) {
    await router.push(hoverRoute.value)
    await delLeftVisitedRoutes(hoverRoute.value.path)
  } else {
    await delLeftVisitedRoutes(handleActivePath(route, true))
  }
  await closeMenu()
}

/**
 * 删除右侧标签页
 * @returns {Promise<void>}
 */
const closeRightTabs = async () => {
  if (hoverRoute.value) {
    await router.push(hoverRoute.value)
    await delRightVisitedRoutes(hoverRoute.value.path)
  } else {
    await delRightVisitedRoutes(handleActivePath(route, true))
  }
  await closeMenu()
}

/**
 * 删除所有标签页
 * @returns {Promise<void>}
 */
const closeAllTabs = async () => {
  await delAllVisitedRoutes()
  await toLastTab()
  await closeMenu()
}

/**
 * 跳转最后一个标签页
 */
const toLastTab = async () => {
  const latestView = visitedRoutes.value.findLast((item: VisitedRoute) => item.path !== handleActivePath(route, true))
  if (latestView) await router.push(latestView)
  else await router.push('/')
}

const { x, y } = useMouse()

const openMenu = (item: VisitedRoute) => {
  left.value = x.value
  top.value = y.value
  hoverRoute.value = item
  visible.value = true
}

const closeMenu = () => {
  visible.value = false
  hoverRoute.value = null
}

// 设置 Sortable 全局选项，避免多实例冲突

let sortable: Sortable | null = null

const sortableId = ref(Date.now().toString())

const handleTabDrag = () => {
  nextTick(() => {
    if (!theme.value.tabDrag || device.value === 'mobile') {
      if (sortable) {
        try {
          sortable.destroy()
        } catch (error) {
          console.warn('销毁拖拽实例出错:', error)
        } finally {
          sortable = null
        }
      }
      return
    }

    const navElement = document.querySelector('.el-tabs__nav.is-top') as HTMLElement
    if (!navElement) return

    if (sortable) {
      try {
        sortable.destroy()
      } catch (error) {
        console.warn('销毁拖拽实例出错:', error)
      } finally {
        sortable = null
      }
    }

    sortableId.value = Date.now().toString()
    const currentId = sortableId.value

    sortable = new Sortable(navElement, {
      animation: 300,
      easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
      draggable: '.el-tabs__item.is-top.is-closable',
      filter: '.el-tabs__active-bar.is-top',
      preventOnFilter: true,
      dataIdAttr: `data-sortable-id-${currentId}`,
      onStart() {
        navElement.dataset.activeSort = currentId
      },
      onEnd(e: any) {
        try {
          if (navElement.dataset.activeSort !== currentId) return
          delete navElement.dataset.activeSort

          if (!e || typeof e.oldIndex !== 'number' || typeof e.newIndex !== 'number') return
          if (e.oldIndex === e.newIndex) return

          const routes = moveElement([...visitedRoutes.value], parseInt(e.oldIndex) - 1, parseInt(e.newIndex) - 1) as VisitedRoute[]

          // 更新路由数据
          updateVisitedRoutes(routes)
          _visitedRoutes.value = [...routes]
        } catch (error) {
          console.error('处理拖拽结束事件时出错:', error)
        }
      },
    })
  })
}

watchEffect(() => {
  if (visible.value) document.body.addEventListener('click', closeMenu)
  else document.body.removeEventListener('click', closeMenu)
})

watch(
  () => route.fullPath,
  () => {
    initNoCLosableTabs(routes.value)
    addTabs(route)
  },
  { immediate: true }
)

// 监听主题变化和布局变化时重新初始化拖拽
watch(
  [() => theme.value, () => props.layout],
  () => {
    handleTabDrag()
  },
  { immediate: true, deep: true }
)

// 监听标签变化时，确保拖拽功能仍然可用
watch([() => visitedRoutes.value.length, () => tabActive.value], () => {
  nextTick(() => {
    handleTabDrag()
  })
})

// 组件挂载后初始化拖拽
onMounted(() => {
  handleTabDrag()
})

// 组件销毁前清理拖拽实例
onBeforeUnmount(() => {
  if (sortable) {
    try {
      sortable.destroy()
    } catch (error) {
      console.warn('组件卸载时清理拖拽实例出错:', error)
    } finally {
      sortable = null
    }
  }
})

onBeforeMount(() => {
  window.addEventListener('beforeunload', handleCaughtRoutes)

  // 监听刷新当前tab事件，接收path参数
  $sub('refresh-current-tab', (path?: string) => {
    // 如果没有传递path参数，使用当前激活的标签页路径
    const targetPath = path || handleActivePath(route, true)
    if (targetPath) {
      refreshingTabs.value.add(targetPath)
      setTimeout(() => refreshingTabs.value.delete(targetPath), 2000)
    }
  })

  // 监听刷新全部tabs事件
  $sub('refresh-all-tabs', () => {
    visitedRoutes.value.forEach((tab: VisitedRoute) => refreshingTabs.value.add(tab.path))
    setTimeout(() => refreshingTabs.value.clear(), 2000)
  })
})

const toggleTabFixed = () => {
  if (!hoverRoute.value) return
  // 首页不允许取消固定
  if (hoverRoute.value.path === '/index' && hoverRoute.value.meta.noClosable) return
  changeTabsMeta({
    name: hoverRoute.value.name,
    meta: { noClosable: !hoverRoute.value.meta.noClosable },
  })
  closeMenu()
}

const toggleTabFixedDropdown = () => {
  const current = visitedRoutes.value.find((item: VisitedRoute) => item.path === tabActive.value)
  if (!current?.meta) return
  if (current.path === '/index' && current.meta.noClosable) return
  changeTabsMeta({
    name: current.name,
    meta: { noClosable: !current.meta.noClosable },
  })
}
</script>

<style lang="scss">
.vab-tabs-more-dropdown {
  width: 135px;
  padding: calc(var(--el-padding) / 2) !important;

  .el-dropdown-menu {
    padding: 0;

    &__item {
      border-radius: var(--el-border-radius-base);
    }
  }

  &[data-popper-placement='bottom-end'] {
    .el-popper__arrow {
      left: 120px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.vab-tabs {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--el-tabs-height);
  padding-right: var(--el-padding);
  padding-left: var(--el-padding);
  user-select: none;
  background: var(--el-color-white);

  .vab-tabs-draggable {
    width: calc(100% - var(--el-margin));
  }

  :deep() {
    .el-tabs {
      &__nav-wrap::after {
        background: none;
      }

      &__item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: var(--el-padding) !important;
        padding-left: var(--el-padding) !important;

        .is-icon-close {
          width: 14px !important;
          margin-top: 1px;
          margin-right: 0 !important;

          svg {
            margin-right: 0 !important;
          }
        }
      }

      &__active-bar {
        display: none;
      }

      &__nav-next,
      &__nav-prev {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--el-tab-item-height);
      }

      &__content {
        display: none;
        height: 0;
        opacity: 0;
      }
    }
  }

  &-content {
    width: 100%;

    &-glass {
      height: var(--el-tab-item-height);

      :deep() {
        .el-tabs__header {
          margin: 0 0 1px 0;

          .el-tabs__item {
            position: relative;
            height: var(--el-tab-item-height);
            margin-right: 5px;
            overflow: hidden;
            color: var(--el-color-primary-light-1);
            border: 1px solid var(--el-color-primary-light-1) !important;
            border-radius: var(--el-border-radius-base) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            &:hover {
              color: #fff; //不要用动态变量
              background: var(--el-color-primary-light-1);

              &::before {
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                content: '';
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: shimmer 0.6s ease-in-out;
              }
            }

            &.is-active {
              color: #fff; //不要用动态变量
              background: var(--el-color-primary-light-1);
              border-color: var(--el-color-primary-light-1) !important;
            }

            @keyframes shimmer {
              0% {
                left: -100%;
              }
              100% {
                left: 100%;
              }
            }
          }
        }
      }
    }

    &-smart {
      height: var(--el-tab-item-height);

      :deep() {
        .el-tabs__header {
          margin: 0 0 1px 0;

          .el-tabs__item {
            height: var(--el-tab-item-height);
            margin-right: 5px;
            border: 0;
            border-top-left-radius: var(--el-border-radius-base);
            border-top-right-radius: var(--el-border-radius-base);

            &.is-active {
              outline: none;
              background: var(--el-color-primary-light-9);

              &:after {
                width: 100%;
                transition: var(--el-transition);
              }
            }

            &:after {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 0;
              height: 2px;
              content: '';
              background-color: var(--el-color-primary);
              transition: var(--el-transition);
            }

            &:hover {
              background: var(--el-color-primary-light-9);

              &:after {
                width: 100%;
                transition: var(--el-transition);
              }
            }
          }
        }
      }
    }

    &-smooth {
      height: var(--el-tab-item-height);

      :deep() {
        .el-tabs__nav {
          margin-top: 3.5px;
        }

        .el-tabs__header {
          margin: 0 0 -7px 0;

          .el-tabs__item {
            //  min-width: 120px;
            height: calc(var(--el-tab-item-height) + 4px);
            margin-right: -18px;

            &:hover {
              z-index: 999;
              color: var(--el-color-grey);
              background: var(--el-border-color);
              mask: url('/@/assets/tabs_images/vab-tab.png');
              mask-layer: url('/@/assets/tabs_images/vab-tab.png');
              mask-size: 100% 100%;
            }

            .vab-tabs-title {
              flex: 1;
              margin: 0 calc(var(--el-margin) / 2) 0 calc(var(--el-margin) / 2);
            }

            &.is-active {
              color: var(--el-color-primary);
              background: var(--el-color-primary-light-9);
              mask: url('/@/assets/tabs_images/vab-tab.png');
              mask-layer: url('/@/assets/tabs_images/vab-tab.png');
              mask-size: 100% 100%;

              &:hover {
                color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
                mask: url('/@/assets/tabs_images/vab-tab.png');
                mask-size: 100% 100%;
              }
            }
          }
        }
      }
    }

    &-card {
      height: var(--el-tab-item-height);

      :deep() {
        .el-tabs__header {
          .el-tabs__item {
            height: var(--el-tab-item-height);
            margin-right: 5px;
            border: 1px solid var(--el-border-color) !important;
            border-radius: var(--el-border-radius-base) !important;

            &:hover {
              color: var(--el-color-primary);
              background: var(--el-color-primary-light-9);

              &::before {
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                content: '';
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: shimmer 0.6s ease-in-out;
              }
            }

            &.is-active {
              color: var(--el-color-primary);
              background: var(--el-color-primary-light-9);
            }
          }
        }
      }
    }

    &-rect {
      height: var(--el-tabs-height);

      :deep() {
        .el-tabs__header {
          height: var(--el-tabs-height);
          margin: -1px 0 0 0;
          .el-tabs__nav {
            height: var(--el-tabs-height);

            .el-tabs__item {
              height: var(--el-tabs-height);

              &.is-active {
                background: var(--el-color-primary-light-9);
              }
            }
          }

          .el-tabs__nav-prev,
          .el-tabs__nav-next {
            height: var(--el-tabs-height);
            line-height: var(--el-tabs-height);
          }
        }
      }
    }
  }

  .contextmenu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    padding: calc(var(--el-padding) / 2);

    box-shadow: var(--el-box-shadow);

    i {
      margin-right: 3px;
    }

    .el-dropdown-menu__item:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      border-radius: var(--el-border-radius-base);
    }
  }

  &-more {
    position: relative;
    box-sizing: border-box;
    display: block;
    text-align: left;

    &-active,
    &:hover {
      &:after {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 0;
        content: '';
      }

      .vab-tabs-more-icon {
        transform: rotate(90deg);

        .box-t {
          &:before {
            transform: rotate(45deg);
          }
        }

        .box:before,
        .box:after {
          background: var(--el-color-primary);
        }
      }
    }

    &-icon {
      display: inline-block;
      color: var(--el-color-grey);
      cursor: pointer;
      transition: transform 0.3s ease-out;

      .box {
        position: relative;
        display: block;
        width: 14px;
        height: 8px;

        &:before {
          position: absolute;
          top: 2px;
          left: 0;
          width: 6px;
          height: 6px;
          content: '';
          background: var(--el-color-grey);
        }

        &:after {
          position: absolute;
          top: 2px;
          left: 8px;
          width: 6px;
          height: 6px;
          content: '';
          background: var(--el-color-grey);
        }
      }

      .box-t {
        &:before {
          transition: transform 0.3s ease-out 0.3s;
        }
      }
    }
  }

  .refreshing-icon {
    animation: refreshing 1s linear infinite;
  }

  @keyframes refreshing {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}

.tab-context-catcher {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: transparent;
}

:deep(.el-tabs__item) {
  position: relative;
}

:deep(.el-tabs__item .is-icon-close) {
  position: relative;
  z-index: 3;
}
</style>
