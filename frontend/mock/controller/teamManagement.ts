import type { MockMethod } from 'vite-plugin-mock'

let teamList: any[] = [
  {
    id: 1,
    name: '前端开发团队',
    description: '负责前端开发工作，包括Vue、React等框架的应用开发',
    memberCount: 8,
    createTime: '2027-01-15',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    members: [
      { id: 1, name: '张三', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '前端开发部' },
      { id: 2, name: '李四', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '前端开发部' },
      { id: 3, name: '王五', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '前端开发部' },
      { id: 4, name: '赵六', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '前端开发部' },
    ],
    order: 1,
  },
  {
    id: 2,
    name: '后端开发团队',
    description: '负责后端服务开发，包括Java、Python等语言的应用开发',
    memberCount: 6,
    createTime: '2027-01-15',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    members: [
      { id: 5, name: '钱七', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '后端开发部' },
      { id: 6, name: '孙八', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '后端开发部' },
      { id: 7, name: '周九', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '后端开发部' },
    ],
    order: 2,
  },
  {
    id: 3,
    name: '测试团队',
    description: '负责产品质量测试，包括自动化测试和手动测试',
    memberCount: 4,
    createTime: '2027-01-20',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    members: [
      { id: 8, name: '吴十', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '测试部' },
      { id: 9, name: '郑一', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '测试部' },
    ],
    order: 3,
  },
  {
    id: 4,
    name: 'UI/UX设计团队',
    description: '负责产品界面设计和用户体验优化',
    memberCount: 5,
    createTime: '2027-02-01',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    members: [
      { id: 10, name: '王二', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '设计部' },
      { id: 11, name: '冯三', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '设计部' },
      { id: 12, name: '陈四', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '设计部' },
      { id: 13, name: '褚五', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '设计部' },
    ],
    order: 4,
  },
  {
    id: 5,
    name: '运维团队',
    description: '负责系统部署、监控和维护工作',
    memberCount: 3,
    createTime: '2027-02-10',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    members: [
      { id: 14, name: '卫六', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '运维部' },
      { id: 15, name: '蒋七', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '运维部' },
    ],
    order: 5,
  },
  {
    id: 6,
    name: '产品团队',
    description: '负责产品规划、需求分析和项目管理',
    memberCount: 4,
    createTime: '2027-02-15',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    members: [
      { id: 16, name: '沈八', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '产品部' },
      { id: 17, name: '韩九', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '产品部' },
      { id: 18, name: '杨十', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', department: '产品部' },
    ],
    order: 6,
  },
]

export default [
  {
    url: '/teamManagement/getList',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: {
          list: teamList,
          total: teamList.length,
        },
      }
    },
  },
  {
    url: '/teamManagement/doEdit',
    method: 'post',
    response: ({ body }: any) => {
      const teamData = body
      if (teamData.id) {
        // 更新现有团队
        const index = teamList.findIndex((item) => item.id === teamData.id)
        if (index !== -1) {
          teamList[index] = { ...teamList[index], ...teamData }
        }
      } else {
        // 添加新团队
        const newId = Math.max(...teamList.map((item) => item.id), 0) + 1
        teamList.push({
          ...teamData,
          id: newId,
          createTime: new Date().toISOString().split('T')[0],
          memberCount: teamData.members?.length || 0,
        })
      }
      return {
        code: 200,
        msg: '保存成功',
      }
    },
  },
  {
    url: '/teamManagement/doDelete',
    method: 'post',
    response: ({ body }: any) => {
      const { ids } = body
      const idArray = ids.split(',').map((id: string) => parseInt(id, 10))
      teamList = teamList.filter((item) => !idArray.includes(item.id))
      return {
        code: 200,
        msg: '删除成功',
      }
    },
  },
  {
    url: '/teamManagement/uploadAvatar',
    method: 'post',
    response: () => {
      // 生成一个随机的图片URL，模拟真实的上传结果
      const randomId = Math.floor(Math.random() * 1000)
      return {
        code: 200,
        msg: '头像上传成功',
        data: {
          url: `https://picsum.photos/200/200?random=${randomId}`,
        },
      }
    },
  },
] as MockMethod[]
