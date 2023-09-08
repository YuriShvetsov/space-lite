import { defineConfig } from 'vite'
// import path from 'path'
import { fileURLToPath, URL } from 'url'
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // createSvgIconsPlugin({
    //   iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/hero')],
    //   symbolId: '[dir]-[name]',
    //   inject: 'body-first'
    // }),
    vue()
  ],
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    global: {}
  }
})
