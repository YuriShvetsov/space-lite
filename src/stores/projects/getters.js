import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { get, last } from 'lodash'

import { useUserStore } from '@/stores/user'

export default {

  taskOrders() {
    return this.sortedTasksByOrder.map(item => item.order)
  },

  // User settings

  userId() {
    const userStore = useUserStore()
    return get(userStore.user, '_id', null)
  },

  // Projects

  showHiddenProjects() {
    const userStore = useUserStore()
    const isVisible = get(userStore.user, 'settings.data.showHiddenProjects', false)

    // close an open project if it has become hidden
    if (!isVisible && this.openedProject?.hidden) {
      this.closeProject(this.openedProject._id)
    }

    return isVisible
  },
  sortedProjectsByOrder(state) {
    return [...state.projects].sort((a, b) => a.order - b.order)
  },
  availableProjects() {
    if (this.showHiddenProjects) return this.sortedProjectsByOrder
    return this.sortedProjectsByOrder.filter(item => !item.hidden)
  },
  openedProject(state) {
    return state.projects.find(project => project.opened) || null
  },
  lastProjectOrder() {
    if (!this.sortedProjectsByOrder.length) return 0
    return get(last(this.sortedProjectsByOrder), 'order', 0)
  },

  // Tasks

  showHiddenTasks() {
    const userStore = useUserStore()
    return get(userStore.user, 'settings.data.showHiddenTasks', false)
  },
  sortedTasksByOrder(state) {
    return [...state.tasks].sort((a, b) => a.order - b.order)
  },
  availableTasks() {
    if (this.showHiddenTasks) return this.sortedTasksByOrder
    return this.sortedTasksByOrder.filter(item => !item.hidden)
  },
  lastTaskOrder() {
    if (!this.sortedTasksByOrder.length) return 0
    return get(last(this.sortedTasksByOrder), 'order', 0)
  }
}
