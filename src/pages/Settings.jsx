import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';

export default function Settings() {
    // 테마 설정 상태 초기값 로컬스토리지 연동
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // 테마 변경에 따른 HTML 최상단 태그(data-theme) 갱신 적용
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '0 1.5rem' }}>
            {/* 설정 페이지 타이틀 */}
            <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 800, 
                marginBottom: '2rem', 
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                letterSpacing: '-1px'
            }}>
                <SettingsIcon size={24} /> 환경 설정
            </h2>

            {/* 설정 그룹 영역 (글래스모피즘 적용) */}
            <div className="glass-card" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '2rem'
            }}>
                {/* 설정 상세 명칭 */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* 설정 데코레이션 아이콘 */}
                    <div style={{
                        padding: '10px',
                        background: isDarkMode ? 'rgba(96, 165, 250, 0.15)' : 'rgba(37, 99, 235, 0.08)',
                        borderRadius: '12px',
                        color: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.35rem 0', color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 800 }}>
                            다크 모드
                        </h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                            화면의 전반적인 색상 톤을 어둡게 변경합니다.
                        </p>
                    </div>
                </div>

                {/* 커스텀 슬라이딩 토글 스위치 */}
                <label style={{ 
                    position: 'relative', 
                    display: 'inline-block', 
                    width: '60px', 
                    height: '32px',
                    cursor: 'pointer'
                }}>
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    {/* 토글 스위치 뒷면 슬라이더 */}
                    <span style={{
                        position: 'absolute', 
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: isDarkMode ? 'var(--primary-color)' : 'rgba(100, 116, 139, 0.2)',
                        transition: 'background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
                        borderRadius: '34px',
                        boxShadow: isDarkMode ? '0 0 12px var(--primary-glow)' : 'none',
                        border: '1.5px solid var(--border-color)'
                    }}>
                        {/* 토글 스위치 핸들(동그라미) */}
                        <span style={{
                            position: 'absolute', 
                            height: '22px', 
                            width: '22px',
                            left: isDarkMode ? '32px' : '4px', 
                            bottom: '3.5px', 
                            backgroundColor: '#FFFFFF',
                            transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s ease', 
                            borderRadius: '50%', 
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} 
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'none'}
                        />
                    </span>
                </label>
            </div>
        </div>
    );
}
