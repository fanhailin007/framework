import Layout from '/@vab/layouts/index.vue'

export const vabRoutes = [
  {
    path: '/vab',
    name: 'Vab',
    component: Layout,
    meta: {
      title: '组件',
      icon: 'code-box-line',
      guard: ['Admin'],
      hidden: true,
    },
    children: [
      {
        path: 'icon',
        name: 'Icon',
        meta: {
          title: '图标',
          icon: 'remixicon-line',
        },
        children: [
          {
            path: 'defaultIcon',
            name: 'DefaultIcon',
            component: () => import('/@/views/vab/icon/defaultIcon.vue'),
            meta: {
              title: '默认图标',
            },
          },
          {
            path: 'iconSelector',
            name: 'IconSelector',
            component: () => import('/@/views/vab/icon/iconSelector.vue'),
            meta: {
              title: '图标选择器',
            },
          },
          {
            path: 'customSvg',
            name: 'CustomSvg',
            component: () => import('/@/views/vab/icon/customSvg.vue'),
            meta: {
              title: '自定义图标',
              icon: 'vite',
              isCustomSvg: true,
            },
          },
        ],
      },
      {
        path: 'table',
        name: 'Table',
        meta: {
          title: '表格',
          // 非editor角色的用户可见
          guard: {
            role: ['Editor'],
            mode: 'except',
          },
          icon: 'table-2',
        },
        children: [
          {
            path: 'defaultTable',
            name: 'DefaultTable',
            component: () => import('/@/views/vab/table/defaultTable.vue'),
            meta: {
              title: '默认表格',
            },
          },
          {
            path: 'narrowTable',
            name: 'NarrowTable',
            component: () => import('/@/views/vab/table/narrowTable.vue'),
            meta: {
              title: '极窄表格',
            },
          },
          {
            path: 'columnTable',
            name: 'ColumnTable',
            component: () => import('/@/views/vab/table/columnTable.vue'),
            meta: {
              title: '左树右表',
            },
          },
          {
            path: 'tabsTable',
            name: 'TabsTable',
            component: () => import('/@/views/vab/table/tabsTable.vue'),
            meta: {
              title: '分类表格',
              dot: 'primary',
            },
          },
          {
            path: 'inlineEditTable',
            name: 'InlineEditTable',
            component: () => import('/@/views/vab/table/inlineEditTable.vue'),
            meta: {
              title: '行内编辑表格',
            },
          },
          {
            path: 'customTable',
            name: 'CustomTable',
            component: () => import('/@/views/vab/table/customTable.vue'),
            meta: {
              title: '自定义表格',
              badge: 'Hot',
            },
          },
          {
            path: 'dragTable',
            name: 'DragTable',
            component: () => import('/@/views/vab/table/dragTable.vue'),
            meta: {
              title: '拖拽表格',
            },
          },
          {
            path: 'splitTable',
            name: 'SplitTable',
            component: () => import('/@/views/vab/table/splitTable.vue'),
            meta: {
              title: '分割表格',
            },
          },
          {
            path: 'bigDataTable',
            name: 'BigDataTable',
            component: () => import('/@/views/vab/table/bigDataTable.vue'),
            meta: {
              title: '大数据表格',
            },
          },
          {
            path: 'defaultTableDetail',
            name: 'DefaultTableDetail',
            component: () => import('/@/views/vab/table/defaultTableDetail.vue'),
            meta: {
              hidden: true,
              title: '详情页',
              activeMenu: '/vab/table/defaultTable',
              dynamicNewTab: true, //详情页根据id传参不同可打开多个
            },
          },
          {
            path: 'pullTable',
            name: 'PullTable',
            component: () => import('/@/views/vab/table/pullTable.vue'),
            meta: {
              title: '下拉表格',
              badge: 'Hot',
            },
          },
        ],
      },
      {
        path: 'list',
        name: 'List',
        component: () => import('/@/views/vab/list/index.vue'),
        meta: {
          title: '列表',
          guard: ['Admin'],
          icon: 'list-check-2',
        },
      },
      {
        path: 'editor',
        name: 'Editor',
        component: Layout,
        meta: {
          title: '编辑器',
          icon: 'edit-box-line',
          guard: ['Admin'],
        },
        children: [
          {
            path: 'wangEditor',
            name: 'WangEditor',
            component: () => import('/@/views/vab/editor/wangEditor.vue'),
            meta: {
              title: '富文本',
              guard: ['Admin'],
            },
          },
          {
            path: 'mdEditor',
            name: 'MdEditor',
            component: () => import('/@/views/vab/editor/mdEditor.vue'),
            meta: {
              title: 'Markdown',
              guard: ['Admin'],
            },
          },
        ],
      },
      {
        path: 'form',
        name: 'Form',
        meta: {
          title: '表单',
          guard: ['Admin'],
          icon: 'file-list-2-line',
        },
        children: [
          {
            path: 'comprehensiveForm',
            name: 'ComprehensiveForm',
            component: () => import('/@/views/vab/form/comprehensiveForm.vue'),
            meta: {
              title: '综合表单',
            },
          },
          {
            path: 'stepForm',
            name: 'StepForm',
            component: () => import('/@/views/vab/form/stepForm.vue'),
            meta: {
              title: '分步表单',
            },
          },
          {
            path: 'button',
            name: 'Button',
            component: () => import('/@/views/vab/form/button.vue'),
            meta: {
              title: '按钮',
            },
          },
          {
            path: 'link',
            name: 'Link',
            component: () => import('/@/views/vab/form/link.vue'),
            meta: {
              title: '文字链接',
            },
          },
          {
            path: 'radio',
            name: 'Radio',
            component: () => import('/@/views/vab/form/radio.vue'),
            meta: {
              title: '单选框',
            },
          },
          {
            path: 'checkbox',
            name: 'Checkbox',
            component: () => import('/@/views/vab/form/checkbox.vue'),
            meta: {
              title: '多选框',
            },
          },
          {
            path: 'input',
            name: 'Input',
            component: () => import('/@/views/vab/form/input.vue'),
            meta: {
              title: '输入框',
            },
          },
          {
            path: 'inputNumber',
            name: 'InputNumber',
            component: () => import('/@/views/vab/form/inputNumber.vue'),
            meta: {
              title: '计数器',
            },
          },
          {
            path: 'select',
            name: 'Select',
            component: () => import('/@/views/vab/form/select.vue'),
            meta: {
              title: '选择器',
              dot: true,
            },
          },
          {
            path: 'city',
            name: 'City',
            component: () => import('/@/views/vab/form/city.vue'),
            meta: {
              title: '城市选择器',
              badge: 'Hot',
            },
          },
          {
            path: 'switch',
            name: 'Switch',
            component: () => import('/@/views/vab/form/switch.vue'),
            meta: {
              title: '开关',
            },
          },
          {
            path: 'slider',
            name: 'Slider',
            component: () => import('/@/views/vab/form/slider.vue'),
            meta: {
              title: '滑块',
            },
          },
          {
            path: 'timePicker',
            name: 'TimePicker',
            component: () => import('/@/views/vab/form/timePicker.vue'),
            meta: {
              title: '时间选择器',
            },
          },
          {
            path: 'datePicker',
            name: 'DatePicker',
            component: () => import('/@/views/vab/form/datePicker.vue'),
            meta: {
              title: '日期选择器',
            },
          },
          {
            path: 'dateTimePicker',
            name: 'DateTimePicker',
            component: () => import('/@/views/vab/form/dateTimePicker.vue'),
            meta: {
              title: '日期时间选择器',
            },
          },
          {
            path: 'rate',
            name: 'Rate',
            component: () => import('/@/views/vab/form/rate.vue'),
            meta: {
              title: '评分',
            },
          },
          {
            path: 'transfer',
            name: 'Transfer',
            component: () => import('/@/views/vab/form/transfer.vue'),
            meta: {
              title: '穿梭框',
              dot: true,
            },
          },
        ],
      },
      {
        path: 'description',
        name: 'Description',
        component: () => import('/@/views/vab/description/index.vue'),
        meta: {
          title: '描述',
          guard: ['Admin'],
          icon: 'slideshow-line',
        },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('/@/views/vab/tree/index.vue'),
        meta: {
          title: '树',
          guard: ['Admin'],
          icon: 'node-tree',
        },
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('/@/views/vab/upload/index.vue'),
        meta: {
          title: '上传',
          icon: 'upload-cloud-2-line',
          guard: ['Admin'],
          dot: true,
        },
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('/@/views/vab/notice/index.vue'),
        meta: {
          title: '通知',
          guard: ['Admin'],
          icon: 'message-2-line',
        },
      },
      {
        path: 'progress',
        name: 'Progress',
        component: () => import('/@/views/vab/progress/index.vue'),
        meta: {
          title: '进度条',
          guard: ['Admin'],
          icon: 'footprint-line',
        },
      },
      {
        path: 'timeline',
        name: 'Timeline',
        component: () => import('/@/views/vab/timeline/index.vue'),
        meta: {
          title: '时间线',
          guard: ['Admin'],
          icon: 'time-line',
        },
      },
      {
        path: 'statistic',
        name: 'Statistic',
        component: () => import('/@/views/vab/statistic/index.vue'),
        meta: {
          title: '统计',
          guard: ['Admin'],
          icon: 'bar-chart-2-line',
        },
      },
      {
        path: 'segmented',
        name: 'Segmented',
        component: () => import('/@/views/vab/segmented/index.vue'),
        meta: {
          title: '分段控制器',
          guard: ['Admin'],
          icon: 'carousel-view',
          dot: true,
        },
      },
      {
        path: 'image',
        name: 'Image',
        component: () => import('/@/views/vab/image/index.vue'),
        meta: {
          title: '图片',
          guard: ['Admin'],
          icon: 'image-2-line',
        },
      },
      {
        path: 'infiniteScroll',
        name: 'InfiniteScroll',
        component: () => import('/@/views/vab/infiniteScroll/index.vue'),
        meta: {
          title: '无限滚动',
          guard: ['Admin'],
          icon: 'align-vertically',
        },
      },
      {
        path: 'drawer',
        name: 'Drawer',
        component: () => import('/@/views/vab/drawer/index.vue'),
        meta: {
          title: '抽屉',
          guard: ['Admin'],
          icon: 'archive-drawer-line',
        },
      },
      {
        path: 'carousel',
        name: 'Carousel',
        component: () => import('/@/views/vab/carousel/index.vue'),
        meta: {
          title: '走马灯',
          guard: ['Admin'],
          icon: 'switch-fill',
        },
      },
      {
        path: 'transition',
        name: 'Transition',
        component: () => import('/@/views/vab/transition/index.vue'),
        meta: {
          title: '过渡动画',
          icon: 'hand-heart-line',
        },
      },
      {
        path: 'divider',
        name: 'Divider',
        component: () => import('/@/views/vab/divider/index.vue'),
        meta: {
          title: '分割线',
          icon: 'equal-line',
        },
      },
    ],
  },
]
