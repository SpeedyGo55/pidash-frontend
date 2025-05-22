import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
    server: {
      proxy: {
        '/cpu_temp': 'http://speedygo55.duckdns.org:8080',
        '/fan_speed': 'http://speedygo55.duckdns.org:8080',
        '/uptime': 'http://speedygo55.duckdns.org:8080',
        '/cpu_usage': 'http://speedygo55.duckdns.org:8080',
        '/mem_usage': 'http://speedygo55.duckdns.org:8080',
        '/disk_usage': 'http://speedygo55.duckdns.org:8080',
      },
    },
  }
  )
