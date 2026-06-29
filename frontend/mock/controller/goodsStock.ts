import type { MockMethod } from 'vite-plugin-mock'

interface StockItem {
  id: string
  goodsName: string
  goodsCode: string
  category: string
  currentStock: string
  minStock: string
  maxStock: string
  unit: string
  status: string
  lastUpdateTime: string
  warehouse: string
}

interface RecordItem {
  id: string
  goodsName: string
  goodsCode: string
  type: string
  quantity: string
  beforeStock: string
  afterStock: string
  operator: string
  warehouse: string
  remark: string
  createTime: string
}

const StockList: StockItem[] = []
const count = 50
for (let i = 0; i < count; i++) {
  StockList.push({
    id: '@id',
    goodsName: '@ctitle(5, 10)',
    goodsCode: '@string("upper", 8)',
    category: '@pick(["电子产品", "服装鞋帽", "食品饮料"])',
    currentStock: '@integer(0, 1000)',
    minStock: '@integer(10, 100)',
    maxStock: '@integer(500, 2000)',
    unit: '@pick(["个", "件", "台", "包", "瓶"])',
    status: '@pick(["正常", "库存不足", "库存积压"])',
    lastUpdateTime: '@datetime',
    warehouse: '@pick(["主仓库", "分仓A", "分仓B"])',
  })
}

const RecordList: RecordItem[] = []
const recordCount = 30
for (let i = 0; i < recordCount; i++) {
  RecordList.push({
    id: '@id',
    goodsName: '@ctitle(5, 10)',
    goodsCode: '@string("upper", 8)',
    type: '@pick(["入库", "出库", "调拨", "盘点"])',
    quantity: '@integer(1, 100)',
    beforeStock: '@integer(0, 500)',
    afterStock: '@integer(0, 500)',
    operator: '@cname',
    warehouse: '@pick(["主仓库", "分仓A", "分仓B"])',
    remark: '@ctitle(10, 30)',
    createTime: '@datetime',
  })
}

export default [
  {
    url: '/goodsStock/getList',
    method: 'get',
    response({ query }: any) {
      const { goodsName, status, pageNo = 1, pageSize = 20 } = query
      let mockList = StockList
      if (goodsName) {
        mockList = mockList.filter((item: StockItem) => item.goodsName.includes(goodsName))
      }
      if (status) {
        mockList = mockList.filter((item: StockItem) => item.status === status)
      }
      const list = mockList.filter((item: any, index: number) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
      return {
        code: 200,
        msg: 'success',
        data: { list, total: mockList.length },
      }
    },
  },
  {
    url: '/goodsStock/getRecordList',
    method: 'get',
    response({ query }: any) {
      const { goodsName, type, pageNo = 1, pageSize = 20 } = query
      let mockList = RecordList
      if (goodsName) {
        mockList = mockList.filter((item: RecordItem) => item.goodsName.includes(goodsName))
      }
      if (type) {
        mockList = mockList.filter((item: RecordItem) => item.type === type)
      }
      const list = mockList.filter((item: any, index: number) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
      return {
        code: 200,
        msg: 'success',
        data: { list, total: mockList.length },
      }
    },
  },
  {
    url: '/goodsStock/doEdit',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/goodsStock/doDelete',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
  {
    url: '/goodsStock/doInStock',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '入库成功',
      }
    },
  },
  {
    url: '/goodsStock/doOutStock',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '出库成功',
      }
    },
  },
] as MockMethod[]
