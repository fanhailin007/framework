import type { MockMethod } from 'vite-plugin-mock'
import { handleRandomImage } from '../utils/index.ts'

const list: any[] = []
for (let i = 0; i < 100; i++) {
  list.push({
    span: 6,
    user: `用户${i + 1}`,
    title: `新闻标题${i + 1} - @ctitle(30, 35)`,
    logo: handleRandomImage(),
    image: handleRandomImage(),
    fullImage: i % 10 === 0,
    time: '@datetime',
    content: '@cparagraph(100, 200)',
  })
}

export default [
  {
    url: '/news/getList',
    method: 'get',
    response: ({ query }: any) => {
      const { pageNo = 1, pageSize = 10 } = query
      list.map((item: any) => {
        item.logo = handleRandomImage()
        item.image = handleRandomImage()
      })
      const start = (pageNo - 1) * pageSize
      const end = start + Number(pageSize)
      const pageList = list.slice(start, end)
      return {
        code: 200,
        msg: 'success',
        data: { list: pageList, total: list.length },
      }
    },
  },
] as MockMethod[]
