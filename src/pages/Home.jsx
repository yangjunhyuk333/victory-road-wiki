import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, BookOpen, Users, Star, ArrowRight, Zap, Folder, Plus, Trash2, Shield, Search, Download, Smartphone } from 'lucide-react';
// 캐릭터 데이터베이스 JSON 파일을 직접 로드하여 퀵 검색 및 랜덤 스카우트와 연동합니다.
import charactersData from '../data/characters.json';
import { getPlayerDisplayName, teamTranslation } from '../utils/playerHelpers'; // 중복 캐릭터 버전 표시 및 팀명 한글화 헬퍼 임포트

export default function Home() {
    const navigate = useNavigate();
    const [savedTactics, setSavedTactics] = useState([]);
    
    // 개편 사항 1: 실시간 퀵 검색어 입력 상태
    const [quickSearchQuery, setQuickSearchQuery] = useState('');
    
    // 개편 사항 2: 오늘의 랜덤 스카우트 결과 상태 (실제 DB 기반)
    const [scoutedPlayer, setScoutedPlayer] = useState(null);

    // 개편 사항 3: 검색 팝업(모달) 오픈 상태 및 검색 결과 저장 상태
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // 로컬 스토리지에서 최근 전술 목록 읽어오기
    useEffect(() => {
        try {
            const localData = localStorage.getItem('victory_road_tactics');
            if (localData) {
                const list = JSON.parse(localData);
                // 최신 생성순 정렬 후 최대 4개만 가져옴
                list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setSavedTactics(list.slice(0, 4));
            }
        } catch (e) {
            console.error("로컬 전술 데이터를 읽어오는 중 에러가 발생했습니다.", e);
        }
    }, []);

    // 홈 화면에서 최근 전술 삭제 기능 (사용성 향상)
    const handleDeleteTactics = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.confirm("이 전술 배치를 로컬 저장소에서 삭제하시겠습니까?")) {
            try {
                const localData = localStorage.getItem('victory_road_tactics');
                if (localData) {
                    const list = JSON.parse(localData);
                    const filtered = list.filter(item => item.id !== id);
                    localStorage.setItem('victory_road_tactics', JSON.stringify(filtered));
                    setSavedTactics(filtered.slice(0, 4));
                }
            } catch (err) {
                console.error("전술 삭제 에러:", err);
            }
        }
    };

    // 속성에 따른 뱃지 스타일 헬퍼 함수
    const getElementClass = (elem) => {
        switch (elem) {
            case '화': return 'element-badge element-fire';
            case '풍': return 'element-badge element-wind';
            case '림': return 'element-badge element-wood';
            case '산': return 'element-badge element-mountain';
            default: return 'element-badge element-none';
        }
    };

    // 날짜 포맷 함수
    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 퀵 검색 제출 핸들러 (바로 도감으로 이동하지 않고 메인 화면에 검색결과 팝업 모달을 노출합니다)
    const handleQuickSearchSubmit = (e) => {
        e.preventDefault();
        if (!quickSearchQuery.trim()) return;

        const query = quickSearchQuery.trim().toLowerCase();
        // charactersData 전체에서 이름, 카나, 별칭을 비교해 필터링합니다.
        const results = charactersData.filter(char => 
            char.name.toLowerCase().includes(query) ||
            (char.kana && char.kana.toLowerCase().includes(query)) ||
            (char.nickname && char.nickname.toLowerCase().includes(query))
        );

        // 검색 성능 및 팝업 레이아웃을 위해 최대 15명까지만 잘라서 노출합니다.
        setSearchResults(results.slice(0, 15));
        setIsSearchModalOpen(true);
    };

    // 오늘의 랜덤 스카우트 실행 핸들러 (실제 charactersData 중 이미지가 있는 대상을 임의 추출)
    const handleRandomScout = () => {
        // 이미지가 존재하여 비주얼이 완벽히 표출되는 선수들만 추출합니다.
        const validPool = charactersData.filter(char => char.image);
        const pool = validPool.length > 0 ? validPool : charactersData;
        const randomIndex = Math.floor(Math.random() * pool.length);
        setScoutedPlayer(pool[randomIndex]);
    };

    return (
        // 여백 문제를 보완하기 위해 maxWidth를 1600px로 넓히고 패딩을 여유롭게 잡았습니다.
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
            
            {/* 상단 워크스페이스 개요 (대시보드 헤더) */}
            <header className="glass-card" style={{ 
                marginBottom: '2rem', 
                padding: '1.8rem 2.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(245, 158, 11, 0.04) 100%), var(--bg-surface)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ 
                        width: '52px', 
                        height: '52px', 
                        borderRadius: '16px', 
                        background: 'var(--primary-glow)', 
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)'
                    }}>
                        <Shield size={24} color="var(--primary-color)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                            이나즈마 스테이션 에디터 허브
                        </h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontWeight: 600 }}>
                            전술 포메이션 빌더 및 5,400여 명의 선수 정보 레지스트리 관리 센터
                        </p>
                    </div>
                </div>
                
                {/* 콤팩트 통계 현황판 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right', borderRight: '1px solid var(--border-color)', paddingRight: '1.5rem' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>로컬 스쿼드 파일</div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-color)', marginTop: '0.1rem' }}>
                            {localStorage.getItem('victory_road_tactics') ? JSON.parse(localStorage.getItem('victory_road_tactics')).length : 0}개
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>총 데이터베이스</div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-color)', marginTop: '0.1rem' }}>5,400+명</div>
                    </div>
                </div>
            </header>

            {/* 
              메인 레이아웃 분할:
              중앙에 너무 밀집되어 여백이 휑했던 Grid 구조 대신, 
              Flexbox 기반의 비대칭(3fr:2fr) 구조를 적용하여 가로폭을 시원하게 채우고 화면을 가득 쓰게 만들었습니다.
              화면이 좁아질 때(모바일 기기 등)는 FlexWrap에 의해 자연스럽게 세로 정렬(wrap)됩니다.
            */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%' }}>
                
                {/* 1. 좌측: 전술 설계 스튜디오 (가로 공간을 넓게 차지하도록 flex: 3 설정) */}
                <section className="glass-card" style={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                            <div style={{ 
                                padding: '8px', 
                                background: 'rgba(37, 99, 235, 0.12)', 
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Folder color="var(--primary-color)" size={18} />
                            </div>
                            전술 설계 스튜디오
                        </h2>
                        <Link to="/tactics" className="btn btn-primary" style={{ padding: '0.45rem 1rem', borderRadius: '10px', fontSize: '0.85rem', gap: '0.3rem' }}>
                            <Plus size={15} /> 새 전술 설계
                        </Link>
                    </div>

                    {/* 최근 저장된 전술 리스트 */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.2rem' }}>최근 편집한 전술 파일</div>
                        
                        {savedTactics.length > 0 ? (
                            savedTactics.map((tactics) => (
                                <div 
                                    key={tactics.id}
                                    onClick={() => navigate(`/tactics?load=${tactics.id}`)}
                                    className="tactic-item-card"
                                    style={{
                                        padding: '0.85rem 1.1rem',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                        <div style={{ 
                                            width: '38px', 
                                            height: '38px', 
                                            borderRadius: '10px', 
                                            background: 'rgba(37, 99, 235, 0.1)', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            border: '1px solid rgba(37, 99, 235, 0.15)'
                                        }}>
                                            <Shield size={16} color="var(--primary-color)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{tactics.title}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem', fontWeight: 600 }}>
                                                포메이션: <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{tactics.formation}</span> &bull; {Object.keys(tactics.squad || {}).length}명 스쿼드
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {formatDate(tactics.createdAt)}
                                        </span>
                                        <button 
                                            onClick={(e) => handleDeleteTactics(tactics.id, e)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.color = '#EF4444'}
                                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                            title="삭제"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ 
                                flex: 1, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                border: '2px dashed var(--border-color)', 
                                borderRadius: '20px', 
                                padding: '2rem 1rem',
                                background: 'rgba(255,255,255,0.02)'
                            }}>
                                <Folder size={32} style={{ opacity: 0.25, marginBottom: '0.75rem', color: 'var(--text-muted)' }} />
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>로컬에 저장된 전술 데이터가 없습니다.</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>새 전술 설계 버튼을 눌러 작업을 시작해 보세요!</div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 2. 우측: 선수 레지스트리 라이브러리 (사이드바 성격으로 flex: 2 설정) */}
                <section className="glass-card" style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                            <div style={{ 
                                padding: '8px', 
                                background: 'rgba(245, 158, 11, 0.12)', 
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Users color="var(--accent-color)" size={18} />
                            </div>
                            선수 레지스트리
                        </h2>
                        <Link to="/zukan" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', borderRadius: '10px', fontSize: '0.85rem', gap: '0.3rem', border: '1px solid var(--border-color)' }}>
                            <Search size={14} /> 전체 선수 탐색
                        </Link>
                    </div>

                    {/* 포지션 퀵 필터 버튼 */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.6rem' }}>포지션별 퀵 필터</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            {['FW', 'MF', 'DF', 'GK'].map(pos => (
                                <Link 
                                    key={pos}
                                    to={`/zukan?position=${pos}`}
                                    className="btn btn-secondary"
                                    style={{
                                        padding: '0.6rem 0',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid var(--border-color)',
                                        textAlign: 'center',
                                        display: 'block',
                                        color: 'var(--text-main)'
                                    }}
                                >
                                    {pos}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 개편 기능 1: 실시간 선수 퀵 검색기 (검색 버튼을 돋보기 아이콘으로 변경) */}
                    <div style={{ marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.6rem' }}>실시간 선수 퀵 검색기</div>
                        <form onSubmit={handleQuickSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text"
                                placeholder="선수 이름 또는 포지션을 입력하세요..."
                                value={quickSearchQuery}
                                onChange={(e) => setQuickSearchQuery(e.target.value)}
                                className="input-field"
                                style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem', borderRadius: '10px' }}
                            />
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                style={{ 
                                    padding: '0.6rem 1rem', 
                                    borderRadius: '10px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    cursor: 'pointer' 
                                }}
                                title="검색"
                            >
                                <Search size={16} />
                            </button>
                        </form>
                    </div>

                    {/* 개편 기능 2: 오늘의 랜덤 스카우트 (실제 DB 이미지 포함) */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>오늘의 랜덤 스카우트</div>
                            <button 
                                onClick={handleRandomScout}
                                className="btn btn-primary"
                                style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', background: 'var(--accent-color)', cursor: 'pointer' }}
                            >
                                스카우트 하기
                            </button>
                        </div>

                        {scoutedPlayer ? (
                            <div 
                                onClick={() => navigate(`/player/${scoutedPlayer.id}`)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '14px',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--primary-color)',
                                    boxShadow: 'var(--soft-shadow)',
                                    cursor: 'pointer', // 마우스 오버 시 클릭 커서로 변경하여 인지도를 향상시킵니다.
                                    transition: 'border-color 0.2s, transform 0.15s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <img 
                                    src={scoutedPlayer.image || 'https://placehold.co/100x100?text=?'} 
                                    alt={scoutedPlayer.name} 
                                    style={{ 
                                        width: '46px', 
                                        height: '46px', 
                                        borderRadius: '50%', 
                                        objectFit: 'contain',
                                        background: 'var(--bg-color)',
                                        border: '2px solid var(--primary-color)' 
                                    }} 
                                    onError={(e) => {
                                        // 실제 이미지 로드 실패 시 물음표로 백업 처리
                                        e.target.src = 'https://placehold.co/100x100?text=?';
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                                            {getPlayerDisplayName(scoutedPlayer, charactersData)}
                                        </h3>
                                        <span className={getElementClass(scoutedPlayer.element)}>
                                            {scoutedPlayer.element}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem', fontWeight: 600 }}>
                                        {scoutedPlayer.position} 포지션 &bull; {scoutedPlayer.team ? (teamTranslation[scoutedPlayer.team.split('\n')[0].trim()] || scoutedPlayer.team.split('\n')[0].trim()) : '무소속'}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 800 }}>
                                    성공!
                                </div>
                            </div>
                        ) : (
                            <div style={{ 
                                flex: 1, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                border: '1px dashed var(--border-color)', 
                                borderRadius: '12px', 
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.01)',
                                minHeight: '110px'
                            }}>
                                <Star size={24} style={{ opacity: 0.15, marginBottom: '0.5rem', color: 'var(--text-muted)' }} />
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>스카우트 대기 중</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem', textAlign: 'center' }}>
                                    스카우트 버튼을 눌러 오늘 활약할 선수를 영입해 보세요.
                                </div>
                            </div>
                        )}
                    </div>
                </section>

            </div>

            {/* 개편 사항 4: 실시간 퀵 검색 결과 팝업(모달) */}
            {isSearchModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass-card" style={{
                        width: '90%',
                        maxWidth: '500px',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.8rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--hover-shadow)',
                        borderRadius: '24px'
                    }}>
                        {/* 팝업 헤더 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                퀵 검색 결과 (<span style={{ color: 'var(--primary-color)' }}>{searchResults.length}</span>건)
                            </h3>
                            <button 
                                onClick={() => setIsSearchModalOpen(false)}
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                닫기
                            </button>
                        </div>
                        
                        {/* 팝업 리스트 스크롤 영역 */}
                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
                            {searchResults.length > 0 ? (
                                searchResults.map((char) => (
                                    <div 
                                        key={char.id}
                                        onClick={() => {
                                            setIsSearchModalOpen(false);
                                            // 선수를 클릭하면 해당 선수의 상세 프로필 페이지(/player/:id)로 즉시 이동합니다.
                                            navigate(`/player/${char.id}`);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.85rem',
                                            padding: '0.65rem 0.9rem',
                                            borderRadius: '14px',
                                            border: '1px solid var(--border-color)',
                                            background: 'rgba(255,255,255,0.03)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        }}
                                    >
                                        <img 
                                            src={char.image || 'https://placehold.co/100x100?text=?'} 
                                            alt={char.name} 
                                            style={{ 
                                                width: '38px', 
                                                height: '38px', 
                                                borderRadius: '50%', 
                                                objectFit: 'contain',
                                                background: 'var(--bg-color)',
                                                border: '1px solid var(--border-color)' 
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/100x100?text=?';
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                                {getPlayerDisplayName(char, charactersData)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {char.position} &bull; {char.team ? (teamTranslation[char.team.split('\n')[0].trim()] || char.team.split('\n')[0].trim()) : '무소속'}
                                            </div>
                                        </div>
                                        <span className={getElementClass(char.element)}>
                                            {char.element}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    일치하는 선수가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

