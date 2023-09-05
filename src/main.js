import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaLogger } from "pinia-logger"

import { startupLoader } from '@/js/startup'
import db from './database'

import App from './components/App.vue'
import commonComponents from './components/common'

import './assets/scss/main.scss'

db.onReady(() => {
  startupLoader.hide()

  const pinia = createPinia()
  const app = createApp(App)

  pinia.use(PiniaLogger({
    expanded: false,
    disabled: !import.meta.env.DEV
  }))
  app.use(pinia)

  Object.entries(commonComponents).forEach(item => {
    const [name, component] = item
    app.component(name, component)
  })

  app.mount('#app')
})
