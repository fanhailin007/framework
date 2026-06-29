import type { MockMethod } from 'vite-plugin-mock'

interface CouponItem {
  id: string
  name: string
  code: string
  type: string
  discount: string
  minAmount: string
  maxDiscount: string
  totalCount: string
  usedCount: string
  startTime: string
  endTime: string
  status: string
  createTime: string
}

interface CouponRecordItem {
  id: string
  couponName: string
  couponCode: string
  userName: string
  phone: string
  useTime: string
  orderAmount: string
  discountAmount: string
  status: string
  createTime: string
}

const CouponList: CouponItem[] = []
const count = 30
for (let i = 0; i < count; i++) {
  CouponList.push({
    id: '@id',
    name: '@ctitle(5, 15)',
    code: '@string("upper", 8)',
    type: '@pick(["满减券", "折扣券", "无门槛券"])',
    discount: '@pick(["满100减10", "满200减30", "9折", "8折", "5元无门槛"])',
    minAmount: '@pick(["0", "100", "200", "500"])',
    maxDiscount: '@pick(["10", "30", "50", "100"])',
    totalCount: '@integer(100, 10000)',
    usedCount: '@integer(0, 1000)',
    startTime: '@datetime',
    endTime: '@datetime',
    status: '@pick(["启用", "停用", "已过期"])',
    createTime: '@datetime',
  })
}

const RecordList: CouponRecordItem[] = []
const recordCount = 50
for (let i = 0; i < recordCount; i++) {
  RecordList.push({
    id: '@id',
    couponName: '@ctitle(5, 15)',
    couponCode: '@string("upper", 8)',
    userName: '@cname',
    phone: '@string("number", 11)',
    useTime: '@datetime',
    orderAmount: '@pick(["120", "250", "380", "520"])',
    discountAmount: '@pick(["10", "30", "50", "100"])',
    status: '@pick(["已使用", "已过期", "已退款"])',
    createTime: '@datetime',
  })
}

export default [
  {
    url: '/goodsCoupon/getList',
    method: 'get',
    response({ query }: any) {
      const { name, status, pageNo = 1, pageSize = 20 } = query
      let mockList = CouponList
      if (name) {
        mockList = mockList.filter((item: CouponItem) => item.name.includes(name))
      }
      if (status) {
        mockList = mockList.filter((item: CouponItem) => item.status === status)
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
    url: '/goodsCoupon/getRecordList',
    method: 'get',
    response({ query }: any) {
      const { couponName, userName, status, pageNo = 1, pageSize = 20 } = query
      let mockList = RecordList
      if (couponName) {
        mockList = mockList.filter((item: CouponRecordItem) => item.couponName.includes(couponName))
      }
      if (userName) {
        mockList = mockList.filter((item: CouponRecordItem) => item.userName.includes(userName))
      }
      if (status) {
        mockList = mockList.filter((item: CouponRecordItem) => item.status === status)
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
    url: '/goodsCoupon/doEdit',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/goodsCoupon/doDelete',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
  {
    url: '/goodsCoupon/doSend',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '发放成功',
      }
    },
  },
] as MockMethod[]
