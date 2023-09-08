import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const isDev = import.meta.env.DEV
const history = createWebHistory()
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/404',
    name: 'PageNotExist',
    component: NotFound
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]

if (isDev) {
  routes.push(
    {
      path: '/design-system',
      name: 'Design System',
      component: () => import('@/views/DesignSystem.vue')
    },
    {
      path: '/icons-overview',
      name: 'Icons Overview',
      component: () => import('@/views/IconsOverview.vue')
    }
  )
}

const router = createRouter({
  history,
  routes
})

export default router
