import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

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
    }),
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: 'dist/types'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist/es',
    lib: {
      // Could also be a dictionary or array of multiple entry points,指定入口文件
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VElement',
      // the proper extensions will be added
      fileName: 'v-element',
      formats: ['es']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', '@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome', 'async-validator', '@popperjs/core', 'axios'],
      output: {
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
