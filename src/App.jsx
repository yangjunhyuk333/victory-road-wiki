import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trello, Sun, Moon, Download, Smartphone } from 'lucide-react';
import Home from './pages/Home';
import Zukan from './pages/Zukan';
import Settings from './pages/Settings';
import Tactics from './pages/Tactics';  // 선수 DB 연동 축구 전술판 페이지
import PlayerDetail from './pages/PlayerDetail'; // 신규 등록: 선수 상세 페이지 컴포넌트
import AppDownloadModal from './components/AppDownloadModal';
import MobileBottomNav from './components/MobileBottomNav';
import { detectDeviceOS } from './utils/deviceDetector';

// 상단 네비게이션 헤더 바 컴포넌트 (에디터 전용 컴팩트 툴바 스타일)
function Navbar({ theme, toggleTheme, onOpenDownloadModal }) {
  const [deviceInfo, setDeviceInfo] = useState(() => detectDeviceOS());

  useEffect(() => {
    setDeviceInfo(detectDeviceOS());
  }, []);

  return (
    <nav className="navbar" style={{ padding: '0.5rem 1.5rem', height: '88px' }}>
      {/* 
        좌측 네비게이션 그룹: 브랜드 로고 및 핵심 탭 메뉴들
      */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* 로고 영역 */}
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="이나즈마 스테이션" 
            style={{ height: '68px', objectFit: 'contain' }}
            onError={(e) => e.target.style.display = 'none'} 
          />
        </Link>

        {/* 좌측 탭 메뉴 버튼 그룹 (도감 DB, 나만의 전술판 링크) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* 캐릭터 도감 링크 */}
          <Link 
            to="/zukan" 
            className="btn btn-secondary nav-desktop-link" 
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
          
          {/* 전술판 기능 링크 */}
          <Link 
            to="/tactics" 
            className="btn btn-secondary nav-desktop-link" 
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
      
      {/* 우측 영역: 앱 다운로드 버튼 & 반응형 테마 스위치 */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        
        {/* 📲 OS 자동 인식 앱 다운로드 버튼 */}
        <button
          onClick={onOpenDownloadModal}
          className="btn btn-primary app-download-nav-btn"
          style={{
            fontSize: '0.82rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--primary-color), #059669)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}
          title={`${deviceInfo.displayName} 전용 앱 다운로드 및 설치 안내`}
        >
          <Download size={14} />
          <span>앱 다운로드</span>
          {deviceInfo.isMobile && (
            <span style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.25)', padding: '1px 6px', borderRadius: '10px' }}>
              {deviceInfo.os === 'android' ? '갤럭시' : '아이폰'}
            </span>
          )}
          {deviceInfo.isTablet && (
            <span style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.25)', padding: '1px 6px', borderRadius: '10px' }}>
              아이패드/태블릿
            </span>
          )}
        </button>

        {/* 테마 스위치 */}
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

  // 앱 다운로드 모달 열림 상태 관리
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

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
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)} 
      />
      
      {/* 본문 라우팅 테이블 */}
      <div className="app-main-content">
        <Routes>
          {/* 메인 홈 페이지 */}
          <Route path="/" element={<Home onOpenDownloadModal={() => setIsDownloadModalOpen(true)} />} />
          
          {/* 캐릭터 대도감 페이지 */}
          <Route path="/zukan" element={<Zukan />} />
          
          {/* 나만의 전술판 페이지 */}
          <Route path="/tactics" element={<Tactics />} />
          
          {/* 다크모드 등 테마 설정 페이지 */}
          <Route path="/settings" element={<Settings />} />

          {/* 신규 등록: 선수 고유 ID별 프로필 상세 보기 페이지 */}
          <Route path="/player/:id" element={<PlayerDetail />} />
        </Routes>
      </div>

      {/* 📱 모바일 전용 하단 바텀 네비게이션 바 (768px 미만에서만 노출) */}
      <MobileBottomNav onOpenDownloadModal={() => setIsDownloadModalOpen(true)} />

      {/* 📲 OS 자동 인식 앱 다운로드 모달 */}
      <AppDownloadModal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
      />
    </HashRouter>
  );
}

export default App;
