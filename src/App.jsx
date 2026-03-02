import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import Home from './pages/Home';
import Login from './pages/Login';
import Zukan from './pages/Zukan';

// 인증된 사용자만 접근을 허용하는 보호 라우트 컴포넌트
function PrivateRoute({ children, user, loading }) {
  const location = useLocation();

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>로딩 중...</div>;
  if (!user) {
    // 로그인되지 않은 경우 로그인 페이지로 보내며 현재 경로를 기억합니다
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Navbar({ user }) {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="이나즈마 스테이션" style={{ height: '54px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
      </Link>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/zukan" className="btn btn-secondary" style={{ border: 'none', background: 'transparent', boxShadow: 'none', fontSize: '1rem' }}>
          캐릭터 도감 DB
        </Link>
        {user ? (
          <button onClick={handleLogout} className="btn btn-secondary">로그아웃</button>
        ) : (
          <Link to="/login" className="btn btn-secondary">로그인</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 Firebase 인증 상태 수신
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <HashRouter>
      {/* 네비게이션 바에 사용자 정보를 전달하여 버튼 동적 변경 */}
      <Navbar user={user} />
      <Routes>
        {/* / 라우트는 로그인 필수 */}
        <Route
          path="/"
          element={
            <PrivateRoute user={user} loading={loading}>
              <Home />
            </PrivateRoute>
          }
        />
        {/* 대규모 캐릭터 도감 라우트 */}
        <Route
          path="/zukan"
          element={
            <PrivateRoute user={user} loading={loading}>
              <Zukan />
            </PrivateRoute>
          }
        />
        {/* 로그인 페이지 라우트 */}
        <Route path="/login" element={<Login user={user} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
