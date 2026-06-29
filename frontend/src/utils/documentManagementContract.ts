import { documentConfig } from '/@/config/data.config'

type QueryForm = {
  keyword?: string
  pageNo?: number
  pageSize?: number
  status?: string
}

export type DocumentManagementRow = {
  category: string
  categoryLabel: string
  content: string
  createdAt: string
  createdByUserId?: number
  documentId?: number
  filePath: string
  fileSize?: number
  fileSizeText: string
  id: number
  ownerUserId?: number
  publishedAt: string
  reviewedBy?: number
  slug: string
  status: string
  statusLabel: string
  statusTagType: string
  summary: string
  tags: string[]
  tagsText: string
  title: string
  updatedAt: string
  updatedByUserId?: number
  version?: number
}

const formatDateTime = (value?: string | null) => {
  return value ? value.replace('T', ' ').slice(0, 19) : ''
}

const formatFileSize = (value?: number | null) => {
  if (!value) return ''
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / 1024 / 1024).toFixed(1)} MB`
}

const formatStatus = (status?: string) => {
  if (!status) return { label: '未设置', tagType: 'info' }
  const option = documentConfig.statusOptions.find((item) => item.value === status)
  return option ? { label: option.label, tagType: option.tagType } : { label: `未配置状态（${status}）`, tagType: 'danger' }
}

const formatCategoryLabel = (category?: string) => {
  if (!category) return ''
  const option = documentConfig.categoryOptions.find((item) => item.value === category)
  return option ? option.label : `未配置分类（${category}）`
}

const normalizeTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) return tags.map((tag) => `${tag}`.trim()).filter(Boolean)
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      if (Array.isArray(parsed)) return normalizeTags(parsed)
    } catch {
      return tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    }
  }
  return []
}

const normalizeNumber = (value: unknown) => {
  if (value === '' || value === undefined || value === null) return undefined
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : undefined
}

type DocumentPayloadOptions = {
  actorUserId?: number
}

export const createDocumentSlug = (value?: string | null) => {
  if (!value) return ''
  return value
    .trim()
    .replace(/\.pdf$/iu, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

const normalizeRow = (row: any): DocumentManagementRow => {
  const status = formatStatus(row.status)
  const tags = normalizeTags(row.tags)
  return {
    id: row.id,
    documentId: row.documentId ?? undefined,
    title: row.title || '',
    slug: row.slug || '',
    summary: row.summary || '',
    content: row.content || '',
    status: row.status || '',
    statusLabel: status.label,
    statusTagType: status.tagType,
    ownerUserId: row.ownerUserId ?? undefined,
    category: row.category || '',
    categoryLabel: formatCategoryLabel(row.category),
    tags,
    tagsText: tags.join(', '),
    filePath: row.filePath || '',
    fileSize: row.fileSize ?? undefined,
    fileSizeText: formatFileSize(row.fileSize),
    version: row.version ?? undefined,
    publishedAt: formatDateTime(row.publishedAt),
    reviewedBy: row.reviewedBy ?? undefined,
    createdByUserId: row.createdByUserId ?? undefined,
    updatedByUserId: row.updatedByUserId ?? undefined,
    createdAt: formatDateTime(row.createdAt),
    updatedAt: formatDateTime(row.updatedAt),
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

export const normalizeDocumentListResponse = (response: any, query: QueryForm = {}) => {
  const pageNo = Number(query.pageNo) || 1
  const pageSize = Number(query.pageSize) || 20
  const keyword = (query.keyword || '').trim().toLowerCase()
  const status = (query.status || '').trim()
  const rows = resolveRows(response)
    .map(normalizeRow)
    .filter((row: DocumentManagementRow) => {
      if (status && row.status !== status) return false
      if (!keyword) return true
      return [row.title, row.slug, row.summary, row.category, row.categoryLabel, row.tagsText].some((value) =>
        `${value || ''}`.toLowerCase().includes(keyword)
      )
    })
  const start = (pageNo - 1) * pageSize
  return {
    list: rows.slice(start, start + pageSize),
    total: rows.length,
  }
}

export const normalizeDocumentPayload = (form: any, options: DocumentPayloadOptions = {}) => {
  const payload: any = {}
  ;['title', 'slug', 'summary', 'content', 'category', 'filePath', 'fileSize'].forEach((key) => {
    const numericKeys = ['fileSize']
    const value = numericKeys.includes(key) ? normalizeNumber(form[key]) : form[key]
    if (value !== '' && value !== undefined && value !== null) payload[key] = value
  })
  const actorUserId = normalizeNumber(options.actorUserId)
  const documentId = normalizeNumber(form.id ?? form.documentId)
  if (form.id && documentId !== undefined) payload.documentId = documentId
  if (!form.id && actorUserId !== undefined) payload.ownerUserId = actorUserId
  if (!form.id && actorUserId !== undefined) payload.createdByUserId = actorUserId
  if (actorUserId !== undefined) payload.updatedByUserId = actorUserId
  if (form.tags !== undefined) payload.tags = normalizeTags(form.tags)
  return payload
}

export const normalizeDocumentUploadPayload = (form: any, options: DocumentPayloadOptions = {}) => {
  const payload = normalizeDocumentPayload(form, options)
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'tags') {
      ;(value as string[]).forEach((tag) => formData.append('tags', tag))
    } else {
      formData.append(key, `${value}`)
    }
  })
  formData.append('file', form.file)
  return formData
}

export const normalizePublishPayload = (form: any) => {
  const actorUserId = normalizeNumber(form.actorUserId)
  const reviewedBy = normalizeNumber(form.reviewedBy ?? actorUserId)
  const updatedByUserId = normalizeNumber(form.updatedByUserId ?? actorUserId)
  return {
    ...(reviewedBy !== undefined ? { reviewedBy } : {}),
    ...(updatedByUserId !== undefined ? { updatedByUserId } : {}),
  }
}
