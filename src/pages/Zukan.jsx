import { useState, useMemo } from 'react';
import charactersData from '../data/characters.json';
import { Search, Filter, Mountain, TreePine, Flame, Wind } from 'lucide-react';

export default function Zukan() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterElement, setFilterElement] = useState('All');
    const [page, setPage] = useState(1);
    const itemsPerPage = 60;

    // 특결(속성) 아이콘 매핑 헬퍼
    const getElementIcon = (elem) => {
        switch (elem) {
            case '화': return <Flame size={14} color="#EF4444" />;
            case '풍': return <Wind size={14} color="#3B82F6" />;
            case '림': return <TreePine size={14} color="#10B981" />;
            case '산': return <Mountain size={14} color="#F59E0B" />;
            default: return null;
        }
    };

    const filteredCharacters = useMemo(() => {
        return charactersData.filter(char => {
            const matchName = char.name.includes(searchTerm) || char.kana.includes(searchTerm) || char.nickname.includes(searchTerm);
            const matchElem = filterElement === 'All' || char.element === filterElement;
            return matchName && matchElem;
        });
    }, [searchTerm, filterElement]);

    const displayedCharacters = filteredCharacters.slice(0, page * itemsPerPage);

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
                    이나즈마 대백과사전
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    총 {charactersData.length.toLocaleString()}명의 공식 도감 데이터가 통합되었습니다.
                </p>
            </div>

            {/* 검색 및 필터 컨트롤 창 */}
            <div className="card" style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

                    <div style={{ flex: '1 1 300px', position: 'relative' }}>
                        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="선수명, 별명 등을 검색하세요..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="input-field"
                            style={{ paddingLeft: '2.8rem', background: '#F8FAFC' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Filter size={18} color="var(--text-muted)" style={{ marginRight: '0.4rem' }} />
                        {['All', '풍', '림', '화', '산'].map(elem => (
                            <button
                                key={elem}
                                onClick={() => { setFilterElement(elem); setPage(1); }}
                                style={{
                                    background: filterElement === elem ? 'var(--primary-color)' : '#F1F5F9',
                                    color: filterElement === elem ? '#fff' : 'var(--text-main)',
                                    border: 'none', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: 600,
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {elem === 'All' ? '전체 속성' : elem}
                            </button>
                        ))}
                    </div>

                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    검색 결과: <strong>{filteredCharacters.length.toLocaleString()}</strong>명
                </div>
            </div>

            {/* 도감 그리드 (5열 배치) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                {displayedCharacters.map((char, index) => (
                    <div key={char.id || index} style={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        overflow: 'hidden',
                        boxShadow: 'var(--soft-shadow)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'none'}
                    >
                        <div style={{
                            height: '180px',
                            background: '#F1F5F9',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            position: 'relative',
                            padding: '1rem'
                        }}>
                            {char.image ? (
                                <img
                                    src={char.image}
                                    alt={char.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div style={{ color: '#CBD5E1', fontSize: '3rem', fontWeight: 800, display: char.image ? 'none' : 'flex' }}>?</div>
                            {/* 포지션 라벨 */}
                            {char.position && (
                                <span style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: '#1E293B', color: '#fff',
                                    fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px'
                                }}>
                                    {char.position}
                                </span>
                            )}
                        </div>

                        <div style={{ padding: '1.2rem' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem', fontWeight: 600 }}>{char.kana || char.category}</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>{char.name}</h3>

                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                                    background: char.element === '화' ? '#FEE2E2' : char.element === '풍' ? '#DBEAFE' : char.element === '림' ? '#D1FAE5' : char.element === '산' ? '#FEF3C7' : '#F1F5F9',
                                    color: char.element === '화' ? '#EF4444' : char.element === '풍' ? '#3B82F6' : char.element === '림' ? '#10B981' : char.element === '산' ? '#F59E0B' : '#64748B',
                                    padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700
                                }}>
                                    {getElementIcon(char.element)}
                                    {char.element || '무'}
                                </div>
                                {char.team && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{char.team}</div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCharacters.length > displayedCharacters.length && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(p => p + 1)}
                        style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', borderRadius: '30px' }}
                    >
                        더 보기 ({displayedCharacters.length} / {filteredCharacters.length})
                    </button>
                </div>
            )}

            {filteredCharacters.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                    <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <h3>검색 결과가 없습니다.</h3>
                </div>
            )}
        </div>
    );
}
