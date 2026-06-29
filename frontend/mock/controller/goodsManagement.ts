import type { MockMethod } from 'vite-plugin-mock'
import { handleRandomImage } from '../utils/index.ts'

const List = <any>[]
const count = 50
const categoryList = [
  { id: '1', name: '食品饮料' },
  { id: '2', name: '家用电器' },
  { id: '3', name: '其他' },
]
for (let i = 0; i < count; i++) {
  const category = categoryList[i % categoryList.length]
  List.push({
    uuid: '@uuid',
    id: '@id',
    title: '@ctitle(5, 10)',
    description: '@ctitle(10, 20)',
    name: '@ctitle(3, 6)',
    categoryId: category.id,
    category: category.name,
    price: '@integer(10,1000)',
    sales: '@integer(0,100)',
    stock: '@integer(0,100)',
    status: '@pick(["active","inactive","pending"])',
    datetime: '@datetime',
    images: [handleRandomImage(), handleRandomImage()],
    link: 'https://www.baidu.com',
    isRecommend: '@boolean',
  })
}

// SKU数据
const SkuList = [
  {
    id: '1',
    skuCode: 'SKU001',
    skuName: 'iPhone 15 Pro',
    specifications: [
      { key: '颜色', value: '银色' },
      { key: '存储容量', value: '128GB' },
    ],
    price: 7999,
    stock: 100,
    status: 'active',
    sort: 1,
    remark: '苹果旗舰手机',
    image: handleRandomImage(),
  },
  {
    id: '2',
    skuCode: 'SKU002',
    skuName: 'iPad Air',
    specifications: [
      { key: '颜色', value: '蓝色' },
      { key: '存储容量', value: '256GB' },
      { key: '连接', value: 'WiFi' },
    ],
    price: 4699,
    stock: 50,
    status: 'active',
    sort: 2,
    remark: '轻薄平板电脑',
    image: handleRandomImage(),
  },
]

export default [
  {
    url: '/goodsManagement/getList',
    method: 'get',
    response({ query }: any) {
      const { name, pageNo = 1, pageSize = 20 } = query
      const mockList = List.filter((item: { name: string | any[] }) => !(name && !item.name.includes(name)))
      const list = mockList.filter((item: any, index: number) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
      list.sort(() => Math.random() - 0.5)
      return {
        code: 200,
        msg: 'success',
        data: { list, total: mockList.length },
      }
    },
  },
  {
    url: '/goodsManagement/doEdit',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/goodsManagement/doDelete',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
  // SKU相关接口
  {
    url: '/goodsSku/getList',
    method: 'get',
    response({ query }: any) {
      const { skuName, status, pageNo = 1, pageSize = 20 } = query
      let mockList = [...SkuList]

      // 按SKU名称筛选
      if (skuName) {
        mockList = mockList.filter((item: any) => item.skuName.includes(skuName))
      }

      // 按状态筛选
      if (status) {
        mockList = mockList.filter((item: any) => item.status === status)
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
    url: '/goodsSku/doAdd',
    method: 'post',
    response({ body }: any) {
      console.log('添加SKU数据:', body)

      // 处理批量SKU创建
      if (body.bulkOperation && body.skuList) {
        console.log(`批量创建了 ${body.skuList.length} 个SKU组合`)
        return {
          code: 200,
          msg: `成功创建 ${body.skuList.length} 个SKU组合`,
        }
      }

      return {
        code: 200,
        msg: 'SKU添加成功',
      }
    },
  },
  {
    url: '/goodsSku/doEdit',
    method: 'post',
    response({ body }: any) {
      console.log('更新SKU数据:', body)

      // 处理批量SKU更新
      if (body.bulkOperation && body.skuList) {
        console.log(`批量更新了 ${body.skuList.length} 个SKU组合`)
        return {
          code: 200,
          msg: `成功更新 ${body.skuList.length} 个SKU组合`,
        }
      }

      return {
        code: 200,
        msg: 'SKU更新成功',
      }
    },
  },
  {
    url: '/goodsSku/doDelete',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: 'SKU删除成功',
      }
    },
  },
  {
    url: '/goodsManagement/doAdd',
    method: 'post',
    response({ body }: any) {
      const newId = String(Date.now())
      const category = categoryList.find((c) => c.id === body.categoryId) || categoryList[0]
      const newGoods = {
        ...body,
        id: newId,
        category: category.name,
        images: body.images || [handleRandomImage()],
        status: body.status || 'active',
        isRecommend: !!body.isRecommend,
        sales: 0,
        stock: body.stock || 0,
        price: body.price || 0,
        datetime: new Date().toISOString(),
      }
      List.unshift(newGoods)
      return { code: 200, msg: '商品新增成功', data: newGoods }
    },
  },
  {
    url: '/goodsManagement/getDetail',
    method: 'get',
    response({ query }: any) {
      const item = List.find((g: any) => g.id === query.id)
      if (item) {
        return { code: 200, msg: 'success', data: item }
      } else {
        return { code: 404, msg: '未找到商品' }
      }
    },
  },
  {
    url: '/goodsManagement/batchDelete',
    method: 'post',
    response({ body }: any) {
      const { ids } = body
      let count = 0
      ids.forEach((id: string) => {
        const idx = List.findIndex((g: any) => g.id === id)
        if (idx !== -1) {
          List.splice(idx, 1)
          count++
        }
      })
      return { code: 200, msg: `成功删除${count}个商品` }
    },
  },
  {
    url: '/goodsManagement/batchUpdateStatus',
    method: 'post',
    response({ body }: any) {
      const { ids, status } = body
      let count = 0
      List.forEach((g: any) => {
        if (ids.includes(g.id)) {
          g.status = status
          count++
        }
      })
      return { code: 200, msg: `成功更新${count}个商品状态` }
    },
  },
  {
    url: '/goodsManagement/batchRecommend',
    method: 'post',
    response({ body }: any) {
      const { ids, isRecommend } = body
      let count = 0
      List.forEach((g: any) => {
        if (ids.includes(g.id)) {
          g.isRecommend = isRecommend
          count++
        }
      })
      return { code: 200, msg: `成功设置${count}个商品推荐状态` }
    },
  },
] as MockMethod[]
