import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trello, Sun, Moon } from 'lucide-react';
import Home from './pages/Home';
import Zukan from './pages/Zukan';
import Settings from './pages/Settings';
import Tactics from './pages/Tactics';  // 선수 DB 연동 축구 전술판 페이지
import PlayerDetail from './pages/PlayerDetail'; // 신규 등록: 선수 상세 페이지 컴포넌트

// 상단 네비게이션 헤더 바 컴포넌트 (에디터 전용 컴팩트 툴바 스타일)
function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="navbar" style={{ padding: '0.5rem 2rem', height: '88px' }}>
      {/* 
        좌측 네비게이션 그룹: 브랜드 로고 및 핵심 탭 메뉴들
        "Tactics Editor" 뱃지를 지우고, 탭 메뉴들을 로고 옆으로 더 바짝 배치했습니다.
        flex 래퍼의 gap을 1rem으로 좁혀 왼쪽으로 한층 더 당겼습니다.
      */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* 로고 영역: 크기를 기존 34px 대비 2배인 68px로 크게 확대하였습니다. */}
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="이나즈마 스테이션" 
            style={{ height: '68px', objectFit: 'contain' }} // 로고 크기 2배 확대 (68px)
            onError={(e) => e.target.style.display = 'none'} 
          />
        </Link>

        {/* 
          좌측 탭 메뉴 버튼 그룹 (도감 DB, 나만의 전술판 링크)
          뱃지가 사라져서 왼쪽 로고 옆에 더욱 가깝게 밀착 정렬됩니다.
        */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* 캐릭터 도감 링크 - 30px 라운드 캡슐형 배경과 소프트 그림자 및 테두리를 주어 동글동글한 느낌을 살렸습니다. */}
          <Link 
            to="/zukan" 
            className="btn btn-secondary" 
            style={{ 
              fontSize: '0.9rem', 
              padding: '0.5rem 1.2rem', 
              borderRadius: '30px', 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--soft-shadow)' 
            }}
          >
            캐릭터 도감
          </Link>
          
          {/* 전술판 기능 링크 - 캐릭터 도감 버튼과 크기를 맞추어 둥글기 30px 및 입체적인 섀도우를 연출했습니다. */}
          <Link 
            to="/tactics" 
            className="btn btn-secondary" 
            style={{ 
              fontSize: '0.9rem', 
              padding: '0.5rem 1.2rem', 
              borderRadius: '30px', 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--soft-shadow)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem' 
            }}
          >
            <Trello size={15} /> 나만의 전술판
          </Link>
        </div>
      </div>
      
      {/* 우측 영역: 라이브러리 상태 반응형 테마 스위치만 깔끔하게 단독 배치 */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary" 
          style={{ 
            padding: '0.45rem', 
            borderRadius: '50%', 
            width: '34px', 
            height: '34px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
          title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <Sun size={15} color="var(--accent-color)" /> : <Moon size={15} color="var(--primary-color)" />}
        </button>
      </div>
    </nav>
  );
}

function App() {
  // 기본값을 다크 테마로 세팅하여 분위기 고도화
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // 테마 변경 시 HTML DOM Attribute 및 localStorage 즉시 동기화
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 테마 반전 토글 스위치 헬퍼
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <HashRouter>
      {/* 네비게이션 헤더 */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      {/* 라우팅 테이블 */}
      <Routes>
        {/* 메인 홈 페이지 */}
        <Route path="/" element={<Home />} />
        
        {/* 캐릭터 대도감 페이지 */}
        <Route path="/zukan" element={<Zukan />} />
        
        {/* 나만의 전술판 페이지 */}
        <Route path="/tactics" element={<Tactics />} />
        
        {/* 다크모드 등 테마 설정 페이지 */}
        <Route path="/settings" element={<Settings />} />

        {/* 신규 등록: 선수 고유 ID별 프로필 상세 보기 페이지 */}
        <Route path="/player/:id" element={<PlayerDetail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
