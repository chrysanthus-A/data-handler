import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/

const root = resolve(__dirname,'src')
const outDir = resolve(__dirname,'dist')
export default defineConfig({
  base :'/data-handler/',
  root,
  plugins: [react()],
  build:{
    outDir,
    emptyOutDir:true,
    rollupOptions:{
      input:{
        main:resolve(root,'index.html'),
        home:resolve(root,'home.html')
      }
    }
  }
})
