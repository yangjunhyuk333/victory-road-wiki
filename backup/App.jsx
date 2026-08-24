import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Trello } from 'lucide-react';
import Home from './pages/Home';
import Zukan from './pages/Zukan';
import Settings from './pages/Settings';
import Tactics from './pages/Tactics';  // 선수 DB 연동 축구 전술판 페이지 (로컬 저장 방식 개편)

// 상단 네비게이션 헤더 바 컴포넌트 (로그인/로그아웃/커뮤니티 메뉴 완전 제거)
function Navbar() {
  return (
    <nav className="navbar">
      {/* 좌측 로고 링크 */}
      <Link to="/" className="logo">
        <img 
          src={`${import.meta.env.BASE_URL}logo.png`} 
          alt="이나즈마 스테이션" 
          style={{ height: '80px', objectFit: 'contain' }} 
          onError={(e) => e.target.style.display = 'none'} 
        />
      </Link>
      
      {/* 우측 네비게이션 메뉴들 (도감 및 전술판 2종으로 고정) */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        {/* 캐릭터 도감 DB 링크 */}
        <Link to="/zukan" className="btn btn-secondary" style={{ border: 'none', background: 'transparent', boxShadow: 'none', fontSize: '0.95rem' }}>
          캐릭터 도감 DB
        </Link>
        
        {/* 전술판 기능 링크 */}
        <Link to="/tactics" className="btn btn-secondary" style={{ border: 'none', background: 'transparent', boxShadow: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Trello size={16} /> 나만의 전술판
        </Link>
      </div>
    </nav>
  );
}

function App() {
  // 컴포넌트 마운트 시 로컬 테마(다크모드) 세팅만 적용
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <HashRouter>
      {/* 네비게이션 헤더 */}
      <Navbar />
      
      {/* 라우팅 테이블 (로그인 보호 없이 상시 오픈하도록 정리) */}
      <Routes>
        {/* 메인 홈 페이지 */}
        <Route path="/" element={<Home />} />
        
        {/* 캐릭터 대도감 페이지 */}
        <Route path="/zukan" element={<Zukan />} />
        
        {/* 나만의 전술판 페이지 */}
        <Route path="/tactics" element={<Tactics />} />
        
        {/* 다크모드 등 테마 설정 페이지 */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
