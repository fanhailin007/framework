import request from '/@/utils/request'

// 定义API响应类型
interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 课程分类类型
interface Category {
  id: string
  name: string
  icon: string
  count: number
}

// 课程类型
interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  price: number
  originalPrice: number
  students: number
  rating: number
  lessons: number
  duration: string
  level: string
  category: string
  categoryId: string
  coverImage: string
  tags: string[]
  isHot: boolean
  isNew: boolean
  updateTime: string
  chapters: Array<{ title: string; lessons: number }>
}

// 课程列表响应类型
interface CourseListResponse {
  list: Course[]
  total: number
  pageNo: number
  pageSize: number
}

// 获取课程分类
export const getCourseCategories = (): Promise<ApiResponse<Category[]>> => {
  return request({
    url: '/courses/getCategories',
    method: 'get',
  })
}

// 获取课程列表
export const getCourseList = (params: {
  categoryId?: string
  level?: string
  keyword?: string
  pageNo?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}): Promise<ApiResponse<CourseListResponse>> => {
  return request({
    url: '/courses/getList',
    method: 'get',
    params,
  })
}

// 获取课程详情
export const getCourseDetail = (id: string): Promise<ApiResponse<Course>> => {
  return request({
    url: '/courses/getDetail',
    method: 'get',
    params: { id },
  })
}

// 获取推荐课程
export const getRecommendCourses = (limit?: number): Promise<ApiResponse<Course[]>> => {
  return request({
    url: '/courses/getRecommend',
    method: 'get',
    params: { limit },
  })
}
