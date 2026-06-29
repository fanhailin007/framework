import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/api/documentManagement.ts', import.meta.url), 'utf8')

assert.match(source, /getCachedAuthInfo\(\)/, 'Document API should read the cached authenticated user')
assert.match(source, /actorUserId: getCurrentUserId\(\)/, 'Publish should pass the current user as the actor')
assert.match(source, /ensureDocumentIdMatchesId/, 'Create and upload should reconcile documentId after the backend returns id')
assert.ok(source.includes('url: `/documents/${id}`'), 'DocumentId reconciliation should update the created document by id')
