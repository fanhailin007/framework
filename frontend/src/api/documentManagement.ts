import request from '/@/utils/request'
import { useUserStore } from '/@/store/modules/user'
import { normalizeDocumentPayload, normalizeDocumentUploadPayload, normalizePublishPayload } from '/@/utils/documentManagementContract'

const getCurrentUserId = () => {
  const authInfo = useUserStore().getCachedAuthInfo()
  return authInfo?.id
}

const ensureDocumentIdMatchesId = async (response: any, actorUserId?: number) => {
  const document = response?.data ?? response
  const id = document?.id
  if (!id || document?.documentId === id) return response
  await request({
    url: `/documents/${id}`,
    method: 'put',
    data: normalizeDocumentPayload({ id }, { actorUserId }),
  })
  return response
}

export function getList(params?: any) {
  return request({
    url: '/documents',
    method: 'get',
    params: {
      status: params?.status || undefined,
    },
  })
}

export function getDetail(id: number | string) {
  return request({
    url: `/documents/${id}`,
    method: 'get',
  })
}

export const doEdit = (data: any) => {
  const id = data.id
  const actorUserId = getCurrentUserId()
  return request({
    url: id ? `/documents/${id}` : '/documents',
    method: id ? 'put' : 'post',
    data: normalizeDocumentPayload(data, { actorUserId }),
  }).then((response) => (id ? response : ensureDocumentIdMatchesId(response, actorUserId)))
}

export const doUpload = (data: any) => {
  const actorUserId = getCurrentUserId()
  return request({
    url: '/documents/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: normalizeDocumentUploadPayload(data, { actorUserId }),
  }).then((response) => ensureDocumentIdMatchesId(response, actorUserId))
}

export const doPublish = (id: number | string, data: any = {}) => {
  return request({
    url: `/documents/${id}/publish`,
    method: 'post',
    data: normalizePublishPayload({ ...data, actorUserId: getCurrentUserId() }),
  })
}

export const doArchive = (id: number | string) => {
  return request({
    url: `/documents/${id}/archive`,
    method: 'post',
  })
}

export const doDelete = (data: any) => {
  const ids = `${data.ids}`.split(',').filter(Boolean)
  return Promise.all(
    ids.map((id) =>
      request({
        url: `/documents/${id}`,
        method: 'delete',
      })
    )
  ).then(() => ({ msg: '删除成功' }))
}

export const getPdfBlob = async (id: number | string) => {
  return (await request({
    url: `/documents/${id}/pdf`,
    method: 'get',
    responseType: 'blob',
  })) as unknown as Blob
}
