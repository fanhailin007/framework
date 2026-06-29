import request from '/@/utils/request'

/**
 * 获取性能监控列表
 * @param params 查询参数
 */
export const getPerformanceList = (params?: any) => {
  return request({
    url: '/performanceMonitor/getList',
    method: 'get',
    params,
  })
}

/**
 * 获取性能趋势数据
 * @param params 查询参数（startDate, endDate）
 */
export const getPerformanceTrend = (params?: any) => {
  return request({
    url: '/performanceMonitor/getTrend',
    method: 'get',
    params,
  })
}

/**
 * 获取性能统计数据
 * @param params 查询参数
 */
export const getPerformanceStats = (params?: any) => {
  return request({
    url: '/performanceMonitor/getStats',
    method: 'get',
    params,
  })
}
