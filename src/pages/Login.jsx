import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export default function Login({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 로그인 된 사용자의 리다이렉트 처리
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            if (isSignup) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: displayName });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') setErrorMsg('이미 가입된 이메일입니다.');
            else if (error.code === 'auth/weak-password') setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
            else if (error.code === 'auth/invalid-credential') setErrorMsg('이메일 또는 비밀번호가 잘못되었습니다.');
            else setErrorMsg('인증 과정 중 문제가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error(error);
            setErrorMsg('구글 로그인 중 문제가 발생했습니다.');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 87px)', overflow: 'hidden' }}>

            {/* 왼쪽 로그인 폼 영역 */}
            <div style={{ flex: '1 1 50%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'var(--bg-color)', position: 'relative', zIndex: 10 }}>
                <div className="auth-card" style={{ boxShadow: 'none', border: 'none', background: 'transparent' }}>
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${!isSignup ? 'active' : ''}`}
                            onClick={() => { setIsSignup(false); setErrorMsg(''); }}
                        >
                            기존 게이머 로그인
                        </button>
                        <button
                            className={`auth-tab ${isSignup ? 'active' : ''}`}
                            onClick={() => { setIsSignup(true); setErrorMsg(''); }}
                        >
                            새 감독 등록
                        </button>
                    </div>

                    <h2 className="auth-title">
                        {isSignup ? "위키에 합류하세요" : "다시 오셨군요 감독님"}
                    </h2>

                    <form onSubmit={handleAuthAction} className="auth-form">
                        {isSignup && (
                            <div className="input-group">
                                <label className="input-label">닉네임</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="사용하실 이름"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required={isSignup}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">이메일 계정</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="coach@inazuma.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">비밀번호</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {errorMsg && <p className="auth-error-msg">{errorMsg}</p>}

                        <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                            {isLoading ? '처리 중...' : (isSignup ? '위키 시작하기' : '로그인')}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>또는 빠르고 편하게</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn btn-social"
                        style={{ padding: '0.85rem' }}
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="social-icon" />
                        {isSignup ? '구글 계정으로 시작' : '구글 계정으로 로그인'}
                    </button>
                </div>
            </div>

            {/* 오른쪽 배너/배경 영역 (모바일 숨김) */}
            <div className="login-banner" style={{
                flex: '1 1 50%',
                backgroundImage: `url(${import.meta.env.BASE_URL}assets/bg_image.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 'inset 20px 0 50px rgba(0,0,0,0.5)', /* 분할 영역 경계면에 깊이감 추가 */
                display: 'block'
            }}>
                {/* CSS 파일 연동 없이 인라인으로 숨기기 위해 미디어 쿼리 대신 단순 인라인 스타일이나 index.css 지원 등 사용 불가하여 
                    아래 style 태그를 주입합니다. */}
                <style>
                    {`
                        @media (max-width: 900px) {
                            .login-banner { display: none !important; }
                        }
                    `}
                </style>
            </div>

        </div>
    );
}
