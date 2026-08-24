import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Electron 로컬 파일 로드(file://) 및 GitHub Pages 웹 배포 모두 지원하기 위해 상대 경로 사용
  base: './'
})
