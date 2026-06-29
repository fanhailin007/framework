import request from '/@/utils/request'
import { normalizeUserPayload } from '/@/utils/userManagementContract'

export function getList(params?: any) {
  return request({
    url: '/users/getList',
    method: 'get',
    params,
  })
}

export const doEdit = (data: any) => {
  const id = data.id
  return request({
    url: id ? `/users/${id}` : '/users',
    method: id ? 'put' : 'post',
    data: normalizeUserPayload(data),
  })
}

export const doDelete = (data: any) => {
  const ids = `${data.ids}`.split(',').filter(Boolean)
  return Promise.all(
    ids.map((id) =>
      request({
        url: `/users/${id}`,
        method: 'delete',
      })
    )
  ).then(() => ({ msg: '删除成功' }))
}
