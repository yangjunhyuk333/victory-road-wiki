import { Trophy, BookOpen, Users, Star, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
    const newsList = [
        { id: 1, title: '영웅들의 빅토리로드 발매일 확정!', date: '2026-03-01', tag: 'OFFICIAL' },
        { id: 2, title: '새로운 시스템 "스크램블" 특화 분석', date: '2026-02-28', tag: 'GUIDE' },
        { id: 3, title: '배타 테스트 랭커들의 덱 구성 통계', date: '2026-02-15', tag: 'DATA' },
    ];

    const characterList = [
        { id: 1, name: '사사나미 운메이', role: '매니저', element: '무', img: 'https://placehold.co/100x100/1e293b/fff?text=UNMEI' },
        { id: 2, name: '엔도 하루', role: '스트라이커', element: '풍', img: 'https://placehold.co/100x100/fca311/000?text=HARU' },
        { id: 3, name: '고엔지 슈야', role: '레전드', element: '화', img: 'https://placehold.co/100x100/ff3366/fff?text=GOUENJI' },
    ];

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>

            {/* 프리미엄 히어로 섹션 */}
            <header style={{
                textAlign: 'center',
                marginBottom: '5rem',
                padding: '6rem 1rem',
                background: 'radial-gradient(ellipse at center, rgba(20,20,25,0.8) 0%, transparent 70%)',
                borderRadius: '30px',
                position: 'relative'
            }}>
                {/* 장식용 네온 바 */}
                <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: '150px', height: '3px', background: 'var(--primary-color)', boxShadow: '0 0 15px var(--primary-color)' }}></div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 240, 255, 0.1)', padding: '0.4rem 1rem', borderRadius: '30px', border: '1px solid rgba(0, 240, 255, 0.3)', color: 'var(--secondary-color)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '1px' }}>
                    <Zap size={14} /> NEW ERA OF SOCCER RPG
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    fontWeight: 800,
                    margin: '0 0 1.5rem 0',
                    lineHeight: 1.1,
                    letterSpacing: '-1px'
                }}>
                    영웅들의 <br />
                    <span style={{
                        background: 'linear-gradient(to right, #ff3366, #fca311)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 30px rgba(255,51,102,0.3)'
                    }}>빅토리로드</span> 위키
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-muted)',
                    maxWidth: '600px',
                    margin: '0 auto 2.5rem auto',
                    lineHeight: 1.6
                }}>
                    전설로 남을 당신만의 드림팀을 구축하세요. 최신 메타 분석, 선수 DB, 그리고 심층 공략이 준비되어 있습니다.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn btn-glow">공략 보기 <ArrowRight size={18} /></button>
                    <button className="btn btn-secondary">캐릭터 도감</button>
                </div>
            </header>

            {/* 대시보드 그리드 형태의 콘텐츠 레이아웃 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
            }}>

                {/* 최신 뉴스 구역 */}
                <section className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', margin: 0, fontSize: '1.4rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '10px' }}>
                                <BookOpen color="var(--secondary-color)" size={20} />
                            </div>
                            최신 정보
                        </h2>
                        <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>더보기</a>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {newsList.map((news) => (
                            <div key={news.id} style={{
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '12px',
                                border: '1px solid transparent',
                                transition: 'border 0.3s',
                                cursor: 'pointer'
                            }}
                                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: news.tag === 'OFFICIAL' ? 'var(--primary-color)' : 'var(--accent-color)' }}>{news.tag}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{news.date}</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.4 }}>{news.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 주목받는 선수(캐릭터) 구역 */}
                <section className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '2rem', fontSize: '1.4rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(252, 163, 17, 0.1)', borderRadius: '10px' }}>
                            <Users color="var(--accent-color)" size={20} />
                        </div>
                        주목받는 선수
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {characterList.map((char) => (
                            <div key={char.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(20,20,25,0) 100%)',
                                padding: '0.8rem',
                                borderRadius: '16px',
                                transition: 'transform 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateX(5px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}
                            >
                                <img src={char.img} alt={char.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)' }} />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>{char.name}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{char.role}</span>
                                </div>
                                <div style={{
                                    width: '32px', height: '32px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '50%',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    color: char.element === '화' ? '#ff3366' : char.element === '풍' ? '#00f0ff' : '#fff'
                                }}>
                                    {char.element}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 추천 공략 게시판 구역 */}
                <section className="card" style={{ gridColumn: '1 / -1' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.5rem', fontSize: '1.4rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255, 51, 102, 0.1)', borderRadius: '10px' }}>
                            <Trophy color="var(--primary-color)" size={20} />
                        </div>
                        에디터 추천 공략
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(255, 51, 102, 0.15), rgba(0,0,0,0.4))',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,51,102,0.2)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><Star size={100} /></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ background: 'var(--primary-color)', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 800 }}>HOT</span>
                            </div>
                            <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.2rem', position: 'relative', zIndex: 1 }}>무과금 V랭크 달성! 완벽한 팀 편성 가이드</h3>
                            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>속성 시너지와 패시브 스킬을 활용하여 최소 투자로 최대 효율을 뽑는 방법을 분석합니다.</p>
                            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>읽기 <ArrowRight size={14} /></a>
                        </div>

                        <div style={{
                            background: 'linear-gradient(145deg, rgba(0, 240, 255, 0.1), rgba(0,0,0,0.4))',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(0,240,255,0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ background: 'var(--secondary-color)', color: '#000', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 800 }}>SYSTEM</span>
                            </div>
                            <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.2rem' }}>스크램블 배틀 심층 분석</h3>
                            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>신규 배틀 시스템에서 승리하기 위한 타이밍 기법과 볼 키핑 팁.</p>
                            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary-color)' }}>읽기 <ArrowRight size={14} /></a>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
