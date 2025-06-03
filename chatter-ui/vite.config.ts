import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



export default () => {

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: "https://prod.eba-xbaeycjv.ap-southeast-2.elasticbeanstalk.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        },
      },
    },
  })
}