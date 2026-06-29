import Layout from '/@vab/layouts/index.vue'

export const goodsRoutes = [
  {
    path: '/goods',
    name: 'Goods',
    component: Layout,
    meta: {
      title: '商品',
      icon: 'shopping-bag-3-line',
      guard: ['Admin'],
      hidden: true,
    },
    children: [
      {
        path: 'goodsManagement',
        name: 'GoodsManagement',
        component: () => import('/@/views/goods/GoodsManagement.vue'),
        meta: {
          title: '商品管理',
          icon: 'shopping-basket-line',
        },
      },
      {
        path: 'goodsStatistics',
        name: 'GoodsStatistics',
        component: () => import('/@/views/goods/GoodsStatistics.vue'),
        meta: {
          title: '商品统计',
          icon: 'line-chart-line',
          dot: true,
        },
      },
      {
        path: 'goodsList',
        name: 'GoodsList',
        component: () => import('/@/views/goods/GoodsList.vue'),
        meta: {
          title: '商品列表',
          icon: 'list-check-3',
        },
      },
      {
        path: 'goodsComment',
        name: 'GoodsComment',
        component: () => import('/@/views/goods/GoodsComment.vue'),
        meta: {
          title: '商品评论',
          icon: 'chat-smile-2-line',
        },
      },
      {
        path: 'workOrder',
        name: 'WorkOrder',
        component: () => import('/@/views/goods/WorkOrder.vue'),
        meta: {
          title: '工单管理',
          icon: 'list-ordered-2',
        },
      },
      {
        path: 'trade',
        name: 'Trade',
        component: () => import('/@/views/goods/Trade.vue'),
        meta: {
          title: '交易订单',
          icon: 'archive-2-line',
        },
      },
      {
        path: 'orderNotice',
        name: 'OrderNotice',
        component: () => import('/@/views/goods/OrderNotice.vue'),
        meta: {
          title: '订单提醒',
          icon: 'bell-line',
          badge: 'New',
        },
      },
      {
        path: 'cashier',
        name: 'Cashier',
        component: () => import('/@/views/goods/Cashier.vue'),
        meta: {
          title: '收银台',
          icon: 'copper-diamond-line',
        },
      },
      {
        path: 'productCenter',
        name: 'ProductCenter',
        component: () => import('/@/views/goods/ProductCenter.vue'),
        meta: {
          title: '产品中心',
          icon: 'presentation-line',
        },
      },
      {
        path: 'posterDesign',
        name: 'PosterDesign',
        component: () => import('/@/views/goods/PosterDesign.vue'),
        meta: {
          title: '海报设计',
          icon: 'image-2-line',
          badge: '全屏',
          fullscreen: true,
        },
      },
      {
        path: 'explorer',
        name: 'Explorer',
        component: () => import('/@/views/goods/Explorer.vue'),
        meta: {
          title: '资源管理器',
          icon: 'file-cloud-line',
          badge: 'New',
        },
      },
      {
        path: 'goodsBrand',
        name: 'GoodsBrand',
        component: () => import('/@/views/goods/GoodsBrand.vue'),
        meta: { title: '品牌管理', icon: 'trademark-line' },
      },
      {
        path: 'goodsStock',
        name: 'GoodsStock',
        component: () => import('/@/views/goods/GoodsStock.vue'),
        meta: { title: '库存管理', icon: 'archive-line' },
      },
      {
        path: 'goodsCoupon',
        name: 'GoodsCoupon',
        component: () => import('/@/views/goods/GoodsCoupon.vue'),
        meta: { title: '优惠券管理', icon: 'ticket-line' },
      },
      {
        path: 'goodsDiscount',
        name: 'GoodsDiscount',
        component: () => import('/@/views/goods/GoodsDiscount.vue'),
        meta: { title: '限时折扣', icon: 'timer-flash-line' },
      },
      {
        path: 'goodsImportExport',
        name: 'GoodsImportExport',
        component: () => import('/@/views/goods/GoodsImportExport.vue'),
        meta: { title: '商品导入导出', icon: 'download-2-line' },
      },
      {
        path: 'goodsSku',
        name: 'GoodsSku',
        component: () => import('/@/views/goods/GoodsSku.vue'),
        meta: { title: 'SKU 配置', icon: 'settings-3-line' },
      },
    ],
  },
]
