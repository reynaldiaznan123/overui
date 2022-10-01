import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import ssr from 'vite-plugin-ssr/plugin'

function include (...files: string[]) {
  return resolve(dirname(fileURLToPath(import.meta.url)), ...files)
}

const mypackage = readFileSync('./package.json', 'utf-8')

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __XCOREUI_VERSION__: JSON.stringify(mypackage['version'])
  },

  root: include('preview'),

  resolve: {
    alias: [
      { find: /^@xcore\/vue$/, replacement: resolve('./src/index.ts') },
    ]
  },

  plugins: [vue(), ssr()]
})
