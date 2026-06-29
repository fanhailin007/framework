import { userConfig } from '/@/config/data.config'

type QueryForm = {
  keyword?: string
  pageNo?: number
  pageSize?: number
  userId?: string
}

export type UserManagementRow = {
  active: boolean
  activeText: string
  avatar?: string
  createdAt?: string
  displayName?: string
  email?: string
  id: number
  lastLoginAt?: string
  lastLoginIp?: string
  phone?: string
  role?: string
  roleLabel: string
  updatedAt?: string
  userId: string
}

const formatDateTime = (value?: string | null) => {
  return value ? value.replace('T', ' ').slice(0, 19) : ''
}

const formatRoleLabel = (role?: string) => {
  if (!role) return '未设置'
  const option = userConfig.roleOptions.find((item) => item.value === role)
  return option ? option.label : `未配置角色（${role}）`
}

const normalizeRow = (row: any): UserManagementRow => {
  const active = row.active !== false
  return {
    id: row.id,
    userId: row.userId || row.username || '',
    displayName: row.displayName || row.username || '',
    role: row.role || '',
    roleLabel: formatRoleLabel(row.role),
    email: row.email || '',
    phone: row.phone || '',
    avatar: row.avatar || '',
    active,
    activeText: active ? '启用' : '停用',
    lastLoginAt: formatDateTime(row.lastLoginAt),
    lastLoginIp: row.lastLoginIp || '',
    createdAt: formatDateTime(row.createdAt),
    updatedAt: formatDateTime(row.updatedAt || row.datetime),
  }
}

const resolveRows = (response: any) => {
  const data = response?.data ?? response
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.list)) return data.list
  if (Array.isArray(data?.records)) return data.records
  if (Array.isArray(data?.items)) return data.items
  return []
}

export const normalizeUserListResponse = (response: any, query: QueryForm = {}) => {
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const keyword = (query.keyword || query.userId || '').trim().toLowerCase()
  const rows = resolveRows(response)
    .map(normalizeRow)
    .filter((row: UserManagementRow) => {
      if (!keyword) return true
      return [row.userId, row.displayName, row.email, row.phone].some((value) => `${value || ''}`.toLowerCase().includes(keyword))
    })
  const start = (pageNo - 1) * pageSize
  return {
    list: rows.slice(start, start + pageSize),
    total: rows.length,
  }
}

export const normalizeUserPayload = (form: any) => {
  return ['userId', 'password', 'displayName', 'role', 'email', 'phone', 'avatar', 'active'].reduce((payload: any, key) => {
    const value = form[key]
    if (value !== '' && value !== undefined && value !== null) payload[key] = value
    return payload
  }, {})
}
