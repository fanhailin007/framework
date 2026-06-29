import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../library/components/DocumentEditDialog/index.vue', import.meta.url), 'utf8')

assert.match(source, /class="document-edit-preview"/, 'PDF upload dialog should include an inline preview container')
assert.match(source, /class="document-upload-pdf-frame"/, 'PDF upload dialog should render the selected file in an iframe')
assert.match(source, /URL\.createObjectURL\(.*form\.file/, 'Selecting a PDF should create a local blob preview URL from the selected file')
assert.match(source, /URL\.revokeObjectURL\(pdfPreviewSource\.value\)/, 'Removing or closing should release the local PDF preview URL')
assert.match(source, /onBeforeUnmount\(\(\) => \{\s*releasePdfPreview\(\)/s, 'Component unmount should release the local PDF preview URL')
