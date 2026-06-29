import request from '/@/utils/request'

export function getGoodsList(params: any) {
  return request({
    url: '/goodsImportExport/getList',
    method: 'get',
    params,
  })
}

export function importGoods(data: FormData) {
  return request({
    url: '/goodsImportExport/import',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function exportGoods(params: any) {
  return request({
    url: '/goodsImportExport/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}
