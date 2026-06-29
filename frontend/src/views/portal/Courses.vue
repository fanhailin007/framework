<template>
  <el-scrollbar wrap-class="scroll-wrap-courses">
    <div class="courses-main">
      <portal-header active-menu="courses" />
      <div class="courses-content">
        <div class="banner">
          <main>
            <div class="banner-title">精品课程</div>
            <div class="banner-description">精选优质课程，涵盖前端、后端、移动开发等多个技术领域</div>
            <div class="image-bg hidden-xs-only"></div>
            <el-image class="hidden-xs-only" :src="logo" />
          </main>
        </div>

        <main>
          <div class="course-filter">
            <div class="filter-tabs">
              <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
                <el-tab-pane label="全部课程" name="all" />
                <el-tab-pane v-for="category in categories" :key="category.id" :label="category.name" :name="category.id" />
              </el-tabs>
            </div>

            <div class="filter-options">
              <el-select v-model="selectedLevel" placeholder="难度等级" @change="handleFilter">
                <el-option label="全部难度" value="" />
                <el-option label="初级" value="初级" />
                <el-option label="中级" value="中级" />
                <el-option label="高级" value="高级" />
              </el-select>

              <el-select v-model="selectedSort" placeholder="排序方式" @change="handleFilter">
                <el-option label="最新更新" value="updateTime" />
                <el-option label="价格从低到高" value="price-asc" />
                <el-option label="价格从高到低" value="price-desc" />
                <el-option label="学习人数" value="students" />
                <el-option label="评分" value="rating" />
              </el-select>

              <el-input v-model="searchKeyword" clearable placeholder="搜索课程" @input="handleSearch">
                <template #prefix>
                  <el-icon>
                    <search />
                  </el-icon>
                </template>
              </el-input>
            </div>
          </div>

          <div class="course-list">
            <el-row v-if="courseList.length > 0" :gutter="20">
              <el-col v-for="course in courseList" :key="course.id" :lg="8" :md="24" :sm="24" :xl="6" :xs="24">
                <div class="course-card" @click="viewCourseDetail(course)">
                  <div class="course-cover">
                    <el-image class="cover-image" :src="course.coverImage" />
                    <div class="course-level">
                      <el-tag size="small" :type="getLevelType(course.level)">
                        {{ course.level }}
                      </el-tag>
                    </div>
                    <div class="course-price">
                      <span v-if="course.price === 0" class="free">免费</span>
                      <span v-else class="paid">¥{{ course.price }}</span>
                    </div>
                  </div>
                  <div class="course-info">
                    <div class="course-title">{{ course.title }}</div>
                    <div class="course-desc">{{ course.description }}</div>
                    <div class="course-meta">
                      <span class="duration">{{ course.duration }}</span>
                      <span class="students">{{ course.students }}人学习</span>
                      <span class="rating">
                        <el-rate v-model="course.rating" disabled show-score text-color="#ff9900" />
                      </span>
                    </div>
                    <div class="course-bottom">
                      <div class="course-teacher">
                        <el-avatar :size="20" :src="course.instructorAvatar" />
                        <span>{{ course.instructor }}</span>
                      </div>
                      <div class="course-tags">
                        <el-tag v-for="tag in course.tags.slice(0, 2)" :key="tag" size="small" type="info">
                          {{ tag }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div v-else class="empty-state">
              <el-empty description="暂无课程数据" :image-size="200">
                <template #image>
                  <el-icon color="#c0c4cc" size="100">
                    <video-camera />
                  </el-icon>
                </template>
                <el-button type="primary" @click="resetFilters">重置筛选条件</el-button>
              </el-empty>
            </div>
          </div>

          <div class="pagination-wrapper">
            <vab-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[12, 24, 48, 96]"
              :total="totalCourses"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </main>
      </div>
      <portal-divider active-menu="courses" style="margin-top: 12px" />
      <vab-footer />
    </div>

    <vab-dialog v-model="showCourseDetail" title="课程详情" width="800px">
      <div v-if="selectedCourse" class="course-detail-dialog">
        <div class="detail-header">
          <el-image class="detail-cover" :src="selectedCourse.coverImage" />
          <div class="detail-info">
            <h3>{{ selectedCourse.title }}</h3>
            <p>{{ selectedCourse.description }}</p>
            <div class="detail-meta">
              <el-tag :type="getLevelType(selectedCourse.level)">
                {{ selectedCourse.level }}
              </el-tag>
              <span class="duration">{{ selectedCourse.duration }}</span>
              <span class="students">{{ selectedCourse.students }}人学习</span>
              <span class="rating">
                <el-rate v-model="selectedCourse.rating" disabled show-score text-color="#ff9900" />
              </span>
            </div>
            <div class="detail-price">
              <span v-if="selectedCourse.price === 0" class="free">免费</span>
              <span v-else class="paid">¥{{ selectedCourse.price }}</span>
              <span v-if="selectedCourse.originalPrice > selectedCourse.price" class="original-price">
                ¥{{ selectedCourse.originalPrice }}
              </span>
            </div>
          </div>
        </div>

        <div class="detail-content">
          <h4>课程大纲</h4>
          <el-collapse>
            <el-collapse-item v-for="(chapter, index) in selectedCourse.chapters" :key="index" :title="chapter.title">
              <div class="chapter-info">
                <span>共 {{ chapter.lessons }} 课时</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <template #footer>
        <el-button size="large" type="primary" @click="enrollCourse(selectedCourse)">
          {{ selectedCourse.price === 0 ? '立即学习' : '立即购买' }}
        </el-button>
        <el-button size="large" @click="addToCart(selectedCourse)">加入购物车</el-button>
      </template>
    </vab-dialog>

    <el-backtop target="#app .scroll-wrap-courses" />
    <vab-theme-setting />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { Search, VideoCamera } from '@element-plus/icons-vue'
import { getCourseCategories, getCourseDetail, getCourseList } from '/@/api/courses'
import logo from '/@/assets/avatar.svg'
import { gp } from '/@vab/plugins/vab'

defineOptions({
  name: 'Courses',
})

const activeCategory = ref('all')
const selectedLevel = ref('')
const selectedSort = ref('updateTime')
const searchKeyword = ref('')

const currentPage = ref(1)
const pageSize = ref(12)
const totalCourses = ref(0)

const showCourseDetail = ref(false)
const selectedCourse = ref<any>(null)

const categories = ref<any[]>([])
const courseList = ref<any[]>([])

const fetchCategories = async () => {
  try {
    const res = await getCourseCategories()

    if (res.code === 200) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('获取课程分类失败:', error)
  }
}

const fetchCourseList = async () => {
  try {
    const params: any = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      sortBy: selectedSort.value.split('-')[0],
      sortOrder: selectedSort.value.includes('-') ? selectedSort.value.split('-')[1] : 'desc',
    }

    if (activeCategory.value !== 'all') {
      params.categoryId = activeCategory.value
    }

    if (selectedLevel.value) {
      params.level = selectedLevel.value
    }

    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    const res = await getCourseList(params)
    if (res.code === 200) {
      courseList.value = res.data.list
      totalCourses.value = res.data.total
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
  }
}

const fetchCourseDetail = async (id: string) => {
  try {
    const res = await getCourseDetail(id)
    if (res.code === 200) {
      selectedCourse.value = res.data
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
  }
}

const handleCategoryChange = (tab: any) => {
  activeCategory.value = tab.props.name
  currentPage.value = 1
  fetchCourseList()
}

const handleFilter = () => {
  currentPage.value = 1
  fetchCourseList()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchCourseList()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchCourseList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchCourseList()
}

const getLevelType = (level: string) => {
  if (level === '初级') return 'success'
  if (level === '中级') return 'warning'
  if (level === '高级') return 'danger'
  return 'info'
}

const viewCourseDetail = async (course: any) => {
  await fetchCourseDetail(course.id)
  showCourseDetail.value = true
}

const enrollCourse = (course: any) => {
  gp.$baseMessage(`开始学习：${course.title}`, 'success', 'hey')
}

const addToCart = (course: any) => {
  gp.$baseMessage(`已将 ${course.title} 加入购物车`, 'success', 'hey')
}

const resetFilters = () => {
  activeCategory.value = 'all'
  selectedLevel.value = ''
  selectedSort.value = 'updateTime'
  searchKeyword.value = ''
  currentPage.value = 1
  fetchCourseList()
}

onMounted(() => {
  fetchCategories()
  fetchCourseList()
})
</script>

<style lang="scss" scoped>
.courses-main {
  display: flex;
  flex-direction: column;
  height: calc(var(--vh, 1vh) * 100);

  @media screen and (max-width: 768px) {
    .banner {
      height: 370px !important;

      &-title {
        margin-top: 100px !important;
        font-size: 26px !important;
      }
    }

    main {
      width: 100% !important;
      padding: var(--el-padding) !important;
    }
  }

  .courses-content {
    flex: 1;
  }

  main {
    position: relative;
    width: 1152px;
    min-height: calc(var(--vh, 1vh) * 100 - 550px);
    padding: 10px 0 0 0;
    margin-right: auto;
    margin-left: auto;
  }

  .banner {
    position: relative;
    width: 100%;
    height: 430px;
    background: var(--el-color-primary-light-9);

    &-title {
      margin-top: 150px;
      margin-bottom: 12px;
      font-size: 40px;
      font-weight: 600;
      line-height: 60px;
      color: #000;
    }

    &-description {
      margin-bottom: 40px;
      font-size: 16px;
      line-height: 20px;
    }

    .image-bg {
      position: absolute;
      top: 150px;
      right: 30px;
      width: 192px;
      height: 192px;
      background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
      border-radius: 50%;
      filter: blur(40px);
    }

    :deep() {
      .el-image {
        position: absolute;
        top: 155px;
        right: 35px;
        width: 170px;
      }
    }
  }

  .course-filter {
    margin-bottom: 30px;

    .filter-tabs {
      margin-bottom: 20px;
    }

    .filter-options {
      display: flex;
      gap: 15px;
      align-items: center;

      .el-select {
        width: 120px;
      }

      .el-input {
        width: 200px;
      }
    }
  }

  .course-list {
    margin-bottom: 30px;

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      padding: 40px 0;
    }

    .course-card {
      margin-bottom: 20px;
      overflow: hidden;
      cursor: pointer;
      background: var(--el-bg-color);
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .course-cover {
        position: relative;
        height: 160px;

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-level {
          position: absolute;
          top: 10px;
          left: 10px;
        }

        .course-price {
          position: absolute;
          top: 10px;
          right: 10px;

          .free {
            padding: 4px 8px;
            font-size: 12px;
            color: white;
            background: var(--el-color-success);
            border-radius: 4px;
          }

          .paid {
            padding: 4px 8px;
            font-size: 12px;
            color: white;
            background: var(--el-color-danger);
            border-radius: 4px;
          }
        }
      }

      .course-info {
        padding: 15px;

        .course-title {
          margin-bottom: 8px;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
          color: var(--el-text-color-primary);
        }

        .course-desc {
          display: -webkit-box;
          height: 40px;
          margin-bottom: 10px;
          overflow: hidden;
          -webkit-line-clamp: 2;
          font-size: 14px;
          line-height: 1.4;
          color: var(--el-text-color-regular);
          -webkit-box-orient: vertical;
        }

        .course-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 12px;
          color: var(--el-text-color-regular);

          .duration,
          .students {
            display: inline-block;
          }

          .rating {
            display: flex;
            align-items: center;
          }
        }

        .course-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;

          .course-teacher {
            display: flex;
            gap: 8px;
            align-items: center;
            font-size: 12px;
            color: var(--el-text-color-regular);
          }

          .course-tags {
            display: flex;
            gap: 4px;
            align-items: center;
          }
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 0 0 20px 0;
    margin-top: -40px;
  }
}

.course-detail-dialog {
  .detail-header {
    display: flex;
    gap: 20px;
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--el-border-color);

    .detail-cover {
      width: 200px;
      height: 120px;
      object-fit: cover;
      border-radius: 8px;
    }

    .detail-info {
      flex: 1;

      h3 {
        margin: 0 0 5px 0;
        font-size: 20px;
        color: var(--el-text-color-primary);
      }

      p {
        margin: 0;
        line-height: 25px;
        color: var(--el-text-color-regular);
      }

      .detail-meta {
        display: flex;
        gap: 15px;
        align-items: center;
        margin-bottom: 12px;

        .duration,
        .students {
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }

      .detail-price {
        margin-bottom: 15px;

        .free {
          padding: 8px 16px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          background: var(--el-color-success);
          border-radius: 4px;
        }

        .paid {
          padding: 4px 16px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          background: var(--el-color-danger);
          border-radius: 4px;
        }

        .original-price {
          margin-left: 10px;
          font-size: 14px;
          color: var(--el-text-color-regular);
          text-decoration: line-through;
        }
      }
    }
  }

  .detail-content {
    margin-bottom: 30px;

    h4 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    .chapter-info {
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
  }

  .detail-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
  }
}

:deep() {
  .vab-footer {
    margin-top: 0;
    background: var(--el-background-color);
    border: 0;
  }

  .vab-theme-setting {
    section {
      > div {
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          display: none;
        }
      }
    }
  }

  .el-dialog {
    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__header {
      padding: 20px 20px 0 20px;
    }
  }

  .el-collapse {
    .el-collapse-item__header {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .el-collapse-item__content {
      padding: 15px 0;
    }
  }
}
</style>
