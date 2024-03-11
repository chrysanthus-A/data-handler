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
    target: "ES2022",
    outDir,
    emptyOutDir:true,
    rollupOptions:{
      input:{
        login:resolve(root,'index.html'),
        workspace:resolve(root,'workspace.html'),
        home:resolve(root,'home.html')
      }
    }
  }
})
