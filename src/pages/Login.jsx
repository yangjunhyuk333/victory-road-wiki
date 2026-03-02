// 리액트의 상태 관리 훅(useState)을 가져옵니다.
import { useState } from 'react';
// 파이어베이스 인증 함수들을 가져옵니다.
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export default function Login() {
    // 이메일과 비밀번호 입력값을 저장할 상태 (초보자 참고: 값이 변할 때마다 화면을 즉시 업데이트합니다)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // 이메일/비밀번호 로그인 버튼 클릭 시 실행할 함수
    const handleEmailLogin = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 현상을 막습니다
        setErrorMsg('');
        try {
            // 파이어베이스 이메일 로그인 함수 호출
            await signInWithEmailAndPassword(auth, email, password);
            alert('로그인 성공!');
        } catch (error) {
            // 에러 발생 시 사용자에게 보여줄 메시지를 설정합니다
            setErrorMsg('로그인 실패: 이메일이나 비밀번호를 확인해주세요.');
            console.error(error);
        }
    };

    // 구글 소셜 로그인 버튼 클릭 시 실행할 함수
    const handleGoogleLogin = async () => {
        try {
            // 팝업창을 통한 구글 로그인 실행
            await signInWithPopup(auth, googleProvider);
            alert('구글 로그인 성공!');
        } catch (error) {
            setErrorMsg('구글 로그인 중 문제가 발생했습니다.');
            console.error(error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-color)' }}>WIKI LOGIN</h2>

                {/* 일반 폼 로그인 */}
                <form onSubmit={handleEmailLogin}>
                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>이메일</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>비밀번호</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* 에러 메시지 출력 공간 */}
                    {errorMsg && <p style={{ color: '#ff4d4f', fontSize: '0.9rem', textAlign: 'center', margin: '0.5rem 0' }}>{errorMsg}</p>}

                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', marginBottom: '1rem' }}>
                        로그인
                    </button>
                </form>

                <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    — 또는 —
                </div>

                {/* 구글 소셜 로그인 버튼 */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="btn btn-secondary"
                    style={{ width: '100%', background: '#ffffff', color: '#000000', border: 'none' }}
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                    구글 계정으로 로그인
                </button>
            </div>
        </div>
    );
}
