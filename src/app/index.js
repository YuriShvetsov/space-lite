import { createApp } from 'vue'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'

import { router, store } from './providers'
import App from './index.vue'

import '@yurishvetsov/space-ui/styles'
import 'highlight.js/styles/stackoverflow-light.css'

const initializeApp = createApp(App)
  .use(router)
  .use(store)
  .use(hljsVuePlugin)

export const app = initializeApp
