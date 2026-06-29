<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="90vw" @close="close">
    <div class="dialog-scroll-wrapper">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form ref="formRef" label-position="top" label-width="80px" :model="form" :rules="rules">
            <el-form-item label="角色码" prop="role">
              <el-input v-model="form.role" clearable />
            </el-form-item>
            <el-form-item label="菜单">
              <div class="vab-tree-border">
                <el-tree
                  ref="treeRef"
                  :data="list"
                  :default-checked-keys="form.menuCheckedList"
                  :default-expanded-keys="[]"
                  node-key="path"
                  show-checkbox
                >
                  <template #default="{ data }">
                    <span>{{ data.meta.title }}</span>
                  </template>
                </el-tree>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="18">
          <el-form label-position="top">
            <el-form-item label="按钮权限">
              <div class="btn-roles-container">
                <div class="btn-roles-header">
                  <el-button size="small" type="primary" @click="toggleAllBtnRoles">
                    {{ isAllChecked ? '取消全选' : '全选' }}
                  </el-button>
                </div>
                <div class="btn-roles-scroll" style="margin-top: 10px">
                  <el-row :gutter="8">
                    <el-col v-for="item in allBtnRoles" :key="item" :span="2">
                      <el-checkbox
                        v-model="form.btnRolesCheckedList"
                        :label="item"
                        style="width: 100%; overflow: hidden; text-overflow: ellipsis; text-align: left; white-space: nowrap"
                      >
                        {{ item }}
                      </el-checkbox>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { doEdit } from '/@/api/roleManagement'
import { getList } from '/@/api/router'

defineOptions({
  name: 'RoleManagementEdit',
})

const emit = defineEmits(['fetch-data'])

const formRef = ref<FormInstance>()
const treeRef = ref<any>(null)
const form = reactive<any>({
  role: '',
  btnRolesCheckedList: [],
})
const rules = reactive<any>({
  role: [{ required: true, trigger: 'blur', message: '请输入角色码' }],
})
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)
const list = ref<any>([])
const OPERATIONS = ['read', 'write', 'delete']
const allBtnRoles = ref<string[]>([])

const showEdit = (row: any) => {
  dialogFormVisible.value = true
  nextTick(() => {
    if (row) {
      title.value = '编辑'
      Object.assign(form, row)
    } else {
      title.value = '添加'
      form.btnRolesCheckedList = ['read:Index', 'write:Index', 'delete:Index']
    }
  })
}

defineExpose({
  showEdit,
})

const close = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  emit('fetch-data')
}

// 新增：获取所有最后一级（无children）路由的name
function getLeafNames(routes: any[]): string[] {
  return routes.flatMap((route) => {
    if (route.children && route.children.length > 0) {
      return getLeafNames(route.children)
    } else {
      return route.name ? [route.name] : []
    }
  })
}

const fetchData = async () => {
  const { data } = await getList()
  list.value = data.list
  // 只生成最后一级按钮权限
  const leafNames = getLeafNames(list.value)
  allBtnRoles.value = leafNames.flatMap((name) => OPERATIONS.map((op) => `${op}:${name}`))
}

const save = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      const tree = treeRef.value.getCheckedKeys()
      const treeObject = { 'treeArray:': tree }
      const { msg }: any = await doEdit({
        ...form,
        ...treeObject,
      })
      await $baseMessage(msg, 'success', 'hey')
      await close()
      dialogFormVisible.value = false
    }
  })
}

const isAllChecked = computed(() => form.btnRolesCheckedList.length === allBtnRoles.value.length && allBtnRoles.value.length > 0)
const toggleAllBtnRoles = () => {
  if (isAllChecked.value) {
    form.btnRolesCheckedList = []
  } else {
    form.btnRolesCheckedList = [...allBtnRoles.value]
  }
}

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.vab-tree-border {
  width: 100%;
  height: 550px;
  padding: var(--el-padding);
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.dialog-scroll-wrapper {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  padding-right: 8px;
  overflow-x: hidden;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .dialog-scroll-wrapper .el-row {
    flex-direction: column !important;
  }
  .dialog-scroll-wrapper .el-col {
    width: 100% !important;
    max-width: 100% !important;
  }
  .btn-roles-header {
    margin-bottom: 0 !important;
  }
  .btn-roles-scroll {
    margin-top: 10px !important;
  }
  .btn-roles-container {
    width: 100% !important;
    max-width: 100% !important;
  }
}

.dialog-scroll-wrapper .el-row {
  flex-wrap: wrap;
}

.btn-roles-scroll {
  max-height: 588px;
  padding: var(--el-padding);
  overflow-y: auto;
  background: #fff;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.btn-roles-header {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.btn-roles-container {
  display: flex;
  flex-direction: column;
}
</style>
