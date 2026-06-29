<template>
  <div class="team-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button :icon="Plus" type="primary" @click="handleAdd">添加团队</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.name" clearable placeholder="请输入团队名称" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-row :gutter="20">
      <el-col v-for="team in list" :key="team.id" :lg="8" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card class="team-card" shadow="hover">
          <template #header>
            <div class="team-header">
              <div class="team-info">
                <el-avatar class="team-avatar" :size="40" :src="team.avatar">
                  <span v-if="!team.avatar">{{ team.name.charAt(0).toUpperCase() }}</span>
                </el-avatar>
                <div class="team-name">{{ team.name }}</div>
              </div>
              <div class="team-actions">
                <el-button circle size="small" @click="handleEdit(team)">
                  <el-icon><edit /></el-icon>
                </el-button>
                <el-button circle size="small" type="danger" @click="handleDelete(team)">
                  <el-icon><delete /></el-icon>
                </el-button>
              </div>
            </div>
          </template>

          <div class="team-content">
            <div class="team-description">{{ team.description }}</div>
            <div class="team-stats">
              <div class="stat-item">
                <el-icon><user /></el-icon>
                <span>{{ team.memberCount }} 成员</span>
              </div>
              <div class="stat-item">
                <el-icon><calendar /></el-icon>
                <span>{{ team.createTime }}</span>
              </div>
            </div>

            <div class="team-members">
              <div class="members-title">团队成员</div>
              <div class="members-list">
                <el-avatar
                  v-for="member in team.members"
                  :key="member.id"
                  class="member-avatar"
                  :size="32"
                  :src="member.avatar"
                  :title="member.name"
                >
                  <span v-if="!member.avatar">{{ member.name.charAt(0).toUpperCase() }}</span>
                </el-avatar>
                <el-avatar v-if="team.memberCount > team.members.length" class="member-avatar more-members" :size="32">
                  +{{ team.memberCount - team.members.length }}
                </el-avatar>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="pagination-container">
      <vab-pagination
        :current-page="queryForm.pageNo"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <team-management-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { Calendar, Delete, Edit, Plus, Refresh, Search, User } from '@element-plus/icons-vue'
import { doDelete, getList } from '/@/api/teamManagement'

defineOptions({
  name: 'TeamManagement',
})

const editRef = ref<any>(null)
const list = ref<any>([])
const listLoading = ref<boolean>(true)

const total = ref<number>(0)
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 6,
  name: '',
})

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row: any = {}) => {
  editRef.value.showEdit(row)
}

const handleDelete = (row: any = {}) => {
  if (row.id) {
    $baseConfirm('您确定要删除当前团队吗', null, async () => {
      const { msg }: any = await doDelete({ ids: row.id.toString() })
      $baseMessage(msg, 'success', 'hey')
      await fetchData()
    })
  }
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  queryForm.pageNo = 1
  queryData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const response = await getList(queryForm)
    list.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('获取团队列表失败:', error)
    $baseMessage('获取团队列表失败', 'error', 'hey')
  } finally {
    listLoading.value = false
  }
}

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.team-management-container {
  display: flex;
  flex-direction: column;
  padding: 20px;

  .team-card {
    margin-bottom: 20px;

    .team-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .team-info {
        display: flex;
        gap: 10px;
        align-items: center;

        .team-avatar {
          background-color: var(--el-text-color-disabled) !important;
        }

        .team-name {
          font-size: 16px;
          font-weight: bold;
        }
      }

      .team-actions {
        display: flex;
        margin-left: 12px;
      }
    }

    .team-content {
      .team-description {
        min-height: 40px;
        margin-bottom: 15px;
        color: var(--el-text-color-secondary);
      }

      .team-stats {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        margin-bottom: 15px;
        background-color: var(--el-fill-color-light);
        border-radius: 4px;

        .stat-item {
          display: flex;
          gap: 5px;
          align-items: center;
          font-size: 12px;
        }
      }

      .team-members {
        .members-title {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 500;
        }

        .members-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .member-avatar {
            cursor: pointer;
            background-color: var(--el-text-color-disabled) !important;

            &.more-members {
              background-color: var(--el-text-color-disabled) !important;
            }
          }
        }
      }
    }
  }

  .pagination-container {
    margin-top: auto;
  }
}
</style>
