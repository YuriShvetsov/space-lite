import { createApp } from 'vue'

import './assets/scss/main.scss'

import App from './components/App.vue'
import commonComponents from './components/common'
import store from './store'
import * as ConfirmDialog from 'vuejs-confirm-dialog'

const app = createApp(App)

Object.entries(commonComponents).forEach(item => {
  const [name, component] = item
  app.component(name, component)
})

app.use(store)
app.use(ConfirmDialog)
app.mount('#app')
