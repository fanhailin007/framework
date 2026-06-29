import type { MockMethod } from 'vite-plugin-mock'

// 获取当前年份
const currentYear = new Date().getFullYear()

// 模拟网站设置数据
const defaultSetting = {
  siteName: 'Vue Shop Vite',
  siteUrl: 'https://vuejs-core.cn/shop-vite',
  logo: '',
  metaKeywords: 'Vue, Vite, Shop',
  metaDesc: '基于Vue3和Vite构建的现代化前端系统',
  copyright: `© ${currentYear} Vue Shop Vite. All rights reserved.`,
  icp: '京ICP备12345678号',
  contactEmail: 'support@vue.shop.com',
  contactPhone: '400-123-4567',
  address: '北京市朝阳区xxx街道xxx号',
  description: '',
}

export default [
  {
    url: '/websiteSetting/getSetting',
    method: 'get',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: defaultSetting,
      }
    },
  },
  {
    url: '/websiteSetting/saveSetting',
    method: 'post',
    response({ body }: any) {
      console.log('保存网站设置:', body)
      return {
        code: 200,
        msg: '网站设置保存成功',
        data: body,
      }
    },
  },
  {
    url: '/websiteSetting/uploadFile',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '文件上传成功',
        data: {
          url: '/static/logo.png',
          filename: 'logo.png',
        },
      }
    },
  },
] as MockMethod[]
