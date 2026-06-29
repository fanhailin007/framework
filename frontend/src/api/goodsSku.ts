import request from '/@/utils/request'

/**
 * 获取SKU列表
 * @param params
 * @returns
 */
export function getSkuList(params: any) {
  return request({
    url: '/goodsSku/getList',
    method: 'get',
    params,
  })
}

/**
 * 新增SKU
 * @param data
 * @returns
 */
export function addSku(data: any) {
  return request({
    url: '/goodsSku/doAdd',
    method: 'post',
    data,
  })
}

/**
 * 编辑SKU
 * @param data
 * @returns
 */
export function editSku(data: any) {
  return request({
    url: '/goodsSku/doEdit',
    method: 'post',
    data,
  })
}

/**
 * 删除SKU
 * @param data
 * @returns
 */
export function deleteSku(data: any) {
  return request({
    url: '/goodsSku/doDelete',
    method: 'post',
    data,
  })
}
