import request from '/@/utils/request'

export function getGoodsDiscountList(params?: any) {
  return request({
    url: '/goodsDiscount/getList',
    method: 'get',
    params,
  })
}

export function doGoodsDiscountEdit(data: any) {
  return request({
    url: '/goodsDiscount/doEdit',
    method: 'post',
    data,
  })
}

export function doGoodsDiscountDelete(data: any) {
  return request({
    url: '/goodsDiscount/doDelete',
    method: 'post',
    data,
  })
}
