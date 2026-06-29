import request from '/@/utils/request'

export function getList(params: any) {
  return request({
    url: '/goodsManagement/getList',
    method: 'get',
    params,
  })
}

export function addGoods(data: any) {
  return request({
    url: '/goodsManagement/doAdd',
    method: 'post',
    data,
  })
}

export function getGoodsDetail(id: string) {
  return request({
    url: '/goodsManagement/getDetail',
    method: 'get',
    params: { id },
  })
}

export function doEdit(data: any) {
  return request({
    url: '/goodsManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/goodsManagement/doDelete',
    method: 'post',
    data,
  })
}

export function batchDelete(ids: string[]) {
  return request({
    url: '/goodsManagement/batchDelete',
    method: 'post',
    data: { ids },
  })
}

export function batchUpdateStatus(data: { ids: string[]; status: string }) {
  return request({
    url: '/goodsManagement/batchUpdateStatus',
    method: 'post',
    data,
  })
}

export function batchRecommend(data: { ids: string[]; isRecommend: boolean }) {
  return request({
    url: '/goodsManagement/batchRecommend',
    method: 'post',
    data,
  })
}
