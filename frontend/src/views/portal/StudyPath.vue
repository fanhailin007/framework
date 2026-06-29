<template>
  <el-scrollbar wrap-class="scroll-wrap-study-path">
    <div class="study-path-main">
      <portal-header active-menu="study-path" />
      <div class="study-path-content">
        <div class="banner">
          <main>
            <div class="banner-title">学习路线</div>
            <div class="banner-description">系统化的学习路径，从入门到精通，助您快速掌握前端开发技能</div>
            <div class="image-bg hidden-xs-only"></div>
            <el-image class="hidden-xs-only" :src="logo" />
          </main>
        </div>

        <main>
          <div class="path-categories">
            <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
              <el-tab-pane label="前端开发" name="frontend">
                <div class="path-list">
                  <div v-for="path in frontendPaths" :key="path.id" class="path-card">
                    <div class="path-header">
                      <div class="path-title">{{ path.title }}</div>
                      <div class="path-stats">
                        <span>{{ path.steps }}步骤</span>
                        <span>{{ path.courses }}门课程</span>
                        <span>{{ path.students }}人学习</span>
                      </div>
                    </div>
                    <div class="path-description">{{ path.description }}</div>
                    <div class="path-progress">
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: path.progress + '%' }"></div>
                      </div>
                      <span class="progress-text">{{ path.progress }}%</span>
                    </div>
                    <div class="path-actions">
                      <el-button type="primary" @click="startLearning(path)">开始学习</el-button>
                      <el-button @click="viewPathDetail(path)">查看详情</el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="后端开发" name="backend">
                <div class="path-list">
                  <div v-for="path in backendPaths" :key="path.id" class="path-card">
                    <div class="path-header">
                      <div class="path-title">{{ path.title }}</div>
                      <div class="path-stats">
                        <span>{{ path.steps }}步骤</span>
                        <span>{{ path.courses }}门课程</span>
                        <span>{{ path.students }}人学习</span>
                      </div>
                    </div>
                    <div class="path-description">{{ path.description }}</div>
                    <div class="path-progress">
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: path.progress + '%' }"></div>
                      </div>
                      <span class="progress-text">{{ path.progress }}%</span>
                    </div>
                    <div class="path-actions">
                      <el-button type="primary" @click="startLearning(path)">开始学习</el-button>
                      <el-button @click="viewPathDetail(path)">查看详情</el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="移动开发" name="mobile">
                <div class="path-list">
                  <div v-for="path in mobilePaths" :key="path.id" class="path-card">
                    <div class="path-header">
                      <div class="path-title">{{ path.title }}</div>
                      <div class="path-stats">
                        <span>{{ path.steps }}步骤</span>
                        <span>{{ path.courses }}门课程</span>
                        <span>{{ path.students }}人学习</span>
                      </div>
                    </div>
                    <div class="path-description">{{ path.description }}</div>
                    <div class="path-progress">
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: path.progress + '%' }"></div>
                      </div>
                      <span class="progress-text">{{ path.progress }}%</span>
                    </div>
                    <div class="path-actions">
                      <el-button type="primary" @click="startLearning(path)">开始学习</el-button>
                      <el-button @click="viewPathDetail(path)">查看详情</el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </main>
      </div>
      <portal-divider active-menu="study-path" style="margin-top: 12px" />
      <vab-footer />
    </div>

    <el-dialog v-model="showPathDetail" :close-on-press-escape="true" title="学习路线详情" width="900px">
      <div v-if="selectedPath" class="path-detail-dialog">
        <div class="detail-header">
          <h3>{{ selectedPath.title }}</h3>
          <p>{{ selectedPath.description }}</p>
        </div>

        <div class="path-steps">
          <h4>学习步骤</h4>
          <el-steps :active="selectedPath.currentStep" direction="vertical">
            <el-step v-for="(step, index) in selectedPath.stepList" :key="index" :description="step.description" :title="step.title">
              <template #icon>
                <el-icon v-if="step.completed">
                  <check />
                </el-icon>
                <el-icon v-else>
                  <clock />
                </el-icon>
              </template>
            </el-step>
          </el-steps>
        </div>

        <div class="path-courses">
          <h4>相关课程</h4>
          <el-row :gutter="20">
            <el-col v-for="course in selectedPath.courseList" :key="course.id" :span="8">
              <div class="course-card">
                <el-image class="course-cover" :src="course.cover" />
                <div class="course-info">
                  <div class="course-title">{{ course.title }}</div>
                  <div class="course-desc">{{ course.description }}</div>
                  <div class="course-meta">
                    <span>{{ course.duration }}</span>
                    <span>{{ course.level }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <el-backtop target="#app .scroll-wrap-study-path" />
    <vab-theme-setting />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { Check, Clock } from '@element-plus/icons-vue'
import logo from '/@/assets/avatar.svg'

defineOptions({
  name: 'StudyPath',
})

// 当前选中的分类
const activeCategory = ref('frontend')

// 对话框控制
const showPathDetail = ref(false)
const selectedPath = ref<any>(null)

// 前端开发路线
const frontendPaths = reactive([
  {
    id: 1,
    title: 'Vue.js 全栈开发工程师',
    description: '从Vue.js基础入门到企业级项目实战，掌握前端开发核心技能',
    steps: 6,
    courses: 12,
    students: 20281,
    progress: 0,
    currentStep: 0,
    stepList: [
      {
        title: 'Vue.js 基础入门',
        description: '掌握Vue.js核心概念和基础语法',
        completed: false,
      },
      {
        title: '组件化开发',
        description: '学习Vue组件化开发思想',
        completed: false,
      },
      {
        title: '路由与状态管理',
        description: '掌握Vue Router和Vuex',
        completed: false,
      },
      {
        title: '项目实战',
        description: '企业级项目开发实践',
        completed: false,
      },
      {
        title: '性能优化',
        description: 'Vue.js性能优化技巧',
        completed: false,
      },
      { title: '部署上线', description: '项目部署和运维', completed: false },
    ],
    courseList: [
      {
        id: 1,
        title: 'Vue.js 基础教程',
        description: '零基础入门Vue.js',
        duration: '10小时',
        level: '初级',
        cover: logo,
      },
      {
        id: 2,
        title: 'Vue.js 组件开发',
        description: '组件化开发实战',
        duration: '15小时',
        level: '中级',
        cover: logo,
      },
      {
        id: 3,
        title: 'Vue.js 项目实战',
        description: '企业级项目开发',
        duration: '20小时',
        level: '高级',
        cover: logo,
      },
    ],
  },
  {
    id: 2,
    title: 'React.js 系统入门',
    description: '从零起步玩转React.js开发，从基础夯实到企业级项目实战',
    steps: 6,
    courses: 15,
    students: 4860,
    progress: 0,
    currentStep: 0,
    stepList: [
      {
        title: 'React 基础',
        description: '掌握React核心概念',
        completed: false,
      },
      { title: 'JSX语法', description: '学习JSX语法规则', completed: false },
      { title: '组件开发', description: 'React组件开发实践', completed: false },
      { title: 'Hooks使用', description: '掌握React Hooks', completed: false },
      {
        title: '状态管理',
        description: 'Redux和Context API',
        completed: false,
      },
      { title: '项目实战', description: 'React项目开发', completed: false },
    ],
    courseList: [
      {
        id: 4,
        title: 'React 基础入门',
        description: 'React核心概念',
        duration: '12小时',
        level: '初级',
        cover: logo,
      },
      {
        id: 5,
        title: 'React Hooks',
        description: 'Hooks深度解析',
        duration: '8小时',
        level: '中级',
        cover: logo,
      },
      {
        id: 6,
        title: 'React 项目实战',
        description: '企业级应用开发',
        duration: '25小时',
        level: '高级',
        cover: logo,
      },
    ],
  },
])

// 后端开发路线
const backendPaths = reactive([
  {
    id: 3,
    title: 'Java工程师 2024版',
    description: '从Java基础到Spring Boot企业级开发，全面掌握Java开发技能',
    steps: 7,
    courses: 18,
    students: 2054,
    progress: 0,
    currentStep: 0,
    stepList: [
      { title: 'Java基础', description: 'Java语言基础语法', completed: false },
      { title: '面向对象', description: '面向对象编程思想', completed: false },
      { title: '集合框架', description: 'Java集合框架使用', completed: false },
      { title: 'Spring框架', description: 'Spring核心概念', completed: false },
      {
        title: 'Spring Boot',
        description: 'Spring Boot开发',
        completed: false,
      },
      { title: '数据库操作', description: 'MyBatis和JPA', completed: false },
      { title: '项目实战', description: '企业级项目开发', completed: false },
    ],
    courseList: [
      {
        id: 7,
        title: 'Java基础教程',
        description: 'Java语言入门',
        duration: '20小时',
        level: '初级',
        cover: logo,
      },
      {
        id: 8,
        title: 'Spring Boot实战',
        description: 'Spring Boot开发',
        duration: '30小时',
        level: '中级',
        cover: logo,
      },
      {
        id: 9,
        title: 'Java项目实战',
        description: '企业级应用开发',
        duration: '40小时',
        level: '高级',
        cover: logo,
      },
    ],
  },
])

// 移动开发路线
const mobilePaths = reactive([
  {
    id: 4,
    title: 'Flutter跨平台开发',
    description: '从Flutter基础入门到混合开发，再到Flutter高级进阶',
    steps: 4,
    courses: 8,
    students: 54,
    progress: 0,
    currentStep: 0,
    stepList: [
      {
        title: 'Flutter基础',
        description: 'Flutter开发环境搭建',
        completed: false,
      },
      { title: 'UI开发', description: 'Flutter UI组件使用', completed: false },
      {
        title: '状态管理',
        description: 'Flutter状态管理方案',
        completed: false,
      },
      { title: '项目实战', description: 'Flutter应用开发', completed: false },
    ],
    courseList: [
      {
        id: 10,
        title: 'Flutter入门',
        description: 'Flutter基础教程',
        duration: '15小时',
        level: '初级',
        cover: logo,
      },
      {
        id: 11,
        title: 'Flutter UI开发',
        description: 'UI组件深度解析',
        duration: '20小时',
        level: '中级',
        cover: logo,
      },
      {
        id: 12,
        title: 'Flutter项目实战',
        description: '跨平台应用开发',
        duration: '35小时',
        level: '高级',
        cover: logo,
      },
    ],
  },
])

// 方法
const handleCategoryChange = (tab: any) => {
  activeCategory.value = tab.props.name
}

const startLearning = (path: any) => {
  $baseMessage(`开始学习：${path.title}`, 'success', 'hey')
}

const viewPathDetail = (path: any) => {
  selectedPath.value = path
  showPathDetail.value = true
}
</script>

<style lang="scss" scoped>
.study-path-main {
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

  .study-path-content {
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

  // 学习路线分类
  .path-categories {
    margin-top: 40px;

    .path-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .path-card {
      padding: 20px;
      background: var(--el-bg-color);
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }

      .path-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 10px;

        .path-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .path-stats {
          display: flex;
          gap: 10px;
          font-size: 12px;
          color: var(--el-text-color-regular);

          span {
            padding: 2px 6px;
            background: var(--el-fill-color-light);
            border-radius: 4px;
          }
        }
      }

      .path-description {
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 1.5;
        color: var(--el-text-color-regular);
      }

      .path-progress {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 15px;

        .progress-bar {
          flex: 1;
          height: 6px;
          overflow: hidden;
          background: var(--el-fill-color-light);
          border-radius: 3px;

          .progress-fill {
            height: 100%;
            background: var(--el-color-primary);
            transition: width 0.3s ease;
          }
        }

        .progress-text {
          font-size: 12px;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}

// 详情对话框样式
.path-detail-dialog {
  .detail-header {
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--el-border-color);

    h3 {
      margin: 0 0 10px 0;
      font-size: 24px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0;
      line-height: 1.6;
      color: var(--el-text-color-regular);
    }
  }

  .path-steps {
    margin-bottom: 30px;

    h4 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }
  }

  .path-courses {
    h4 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    .course-card {
      overflow: hidden;
      background: var(--el-fill-color-light);
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .course-cover {
        width: 100%;
        height: 120px;
        object-fit: cover;
      }

      .course-info {
        padding: 15px;

        .course-title {
          margin-bottom: 5px;
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .course-desc {
          margin-bottom: 10px;
          font-size: 12px;
          line-height: 1.4;
          color: var(--el-text-color-regular);
        }

        .course-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--el-text-color-regular);

          span {
            padding: 2px 6px;
            background: var(--el-fill-color);
            border-radius: 4px;
          }
        }
      }
    }
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
}
</style>
