import type { MockMethod } from 'vite-plugin-mock'

// 性能监控数据列表
const PerformanceList: {
  id: string
  uuid: string
  pagePath: string
  loadTime: number
  fcp: number
  lcp: number
  fid: number
  cls: number
  fps: number
  resourceSize: number
  performanceLevel: string
  accessTime: string
}[] = []

const count = 50
const pagePaths = [
  { path: '/index', name: '首页' },
  { path: '/goods/list', name: '商品列表' },
  { path: '/goods/detail', name: '商品详情' },
  { path: '/order/list', name: '订单列表' },
  { path: '/order/detail', name: '订单详情' },
  { path: '/user/center', name: '用户中心' },
  { path: '/cart', name: '购物车' },
  { path: '/checkout', name: '结算页' },
  { path: '/setting/userManagement', name: '用户管理' },
  { path: '/setting/roleManagement', name: '角色管理' },
]

// 生成优秀的性能数据 - 大部分页面性能都是优秀级别
for (let i = 0; i < count; i++) {
  // 80% 的概率生成优秀数据，15% 良好，5% 一般
  const rand = Math.random()
  let loadTime: number, fcp: number, lcp: number, fid: number, cls: number, fps: number, resourceSize: number
  
  if (rand < 0.8) {
    // 优秀性能：加载时间 < 1.5s, FPS > 55
    loadTime = +(Math.random() * 0.8 + 0.3).toFixed(2) // 0.3-1.1s
    fcp = +(Math.random() * 0.6 + 0.2).toFixed(2) // 0.2-0.8s
    lcp = +(Math.random() * 1 + 0.3).toFixed(2) // 0.3-1.3s
    fid = Math.floor(Math.random() * 50 + 5) // 5-55ms
    cls = +(Math.random() * 0.05 + 0.001).toFixed(3) // 0.001-0.05
    fps = Math.floor(Math.random() * 5 + 57) // 57-62fps
    resourceSize = Math.floor(Math.random() * 800 + 300) // 300-1100KB
  } else if (rand < 0.95) {
    // 良好性能：加载时间 1.5-2.5s, FPS 45-55
    loadTime = +(Math.random() * 1 + 1.5).toFixed(2) // 1.5-2.5s
    fcp = +(Math.random() * 0.8 + 0.8).toFixed(2) // 0.8-1.6s
    lcp = +(Math.random() * 1.5 + 1.3).toFixed(2) // 1.3-2.8s
    fid = Math.floor(Math.random() * 100 + 50) // 50-150ms
    cls = +(Math.random() * 0.1 + 0.05).toFixed(3) // 0.05-0.15
    fps = Math.floor(Math.random() * 10 + 45) // 45-55fps
    resourceSize = Math.floor(Math.random() * 1500 + 800) // 800-2300KB
  } else {
    // 一般性能：加载时间 2.5-4s, FPS 35-45
    loadTime = +(Math.random() * 1.5 + 2.5).toFixed(2) // 2.5-4s
    fcp = +(Math.random() * 1.5 + 1.5).toFixed(2) // 1.5-3s
    lcp = +(Math.random() * 2 + 2.5).toFixed(2) // 2.5-4.5s
    fid = Math.floor(Math.random() * 200 + 100) // 100-300ms
    cls = +(Math.random() * 0.15 + 0.1).toFixed(3) // 0.1-0.25
    fps = Math.floor(Math.random() * 10 + 35) // 35-45fps
    resourceSize = Math.floor(Math.random() * 2000 + 1500) // 1500-3500KB
  }
  
  // 根据性能指标计算等级
  let performanceLevel = 'good'
  if (loadTime < 1.5 && fps > 55 && cls < 0.1) {
    performanceLevel = 'excellent'
  } else if (loadTime < 2.5 && fps > 45) {
    performanceLevel = 'good'
  } else if (loadTime < 3.5 && fps > 40) {
    performanceLevel = 'fair'
  } else {
    performanceLevel = 'poor'
  }
  
  PerformanceList.push({
    id: '@id',
    uuid: '@uuid',
    pagePath: pagePaths[Math.floor(Math.random() * pagePaths.length)].path,
    loadTime,
    fcp,
    lcp,
    fid,
    cls,
    fps,
    resourceSize,
    performanceLevel,
    accessTime: '@datetime',
  })
}

// 趋势数据 - 生成优秀的性能趋势
const getTrendData = (startDate?: string, endDate?: string) => {
  const dates: string[] = []
  const loadTimeTrend: number[] = []
  const fcpTrend: number[] = []
  const lcpTrend: number[] = []
  const fpsTrend: number[] = []
  
  const days = 7
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
    dates.push(dateStr)
    
    // 优秀的性能趋势数据
    loadTimeTrend.push(+(Math.random() * 0.6 + 0.5).toFixed(2)) // 0.5-1.1s
    fcpTrend.push(+(Math.random() * 0.5 + 0.3).toFixed(2)) // 0.3-0.8s
    lcpTrend.push(+(Math.random() * 0.7 + 0.4).toFixed(2)) // 0.4-1.1s
    fpsTrend.push(Math.floor(Math.random() * 4 + 58)) // 58-62fps
  }
  
  return {
    dates,
    loadTimeTrend,
    fcpTrend,
    lcpTrend,
    fpsTrend,
  }
}

export default [
  {
    url: '/performanceMonitor/getList',
    method: 'get',
    response: ({ query }: any) => {
      const { pagePath, performanceLevel, pageNo = 1, pageSize = 20 } = query
      
      let mockList = PerformanceList.filter((item: any) => {
        if (pagePath && !item.pagePath.includes(pagePath)) {
          return false
        }
        if (performanceLevel && item.performanceLevel !== performanceLevel) {
          return false
        }
        return true
      })
      
      const list = mockList.filter((item: any, index: any) => 
        index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
      )
      
      return {
        code: 200,
        msg: 'success',
        data: { 
          list, 
          total: mockList.length 
        },
      }
    },
  },
  {
    url: '/performanceMonitor/getTrend',
    method: 'get',
    response: ({ query }: any) => {
      const { startDate, endDate } = query
      const trendData = getTrendData(startDate, endDate)
      
      return {
        code: 200,
        msg: 'success',
        data: trendData,
      }
    },
  },
  {
    url: '/performanceMonitor/getStats',
    method: 'get',
    response: () => {
      const totalLoadTime = PerformanceList.reduce((sum, item) => sum + item.loadTime, 0)
      const totalFps = PerformanceList.reduce((sum, item) => sum + item.fps, 0)
      const totalResourceSize = PerformanceList.reduce((sum, item) => sum + item.resourceSize, 0)
      const errors = PerformanceList.filter((item) => item.performanceLevel === 'poor').length
      
      return {
        code: 200,
        msg: 'success',
        data: {
          avgLoadTime: +(totalLoadTime / PerformanceList.length).toFixed(2),
          avgFps: Math.round(totalFps / PerformanceList.length),
          avgResourceSize: Math.round(totalResourceSize / PerformanceList.length),
          errorCount: errors,
        },
      }
    },
  },
] as MockMethod[]
