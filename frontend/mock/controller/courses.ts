import type { MockMethod } from 'vite-plugin-mock'
import { handleRandomImage } from '../utils/index.ts'

// 课程分类数据
const categoryList = [
  { id: '1', name: '前端开发', icon: 'icon-html5', count: 156 },
  { id: '2', name: '后端开发', icon: 'icon-java', count: 203 },
  { id: '3', name: '移动开发', icon: 'icon-android', count: 89 },
  { id: '4', name: '数据库', icon: 'icon-mysql', count: 67 },
  { id: '5', name: '云计算&大数据', icon: 'icon-cloud', count: 45 },
  { id: '6', name: '运维&测试', icon: 'icon-linux', count: 78 },
  { id: '7', name: 'UI设计', icon: 'icon-photoshop', count: 92 },
  { id: '8', name: '游戏开发', icon: 'icon-game', count: 34 },
]

// 课程数据
const courseList = [
  {
    id: '1',
    title: 'Vue.js 3.0 从入门到精通',
    description: '全面学习Vue.js 3.0的新特性和最佳实践，掌握现代前端开发技能',
    instructor: '张老师',
    instructorAvatar: handleRandomImage(),
    price: 299,
    originalPrice: 399,
    students: 12580,
    rating: 4.8,
    lessons: 48,
    duration: '32小时',
    level: '中级',
    category: '前端开发',
    categoryId: '1',
    coverImage: handleRandomImage(),
    tags: ['Vue3', 'Composition API', 'TypeScript'],
    isHot: true,
    isNew: false,
    updateTime: '2024-01-15',
    chapters: [
      { title: 'Vue3基础语法', lessons: 12 },
      { title: 'Composition API详解', lessons: 15 },
      { title: 'Vue Router 4', lessons: 8 },
      { title: 'Pinia状态管理', lessons: 10 },
      { title: '项目实战', lessons: 3 },
    ],
  },
  {
    id: '2',
    title: 'React 18 实战教程',
    description: '深入学习React 18的新特性，包括Concurrent Features和Suspense',
    instructor: '李老师',
    instructorAvatar: handleRandomImage(),
    price: 399,
    originalPrice: 499,
    students: 8960,
    rating: 4.9,
    lessons: 56,
    duration: '40小时',
    level: '高级',
    category: '前端开发',
    categoryId: '1',
    coverImage: handleRandomImage(),
    tags: ['React18', 'Hooks', 'Concurrent'],
    isHot: true,
    isNew: true,
    updateTime: '2024-01-20',
    chapters: [
      { title: 'React 18新特性', lessons: 10 },
      { title: 'Hooks深度解析', lessons: 18 },
      { title: '状态管理方案', lessons: 12 },
      { title: '性能优化', lessons: 8 },
      { title: '企业级项目', lessons: 8 },
    ],
  },
  {
    id: '3',
    title: 'Node.js 微服务架构',
    description: '从零开始构建Node.js微服务架构，掌握分布式系统设计',
    instructor: '王老师',
    instructorAvatar: handleRandomImage(),
    price: 599,
    originalPrice: 799,
    students: 5670,
    rating: 4.7,
    lessons: 72,
    duration: '50小时',
    level: '高级',
    category: '后端开发',
    categoryId: '2',
    coverImage: handleRandomImage(),
    tags: ['Node.js', '微服务', 'Docker'],
    isHot: false,
    isNew: false,
    updateTime: '2024-01-10',
    chapters: [
      { title: 'Node.js基础', lessons: 15 },
      { title: 'Express框架', lessons: 12 },
      { title: '微服务设计', lessons: 20 },
      { title: 'Docker容器化', lessons: 15 },
      { title: '部署与监控', lessons: 10 },
    ],
  },
  {
    id: '4',
    title: 'Python数据分析实战',
    description: '使用Python进行数据分析，掌握pandas、numpy、matplotlib等工具',
    instructor: '陈老师',
    instructorAvatar: handleRandomImage(),
    price: 199,
    originalPrice: 299,
    students: 23450,
    rating: 4.6,
    lessons: 36,
    duration: '24小时',
    level: '初级',
    category: '云计算&大数据',
    categoryId: '5',
    coverImage: handleRandomImage(),
    tags: ['Python', '数据分析', '可视化'],
    isHot: true,
    isNew: false,
    updateTime: '2024-01-18',
    chapters: [
      { title: 'Python基础', lessons: 8 },
      { title: 'Pandas数据处理', lessons: 12 },
      { title: '数据可视化', lessons: 10 },
      { title: '统计分析', lessons: 6 },
    ],
  },
  {
    id: '5',
    title: 'Flutter跨平台开发',
    description: '使用Flutter开发iOS和Android应用，一套代码多端运行',
    instructor: '刘老师',
    instructorAvatar: handleRandomImage(),
    price: 449,
    originalPrice: 599,
    students: 7890,
    rating: 4.8,
    lessons: 64,
    duration: '45小时',
    level: '中级',
    category: '移动开发',
    categoryId: '3',
    coverImage: handleRandomImage(),
    tags: ['Flutter', 'Dart', '跨平台'],
    isHot: false,
    isNew: true,
    updateTime: '2024-01-25',
    chapters: [
      { title: 'Dart语言基础', lessons: 10 },
      { title: 'Flutter框架', lessons: 20 },
      { title: 'UI组件开发', lessons: 18 },
      { title: '状态管理', lessons: 8 },
      { title: '原生功能集成', lessons: 8 },
    ],
  },
  {
    id: '6',
    title: 'MySQL数据库优化',
    description: '深入MySQL数据库优化，提升查询性能和系统稳定性',
    instructor: '赵老师',
    instructorAvatar: handleRandomImage(),
    price: 299,
    originalPrice: 399,
    students: 11230,
    rating: 4.7,
    lessons: 42,
    duration: '28小时',
    level: '中级',
    category: '数据库',
    categoryId: '4',
    coverImage: handleRandomImage(),
    tags: ['MySQL', '性能优化', '索引'],
    isHot: false,
    isNew: false,
    updateTime: '2024-01-12',
    chapters: [
      { title: 'MySQL基础', lessons: 8 },
      { title: '索引优化', lessons: 12 },
      { title: '查询优化', lessons: 15 },
      { title: '配置调优', lessons: 7 },
    ],
  },
  {
    id: '7',
    title: 'Docker容器化部署',
    description: '学习Docker容器技术，实现应用的快速部署和扩展',
    instructor: '孙老师',
    instructorAvatar: handleRandomImage(),
    price: 249,
    originalPrice: 349,
    students: 15670,
    rating: 4.5,
    lessons: 38,
    duration: '26小时',
    level: '初级',
    category: '运维&测试',
    categoryId: '6',
    coverImage: handleRandomImage(),
    tags: ['Docker', '容器化', '部署'],
    isHot: true,
    isNew: false,
    updateTime: '2024-01-16',
    chapters: [
      { title: 'Docker基础', lessons: 10 },
      { title: '镜像管理', lessons: 8 },
      { title: '容器编排', lessons: 12 },
      { title: '生产环境部署', lessons: 8 },
    ],
  },
  {
    id: '8',
    title: 'UI设计从入门到精通',
    description: '掌握现代UI设计理念和工具，提升产品用户体验',
    instructor: '周老师',
    instructorAvatar: handleRandomImage(),
    price: 399,
    originalPrice: 499,
    students: 8920,
    rating: 4.8,
    lessons: 52,
    duration: '35小时',
    level: '中级',
    category: 'UI设计',
    categoryId: '7',
    coverImage: handleRandomImage(),
    tags: ['UI设计', 'Figma', '用户体验'],
    isHot: false,
    isNew: true,
    updateTime: '2024-01-22',
    chapters: [
      { title: '设计基础', lessons: 12 },
      { title: 'Figma工具', lessons: 15 },
      { title: '组件设计', lessons: 18 },
      { title: '设计规范', lessons: 7 },
    ],
  },
]

export default [
  {
    url: '/courses/getCategories',
    method: 'get',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: categoryList,
      }
    },
  },
  {
    url: '/courses/getList',
    method: 'get',
    response({ query }: any) {
      const { categoryId, level, keyword, pageNo = 1, pageSize = 12, sortBy = 'updateTime', sortOrder = 'desc' } = query

      let filteredList = [...courseList]

      // 按分类筛选
      if (categoryId) {
        filteredList = filteredList.filter((item) => item.categoryId === categoryId)
      }

      // 按难度筛选
      if (level) {
        filteredList = filteredList.filter((item) => item.level === level)
      }

      // 按关键词搜索
      if (keyword) {
        filteredList = filteredList.filter(
          (item) => item.title.includes(keyword) || item.description.includes(keyword) || item.tags.some((tag) => tag.includes(keyword))
        )
      }

      // 排序
      filteredList.sort((a, b) => {
        switch (sortBy) {
          case 'price': {
            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
          }
          case 'students': {
            return sortOrder === 'asc' ? a.students - b.students : b.students - a.students
          }
          case 'rating': {
            return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
          }
          default: {
            // 默认按更新时间排序
            return sortOrder === 'asc'
              ? new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime()
              : new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
          }
        }
      })

      // 分页
      const startIndex = (pageNo - 1) * pageSize
      const endIndex = startIndex + pageSize
      const list = filteredList.slice(startIndex, endIndex)

      return {
        code: 200,
        msg: 'success',
        data: {
          list,
          total: filteredList.length,
          pageNo: parseInt(pageNo),
          pageSize: parseInt(pageSize),
        },
      }
    },
  },
  {
    url: '/courses/getDetail',
    method: 'get',
    response({ query }: any) {
      const { id } = query
      const course = courseList.find((item) => item.id === id)

      if (!course) {
        return {
          code: 404,
          msg: '课程不存在',
          data: null,
        }
      }

      return {
        code: 200,
        msg: 'success',
        data: course,
      }
    },
  },
  {
    url: '/courses/getRecommend',
    method: 'get',
    response({ query }: any) {
      const { limit = 6 } = query
      const recommendList = courseList
        .filter((item) => item.isHot || item.isNew)
        .sort(() => Math.random() - 0.5)
        .slice(0, parseInt(limit))

      return {
        code: 200,
        msg: 'success',
        data: recommendList,
      }
    },
  },
] as MockMethod[]
