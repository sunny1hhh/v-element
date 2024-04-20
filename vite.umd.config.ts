import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros.vite({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist/umd',
    lib: {
      // Could also be a dictionary or array of multiple entry points,指定入口文件
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VElement',
      // the proper extensions will be added
      fileName: 'v-element',
      formats: ['umd']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        exports: 'named',
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (chunkInfo) => {
            if(chunkInfo.name === 'style.css') {
                return 'index.css'
            }
            return chunkInfo.name as string
        }
      },
    },
  }
})
