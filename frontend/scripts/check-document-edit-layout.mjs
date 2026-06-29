import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../library/components/DocumentEditDialog/index.vue', import.meta.url), 'utf8')

assert.match(source, /class="document-edit-layout"/, 'Document edit dialog should use a left/right layout container')
assert.match(source, /class="document-edit-fields"/, 'Document edit dialog should place form fields on the left')
assert.match(source, /class="document-edit-preview"/, 'Document edit dialog should place the PDF preview on the right')
assert.doesNotMatch(source, /label="文档ID"/, 'Document ID input should be hidden from the dialog')
assert.doesNotMatch(source, /label="负责人ID"/, 'Owner user ID input should be hidden from the dialog')
assert.doesNotMatch(source, /label="文件路径"/, 'File path input should be hidden from the dialog')
assert.doesNotMatch(source, /label="文件大小"/, 'File size input should be hidden from the dialog')
assert.doesNotMatch(source, /label="创建人ID"/, 'Created-by user ID input should be hidden from the dialog')
assert.doesNotMatch(source, /label="更新人ID"/, 'Updated-by user ID input should be hidden from the dialog')
