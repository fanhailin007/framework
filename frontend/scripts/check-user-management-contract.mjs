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

const source = readFileSync(new URL('../src/utils/userManagementContract.ts', import.meta.url), 'utf8').replace(
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
const { normalizeUserListResponse, normalizeUserPayload } = await import(moduleUrl)

const response = {
  success: true,
  code: 'OK',
  message: 'success',
  data: [
    {
      id: 1,
      userId: 'admin',
      displayName: '系统管理员',
      role: 'Admin',
      roleLabel: '管理员',
      email: 'admin@example.com',
      phone: '13900000001',
      active: true,
      lastLoginAt: '2026-06-28T15:04:12',
      lastLoginIp: '127.0.0.1',
      updatedAt: '2026-06-28T15:04:12',
    },
    {
      id: 2,
      userId: 'viewer',
      displayName: '只读用户',
      role: 'Viewer',
      email: 'viewer@example.com',
      phone: '13900000002',
      active: false,
      lastLoginAt: null,
      lastLoginIp: null,
      updatedAt: '2026-06-03T09:00:00',
    },
    {
      id: 3,
      userId: 'custom',
      displayName: '自定义角色用户',
      role: 'CustomRole',
      email: 'custom@example.com',
      phone: '13900000003',
      active: true,
      lastLoginAt: null,
      lastLoginIp: null,
      updatedAt: '2026-06-03T09:00:00',
    },
  ],
}

assert.deepEqual(normalizeUserListResponse(response, { pageNo: 1, pageSize: 1, keyword: 'admin' }), {
  list: [
    {
      id: 1,
      userId: 'admin',
      displayName: '系统管理员',
      role: 'Admin',
      roleLabel: '管理员',
      email: 'admin@example.com',
      phone: '13900000001',
      avatar: '',
      active: true,
      activeText: '启用',
      lastLoginAt: '2026-06-28 15:04:12',
      lastLoginIp: '127.0.0.1',
      createdAt: '',
      updatedAt: '2026-06-28 15:04:12',
    },
  ],
  total: 1,
})

assert.equal(normalizeUserListResponse(response, { pageNo: 1, pageSize: 10, keyword: 'custom' }).list[0].roleLabel, '未配置角色（CustomRole）')

assert.deepEqual(
  normalizeUserPayload({
    id: 1,
    userId: 'admin',
    password: '',
    displayName: '系统管理员',
    role: 'Admin',
    email: 'admin@example.com',
    phone: '',
    avatar: '',
    active: true,
  }),
  {
    userId: 'admin',
    displayName: '系统管理员',
    role: 'Admin',
    email: 'admin@example.com',
    active: true,
  }
)
