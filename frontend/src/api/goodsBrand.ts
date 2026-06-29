import request from '/@/utils/request'

export function getBrandList(params: any) {
  return request({
    url: '/brand/getList',
    method: 'get',
    params,
  })
}

export function doBrandEdit(data: any) {
  return request({
    url: '/brand/doEdit',
    method: 'post',
    data,
  })
}

export function doBrandDelete(data: any) {
  return request({
    url: '/brand/doDelete',
    method: 'post',
    data,
  })
}
