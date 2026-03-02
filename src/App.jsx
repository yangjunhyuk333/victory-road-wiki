// React Router를 사용해 여러 페이지를 이동할 수 있게 합니다
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

// 상단 네비게이션 바 컴포넌트
function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">VICTORY ROAD WIKI</Link>
      <div className="nav-links">
        <Link to="/login" className="btn btn-secondary">로그인</Link>
      </div>
    </nav>
  );
}

// 메인 앱 컴포넌트 (초보자 참고: 라우터 구조가 정의되어 경로에 따라 다른 UI를 보여줍니다)
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* '/' 경로로 가면 Home 화면을 렌더링합니다 */}
        <Route path="/" element={<Home />} />
        {/* '/login' 경로로 가면 Login 화면을 렌더링합니다 */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
