import { Trophy, BookOpen, Users, Star, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const newsList = [
        { id: 1, title: '영웅들의 빅토리로드 발매일 확정!', date: '2026-03-01', tag: 'OFFICIAL' },
        { id: 2, title: '새로운 시스템 "스크램블" 특화 분석', date: '2026-02-28', tag: 'GUIDE' },
        { id: 3, title: '배타 테스트 랭커들의 덱 구성 통계', date: '2026-02-15', tag: 'DATA' },
    ];

    const characterList = [
        { id: 1, name: '사사나미 운메이', role: '매니저', element: '무', img: 'https://placehold.co/100x100/CBD5E1/0F172A?text=UNMEI' },
        { id: 2, name: '엔도 하루', role: '스트라이커', element: '풍', img: 'https://placehold.co/100x100/FBBF24/0F172A?text=HARU' },
        { id: 3, name: '고엔지 슈야', role: '레전드', element: '화', img: 'https://placehold.co/100x100/EF4444/FFFFFF?text=GOUENJI' },
    ];

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2vw 1rem' }}>

            {/* 프리미엄 라이트 테마 히어로 섹션 */}
            <header className="header-hero">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#DBEAFE', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.2rem', letterSpacing: '0.5px' }}>
                    <Zap size={14} fill="currentColor" /> NEW ERA OF SOCCER RPG
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <img
                        src="/logo.png"
                        alt="이나즈마 스테이션 로고"
                        style={{ maxWidth: '80%', maxHeight: '120px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <h1 style={{ display: 'none', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, margin: '0 0 1rem 0', lineHeight: 1.15, letterSpacing: '-1.5px', color: 'var(--text-main)' }}>
                        당신의 꿈으로 그리는<br />
                        <span style={{ color: 'var(--primary-color)' }}>빅토리 로드</span>
                    </h1>
                </div>

                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                    color: 'var(--text-muted)',
                    maxWidth: '650px',
                    margin: '0 auto 2.5rem auto',
                    lineHeight: 1.6
                }}>
                    최고의 정보, 5,400여 명의 선수 데이터베이스, 그리고 당신의 승리를 위한 특급 공략이 이곳에 모두 준비되어 있습니다.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" style={{ minWidth: '140px' }}>공략 보기 <ArrowRight size={18} /></button>
                    <Link to="/zukan" className="btn btn-secondary" style={{ minWidth: '140px', textDecoration: 'none' }}>공식 캐릭터 도감</Link>
                </div>
            </header>

            {/* 대시보드 형태의 반응형 그리드 */}
            <div className="grid-container">

                {/* 최신 뉴스 구역 */}
                <section className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
                            <div style={{ padding: '8px', background: '#EFF6FF', borderRadius: '10px' }}>
                                <BookOpen color="var(--primary-color)" size={20} />
                            </div>
                            최신 정보
                        </h2>
                        <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>더보기</a>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {newsList.map((news) => (
                            <div key={news.id} style={{
                                padding: '1.25rem 1rem',
                                background: '#F8FAFC',
                                borderRadius: '12px',
                                border: '1px solid #F1F5F9',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = '#FFFFFF'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.background = '#F8FAFC'; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', background: news.tag === 'OFFICIAL' ? '#DBEAFE' : '#FEF3C7', color: news.tag === 'OFFICIAL' ? '#1D4ED8' : '#B45309' }}>
                                        {news.tag}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{news.date}</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.4, color: 'var(--text-main)', fontWeight: 600 }}>{news.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 주목받는 선수 구역 */}
                <section className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 800 }}>
                        <div style={{ padding: '8px', background: '#FEF3C7', borderRadius: '10px' }}>
                            <Users color="#D97706" size={20} />
                        </div>
                        주목받는 선수
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {characterList.map((char) => (
                            <div key={char.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.8rem',
                                borderRadius: '12px',
                                transition: 'background 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <img src={char.img} alt={char.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>{char.name}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{char.role}</span>
                                </div>
                                <div style={{
                                    width: '32px', height: '32px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: char.element === '화' ? '#FEE2E2' : char.element === '풍' ? '#D1FAE5' : '#F1F5F9',
                                    borderRadius: '50%',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    color: char.element === '화' ? '#EF4444' : char.element === '풍' ? '#059669' : '#64748B'
                                }}>
                                    {char.element}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 추천 공략 게시판 구역 */}
                <section className="card" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
                            <div style={{ padding: '8px', background: '#FCE7F3', borderRadius: '10px' }}>
                                <Trophy color="#DB2777" size={20} />
                            </div>
                            에디터 추천 공략
                        </h2>
                    </div>

                    <div className="grid-container">
                        <div style={{
                            background: '#FFFFFF',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{ position: 'absolute', top: '-15px', right: '-15px', opacity: 0.05 }}><Star size={80} fill="#DB2777" /></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ background: '#DB2777', color: '#fff', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>HOT</span>
                            </div>
                            <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.15rem', position: 'relative', zIndex: 1, color: 'var(--text-main)', fontWeight: 800 }}>무과금 V랭크 달성! 완벽 팀 가이드</h3>
                            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>속성 시너지와 특결 스킬을 활용하여 가장 효율적인 스쿼드를 짜는 기본기를 공유합니다.</p>
                            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)' }}>자세히 읽기 <ArrowRight size={14} /></a>
                        </div>

                        <div style={{
                            background: '#F8FAFC',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ background: '#3B82F6', color: '#fff', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>SYSTEM</span>
                            </div>
                            <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800 }}>스크램블 배틀 심층 팁</h3>
                            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>신규 배틀 조작 및 수비수 돌파 타이밍의 핵심 팁을 움짤과 함께 알아봅니다.</p>
                            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)' }}>자세히 읽기 <ArrowRight size={14} /></a>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
