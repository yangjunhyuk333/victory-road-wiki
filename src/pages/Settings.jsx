import { useState, useEffect } from 'react';

export default function Settings() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

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
        <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)' }}>설정</h2>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.2rem' }}>다크 모드</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>화면 테마를 어둡게 변경합니다.</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '54px', height: '30px' }}>
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: isDarkMode ? 'var(--primary-color)' : 'var(--border-color)',
                        transition: '.4s', borderRadius: '34px'
                    }}>
                        <span style={{
                            position: 'absolute', content: '""', height: '22px', width: '22px',
                            left: isDarkMode ? '28px' : '4px', bottom: '4px', backgroundColor: '#fff',
                            transition: '.4s', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                    </span>
                </label>
            </div>
        </div>
    );
}
