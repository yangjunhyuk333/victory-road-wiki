import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css' // 전역 스타일 불러오기 (초보자 참고: CSS 파일은 여기서 한 번만 임포트하면 프로젝트 전체에 적용됩니다)

// id가 'root'인 HTML 요소를 찾아서 리액트 앱을 화면에 그립니다
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
