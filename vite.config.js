import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages 部署在子路径 /yiyang-frontend/ 下，生产构建需要 base。
// 本地开发使用 '/'，CI 通过 BASE_PATH 环境变量注入。
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
