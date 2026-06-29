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
const { createDocumentSlug } = await import(moduleUrl)

assert.equal(createDocumentSlug('House Rental Contract'), 'house-rental-contract')
assert.equal(createDocumentSlug('House Rental Contract.pdf'), 'house-rental-contract')
assert.equal(createDocumentSlug('合同 A 公司 2026.pdf'), '合同-a-公司-2026')
assert.equal(createDocumentSlug('  Contract__No. 2026/001  '), 'contract-no-2026-001')
assert.equal(createDocumentSlug(''), '')
