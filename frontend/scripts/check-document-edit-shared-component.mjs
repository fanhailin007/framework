import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const sharedComponentPath = new URL('../library/components/DocumentEditDialog/index.vue', import.meta.url)
const oldComponentPath = new URL('../src/views/setting/documentManagement/vabAutoComponents/DocumentManagementEdit.vue', import.meta.url)
const pageSource = readFileSync(new URL('../src/views/setting/documentManagement/index.vue', import.meta.url), 'utf8')
const declarationSource = readFileSync(new URL('../library/build/unplugin/components.d.ts', import.meta.url), 'utf8')

assert.equal(existsSync(sharedComponentPath), true, 'Document edit dialog should live in the shared component directory')
assert.equal(existsSync(oldComponentPath), false, 'Document edit dialog should not remain as a page-private component')
assert.match(pageSource, /<document-edit-dialog\b/, 'Document management page should render the shared dialog component')
assert.match(pageSource, /\/@vab\/components\/DocumentEditDialog\/index\.vue/, 'Document management page should import the shared dialog component')
assert.doesNotMatch(pageSource, /document-management-edit|DocumentManagementEdit/, 'Document management page should not reference the old page-private component')
assert.doesNotMatch(declarationSource, /DocumentManagementEdit/, 'Generated component declarations should not reference the removed page-private component')
