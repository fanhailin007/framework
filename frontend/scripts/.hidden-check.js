#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const files = ['vite.config.ts', 'src/main.ts', 'src/App.vue']
const rules = {
  'vite.config.ts': ['defineConfig', 'createVitePlugin'],
  'src/main.ts': ['createApp', 'setupVab'],
  'src/App.vue': ['<template>', '<script lang="ts" setup>'],
}

const pkgChecks = [
  {
    name: 'core-security',
    files: ['package.json', 'index.js'],
    keywords: ['core-security', 'security'],
  },
  {
    name: 'vite-plugin-unplugin',
    files: ['package.json', 'index.js'],
    keywords: ['vite-plugin-unplugin', 'unplugin'],
  },
  {
    name: 'vite-plugin-vitebar',
    files: ['package.json', 'index.js'],
    keywords: ['vite-plugin-vitebar', 'vitebar'],
  },
  {
    name: 'vsv-icon',
    files: ['package.json', 'index.js'],
    keywords: ['vsv-icon', 'icon'],
  },
]

let ok = true

for (let file of files) {
  const abs = path.resolve(process.cwd(), file)
  if (!fs.existsSync(abs)) {
    ok = false
    continue
  }
  const content = fs.readFileSync(abs, 'utf8')
  if (rules[file]) {
    for (let key of rules[file]) {
      if (!content.includes(key)) {
        ok = false
      }
    }
  }
}

for (let pkg of pkgChecks) {
  try {
    const pkgPath = require.resolve(pkg.name)
    const pkgDir = path.dirname(pkgPath)

    for (let file of pkg.files) {
      const filePath = path.join(pkgDir, file)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8')
        let hasKeyword = false
        for (let keyword of pkg.keywords) {
          if (content.includes(keyword)) {
            hasKeyword = true
            break
          }
        }
        if (!hasKeyword) {
          ok = false
        }
      }
    }
  } catch {
    ok = false
  }
}

if (!ok) process.exit(1)
