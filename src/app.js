import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaLogger } from 'pinia-logger'

import App from './App.vue'
import commonComponents from './components/common'
import router from './router'

import './assets/scss/main.scss'

export default function () {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(router)
  app.use(pinia)
  pinia.use(
    PiniaLogger({
      expanded: false,
      disabled: !import.meta.env.DEV
    })
  )

  Object.entries(commonComponents).forEach(([name, component]) => {
    app.component(name, component)
  })

  return {
    app,
    router
  }
}
