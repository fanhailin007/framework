import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/utils/authContract.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
})
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
const { normalizeLoginPayload, normalizeLoginResponse, normalizeUserInfo } = await import(moduleUrl)

assert.deepEqual(normalizeLoginPayload({ username: 'admin', password: 'Password123!' }), {
  userId: 'admin',
  password: 'Password123!',
})

const backendResponse = normalizeLoginResponse({
  success: true,
  code: 'OK',
  message: 'success',
  data: {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: {
      id: 1,
      userId: 'admin',
      displayName: '系统管理员',
      role: 'Admin',
      avatar: '/avatars/admin.png',
    },
  },
})

assert.deepEqual(backendResponse, {
  id: 1,
  token: 'access-token',
  refreshToken: 'refresh-token',
  username: '系统管理员',
  avatar: '/avatars/admin.png',
  roles: ['Admin'],
  permissions: [],
})

assert.deepEqual(
  normalizeUserInfo({
    token: 'mock-token',
    username: 'admin',
    avatar: './static/svg/avatar.svg',
    roles: ['Admin'],
    permissions: ['read:Index'],
  }),
  {
    id: undefined,
    username: 'admin',
    avatar: './static/svg/avatar.svg',
    roles: ['Admin'],
    permissions: ['read:Index'],
  }
)
