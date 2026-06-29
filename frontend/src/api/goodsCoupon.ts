import request from '/@/utils/request'

export function getGoodsCouponList(params?: any) {
  return request({
    url: '/goodsCoupon/getList',
    method: 'get',
    params,
  })
}

export function getGoodsCouponRecordList(params?: any) {
  return request({
    url: '/goodsCoupon/getRecordList',
    method: 'get',
    params,
  })
}

export function doGoodsCouponEdit(data: any) {
  return request({
    url: '/goodsCoupon/doEdit',
    method: 'post',
    data,
  })
}

export function doGoodsCouponDelete(data: any) {
  return request({
    url: '/goodsCoupon/doDelete',
    method: 'post',
    data,
  })
}

export function doGoodsCouponSend(data: any) {
  return request({
    url: '/goodsCoupon/doSend',
    method: 'post',
    data,
  })
}
