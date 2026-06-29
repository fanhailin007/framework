<template>
  <div class="vab-search">
    <!-- 手机端只显示搜索图标 -->
    <div v-if="device === 'mobile'" class="search-icon-wrapper" @click="openSearchDialog">
      <vab-icon icon="search-line" />
    </div>
    <!-- 电脑端显示搜索输入框 -->
    <div v-else class="search-input-wrapper" @click="openSearchDialog">
      <el-input v-model="searchKeyword" class="search-input" :placeholder="placeholder" readonly @keydown.enter="openSearchDialog">
        <template #prefix>
          <el-icon class="search-icon">
            <search />
          </el-icon>
        </template>
      </el-input>
    </div>

    <!-- 搜索弹框 -->
    <vab-dialog
      v-model="dialogVisible"
      :append-to-body="true"
      class="search-dialog search-glass-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :modal-append-to-body="true"
      :title="translate('AI智能搜索')"
      width="600px"
    >
      <div class="search-dialog-content">
        <!-- 搜索输入框 -->
        <div class="dialog-search-input">
          <el-input
            ref="searchInputRef"
            v-model="searchKeyword"
            class="main-search-input"
            :placeholder="translate('输入关键词搜索')"
            @focus="handleFocus"
            @input="handleSearch"
            @keydown="handleKeydown"
          >
            <template #prefix>
              <el-icon class="search-icon">
                <search />
              </el-icon>
            </template>
            <template #suffix>
              <el-icon v-if="searchKeyword" class="clear-icon" @click="clearSearch">
                <close />
              </el-icon>
            </template>
          </el-input>
        </div>

        <!-- 搜索历史 -->
        <div v-if="!searchKeyword && searchHistory.length > 0" class="search-history">
          <div class="history-header">
            <span class="history-title">{{ translate('搜索历史') }}</span>
            <el-button class="clear-history-btn" size="small" text @click="clearHistory">
              {{ translate('清空历史') }}
            </el-button>
          </div>
          <div class="history-list">
            <div v-for="(item, index) in searchHistory" :key="index" class="history-item" @click="selectHistory(item)">
              <el-icon class="history-icon">
                <clock />
              </el-icon>
              <span class="history-text">{{ item }}</span>
              <el-icon class="delete-icon" @click.stop="removeHistory(index)">
                <close />
              </el-icon>
            </div>
          </div>
        </div>

        <!-- 搜索建议 -->
        <div v-if="searchKeyword && searchSuggestions.length > 0" class="search-suggestions">
          <div class="suggestions-title">{{ translate('搜索建议') }}</div>
          <div class="suggestions-list">
            <div
              v-for="(suggestion, index) in searchSuggestions"
              :key="index"
              class="suggestion-item"
              :class="{ active: index === activeIndex }"
              @click="selectSuggestion(suggestion)"
              @mouseenter="activeIndex = index"
            >
              <el-icon class="suggestion-icon">
                <search />
              </el-icon>
              <span class="suggestion-text" v-html="highlightText(suggestion)"></span>
            </div>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div v-if="searchKeyword && searchResults.length > 0" class="search-results">
          <div class="results-header">
            <span class="results-title">{{ translate('搜索结果') }} ({{ searchResults.length }})</span>
          </div>
          <div class="results-list">
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="result-item"
              :class="{ active: index === activeIndex }"
              @click="selectResult(result)"
              @mouseenter="activeIndex = index"
            >
              <div class="result-icon">
                <vab-icon :icon="result.icon || 'file-text-line'" :is-custom-svg="result.meta?.isCustomSvg || false" />
              </div>
              <div class="result-content">
                <div class="result-title" v-html="highlightText(result.title)"></div>
                <div v-if="result.path" class="result-path">
                  {{ result.path }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div v-if="searchKeyword && searchResults.length === 0 && !isSearching" class="no-results">
          <el-icon class="no-results-icon">
            <search />
          </el-icon>
          <div class="no-results-text">{{ translate('未找到相关结果') }}</div>
          <div class="no-results-tips">
            {{ translate('尝试使用其他关键词或检查拼写') }}
          </div>
        </div>

        <!-- 搜索中提示 -->
        <div v-if="isSearching" class="searching">
          <el-icon class="searching-icon" :class="{ rotating: isSearching }">
            <loading />
          </el-icon>
          <div class="searching-text">{{ translate('搜索中') }}</div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <div class="shortcut-tips">
            <span class="shortcut-item">
              {{ translate('Enter: 确认搜索') }}
            </span>
            <span class="shortcut-item">{{ translate('Esc: 关闭弹框') }}</span>
            <span class="shortcut-item">{{ translate('↑↓: 选择项目') }}</span>
          </div>
          <div class="footer-buttons">
            <el-button @click="dialogVisible = false">
              {{ translate('取消') }}
            </el-button>
            <el-button :disabled="!searchKeyword" type="primary" @click="confirmSearch">
              {{ translate('搜索') }}
            </el-button>
          </div>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Clock, Close, Loading, Search } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { $baseMessage } from '/@/hooks'
import { translate } from '/@/i18n'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'

interface SearchResult {
  title: string
  path: string
  icon?: string
  route?: string
  meta?: any
}

interface Props {
  placeholder?: string
  showShortcut?: boolean
  maxHistory?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: translate('AI智能搜索'),
  showShortcut: true,
  maxHistory: 10,
})

const router = useRouter()
const settingsStore = useSettingsStore()
const routesStore = useRoutesStore()
const { theme, device } = storeToRefs(settingsStore)
const { getAllRoutes: allRoutes } = storeToRefs(routesStore)

// 响应式数据
const searchKeyword = ref('')
const dialogVisible = ref(false)
const searchInputRef = ref()
const searchHistory = ref<string[]>([])
const searchSuggestions = ref<string[]>([])
const searchResults = ref<SearchResult[]>([])
const activeIndex = ref(-1)
const isSearching = ref(false)

// 从真实路由数据生成搜索建议
const generateSuggestions = computed(() => {
  const suggestions: string[] = []

  const extractTitles = (routes: any[]) => {
    routes.forEach((route) => {
      // 允许包含隐藏路由的标题
      if (route.meta && route.meta.title) {
        const title = translate(route.meta.title)
        if (!suggestions.includes(title)) {
          suggestions.push(title)
        }
      }
      if (route.children && route.children.length > 0) {
        extractTitles(route.children)
      }
    })
  }

  extractTitles(allRoutes.value)
  return suggestions
})

// 从真实路由数据生成搜索结果
const generateSearchResults = (keyword: string): SearchResult[] => {
  const results: SearchResult[] = []

  const searchInRoutes = (routes: any[], parentPath = '') => {
    routes.forEach((route) => {
      // 允许搜索hidden路由，但标记为特殊类型
      if (route.meta && route.meta.title) {
        const title = translate(route.meta.title)
        const path = route.path
        const isHidden = route.meta.hidden

        // 构建完整路径
        let fullPath = path
        if (parentPath && path !== '/') {
          // 确保路径正确拼接，避免多余的斜线
          if (parentPath.endsWith('/') && path.startsWith('/')) {
            fullPath = parentPath + path.slice(1)
          } else if (!parentPath.endsWith('/') && !path.startsWith('/')) {
            fullPath = `${parentPath}/${path}`
          } else {
            fullPath = parentPath + path
          }
        } else if (parentPath === '/' && path !== '/') {
          // 特殊处理：父路径是根路径，子路径不是根路径
          fullPath = `/${path}`
        }

        // 搜索标题、路径、图标等
        const searchText = `${title} ${path} ${route.meta.icon || ''}`.toLowerCase()
        if (searchText.includes(keyword.toLowerCase())) {
          results.push({
            title: isHidden ? `${title} (${translate('隐藏路由')})` : title,
            path: fullPath,
            icon: route.meta.icon || 'file-text-line',
            route: fullPath,
            meta: {
              ...route.meta,
              name: route.name, // 确保包含路由名称
              routeName: route.name, // 添加一个明确的字段
              isHidden, // 标记是否为隐藏路由
              isDynamic: route.meta.dynamicNewTab, // 标记是否为动态路由
              isCustomSvg: route.meta.isCustomSvg || false, // 确保包含自定义SVG标记
            },
          })
        }
      }

      // 递归搜索子路由
      if (route.children && route.children.length > 0) {
        // 对于根路径，传递根路径字符串
        const currentPath = route.path === '/' ? '/' : route.path
        searchInRoutes(route.children, currentPath)
      }
    })
  }

  searchInRoutes(allRoutes.value)
  return results
}

// 打开搜索弹框
const openSearchDialog = () => {
  dialogVisible.value = true
  nextTick(() => {
    setTimeout(() => {
      searchInputRef.value?.focus?.()
    }, 100)
  })
}

// 处理搜索输入
const handleSearch = () => {
  if (!searchKeyword.value) {
    searchSuggestions.value = []
    searchResults.value = []
    activeIndex.value = -1
    return
  }

  // 生成搜索建议
  searchSuggestions.value = generateSuggestions.value
    .filter((item) => item.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    .slice(0, 5)

  // 模拟搜索延迟
  isSearching.value = true
  setTimeout(() => {
    searchResults.value = generateSearchResults(searchKeyword.value)
    isSearching.value = false
    activeIndex.value = -1
  }, 300)
}

// 处理键盘事件
const handleKeydown = (e: Event) => {
  const keyboardEvent = e as KeyboardEvent
  const maxIndex = Math.max(searchSuggestions.value.length - 1, searchResults.value.length - 1)

  switch (keyboardEvent.key) {
    case 'ArrowDown': {
      keyboardEvent.preventDefault()
      activeIndex.value = activeIndex.value < maxIndex ? activeIndex.value + 1 : 0
      break
    }
    case 'ArrowUp': {
      keyboardEvent.preventDefault()
      activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : maxIndex
      break
    }
    case 'Enter': {
      keyboardEvent.preventDefault()
      if (activeIndex.value >= 0) {
        if (searchSuggestions.value.length > 0) {
          selectSuggestion(searchSuggestions.value[activeIndex.value])
        } else if (searchResults.value.length > 0) {
          selectResult(searchResults.value[activeIndex.value])
        }
      } else {
        confirmSearch()
      }
      break
    }
    case 'Escape': {
      dialogVisible.value = false
      break
    }
  }
}

// 处理焦点事件
const handleFocus = () => {
  if (searchKeyword.value) {
    handleSearch()
  }
}

// 选择搜索建议
const selectSuggestion = (suggestion: string) => {
  searchKeyword.value = suggestion
  handleSearch()
}

// 选择搜索结果
const selectResult = (result: SearchResult) => {
  if (result.route) {
    try {
      console.log('尝试跳转到:', result)

      // 检查是否是外部链接或有target配置
      if (result.meta && (result.meta.target === '_blank' || result.meta.target === '_self')) {
        // 使用hash路由格式在新标签页打开
        const hashPath = result.route.startsWith('/') ? result.route.slice(1) : result.route
        const url = `${globalThis.location.origin}${globalThis.location.pathname}#/${hashPath}`
        window.open(url, result.meta.target || '_blank')
        addToHistory(result.title)
        dialogVisible.value = false
        searchKeyword.value = ''
        $baseMessage(`${translate('已在新标签页打开')} ${result.title}`, 'success', 'hey')
        return
      }

      // 检查是否是隐藏路由
      if (result.meta && result.meta.isHidden) {
        $baseMessage(`${result.title} ${translate('是隐藏路由，可能需要特殊权限')}`, 'warning', 'hey')
      }

      // 检查权限
      if (result.meta && result.meta.guard) {
        console.log('路由需要权限:', result.meta.guard)
        // 这里可以添加权限检查逻辑，暂时跳过
      }

      // 检查是否是动态路由（包含参数）
      if (result.route.includes(':')) {
        // 动态路由需要特殊处理，这里可以添加默认参数或提示用户
        console.warn('动态路由需要参数:', result.route)
        $baseMessage(`${result.title} ${translate('需要参数，请从菜单直接访问')}`, 'warning', 'hey')
        return
      }

      // 检查是否是动态新标签页路由
      if (result.meta && result.meta.isDynamic) {
        $baseMessage(`${result.title} ${translate('是动态路由，将新开标签页')}`, 'info', 'hey')
      }

      // 获取路由名称
      const routeName = result.meta?.name || result.meta?.routeName

      // 优先使用路由名称跳转，如果失败则使用路径
      if (routeName) {
        try {
          console.log('使用路由名称跳转:', routeName)
          router.push({ name: routeName })
        } catch (nameError) {
          // 如果名称跳转失败，尝试路径跳转
          console.warn('路由名称跳转失败，尝试路径跳转:', nameError)
          try {
            router.push(result.route)
          } catch (pathError) {
            console.error('路径跳转也失败:', pathError)
            // 如果路径跳转也失败，尝试使用window.open
            console.log('尝试使用window.open跳转:', result.route)
            const hashPath = result.route.startsWith('/') ? result.route.slice(1) : result.route
            const url = `${globalThis.location.origin}${globalThis.location.pathname}#/${hashPath}`
            window.open(url, '_blank')
            $baseMessage(`${translate('已在新标签页打开')} ${result.title}`, 'success', 'hey')
            addToHistory(result.title)
            dialogVisible.value = false
            searchKeyword.value = ''
            return
          }
        }
      } else {
        // 没有名称时使用路径跳转
        console.log('使用路径跳转:', result.route)
        try {
          router.push(result.route)
        } catch (pathError) {
          console.error('路径跳转失败:', pathError)
          // 如果路径跳转失败，尝试使用window.open
          console.log('尝试使用window.open跳转:', result.route)
          const hashPath = result.route.startsWith('/') ? result.route.slice(1) : result.route
          const url = `${globalThis.location.origin}${globalThis.location.pathname}#/${hashPath}`
          window.open(url, '_blank')
          $baseMessage(`${translate('已在新标签页打开')} ${result.title}`, 'success', 'hey')
          addToHistory(result.title)
          dialogVisible.value = false
          searchKeyword.value = ''
          return
        }
      }

      addToHistory(result.title)
      dialogVisible.value = false
      searchKeyword.value = ''
      $baseMessage(`${translate('已跳转到')} ${result.title}`, 'success', 'hey')
    } catch (error) {
      console.error('路由跳转失败:', error, result)
      // 最后的备选方案：使用window.open
      try {
        const hashPath = result.route.startsWith('/') ? result.route.slice(1) : result.route
        const url = `${globalThis.location.origin}${globalThis.location.pathname}#/${hashPath}`
        window.open(url, '_blank')
        $baseMessage(`${translate('已在新标签页打开')} ${result.title}`, 'success', 'hey')
        addToHistory(result.title)
        dialogVisible.value = false
        searchKeyword.value = ''
      } catch (finalError) {
        console.error('所有跳转方式都失败:', finalError)
        $baseMessage(`${translate('无法跳转到')} ${result.title}，${translate('请检查路由配置')}`, 'error', 'hey')
      }
    }
  }
}

// 确认搜索
const confirmSearch = () => {
  if (searchKeyword.value) {
    addToHistory(searchKeyword.value)
    // 如果只有一个搜索结果，直接跳转
    if (searchResults.value.length === 1) {
      selectResult(searchResults.value[0])
    } else {
      // 否则显示搜索结果
      console.log('执行搜索:', searchKeyword.value)
      dialogVisible.value = false
    }
  }
}

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = ''
  searchSuggestions.value = []
  searchResults.value = []
  activeIndex.value = -1
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// 选择历史记录
const selectHistory = (item: string) => {
  searchKeyword.value = item
  handleSearch()
}

// 移除历史记录
const removeHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 清空历史记录
const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// 添加到历史记录
const addToHistory = (keyword: string) => {
  if (!keyword.trim()) return

  const index = searchHistory.value.indexOf(keyword)
  if (index !== -1) {
    searchHistory.value.splice(index, 1)
  }

  searchHistory.value.unshift(keyword)

  if (searchHistory.value.length > props.maxHistory) {
    searchHistory.value = searchHistory.value.slice(0, props.maxHistory)
  }

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 高亮文本
const highlightText = (text: string) => {
  if (!searchKeyword.value) return text
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 加载历史记录
const loadHistory = () => {
  try {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      searchHistory.value = JSON.parse(history)
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error)
  }
}

// 监听全局快捷键
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    openSearchDialog()
  }
}

onMounted(() => {
  loadHistory()
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style lang="scss" scoped>
.vab-search {
  position: relative;

  .search-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    transition: none;

    .vab-icon {
      font-size: 22px;
      color: var(--el-color-primary);
    }

    &:hover {
      box-shadow: none;
      transform: none;
    }
  }

  .search-input-wrapper {
    width: 120px;
    cursor: pointer;

    .search-input {
      :deep(.el-input__wrapper) {
        background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
        border: none;
        border-radius: var(--el-border-radius-round);
        box-shadow: 0 4px 5px rgba(var(--el-color-primary-rgb), 0.3);
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 4px 5px rgba(var(--el-color-primary-rgb), 0.4);
        }

        &:focus-within {
          box-shadow: 0 4px 5px rgba(var(--el-color-primary-rgb), 0.5);
        }
      }

      :deep(.el-input__inner) {
        font-weight: 500;
        color: #fff;

        &::placeholder {
          color: #fff;
        }
      }

      .search-icon {
        font-size: 16px;
        color: #fff;
      }
    }
  }
}

.search-dialog-content {
  max-height: 500px;
  overflow-y: auto;

  .dialog-search-input {
    padding: 20px 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .main-search-input {
      width: 100%;
      max-width: 500px;

      :deep(.el-input__wrapper) {
        height: 48px;
        border-radius: var(--el-border-radius-base);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:focus-within {
          box-shadow: 0 4px 16px rgba(var(--el-color-primary-rgb), 0.3);
        }
      }

      .search-icon {
        color: var(--el-color-primary);
      }

      .clear-icon {
        color: var(--el-text-color-placeholder);
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  .search-history {
    padding: 16px 24px;

    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .history-title {
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .clear-history-btn {
        font-size: 12px;
        color: var(--el-text-color-placeholder);

        &:hover {
          color: var(--el-text-color-regular);
        }
      }
    }

    .history-list {
      .history-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: var(--el-border-radius-base);
        transition: all 0.3s ease;

        &:hover {
          background: var(--el-fill-color-light);
        }

        .history-icon {
          margin-right: 8px;
          font-size: 14px;
          color: var(--el-text-color-placeholder);
        }

        .history-text {
          flex: 1;
          font-size: 14px;
          color: var(--el-text-color-regular);
        }

        .delete-icon {
          color: var(--el-border-color);
          cursor: pointer;
          transition: color 0.3s ease;

          &:hover {
            color: var(--el-text-color-placeholder);
          }
        }
      }
    }
  }

  .search-suggestions {
    padding: 16px 24px;

    .suggestions-title {
      margin-bottom: 12px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .suggestions-list {
      .suggestion-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: var(--el-border-radius-base);
        transition: all 0.3s ease;

        &:hover,
        &.active {
          background: var(--el-color-primary-light-9);
        }

        .suggestion-icon {
          margin-right: 8px;
          font-size: 14px;
          color: var(--el-color-primary);
        }

        .suggestion-text {
          flex: 1;
          font-size: 14px;
          color: var(--el-text-color-primary);

          .highlight {
            font-weight: 600;
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  .search-results {
    padding: 16px 24px;

    .results-header {
      margin-bottom: 12px;

      .results-title {
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .results-list {
      .result-item {
        display: flex;
        align-items: center;
        padding: 12px;
        cursor: pointer;
        border-radius: var(--el-border-radius-base);
        transition: all 0.3s ease;

        &:hover,
        &.active {
          background: var(--el-color-primary-light-9);
        }

        .result-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          margin-right: 12px;
          background: var(--el-color-primary);
          border-radius: var(--el-border-radius-base);

          :deep(i) {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            margin: auto !important;
            font-size: 18px;
            color: #fff;
          }
        }

        .result-content {
          flex: 1;

          .result-title {
            margin-bottom: 4px;
            font-weight: 600;
            color: var(--el-text-color-primary);

            .highlight {
              font-weight: 700;
              color: var(--el-color-primary);
            }
          }

          .result-path {
            font-size: 12px;
            color: var(--el-text-color-regular);
          }
        }
      }
    }
  }

  .no-results {
    padding: 40px 24px;
    text-align: center;

    .no-results-icon {
      margin-bottom: 16px;
      font-size: 48px;
      color: var(--el-border-color);
    }

    .no-results-text {
      margin-bottom: 8px;
      font-size: 16px;
      color: var(--el-text-color-regular);
    }

    .no-results-tips {
      font-size: 14px;
      color: var(--el-text-color-placeholder);
    }
  }

  .searching {
    padding: 40px 24px;
    text-align: center;

    .searching-icon {
      margin-bottom: 12px;
      font-size: 24px;
      color: var(--el-color-primary);

      &.rotating {
        animation: rotate 1s linear infinite;
      }
    }

    .searching-text {
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
  }
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .shortcut-tips {
    display: flex;
    gap: 16px;

    .shortcut-item {
      font-size: 12px;
      color: var(--el-text-color-placeholder);

      &::before {
        margin-right: 4px;
        font-weight: bold;
        content: '⌘';
      }
    }
  }

  .footer-buttons {
    display: flex;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
