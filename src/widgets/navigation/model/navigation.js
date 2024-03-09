import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

import { tabs as allTabs } from './config'

export const useNavigationStore = defineStore('navigation', () => {
  const router = useRouter()
  const tabs = reactive(allTabs)
  const activeTab = computed(() => {
    const currentRoutePath = router.currentRoute.value.path
    return tabs.find((tab) => tab.url === currentRoutePath)
  })

  const openTab = (tabName) => {
    const selectedTab = tabs.find((teb) => tab.name === tabname)

    if (selectedTab.isOpened) return

    const prevOpenedTab = tabs.find((tab) => tab.isOpened)

    prevOpenedTab.isOpened = false
    selectedTab.isOpened = true
  }

  return { tabs, openTab, activeTab }
})
