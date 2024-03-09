import Routing from './index.vue'

export const routes = [
  { path: '/', redirect: '/tasks', component: () => import('./dashboard'), name: 'Dashboard', meta: { title: 'Space Lite - Dashboard' } },
  { path: '/tasks', component: () => import('./task-board'), name: 'Task board', meta: { title: 'Space Lite - Task Board' } },
  { path: '/notes', component: () => import('./note-board'), name: 'Note board', meta: { title: 'Space Lite - Note Board' } },
  { path: '/settings', component: () => import('./settings'), name: 'Settings', meta: { title: 'Space Lite - Settings' } }
];

if (import.meta.env.DEV) {
  routes.push(...[
    { path: '/dev', component: () => import('./dev'), name: 'Development', meta: { title: 'Space Lite - Development' } },
    { path: '/dev/ui', component: () => import('./dev/ui'), name: 'UI', meta: { title: 'Space Lite - UI' } }
  ])
}

export { Routing }
