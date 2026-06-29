import Layout from '/@vab/layouts/index.vue'

export const chatRoutes = [
  {
    path: '/chat',
    name: 'Chat',
    component: Layout,
    meta: {
      title: 'GPT',
      icon: 'chat-1-line',
      guard: ['Admin'],
      hidden: true,
    },
    children: [
      {
        path: 'chatGPT',
        name: 'ChatGPT',
        component: () => import('/@/views/GPT/ChatGPT.vue'),
        meta: {
          title: 'ChatGPT',
          icon: 'openai-line',
          dot: true,
        },
      },
      {
        path: 'speechSynthesis',
        name: 'SpeechSynthesis',
        component: () => import('/@/views/GPT/SpeechSynthesis.vue'),
        meta: {
          title: '语音合成',
          icon: 'customer-service-line',
        },
      },
    ],
  },
]
