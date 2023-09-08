import { defineStore, storeToRefs } from 'pinia'
import { watch } from 'vue'
import { get } from 'lodash'

import db from '@/database'

import { useUserStore } from './user'
import { useProjectsStore } from './projects'

export const useStoresRunner = defineStore('storesRunner', {
  state: () => ({
    userStore: null,
    projectsStore: null
  }),
  actions: {
    async run() {
      this.userStore = useUserStore()
      this.projectsStore = useProjectsStore()

      this.userStore.reactSystemAppearance()

      const user = await db.users.findOne()

      await this.userStore.init(user)
      await this.projectsStore.init()
    }
  }
})
