import { Random } from 'mockjs'
import type { MockMethod } from 'vite-plugin-mock'

const List: any[] = []
const count = 20
const logoList = [
  'https://logo.clearbit.com/apple.com',
  'https://logo.clearbit.com/huawei.com',
  'https://logo.clearbit.com/mi.com',
  'https://logo.clearbit.com/samsung.com',
  'https://logo.clearbit.com/oppo.com',
  'https://logo.clearbit.com/vivo.com',
  'https://logo.clearbit.com/lenovo.com',
  'https://logo.clearbit.com/sony.com',
  'https://logo.clearbit.com/lg.com',
  'https://logo.clearbit.com/zte.com.cn',
]
for (let i = 0; i < count; i++) {
  List.push({
    id: i + 1,
    name: Random.ctitle(3, 6),
    logo: logoList[i % logoList.length],
    desc: Random.csentence(8, 16),
    status: Random.pick(['启用', '禁用']),
  })
}

export default [
  {
    url: '/brand/getList',
    method: 'get',
    response({ query }: any) {
      const { name, pageNo = 1, pageSize = 10 } = query
      let mockList = List
      if (name) {
        mockList = mockList.filter((item) => item.name.includes(name))
      }
      const list = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
      return {
        code: 200,
        msg: 'success',
        data: { list, total: mockList.length },
      }
    },
  },
  {
    url: '/brand/doEdit',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/brand/doDelete',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
] as MockMethod[]
