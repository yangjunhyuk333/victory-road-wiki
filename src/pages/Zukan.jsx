import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import charactersData from '../data/characters.json';
import { getPlayerDisplayName, categoryTranslation, teamTranslation } from '../utils/playerHelpers'; // 중복 버전 표시 및 카테고리, 팀명 한글화 헬퍼 임포트
import { Search, Filter, Mountain, TreePine, Flame, Wind, UserCheck } from 'lucide-react';

export default function Zukan() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // 라우터 페이지 이동을 위한 useNavigate 선언
    
    // URL 쿼리 스트링에서 기본 필터값을 읽어옴 (예: ?position=FW&element=화)
    const initialElement = searchParams.get('element') || 'All';
    const initialPosition = searchParams.get('position') || 'All';

    const [searchTerm, setSearchTerm] = useState(() => {
        // URL 쿼리 파라미터에 검색어가 들어있는 경우 즉시 초기값으로 파싱하여 초기 렌더링에 반영합니다.
        return searchParams.get('searchTerm') || '';
    });
    const [filterElement, setFilterElement] = useState(initialElement);
    const [filterPosition, setFilterPosition] = useState(initialPosition);
    const [page, setPage] = useState(1);
    const itemsPerPage = 60; // 한 페이지당 로드할 선수 개수

    // URL 파라미터가 실시간으로 변할 때 상태값도 동기화 (예: 홈에서 퀵링크 또는 검색으로 들어왔을 때 대응)
    useEffect(() => {
        const paramElem = searchParams.get('element');
        const paramPos = searchParams.get('position');
        const paramSearch = searchParams.get('searchTerm');
        if (paramElem) setFilterElement(paramElem);
        if (paramPos) setFilterPosition(paramPos);
        // 홈에서 검색 팝업 내 선수를 누르거나 검색 쿼리를 넘겼을 때 검색창의 상태를 동기화해 줍니다.
        if (paramSearch !== null) setSearchTerm(paramSearch);
    }, [searchParams]);

    // 특결(속성) 아이콘 렌더링 헬퍼 함수
    const getElementIcon = (elem) => {
        switch (elem) {
            case '화': return <Flame size={14} color="#EF4444" />;
            case '풍': return <Wind size={14} color="#3B82F6" />;
            case '림': return <TreePine size={14} color="#10B981" />;
            case '산': return <Mountain size={14} color="#F59E0B" />;
            default: return null;
        }
    };

    // 속성에 대응하는 디자인용 CSS 클래스 리턴 헬퍼 함수
    const getElementClass = (elem) => {
        switch (elem) {
            case '화': return 'element-badge element-fire';
            case '풍': return 'element-badge element-wind';
            case '림': return 'element-badge element-wood';
            case '산': return 'element-badge element-mountain';
            default: return 'element-badge element-none';
        }
    };

    // 검색어 및 필터 조건(속성 + 포지션)에 부합하는 선수 배열 필터링 (useMemo로 메모이제이션)
    const filteredCharacters = useMemo(() => {
        return charactersData.filter(char => {
            const nameLower = char.name.toLowerCase();
            const kanaLower = (char.kana || '').toLowerCase();
            const nicknameLower = (char.nickname || '').toLowerCase();
            const searchLower = searchTerm.toLowerCase();

            const matchName = nameLower.includes(searchLower) || 
                              kanaLower.includes(searchLower) || 
                              nicknameLower.includes(searchLower);
            
            const matchElem = filterElement === 'All' || char.element === filterElement;
            
            // 포지션 데이터 매칭 (FW, MF, DF, GK 등 매칭)
            let charPos = char.position || '';
            // 데이터 형태가 'FW' 혹은 'MF' 등이므로, 대소문자 무관하게 비교
            const matchPos = filterPosition === 'All' || 
                             charPos.toUpperCase() === filterPosition.toUpperCase();

            return matchName && matchElem && matchPos;
        });
    }, [searchTerm, filterElement, filterPosition]);

    // 검색어나 필터 조건이 변경되면 즉시 1페이지로 리셋합니다.
    useEffect(() => {
        setPage(1);
    }, [searchTerm, filterElement, filterPosition]);

    // 하단 도달 시 자동으로 다음 60명을 로드하는 무한 스크롤 Observer
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

    // 무한 스크롤(더보기) 방식의 노출 선수 배열 슬라이싱
    const displayedCharacters = filteredCharacters.slice(0, page * itemsPerPage);

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

            {/* 타이틀 헤더 영역 */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <h1 style={{ 
                    fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', 
                    fontWeight: 800, 
                    color: 'var(--text-main)', 
                    marginBottom: '1rem',
                    letterSpacing: '-1.5px'
                }}>
                    이나즈마 <span className="text-gradient">대백과사전</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', fontWeight: 500 }}>
                    총 {charactersData.length.toLocaleString()}명의 공식 빅토리로드 데이터베이스를 한눈에 검색하세요.
                </p>
            </div>

            {/* 검색 및 필터 컨트롤 창 (Glassmorphism 적용) */}
            <div className="glass-card" style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                    {/* 통합 텍스트 검색 창 */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '1.2rem', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="선수명, 카나, 별칭을 입력해 필터링..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="input-field"
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>

                    {/* 필터링 패널 영역 */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                        
                        {/* 1. 속성별 필터링 버튼 패널 */}
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
                                <Filter size={16} /> 속성 필터:
                            </div>
                            {['All', '풍', '림', '화', '산'].map(elem => (
                                <button
                                    key={elem}
                                    onClick={() => { setFilterElement(elem); setPage(1); }}
                                    className={`btn ${filterElement === elem ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{
                                        padding: '0.45rem 1.15rem',
                                        borderRadius: '25px',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {elem === 'All' ? '전체 속성' : `${elem} 속성`}
                                </button>
                            ))}
                        </div>

                        {/* 2. 포지션별 필터링 버튼 패널 (신설) */}
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
                                <UserCheck size={16} /> 포지션 필터:
                            </div>
                            {['All', 'FW', 'MF', 'DF', 'GK'].map(pos => (
                                <button
                                    key={pos}
                                    onClick={() => { setFilterPosition(pos); setPage(1); }}
                                    className={`btn ${filterPosition === pos ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{
                                        padding: '0.45rem 1.15rem',
                                        borderRadius: '25px',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {pos === 'All' ? '전체 포지션' : pos}
                                </button>
                            ))}
                        </div>

                    </div>

                </div>
                {/* 검색 통계 정보 */}
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    검색 조건 부합: <strong style={{ color: 'var(--primary-color)' }}>{filteredCharacters.length.toLocaleString()}</strong>명
                </div>
            </div>

            {/* 도감 인덱스 카드 그리드 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '1.8rem'
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
                            cursor: 'pointer' // 마우스 오버 시 클릭이 가능함을 사용자에게 알리는 커서 스타일 추가
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
                                        // 초상화 이미지 깨질 시 물음표 텍스트 백업 처리
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
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
                                justifyContent: 'center',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>?</div>
                            
                            {/* 포지션 마커 (FW, MF, DF, GK 등) */}
                            {char.position && (
                                <span className="position-badge" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                    {char.position}
                                </span>
                            )}
                        </div>

                        {/* 카드 선수 정보 텍스트 영역 */}
                        <div style={{ padding: '1.4rem' }}>
                            {/* 카나 / 분류 명 (분류 명 한글화 매핑 적용) */}
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.3rem', fontWeight: 700 }}>
                                {char.kana || categoryTranslation[char.category] || char.category}
                            </div>
                            {/* 이름 (중복 캐릭터일 경우 버전 괄호 명시 적용) */}
                            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800 }}>
                                {getPlayerDisplayName(char, charactersData)}
                            </h3>

                            {/* 하단 속성 및 소속팀 배너 */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span className={getElementClass(char.element)}>
                                    {getElementIcon(char.element)}
                                    {char.element || '무'}
                                </span>
                                {char.team && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'pre-line' }}>
                                        {char.team.split('\n').map(t => teamTranslation[t.trim()] || t.trim()).join('\n')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 더 보기 무한 스크롤 트리거 버튼 및 자동 관찰 타겟 */}
            {filteredCharacters.length > displayedCharacters.length && (
                <div id="infinite-scroll-trigger" style={{ textAlign: 'center', marginTop: '3rem', padding: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(p => p + 1)}
                        style={{ padding: '0.85rem 3rem', borderRadius: '30px', fontSize: '1rem' }}
                    >
                        선수 더 불러오기 ({displayedCharacters.length} / {filteredCharacters.length})
                    </button>
                </div>
            )}

            {/* 검색 결과 0명일 때 백업 예외 화면 */}
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
