import buildApp from './app.js'

import startupLoader from '@/utils/startupLoader'
import db from './database'
import { useStoresRunner } from '@/stores/storesRunner'

const { app, router } = buildApp()
const storesRunner = useStoresRunner()

db.onReady(async () => {
  router.isReady().then(async () => {
    await storesRunner.run()
    startupLoader.hide()
    app.mount('#app')
  })
})
