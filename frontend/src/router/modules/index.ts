import { homeRoutes } from './home'
import { settingRoutes } from './setting'

export const asyncRoutes = [
  ...homeRoutes,
  // ...portalRoutes,
  // ...goodsRoutes,
  // ...operateRoutes,
  // ...vabRoutes,
  // ...templateRoutes,
  // ...otherRoutes,
  // ...chatRoutes,
  ...settingRoutes,
  // ...noColumnRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      title: '404',
      hidden: true,
    },
  },
]
