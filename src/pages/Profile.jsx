export default function Profile({ user }) {
    if (!user) return <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-main)' }}>로그인이 필요합니다.</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)' }}>프로필 정보</h2>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--border-color)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', border: '4px solid var(--border-color)',
                    overflow: 'hidden'
                }}>
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '3rem', color: 'var(--text-muted)' }}>{user.email?.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'var(--text-main)' }}>{user.displayName || '이름 없음'}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{user.email}</p>
                </div>

                <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />

                <div style={{ width: '100%', padding: '0 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>계정 생성일</span>
                        <span style={{ color: 'var(--text-main)' }}>{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '알 수 없음'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>최근 로그인</span>
                        <span style={{ color: 'var(--text-main)' }}>{user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : '알 수 없음'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
