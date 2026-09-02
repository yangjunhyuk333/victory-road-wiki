import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import charactersData from '../data/characters.json';
import { getPlayerDisplayName, categoryTranslation, teamTranslation } from '../utils/playerHelpers';
import { Search, Filter, Mountain, TreePine, Flame, Wind, UserCheck, LayoutGrid, List, ArrowUpDown, Sparkles, Shield, Zap, Crosshair } from 'lucide-react';

export default function Zukan() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // URL 쿼리 스트링에서 기본 필터값을 읽어옴
    const initialElement = searchParams.get('element') || 'All';
    const initialPosition = searchParams.get('position') || 'All';

    const [searchTerm, setSearchTerm] = useState(() => searchParams.get('searchTerm') || '');
    const [filterElement, setFilterElement] = useState(initialElement);
    const [filterPosition, setFilterPosition] = useState(initialPosition);
    const [sortBy, setSortBy] = useState('default'); // 'default', 'kick', 'guard', 'control', 'speed', 'name'
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [page, setPage] = useState(1);
    const itemsPerPage = 60;

    // URL 파라미터 실시간 동기화
    useEffect(() => {
        const paramElem = searchParams.get('element');
        const paramPos = searchParams.get('position');
        const paramSearch = searchParams.get('searchTerm');
        if (paramElem) setFilterElement(paramElem);
        if (paramPos) setFilterPosition(paramPos);
        if (paramSearch !== null) setSearchTerm(paramSearch);
    }, [searchParams]);

    // 속성 아이콘 렌더링 헬퍼
    const getElementIcon = (elem) => {
        switch (elem) {
            case '화': return <Flame size={13} color="#EF4444" />;
            case '풍': return <Wind size={13} color="#3B82F6" />;
            case '림': return <TreePine size={13} color="#10B981" />;
            case '산': return <Mountain size={13} color="#F59E0B" />;
            default: return null;
        }
    };

    // 속성 CSS 클래스 리턴
    const getElementClass = (elem) => {
        switch (elem) {
            case '화': return 'element-badge element-fire';
            case '풍': return 'element-badge element-wind';
            case '림': return 'element-badge element-wood';
            case '산': return 'element-badge element-mountain';
            default: return 'element-badge element-none';
        }
    };

    // 검색어, 필터 및 정렬 필터링
    const filteredCharacters = useMemo(() => {
        const filtered = charactersData.filter(char => {
            const nameLower = (char.name || '').toLowerCase();
            const kanaLower = (char.kana || '').toLowerCase();
            const nicknameLower = (char.nickname || '').toLowerCase();
            const searchLower = searchTerm.toLowerCase().trim();

            const matchName = !searchLower || 
                              nameLower.includes(searchLower) || 
                              kanaLower.includes(searchLower) || 
                              nicknameLower.includes(searchLower);
            
            const matchElem = filterElement === 'All' || char.element === filterElement;
            const charPos = char.position || '';
            const matchPos = filterPosition === 'All' || 
                             charPos.toUpperCase() === filterPosition.toUpperCase();

            return matchName && matchElem && matchPos;
        });

        // 정렬 로직 적용
        if (sortBy === 'kick') {
            filtered.sort((a, b) => Number(b.stats?.kick || b.stats?.kick_power || 0) - Number(a.stats?.kick || a.stats?.kick_power || 0));
        } else if (sortBy === 'guard') {
            filtered.sort((a, b) => Number(b.stats?.guard || b.stats?.defense || 0) - Number(a.stats?.guard || a.stats?.defense || 0));
        } else if (sortBy === 'control') {
            filtered.sort((a, b) => Number(b.stats?.control || b.stats?.technique || 0) - Number(a.stats?.control || a.stats?.technique || 0));
        } else if (sortBy === 'speed') {
            filtered.sort((a, b) => Number(b.stats?.speed || b.stats?.agility || 0) - Number(a.stats?.speed || a.stats?.agility || 0));
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko-KR'));
        }

        return filtered;
    }, [searchTerm, filterElement, filterPosition, sortBy]);

    // 필터 조건 변경 시 페이지 리셋
    useEffect(() => {
        setPage(1);
    }, [searchTerm, filterElement, filterPosition, sortBy]);

    // 무한 스크롤 Observer
    useEffect(() => {
        const observerTarget = document.getElementById('infinite-scroll-trigger');
        if (!observerTarget) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage(prev => {
                    const maxPage = Math.ceil(filteredCharacters.length / itemsPerPage);
                    if (prev < maxPage) return prev + 1;
                    return prev;
                });
            }
        }, { threshold: 0.1 });

        observer.observe(observerTarget);
        return () => observer.disconnect();
    }, [filteredCharacters.length]);

    const displayedCharacters = filteredCharacters.slice(0, page * itemsPerPage);

    return (
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

            {/* 타이틀 헤더 영역 */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.25)', color: 'var(--primary-color)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                    <Sparkles size={14} /> 빅토리 로드 공식 데이터베이스
                </div>
                <h1 style={{ 
                    fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', 
                    fontWeight: 900, 
                    color: 'var(--text-main)', 
                    marginBottom: '0.75rem',
                    letterSpacing: '-1.5px'
                }}>
                    이나즈마 <span className="text-gradient">캐릭터 대도감</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>
                    총 <strong>{charactersData.length.toLocaleString()}</strong>명의 선수와 팀 프로필, 스탯을 실시간으로 검색하고 비교하세요.
                </p>
            </div>

            {/* 검색 및 필터 컨트롤 바 */}
            <div className="glass-card" style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1.5rem' }}>
                
                {/* 1. 상단: 통합 검색창 & 뷰 전환/정렬 토글 */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '1.2rem', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="선수 이름, 별칭, 카나를 검색하세요..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="input-field"
                            style={{ paddingLeft: '3rem', width: '100%' }}
                        />
                    </div>

                    {/* 정렬 드롭다운 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowUpDown size={15} color="var(--text-muted)" />
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '0.65rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-main)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            <option value="default">기본 정렬</option>
                            <option value="kick">🔥 킥(공격력) 높은순</option>
                            <option value="guard">🛡️ 가드(수비력) 높은순</option>
                            <option value="control">🎯 컨트롤 높은순</option>
                            <option value="speed">⚡ 스피드 높은순</option>
                            <option value="name">가나다순</option>
                        </select>
                    </div>

                    {/* 뷰 모드 토글 (갤러리 ↔ 리스트) */}
                    <div style={{ display: 'flex', background: 'var(--bg-color)', padding: '3px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '0.45rem 0.75rem',
                                borderRadius: '9px',
                                border: 'none',
                                background: viewMode === 'grid' ? 'var(--primary-color)' : 'transparent',
                                color: viewMode === 'grid' ? '#FFF' : 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                transition: 'all 0.2s'
                            }}
                            title="카드 갤러리 뷰"
                        >
                            <LayoutGrid size={15} /> 카드
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '0.45rem 0.75rem',
                                borderRadius: '9px',
                                border: 'none',
                                background: viewMode === 'list' ? 'var(--primary-color)' : 'transparent',
                                color: viewMode === 'list' ? '#FFF' : 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                transition: 'all 0.2s'
                            }}
                            title="스탯 비교 리스트 뷰"
                        >
                            <List size={15} /> 스탯 리스트
                        </button>
                    </div>
                </div>

                {/* 2. 하단: 속성 & 포지션 칩 필터 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    
                    {/* 속성 칩 필터 */}
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, marginRight: '0.2rem' }}>속성:</span>
                        {[
                            { id: 'All', label: '전체' },
                            { id: '화', label: '🔥 화' },
                            { id: '풍', label: '💨 풍' },
                            { id: '림', label: '🌲 림' },
                            { id: '산', label: '⛰️ 산' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setFilterElement(item.id)}
                                className={`btn ${filterElement === item.id ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* 포지션 칩 필터 */}
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, marginRight: '0.2rem' }}>포지션:</span>
                        {[
                            { id: 'All', label: '전체' },
                            { id: 'FW', label: '⚽ FW' },
                            { id: 'MF', label: '🎯 MF' },
                            { id: 'DF', label: '🛡️ DF' },
                            { id: 'GK', label: '🧤 GK' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setFilterPosition(item.id)}
                                className={`btn ${filterPosition === item.id ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* 검색 통계 카운트 */}
                    <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        검색 결과: <strong style={{ color: 'var(--primary-color)' }}>{filteredCharacters.length.toLocaleString()}</strong>명
                    </div>
                </div>

            </div>

            {/* 3. 본문 뷰 렌더링 (그리드 vs 리스트) */}
            {viewMode === 'grid' ? (
                /* 🎴 갤러리 카드 뷰 */
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                    gap: '1.6rem'
                }}>
                    {displayedCharacters.map((char, index) => (
                        <div 
                            key={char.id || index} 
                            className="glass-card glass-card-hover" 
                            onClick={() => navigate(`/player/${char.id}`)}
                            style={{
                                padding: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer'
                            }}
                        >
                            {/* 카드 이미지 영역 */}
                            <div style={{
                                height: '190px',
                                background: 'var(--bg-color)',
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                position: 'relative',
                                padding: '1.25rem',
                                borderBottom: '1px solid var(--border-color)'
                            }}>
                                {char.image ? (
                                    <img
                                        src={char.image}
                                        alt={char.name}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'contain',
                                            transition: 'transform 0.4s ease' 
                                        }}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                ) : null}
                                <div style={{ 
                                    color: 'var(--text-muted)', 
                                    fontSize: '2.5rem', 
                                    fontWeight: 800, 
                                    display: char.image ? 'none' : 'flex',
                                    background: 'var(--border-color)',
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>?</div>
                                
                                {char.position && (
                                    <span className="position-badge" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                        {char.position}
                                    </span>
                                )}
                            </div>

                            {/* 카드 선수 정보 텍스트 영역 */}
                            <div style={{ padding: '1.3rem' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                                    {char.kana || categoryTranslation[char.category] || char.category}
                                </div>
                                <h3 style={{ margin: '0 0 0.7rem 0', fontSize: '1.12rem', color: 'var(--text-main)', fontWeight: 800 }}>
                                    {getPlayerDisplayName(char, charactersData)}
                                </h3>

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span className={getElementClass(char.element)}>
                                        {getElementIcon(char.element)}
                                        {char.element || '무'}
                                    </span>
                                    {char.team && (
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'pre-line' }}>
                                            {char.team.split('\n').map(t => teamTranslation[t.trim()] || t.trim()).join('\n')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* 📊 스탯 비교 리스트 뷰 */
                <div className="glass-card" style={{ padding: '0.5rem', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                <th style={{ padding: '0.85rem 1rem' }}>선수</th>
                                <th style={{ padding: '0.85rem 0.6rem' }}>포지션</th>
                                <th style={{ padding: '0.85rem 0.6rem' }}>속성</th>
                                <th style={{ padding: '0.85rem 0.6rem' }}>소속팀</th>
                                <th style={{ padding: '0.85rem 0.6rem', textAlign: 'center' }}>킥(공격)</th>
                                <th style={{ padding: '0.85rem 0.6rem', textAlign: 'center' }}>가드(수비)</th>
                                <th style={{ padding: '0.85rem 0.6rem', textAlign: 'center' }}>컨트롤</th>
                                <th style={{ padding: '0.85rem 0.6rem', textAlign: 'center' }}>스피드</th>
                                <th style={{ padding: '0.85rem 0.6rem', textAlign: 'center' }}>체력</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedCharacters.map((char, index) => {
                                const s = char.stats || {};
                                return (
                                    <tr 
                                        key={char.id || index}
                                        onClick={() => navigate(`/player/${char.id}`)}
                                        style={{ 
                                            borderBottom: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-color)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {char.image ? (
                                                    <img src={char.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
                                                ) : <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>?</span>}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>{getPlayerDisplayName(char, charactersData)}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{char.nickname || char.kana}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem 0.6rem' }}>
                                            <span className="position-badge" style={{ fontSize: '0.72rem', padding: '2px 7px' }}>{char.position || '-'}</span>
                                        </td>
                                        <td style={{ padding: '0.75rem 0.6rem' }}>
                                            <span className={getElementClass(char.element)} style={{ fontSize: '0.74rem' }}>
                                                {char.element || '무'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem 0.6rem', color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {char.team ? char.team.split('\n').map(t => teamTranslation[t.trim()] || t.trim()).join(', ') : '-'}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', fontWeight: 800, color: '#EF4444' }}>
                                            {s.kick || s.kick_power || '-'}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', fontWeight: 800, color: '#10B981' }}>
                                            {s.guard || s.defense || '-'}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', fontWeight: 800, color: '#3B82F6' }}>
                                            {s.control || s.technique || '-'}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', fontWeight: 800, color: '#F59E0B' }}>
                                            {s.speed || s.agility || '-'}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                                            {s.stamina || s.guts || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 더 보기 무한 스크롤 트리거 버튼 */}
            {filteredCharacters.length > displayedCharacters.length && (
                <div id="infinite-scroll-trigger" style={{ textAlign: 'center', marginTop: '3rem', padding: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(p => p + 1)}
                        style={{ padding: '0.85rem 3rem', borderRadius: '30px', fontSize: '0.95rem', fontWeight: 700 }}
                    >
                        선수 더 불러오기 ({displayedCharacters.length} / {filteredCharacters.length})
                    </button>
                </div>
            )}

            {/* 0명 검색 예외 화면 */}
            {filteredCharacters.length === 0 && (
                <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
                    <Search size={48} style={{ opacity: 0.15, marginBottom: '1.25rem' }} />
                    <h3 style={{ fontWeight: 700 }}>해당 조건에 만족하는 선수를 찾지 못했습니다.</h3>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>검색어를 다시 검토하거나 필터 구성을 변경해 보세요.</p>
                </div>
            )}
        </div>
    );
}
