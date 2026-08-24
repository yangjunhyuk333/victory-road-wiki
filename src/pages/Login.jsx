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

    // 로그인 확인 및 직전 페이지 리다이렉트 유도 처리
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    // 계정 생성 또는 이메일 로그인 요청 핸들러
    const handleAuthAction = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            if (isSignup) {
                // 신규 유저 생성
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // 닉네임 정보 업데이트
                await updateProfile(userCredential.user, { displayName: displayName });
            } else {
                // 기존 유저 이메일 로그인
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            console.error(error);
            // 한국어로 친화적인 에러메시지 반환
            if (error.code === 'auth/email-already-in-use') setErrorMsg('이미 가입된 이메일입니다.');
            else if (error.code === 'auth/weak-password') setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
            else if (error.code === 'auth/invalid-credential') setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
            else setErrorMsg('인증 처리 중 알 수 없는 문제가 생겼습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 구글 소셜 팝업 로그인 핸들러
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error(error);
            setErrorMsg('구글 인증 팝업 진행 중 에러가 발생했습니다.');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 87px)' }}>
            
            {/* 좌측: 로그인 양식 카드 배치 영역 (은은한 백드롭 그라디언트 적용) */}
            <div style={{
                flex: 1.1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem 1.5rem',
                backgroundColor: 'var(--bg-color)',
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 40%)',
                position: 'relative'
            }}>
                <div className="auth-card">
                    {/* 상단 탭 전환 바 */}
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

                    {/* 타이틀 텍스트 */}
                    <h2 className="auth-title">
                        {isSignup ? "위키에 합류하세요" : "다시 오셨군요 감독님"}
                    </h2>

                    {/* 로그인/가입 입력 폼 */}
                    <form onSubmit={handleAuthAction}>
                        {isSignup && (
                            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                    닉네임
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="사용할 이름"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required={isSignup}
                                />
                            </div>
                        )}

                        <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="input-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                이메일 계정
                            </label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="coach@inazuma.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="input-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                비밀번호
                            </label>
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

                        {/* 메인 처리 버튼 */}
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isLoading} 
                            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
                        >
                            {isLoading ? '인증 처리 중...' : (isSignup ? '위키 시작하기' : '로그인')}
                        </button>
                    </form>

                    {/* 소셜 구분선 */}
                    <div className="auth-divider">
                        <span>또는 빠르고 편하게</span>
                    </div>

                    {/* 구글 소셜 로그인 버튼 */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn btn-social"
                        style={{ padding: '0.85rem', borderRadius: '12px' }}
                    >
                        <img 
                            src="https://www.svgrepo.com/show/475656/google-color.svg" 
                            alt="Google" 
                            style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} 
                        />
                        {isSignup ? '구글 계정으로 가입' : '구글 로그인'}
                    </button>
                </div>
            </div>

            {/* 우측: 배경 일러스트 영역 (화면을 넓게 쓰고 비주얼을 높임) */}
            <div className="login-image-column" style={{
                flex: 1.3,
                backgroundImage: `url(${import.meta.env.BASE_URL}assets/bg_image.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
            }}>
                {/* 배경 이미지의 시각적 명도를 다듬는 그라디언트 딤(Dim) 레이어 */}
                <div style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'linear-gradient(to right, var(--bg-color), rgba(0,0,0,0.15))', 
                    pointerEvents: 'none' 
                }}></div>
            </div>
        </div>
    );
}
