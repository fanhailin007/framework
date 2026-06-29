import type { MockMethod } from 'vite-plugin-mock'

interface GoodsItem {
  id: string
  name: string
  code: string
  price: string
  stock: string
  status: string
  createTime: string
}

const GoodsList: GoodsItem[] = []
const count = 50
for (let i = 0; i < count; i++) {
  GoodsList.push({
    id: '@id',
    name: '@ctitle(5, 10)',
    code: '@string("upper", 8)',
    price: '@float(10, 1000, 2, 2)',
    stock: '@integer(0, 1000)',
    status: '@pick(["上架", "下架", "售罄"])',
    createTime: '@datetime',
  })
}

export default [
  {
    url: '/goodsImportExport/getList',
    method: 'get',
    response({ query }: any) {
      const { name, code, status, pageNo = 1, pageSize = 20 } = query
      let mockList = GoodsList
      if (name) mockList = mockList.filter((item: GoodsItem) => item.name.includes(name))
      if (code) mockList = mockList.filter((item: GoodsItem) => item.code.includes(code))
      if (status) mockList = mockList.filter((item: GoodsItem) => item.status === status)
      const list = mockList.filter((item: any, index: number) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
      return {
        code: 200,
        msg: 'success',
        data: { list, total: mockList.length },
      }
    },
  },
  {
    url: '/goodsImportExport/import',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '导入成功（mock）',
      }
    },
  },
  {
    url: '/goodsImportExport/export',
    method: 'get',
    response() {
      return {
        code: 200,
        msg: '导出成功（mock）',
      }
    },
  },
] as MockMethod[]
