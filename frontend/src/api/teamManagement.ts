import request from '/@/utils/request'

/**
 * 团队管理API
 */

export function getList(query?: any) {
  return request({
    url: '/teamManagement/getList',
    method: 'get',
    params: query,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/teamManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/teamManagement/doDelete',
    method: 'post',
    data,
  })
}

export function uploadAvatar(data: any) {
  return request({
    url: '/teamManagement/uploadAvatar',
    method: 'post',
    data,
  })
}
