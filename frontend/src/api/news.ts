import request from '/@/utils/request'

export const getList = (params?: any) => {
  return request({
    url: '/news/getList',
    method: 'get',
    params,
  })
}
