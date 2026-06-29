import request from '/@/utils/request'

// 获取网站设置
export function getWebsiteSetting() {
  return request({
    url: '/websiteSetting/getSetting',
    method: 'get',
  })
}

// 保存网站设置
export function saveWebsiteSetting(data: any) {
  return request({
    url: '/websiteSetting/saveSetting',
    method: 'post',
    data,
  })
}

// 上传文件
export function uploadFile(data: FormData) {
  return request({
    url: '/websiteSetting/uploadFile',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
