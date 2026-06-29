<template>
  <div class="pull-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.title" clearable placeholder="请输入标题" />
          </el-form-item>
          <el-form-item v-show="!fold">
            <el-input v-model="queryForm.author" clearable placeholder="请输入作者" />
          </el-form-item>
          <el-form-item v-show="!fold">
            <el-date-picker v-model="queryForm.datetime" format="YYYY/MM/DD HH:mm:ss" placeholder="请选择时间" type="datetime" />
          </el-form-item>
          <el-form-item v-show="!fold">
            <el-select v-model="queryForm.status" placeholder="请选择状态">
              <el-option label="success" value="published" />
              <el-option label="primary" value="draft" />
              <el-option label="danger" value="deleted" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData">查询</el-button>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
            <el-button class="hidden-xs-only" text type="primary" @click="handleFold">
              <span v-if="fold">展开</span>
              <span v-else>合并</span>
              <vab-icon class="vab-dropdown" :class="{ 'vab-dropdown-active': fold }" icon="arrow-up-s-line" />
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel :span="24">
        <el-button :icon="Plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete">删除</el-button>
        <el-button type="primary" @click="handleDetail">详情</el-button>
        <el-button class="hidden-xs-only" type="primary" @click="handleDetailStayTable">后台打开详情</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <div
      v-infinite-scroll="loadMore"
      class="table-scroll-wrapper"
      :infinite-scroll-disabled="listLoading || noMore"
      style="height: 500px; overflow: auto"
    >
      <el-table ref="tableRef" border :data="list" style="min-width: 100%" @selection-change="setSelectRows">
        <el-table-column type="selection" width="38" />
        <el-table-column align="center" label="序号" width="55">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题" min-width="200" prop="title" />
        <el-table-column align="center" label="作者" prop="author" />
        <el-table-column align="center" label="评级" min-width="200">
          <template #default="{ row }">
            <el-rate v-model="row.rate" disabled />
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量" min-width="100" prop="count" sortable />
        <el-table-column align="center" label="开关" prop="switch">
          <template #default="{ row }">
            <el-switch v-model="row.switch" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag effect="dark" :type="statusFilter(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" min-width="160" prop="datetime" />
        <el-table-column align="center" :fixed="fixed" label="操作" :width="!foldOperation ? 215 : 120">
          <template #header>
            <el-checkbox v-model="foldOperation" label="折叠操作列" true-value="right" />
          </template>
          <template #default="{ row }">
            <div v-if="!foldOperation">
              <el-button text type="primary" @click="handleDetail(row)">详情</el-button>
              <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
            <el-dropdown v-else>
              <el-button text type="primary">
                操作
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleDetail(row)">
                    <el-link type="primary" :underline="false">详情</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleEdit(row)">
                    <el-link type="primary" :underline="false">编辑</el-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(row)">
                    <el-link type="danger" :underline="false">删除</el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="listLoading && !noMore" class="table-bottom-loading">
        <el-icon class="loading-spin">
          <loading />
        </el-icon>
        加载中...
      </div>
      <div v-if="noMore" class="table-bottom-no-more">没有更多了</div>
    </div>
    <default-table-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Loading, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { doDelete, getList } from '/@/api/table'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleMatched, handleTabs } from '/@/utils/routes'

defineOptions({
  name: 'PullTable',
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getAllRoutes: allRoutes }: any = storeToRefs(routesStore)

const tabsStore = useTabsStore()
const { changeTabsMeta, addVisitedRoute } = tabsStore
const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const fold = ref<boolean>(true)
const list = ref<any>([])
const listLoading = ref<boolean>(false)
const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 15,
})
const foldOperation = ref<boolean>(false)
const settingsStore = useSettingsStore()
const { device } = storeToRefs(settingsStore)
const fixed = ref<string | boolean>(false)
const noMore = ref(false)

const fetchData = async (reset = false) => {
  if (listLoading.value || noMore.value) return
  listLoading.value = true
  const { data } = await getList(queryForm)
  setTimeout(() => {
    if (reset) {
      list.value = data.list
    } else {
      list.value = list.value.concat(data.list)
    }
    total.value = data.total
    if (list.value.length >= data.total || data.list.length < queryForm.pageSize) {
      noMore.value = true
    }
    listLoading.value = false
  }, 500)
}

const loadMore = async () => {
  if (listLoading.value || noMore.value) return
  queryForm.pageNo++
  await fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  noMore.value = false
  fetchData(true)
}

const statusFilter = (status: string | number) => {
  const statusMap: any = {
    published: 'success',
    draft: 'primary',
    deleted: 'danger',
  }
  return statusMap[status]
}

const handleFold = () => {
  fold.value = !fold.value
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row = {}) => {
  editRef.value.showEdit(row)
}

const handleDelete = (row: any) => {
  if (row && row.id) {
    $baseConfirm('您确定要删除当前项吗', null, async () => {
      const { msg }: any = await doDelete({ ids: row.id })
      $baseMessage(msg, 'success', 'hey')
      await fetchData(true)
    })
  } else {
    if (selectRows.value.length > 0) {
      const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
      $baseConfirm('您确定要删除选中项吗', null, async () => {
        const { msg }: any = await doDelete({ ids })
        $baseMessage(msg, 'success', 'hey')
        await fetchData(true)
      })
    } else {
      $baseMessage('您未选中任何行', 'warning', 'hey')
    }
  }
}

const handleDetailStayTable = async () => {
  if (selectRows.value.length > 0)
    for (let i = 0; i < selectRows.value.length; i++) {
      const matched = handleMatched(allRoutes.value, '/vab/table/defaultTableDetail')
      const tab = handleTabs({
        ...matched.at(-1),
        query: selectRows.value[i],
      })
      if (tab) {
        await addVisitedRoute(tab)
        await changeTabsMeta({
          title: '详情页',
          meta: {
            title: `${tab.query.title} 详情页`,
          },
        })
      }
    }
  else $baseMessage('请至少选择一行进行详情页跳转', 'warning', 'hey')
}

const handleDetail = (row: any) => {
  if (row && row.id)
    router.push({
      path: '/vab/table/defaultTableDetail',
      query: {
        ...row,
        timestamp: Date.now(),
      },
    })
  else {
    if (selectRows.value.length === 1)
      router.push({
        path: '/vab/table/defaultTableDetail',
        query: {
          ...selectRows.value[0],
          timestamp: Date.now(),
        },
      })
    else $baseMessage('请选择一行进行详情页跳转', 'warning', 'hey')
  }
}

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  queryForm.pageNo = 1
  queryData()
}

watch(
  () => device.value,
  () => {
    if (device.value === 'mobile') {
      foldOperation.value = true
      fixed.value = 'right'
    }
  },
  {
    immediate: true,
  }
)

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  list.value = []
  queryForm.pageNo = 1
  noMore.value = false
  fetchData(true)
})
</script>

<style lang="scss" scoped>
.pull-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .vab-query-form {
    flex-shrink: 0;
  }

  .table-scroll-wrapper {
    flex: 1 1 0%;
    min-height: 0;
    overflow: auto;
  }

  .table-loading {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-size: 16px;
    color: #409eff;
    text-align: center;
  }

  .table-bottom-loading {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    padding: 16px 0;
    font-size: 16px;
    color: #409eff;
    text-align: center;
    background: #fff;
  }

  .loading-spin {
    font-size: 20px;
    animation: spin 1s linear infinite;
  }

  .table-bottom-no-more {
    padding: 12px 0;
    font-size: 14px;
    color: #999;
    text-align: center;
    background: #fff;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
