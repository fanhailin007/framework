import request from '/@/utils/request'

export const getList = (params?: { u?: string }) => {
  return request({
    // 正式项目请更换为真实地址
    url: 'https://api.vuejs-core.cn/getShopDescription',
    method: 'get',
    params: {
      u: params?.u,
    },
  })
}
