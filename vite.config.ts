import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { PlusProComponentsResolver } from '@plus-pro-components/resolver'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // 可定义环境变量，在env.d.ts中进行类型声明，使用import.meta.env.
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],

      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),

        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],

      dts: fileURLToPath(new URL('./src/auto-imports.d.ts', import.meta.url)), // 生成类型文件
    }),
    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        PlusProComponentsResolver()
      ],

      dts: fileURLToPath(new URL('./src/components.d.ts', import.meta.url)), // 生成类型文件
    }),
    Icons({
      autoInstall: true,
    }),
    createHtmlPlugin({
      minify: false,
      pages: [
        {
          template: 'index.html',
          filename: 'index.html',
          injectOptions: {
            data: {
              buildTime: new Date().toLocaleString() // 记录打包时间
            }
          }
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use '@/assets/css/element/index.scss' as *;
          @use '@/assets/css/global-variables.scss';
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
