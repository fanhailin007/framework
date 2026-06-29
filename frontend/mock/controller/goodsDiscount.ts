import type { MockMethod } from 'vite-plugin-mock'

interface DiscountItem {
  id: string
  activityName: string
  goodsName: string
  goodsCode: string
  discountPrice: string
  originPrice: string
  stock: string
  startTime: string
  endTime: string
  status: string
  updateTime: string
}

const DiscountList: DiscountItem[] = []
const count = 30
for (let i = 0; i < count; i++) {
  DiscountList.push({
    id: '@id',
    activityName: '@ctitle(5, 10)',
    goodsName: '@ctitle(5, 10)',
    goodsCode: '@string("upper", 8)',
    discountPrice: '@float(10, 100, 2, 2)',
    originPrice: '@float(20, 200, 2, 2)',
    stock: '@integer(0, 1000)',
    startTime: '@datetime',
    endTime: '@datetime',
    status: '@pick(["未开始", "进行中", "已结束", "已停用"])',
    updateTime: '@datetime',
  })
}

export default [
  {
    url: '/goodsDiscount/getList',
    method: 'get',
    response({ query }: any) {
      const { activityName, goodsName, status, pageNo = 1, pageSize = 10 } = query
      let mockList = DiscountList
      if (activityName) {
        mockList = mockList.filter((item: DiscountItem) => item.activityName.includes(activityName))
      }
      if (goodsName) {
        mockList = mockList.filter((item: DiscountItem) => item.goodsName.includes(goodsName))
      }
      if (status) {
        mockList = mockList.filter((item: DiscountItem) => item.status === status)
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
    url: '/goodsDiscount/doEdit',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/goodsDiscount/doDelete',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
] as MockMethod[]
