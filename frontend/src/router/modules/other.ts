import Layout from '/@vab/layouts/index.vue'

export const otherRoutes = [
  {
    path: '/other',
    name: 'Other',
    component: Layout,
    meta: {
      title: '其他',
      icon: 'archive-line',
      guard: ['Admin'],
      hidden: true,
    },
    children: [
      {
        path: 'echarts',
        name: 'ECharts',
        component: () => import('/@/views/other/echarts/index.vue'),
        meta: {
          title: '图表',
          guard: ['Admin'],
          icon: 'bubble-chart-line',
          noKeepAlive: true,
        },
      },
      {
        path: 'gantt',
        name: 'Gantt',
        component: () => import('/@/views/other/gantt/index.vue'),
        meta: {
          title: '甘特图',
          guard: ['Admin'],
          icon: 'organization-chart',
        },
      },
      {
        path: 'excel',
        name: 'Excel',
        component: () => import('/@/views/other/excel/index.vue'),
        meta: {
          title: 'Excel',
          guard: ['Admin'],
          icon: 'file-excel-2-line',
        },
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('/@/views/other/video/index.vue'),
        meta: {
          title: '视频播放器',
          guard: ['Admin'],
          icon: 'video-line',
          dot: 'warning',
        },
      },
      {
        path: 'workflow',
        name: 'Workflow',
        component: () => import('/@/views/other/workflow/index.vue'),
        meta: {
          title: '工作流',
          guard: ['Admin'],
          icon: 'flow-chart',
        },
      },
      {
        path: 'sliderVerify',
        name: 'SliderVerify',
        component: () => import('/@/views/other/sliderVerify/index.vue'),
        meta: {
          title: '滑块验证码',
          guard: ['Admin'],
          icon: 'shield-check-line',
        },
      },
      {
        path: 'pdf',
        name: 'PDF',
        component: () => import('/@/views/other/pdf/index.vue'),
        meta: {
          title: 'Pdf',
          guard: ['Admin'],
          icon: 'file-pdf-line',
        },
      },
      {
        path: 'print',
        name: 'Print',
        component: () => import('/@/views/other/print/index.vue'),
        meta: {
          title: '打印',
          guard: ['Admin'],
          icon: 'printer-line',
        },
      },
      {
        path: 'crop',
        name: 'Crop',
        component: () => import('/@/views/other/crop/index.vue'),
        meta: {
          title: '裁剪',
          guard: ['Admin'],
          icon: 'crop-line',
          badge: 'New',
        },
      },
      {
        path: 'award',
        name: 'Award',
        component: () => import('/@/views/other/award/index.vue'),
        meta: {
          title: '抽奖',
          icon: 'award-line',
          dot: 'danger',
        },
      },
      {
        path: 'count',
        name: 'Count',
        component: () => import('/@/views/other/count/index.vue'),
        meta: {
          title: '数字自增长',
          guard: ['Admin'],
          icon: 'number-0',
        },
      },
      {
        path: 'magnifier',
        name: 'Magnifier',
        component: () => import('/@/views/other/magnifier/index.vue'),
        meta: {
          title: '放大镜',
          guard: ['Admin'],
          icon: 'search-2-line',
        },
      },
      {
        path: 'signature',
        name: 'Signature',
        component: () => import('/@/views/other/signature/index.vue'),
        meta: {
          title: '签名',
          icon: 'edit-2-line',
          guard: ['Admin'],
        },
      },
      {
        path: 'watermark',
        name: 'Watermark',
        component: () => import('/@/views/other/watermark/index.vue'),
        meta: {
          title: '水印',
          guard: ['Admin'],
          icon: 'water-flash-line',
          badge: 'New',
          badgeType: 'warning',
        },
      },
      {
        path: 'share',
        name: 'Share',
        component: () => import('/@/views/other/share/index.vue'),
        meta: {
          title: '分享',
          guard: ['Admin'],
          icon: 'share-line',
          dot: true,
        },
      },
      {
        path: 'paneSplit',
        name: 'PaneSplit',
        component: () => import('/@/views/other/paneSplit/index.vue'),
        meta: {
          title: '面板分割',
          guard: ['Admin'],
          icon: 'split-cells-horizontal',
        },
      },
      {
        path: 'drag',
        name: 'Drag',
        component: () => import('/@/views/other/drag/index.vue'),
        meta: {
          title: '拖拽',
          icon: 'drag-drop-line',
        },
      },
      {
        path: 'scrollText',
        name: 'ScrollText',
        component: () => import('/@/views/other/scrollText/index.vue'),
        meta: {
          title: '文字滚动',
          icon: 'exchange-line',
        },
      },
      {
        path: 'milestone',
        name: 'Milestone',
        component: () => import('/@/views/other/milestone/index.vue'),
        meta: {
          title: '里程碑',
          icon: 'presentation-line',
        },
      },
      {
        path: 'noLayout',
        name: 'NoLayout',
        component: () => import('/@/views/other/noLayout/index.vue'),
        meta: {
          title: '全屏',
          guard: ['Admin'],
          icon: 'aspect-ratio-line',
          dot: true,
          fullscreen: true,
        },
      },
      {
        path: 'fixedWidth',
        name: 'FixedWidth',
        component: () => import('/@/views/other/fixedWidth/index.vue'),
        meta: {
          title: '定宽',
          guard: ['Admin'],
          icon: 'picture-in-picture-fill',
          dot: true,
        },
      },
      {
        path: '//github.com/zxwk1998/vue-admin-better',
        name: 'ExternalLink',
        meta: {
          title: '外链',
          target: '_blank',
          guard: ['Admin', 'Editor'],
          icon: 'external-link-line',
        },
      },
      {
        path: 'iframe',
        name: 'Iframe',
        meta: {
          title: '内嵌网页',
          guard: ['Admin'],
          icon: 'window-line',
        },
        children: [
          {
            path: 'iframeView',
            name: 'IframeView',
            component: () => import('/@/views/other/iframe/view.vue'),
            meta: {
              title: 'Iframe',
              icon: 'window-line',
              dynamicNewTab: true,
              hidden: true,
            },
          },
          {
            path: 'iframeView?url=nodejs.org/en&title=Node',
            name: 'Node',
            meta: {
              title: 'Node',
            },
          },
        ],
      },
    ],
  },
]
