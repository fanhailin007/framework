import request from '/@/utils/request'

export function getGoodsStockList(params?: any) {
  return request({
    url: '/goodsStock/getList',
    method: 'get',
    params,
  })
}

export function getGoodsStockRecordList(params?: any) {
  return request({
    url: '/goodsStock/getRecordList',
    method: 'get',
    params,
  })
}

export function doGoodsStockEdit(data: any) {
  return request({
    url: '/goodsStock/doEdit',
    method: 'post',
    data,
  })
}

export function doGoodsStockDelete(data: any) {
  return request({
    url: '/goodsStock/doDelete',
    method: 'post',
    data,
  })
}

export function doGoodsStockInStock(data: any) {
  return request({
    url: '/goodsStock/doInStock',
    method: 'post',
    data,
  })
}

export function doGoodsStockOutStock(data: any) {
  return request({
    url: '/goodsStock/doOutStock',
    method: 'post',
    data,
  })
}
