import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const configSource = readFileSync(new URL('../src/config/data.config.ts', import.meta.url), 'utf8')
const { outputText: configOutputText } = ts.transpileModule(configSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
})
const configModuleUrl = `data:text/javascript;base64,${Buffer.from(configOutputText).toString('base64')}`

const source = readFileSync(new URL('../src/utils/documentManagementContract.ts', import.meta.url), 'utf8').replace(
  "from '/@/config/data.config'",
  `from '${configModuleUrl}'`
)
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
})
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
const { normalizeDocumentListResponse, normalizeDocumentPayload, normalizePublishPayload } = await import(moduleUrl)

const response = {
  success: true,
  code: 'OK',
  message: 'success',
  data: [
    {
      id: 1,
      documentId: 1,
      title: '草稿测试文档',
      slug: 'draft-test-document',
      summary: '用于测试草稿状态的文档',
      content: '# 草稿测试文档',
      status: 'draft',
      ownerUserId: 2,
      category: 'guide',
      tags: ['seed', 'draft'],
      filePath: null,
      fileSize: null,
      version: 1,
      publishedAt: null,
      reviewedBy: null,
      createdByUserId: 2,
      updatedByUserId: 2,
      createdAt: '2026-06-20T10:00:00',
      updatedAt: '2026-06-20T10:00:00',
    },
    {
      id: 2,
      documentId: 2,
      title: '未知状态文档',
      slug: 'custom-status-document',
      summary: '',
      content: '',
      status: 'reviewing',
      ownerUserId: 1,
      category: 'custom',
      tags: '["custom"]',
      filePath: '/docs/custom.pdf',
      fileSize: 2048,
      version: 2,
      publishedAt: null,
      reviewedBy: null,
      createdByUserId: 1,
      updatedByUserId: 1,
      createdAt: '2026-06-21T10:00:00',
      updatedAt: '2026-06-21T10:00:00',
    },
  ],
}

assert.deepEqual(normalizeDocumentListResponse(response, { pageNo: 1, pageSize: 1, keyword: '草稿' }), {
  list: [
    {
      id: 1,
      documentId: 1,
      title: '草稿测试文档',
      slug: 'draft-test-document',
      summary: '用于测试草稿状态的文档',
      content: '# 草稿测试文档',
      status: 'draft',
      statusLabel: '草稿',
      statusTagType: 'info',
      ownerUserId: 2,
      category: 'guide',
      categoryLabel: '指南',
      tags: ['seed', 'draft'],
      tagsText: 'seed, draft',
      filePath: '',
      fileSize: undefined,
      fileSizeText: '',
      version: 1,
      publishedAt: '',
      reviewedBy: undefined,
      createdByUserId: 2,
      updatedByUserId: 2,
      createdAt: '2026-06-20 10:00:00',
      updatedAt: '2026-06-20 10:00:00',
    },
  ],
  total: 1,
})

const unknownRow = normalizeDocumentListResponse(response, { pageNo: 1, pageSize: 10, keyword: '未知' }).list[0]
assert.equal(unknownRow.statusLabel, '未配置状态（reviewing）')
assert.equal(unknownRow.categoryLabel, '未配置分类（custom）')
assert.equal(unknownRow.fileSizeText, '2.0 KB')

assert.deepEqual(
  normalizeDocumentPayload({
    id: 1,
    title: '文档',
    slug: 'document',
    summary: '',
    content: '# 文档',
    category: 'guide',
    tags: ['seed', 'guide'],
    filePath: '',
    fileSize: '',
  }, { actorUserId: 3 }),
  {
    documentId: 1,
    title: '文档',
    slug: 'document',
    content: '# 文档',
    category: 'guide',
    updatedByUserId: 3,
    tags: ['seed', 'guide'],
  }
)

assert.deepEqual(
  normalizeDocumentPayload({
    title: '新文档',
    slug: 'new-document',
    summary: '',
    content: '# 新文档',
    category: 'guide',
    tags: ['seed', 'guide'],
  }, { actorUserId: 3 }),
  {
    title: '新文档',
    slug: 'new-document',
    content: '# 新文档',
    category: 'guide',
    ownerUserId: 3,
    createdByUserId: 3,
    updatedByUserId: 3,
    tags: ['seed', 'guide'],
  }
)

assert.deepEqual(normalizeDocumentPayload({ id: 9 }, { actorUserId: 3 }), {
  documentId: 9,
  updatedByUserId: 3,
})

assert.deepEqual(normalizePublishPayload({ actorUserId: 3 }), {
  reviewedBy: 3,
  updatedByUserId: 3,
})
