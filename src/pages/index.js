import Routing from './index.vue'

export const routes = [
  { path: '/', redirect: 'task-board' },
  { path: '/task-board', component: () => import('./task-board'), name: 'Task board' },
  { path: '/note-board', component: () => import('./note-board'), name: 'Note board' }
];

export { Routing }
