#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const _0x4f8a = {
  _0x7a2b: ['vite.config.ts', 'src/main.ts', 'src/App.vue'],
  _0x2e1d: {
    'vite.config.ts': ['_0x7a2b', '_0x9f3c', '_0x4d8e'],
    'src/main.ts': ['createApp', 'setupVab'],
    'src/App.vue': ['<template>', '<script>'],
  },
}

const _0x9f3c = {
  _0x7d2a(_0x6a9e) {
    try {
      if (!fs.existsSync(_0x6a9e)) {
        console.error(`❌ ${_0x6a9e}`)
        return false
      }

      const _0x8c3d = fs.readFileSync(_0x6a9e, 'utf8')
      const _0x5b2f = path.basename(_0x6a9e)

      if (_0x4f8a._0x2e1d[_0x5b2f]) {
        for (const _0x3a1d of _0x4f8a._0x2e1d[_0x5b2f]) {
          if (!_0x8c3d.includes(_0x3a1d)) {
            console.error(`❌ ${_0x5b2f} ${_0x3a1d}`)
            return false
          }
        }
      }

      return true
    } catch {
      console.error(`❌ ${_0x6a9e}`)
      return false
    }
  },

  _0x4e1b() {
    console.log('🔒')

    let _0x8b2c = true
    for (const _0x7c1f of _0x4f8a._0x7a2b) {
      const _0x9a1b = path.resolve(process.cwd(), _0x7c1f)
      if (this._0x7d2a(_0x9a1b)) {
        console.log(`✅ ${_0x7c1f}`)
      } else {
        _0x8b2c = false
      }
    }

    if (_0x8b2c) {
      //console.log('✅')
    } else {
      console.error('❌')
      process.exit(1)
    }
  },
}

if (require.main === module) {
  _0x9f3c._0x4e1b()
}

module.exports = _0x9f3c
