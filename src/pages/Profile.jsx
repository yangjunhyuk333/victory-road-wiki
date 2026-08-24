export default function Profile({ user }) {
    // 세션 인증 예외 처리
    if (!user) {
        return (
            <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-main)' }}>
                <h3>로그인이 필요한 서비스입니다.</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>먼저 로그인 페이지로 이동하여 감독 등록을 해 주세요.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '0 1.5rem' }}>
            {/* 페이지 헤더 */}
            <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 800, 
                marginBottom: '2rem', 
                color: 'var(--text-main)',
                letterSpacing: '-1px'
            }}>
                프로필 정보
            </h2>

            {/* 메인 프로필 패널 (Glassmorphism + 섀도우) */}
            <div className="glass-card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1.8rem',
                padding: '2.5rem 2rem'
            }}>
                {/* 프로필 이미지 (그라디언트 링 테두리) */}
                <div style={{
                    width: '130px', 
                    height: '130px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    padding: '4px', // 그라디언트 링 두께
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'var(--bg-surface-pure)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden'
                    }}>
                        {user.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt="Profile Avatar" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <span style={{ 
                                fontSize: '3.2rem', 
                                fontWeight: 800, 
                                color: 'var(--primary-color)',
                                textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                {user.email?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                {/* 감독 인포메이션 텍스트 */}
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ 
                        margin: '0 0 0.4rem 0', 
                        fontSize: '1.6rem', 
                        fontWeight: 800, 
                        color: 'var(--text-main)' 
                    }}>
                        {user.displayName || '이름 없음'}
                    </h3>
                    <p style={{ 
                        margin: 0, 
                        color: 'var(--text-muted)', 
                        fontSize: '0.95rem',
                        fontWeight: 600
                    }}>
                        {user.email}
                    </p>
                </div>

                {/* 카드 구분 구분선 */}
                <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                {/* 계정 디테일 리스트 */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* 계정 생성일 */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'rgba(100, 116, 139, 0.04)',
                        padding: '1rem 1.25rem',
                        borderRadius: '14px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>계정 등록일</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.95rem' }}>
                            {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : '알 수 없음'}
                        </span>
                    </div>

                    {/* 최근 로그인 시점 */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'rgba(100, 116, 139, 0.04)',
                        padding: '1rem 1.25rem',
                        borderRadius: '14px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>최근 로그인</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.95rem' }}>
                            {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : '알 수 없음'}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
