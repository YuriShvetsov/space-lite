import { defineStore } from 'pinia'

import state from './state'
import getters from './getters'
import actions from './actions'

export const useUserSettingsStore = () => {
  const defineInnerStore = defineStore('userSettings', {
    state: () => state,
    getters,
    actions  
  })
  const store = defineInnerStore()

  if (store.isInitialized) return store
  
  store.init()
  
  return store
}
