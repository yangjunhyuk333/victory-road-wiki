// 아이콘 사용을 위해 lucide-react에서 아이콘을 가져옵니다
import { Trophy, BookOpen, Users, Star } from 'lucide-react';

export default function Home() {
    // 더미 데이터 배열 (초보자 참고: 화면에 보여줄 가짜 데이터 리스트입니다)
    const newsList = [
        { id: 1, title: '영웅들의 빅토리로드 발매일 확정!', date: '2026-03-01' },
        { id: 2, title: '새로운 시스템 "스크램블" 상세 정보 공개', date: '2026-02-28' },
        { id: 3, title: '배타 테스트 피드백 및 업데이트 내역', date: '2026-02-15' },
    ];

    const characterList = [
        { id: 1, name: '사사나미 운메이', role: '매니저', element: '무속성' },
        { id: 2, name: '엔도 하루', role: '스트라이커', element: '바람' },
        { id: 3, name: '고엔지 슈야', role: '레전드 스트라이커', element: '불' },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            {/* 히어로 섹션: 사이트의 첫 느낌을 주는 메인 배너 역할을 합니다 */}
            <header style={{ textAlign: 'center', marginBottom: '4rem', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', marginBottom: '1rem', textTransform: 'uppercase', textShadow: '0 0 20px rgba(252,163,17,0.5)' }}>
                    이나즈마일레븐 영웅들의 빅토리로드
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                    최고의 공략, 캐릭터 정보, 그리고 유저 커뮤니티가 함께하는 위키입니다.
                </p>
            </header>

            {/* 게임 패키지 같은 역동적인 레이아웃 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* 최신 뉴스 구역 */}
                <section className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <BookOpen color="var(--primary-color)" /> 최신 뉴스
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {newsList.map((news) => (
                            <div key={news.id} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{news.title}</h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{news.date}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 인기 캐릭터 구역 */}
                <section className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Users color="var(--primary-color)" /> 인기 캐릭터 정보
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {characterList.map((char) => (
                            <div key={char.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.1rem' }}>{char.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{char.role}</span>
                                </div>
                                <div style={{ background: 'var(--glass-bg)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid var(--glass-border)' }}>
                                    {char.element}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 추천 공략 게시판 구역 */}
                <section className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Trophy color="var(--primary-color)" /> 추천 공략
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: 'rgba(252, 163, 17, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Star size={16} color="var(--primary-color)" />
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-color)' }}>팀 편성의 기초 가이드</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>속성 밸런스와 포메이션 구성 팁을 알아봅시다.</p>
                        </div>
                        <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>V랭크 달성 공략</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>가장 효율적인 슛 체인 연결 방법</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
