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
    const [isSignup, setIsSignup] = useState(false); // 로그인 폼 <-> 회원가입 폼 전환 상태
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState(''); // 닉네임 추가
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 이미 로그인한 사용자가 접근하면 홈으로 튕겨냅니다
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
                // 회원가입 로직
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: displayName });
                // updateProfile은 onAuthStateChanged가 즉각 인지하지 못할 수 있으므로 강제 리로드 필요시 고려가능
            } else {
                // 이메일 로그인 로직
                await signInWithEmailAndPassword(auth, email, password);
            }
            // 성공하면 useEffect의 네비게이션 트리거가 동작함
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') setErrorMsg('이미 가입된 이메일입니다.');
            else if (error.code === 'auth/weak-password') setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
            else if (error.code === 'auth/invalid-credential') setErrorMsg('이메일 또는 비밀번호가 잘못되었습니다.');
            else setErrorMsg('인증 과정 중 문제가 발생했습니다: ' + error.message);
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
            {/* 폼을 감싸는 전체 Auth 카드 (글래스모피즘 + 사이버네온 컨셉) */}
            <div className="auth-card">
                {/* 로그인/가입 토글 탭 버튼 (새로 추가될 UI 스타일 활용) */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${!isSignup ? 'active' : ''}`}
                        onClick={() => { setIsSignup(false); setErrorMsg(''); }}
                    >
                        로그인
                    </button>
                    <button
                        className={`auth-tab ${isSignup ? 'active' : ''}`}
                        onClick={() => { setIsSignup(true); setErrorMsg(''); }}
                    >
                        회원가입
                    </button>
                </div>

                <h2 className="auth-title">
                    {isSignup ? "JOIN THE SQUAD" : "WELCOME BACK"}
                </h2>

                <form onSubmit={handleAuthAction} className="auth-form">
                    {isSignup && (
                        <div className="input-group">
                            <label className="input-label">닉네임</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="나의 팀 이름 (예: 라이몬 중핵)"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required={isSignup}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">이메일</label>
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

                    <button type="submit" className="btn btn-glow" disabled={isLoading} style={{ width: '100%', marginTop: '1.5rem' }}>
                        {isLoading ? '처리 중...' : (isSignup ? '시작하기' : '로그인')}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>또는</span>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="btn btn-social"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="social-icon" />
                    {isSignup ? '구글로 빠르게 가입' : '구글로 계속하기'}
                </button>
            </div>
        </div>
    );
}
