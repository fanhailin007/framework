import autoprefixer from 'autoprefixer'
import dayjs from 'dayjs'
import { resolve } from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import compressPlugin from 'vite-plugin-compression'
import {
  assetsDir,
  base,
  chunkSizeWarningLimit,
  cssCodeSplit,
  exclude,
  https,
  include,
  open,
  outDir,
  port,
  reportCompressedSize,
} from '/@/config'
import { createVitePlugin, createWatch } from '/@vab/build'

const removeCacheControlMeta = () => ({
  name: 'remove-cache-control-meta',
  transformIndexHtml(html: string) {
    let result = html.replace(/<meta content="no-cache, no-store, must-revalidate" http-equiv="Cache-Control" \/>\s*\n?/gi, '')
    const keywords = 'Vue3, Vite, Element Plus, 前端框架, 中后台, Admin, Vue Shop Vite, 官网, 源码, 文档'
    const keywordsMeta = `<meta content="${keywords}" name="keywords" />\n    `
    result = result.replace(/(<meta content="[^"]*" name="description" \/>)/i, `$1\n    ${keywordsMeta}`)
    return result
  },
})

const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

// vue_shop_vite官网独立配置
const minify = 'terser'
const outputHash = true

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  process.env['VITE_APP_UPDATE_TIME'] = lastBuildTime
  process.env['VITE_USER_NODE_ENV'] = mode
  const root = process.cwd()
  const env = loadEnv(mode, root)
  createWatch(env)
  console.log(lastBuildTime)

  const vitePlugins = createVitePlugin(env) || []
  vitePlugins.push(compressPlugin({ ext: '.gz' }) as any)
  vitePlugins.push(removeCacheControlMeta() as any)

  // const base64VersionPlugin = () => ({
  //   name: 'base64-version-plugin',
  //   transformIndexHtml(html: string) {
  //     const githubUserName = env.VITE_APP_GITHUB_USER_NAME || process.env.VITE_APP_GITHUB_USER_NAME || 'test'
  //     const base64UserName = Buffer.from(githubUserName).toString('base64')
  //     let result = html.replace(/\/static\/css\/loading\.css\?v=[^"&\s]*/g, '/static/css/loading.css')
  //     result = result.replace(/(\/static\/css\/loading\.css)(["\s>])/g, `$1?v=${base64UserName}$2`)
  //     return result
  //   },
  // })

  // vitePlugins.push(base64VersionPlugin() as any)
  // vitePlugins.push(
  //   visualizer({
  //     filename: './dist/stats.html',
  //     open: true,
  //     gzipSize: true,
  //     brotliSize: true,
  //   }) as any
  // )

  return {
    base,
    root,
    server: {
      open,
      port,
      hmr: {
        overlay: true,
      },
      host: '0.0.0.0',
      warmup: {
        clientFiles: ['./index.html', './library/{components,layouts}/*', './src/{views,plugins}/*'],
      },
      https,
    },
    resolve: {
      alias: {
        '~/': `${resolve(__dirname, '.')}/`,
        '/@/': `/${resolve(__dirname, 'src')}/`,
        '/@vab/': `/${resolve(__dirname, 'library')}/`,
      },
    },
    optimizeDeps: {
      include,
      exclude,
    },
    build: {
      assetsDir,
      chunkSizeWarningLimit,
      cssCodeSplit,
      outDir,
      reportCompressedSize,
      rollupOptions: {
        //treeshake: false,
        onwarn: () => {
          return
        },
        external: [],
        output: {
          chunkFileNames: outputHash ? 'static/js/[name]-[hash].js' : 'static/js/[name].js',
          entryFileNames: outputHash ? 'static/js/[name]-[hash].js' : 'static/js/[name].js',
          assetFileNames: outputHash ? 'static/[ext]/[name]-[hash].[ext]' : 'static/[ext]/[name].[ext]',
          manualChunks: {
            'vsv-element-plus': ['element-plus'],
            'vsv-nprogress': ['nprogress'],
            'vsv-icon': ['vsv-icon'],
            'vsv-echarts': ['echarts'],
            // 将opentiny相关组件单独打包
            'opentiny-base': ['@opentiny/vue'],
          },
        },
        input: ['./index.html', './website.html'],
      },
      minify,
      sourcemap: false,
      target: 'es2015',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({ grid: true }) as any,
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule: { name: string; remove: () => void }) => {
                if (atRule.name === 'charset') atRule.remove()
              },
            },
          },
        ],
      },
      preprocessorOptions: {
        scss: {
          // api: 'modern-compiler', // 修复警告: Deprecation Warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
          // sassOptions: { outputStyle: 'expanded' },
        },
      },
      devSourcemap: true,
    },
    plugins: vitePlugins,
    define: {
      // 如果您必须使用华为组件库且打包报错，请放开该行，放开注释后会将您的环境变量暴露给华为组件库
      // 'process.env': { ...process.env },
    },
    // 为生产环境添加预加载指令，提高初次访问速度
    experimental: {
      renderBuiltUrl(filename: string, { hostType }: { hostType: string }) {
        // 为JS和CSS资源添加preload，提高资源加载优先级
        if (hostType === 'js' && filename.endsWith('.js')) {
          return { relative: true, preload: true }
        }
        if (hostType === 'css' && filename.endsWith('.css')) {
          return { relative: true, preload: true }
        }
        return { relative: true }
      },
    },
  }
})
