import { defineConfig, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'



export default ({ mode }: ConfigEnv) => {
  const typedMode = mode as 'development' | 'production'

  const backendUrls = {
    development: 'http://localhost:3000',
    production: 'https://prod.eba-xbaeycjv.ap-southeast-2.elasticbeanstalk.com',
  }
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backendUrls[typedMode] || backendUrls.development,  // now you get the env var correctly
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  })
}