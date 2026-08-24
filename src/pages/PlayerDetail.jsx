import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Flame, Wind, TreePine, Mountain, Shield, Trello, Heart, Calendar, RefreshCw, Globe } from 'lucide-react';
import { useState, useEffect } from 'react'; // 실시간 한글 번역 상태관리를 위한 훅 임포트
import charactersData from '../data/characters.json';
import { getPlayerDisplayName, seriesTranslation, refineTranslation, categoryTranslation, teamTranslation } from '../utils/playerHelpers'; // 헬퍼 모듈 임포트

import { translateJaToKo } from '../utils/translationService';

// 선수 상세 페이지 컴포넌트
export default function PlayerDetail() {
  const { id } = useParams(); // URL 파라미터에서 선수의 고유 ID를 가져옵니다.
  const navigate = useNavigate();

  // 데이터베이스(characters.json)에서 ID가 일치하는 선수를 검색합니다.
  const player = charactersData.find(char => char.id === id);

  // 번역된 프로필 설명 저장 상태 및 번역 로딩(진행) 상태를 관리합니다.
  const [translatedDesc, setTranslatedDesc] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // 번역된 소속 팀 목록을 저장할 상태를 선언합니다.
  const [translatedTeams, setTranslatedTeams] = useState([]);

  // 선수의 일어 설명을 감지해 한글로 실시간 번역해 주는 함수
  const loadTranslation = async (forceRefresh = false) => {
    if (!player || !player.description) {
      setTranslatedDesc('');
      return;
    }

    if (forceRefresh) {
      try {
        localStorage.removeItem(`inazuma_trans_v1_desc_${player.id}`);
      } catch (e) {}
    }

    setIsTranslating(true);
    try {
      const res = await translateJaToKo(player.description, `desc_${player.id}`);
      setTranslatedDesc(res);
    } catch (err) {
      console.error("인게임 상세 정보 실시간 번역 오류 발생:", err);
      setTranslatedDesc(refineTranslation(player.description));
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    loadTranslation();
  }, [player]);

  // 선수의 일어 소속 팀 명칭들을 한글로 실시간 번역해 주는 이펙트 훅입니다.
  useEffect(() => {
    if (!player || !player.team) {
      setTranslatedTeams([]);
      return;
    }

    const teamList = player.team.split('\n').filter(t => t.trim() !== '');

    // 이미 소속 팀에 한글이 포함된 경우에는 번역을 건너뜁니다.
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(player.team);
    if (hasKorean) {
      setTranslatedTeams(teamList);
      return;
    }

    // 기본적으로 한글 매핑 사전에 명시된 대표팀 이름을 우선 매칭합니다.
    const mapped = teamList.map(t => teamTranslation[t] || t);

    // 가타카나 및 한자가 여전히 포함되어 있는지 확인하여 정밀 번역 여부를 판별합니다.
    const hasJapanese = /[\u3040-\u30ff\u4e00-\u9faf]/.test(mapped.join(''));
    if (!hasJapanese) {
      setTranslatedTeams(mapped);
      return;
    }

    // 일어 텍스트들을 줄바꿈으로 묶어 번역 API를 단 한 번만 호출해 속도를 향상시킵니다.
    const jaTeamsText = teamList.join('\n');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=ko&dt=t&q=${encodeURIComponent(jaTeamsText)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) {
          const translated = data[0].map(item => item[0]).join('');
          const translatedList = translated.split('\n')
            .map(t => refineTranslation(t.trim()))
            .filter(t => t !== '');
          setTranslatedTeams(translatedList);
        } else {
          setTranslatedTeams(mapped);
        }
      })
      .catch(err => {
        console.error("소속 팀 실시간 번역 에러:", err);
        setTranslatedTeams(mapped);
      });
  }, [player]);

  // 선수를 찾지 못한 경우 예외 처리를 수행합니다.
  if (!player) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center', padding: '2rem' }} className="glass-card">
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 800 }}>선수를 찾을 수 없습니다</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>존재하지 않거나 삭제된 선수 데이터입니다. ID를 확인해 주세요.</p>
        <button onClick={() => navigate('/zukan')} className="btn btn-primary" style={{ padding: '0.6rem 2rem', borderRadius: '30px' }}>
          선수 도감으로 돌아가기
        </button>
      </div>
    );
  }

  // 선수의 속성(Element)에 따라 테마 색상과 아이콘을 다르게 지정하는 헬퍼 함수입니다.
  const getElementTheme = (elem) => {
    switch (elem) {
      case '화':
        return {
          icon: <Flame size={20} color="#FFFFFF" />,
          color: '#EF4444',
          bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.03) 100%)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          badgeClass: 'element-badge element-fire'
        };
      case '풍':
        return {
          icon: <Wind size={20} color="#FFFFFF" />,
          color: '#3B82F6',
          bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.03) 100%)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          badgeClass: 'element-badge element-wind'
        };
      case '림':
        return {
          icon: <TreePine size={20} color="#FFFFFF" />,
          color: '#10B981',
          bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.03) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          badgeClass: 'element-badge element-wood'
        };
      case '산':
        return {
          icon: <Mountain size={20} color="#FFFFFF" />,
          color: '#F59E0B',
          bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.03) 100%)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          badgeClass: 'element-badge element-mountain'
        };
      default:
        return {
          icon: null,
          color: 'var(--text-muted)',
          bgGradient: 'linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, rgba(100, 116, 139, 0.02) 100%)',
          borderColor: 'var(--border-color)',
          badgeClass: 'element-badge element-none'
        };
    }
  };

  const theme = getElementTheme(player.element);

  // 등장 작품(appearances) 배열 인덱스 매핑 정보입니다.
  const seriesNames = [
    "이나즈마 1",
    "이나즈마 2",
    "이나즈마 3",
    "GO 무인편",
    "GO 크로노 스톤",
    "GO 갤럭시",
    "아레스의 천칭",
    "오리온의 각인",
    "빅토리 로드"
  ];

  // 소속 팀 리스트 가공 (줄바꿈 문자가 있는 경우 배열로 쪼개기)
  const teams = player.team ? player.team.split('\n').filter(t => t.trim() !== '') : [];

  return (
    <div style={{ maxWidth: '1000px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      
      {/* 상단 네비게이션 액션바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            borderRadius: '20px',
            padding: '0.5rem 1.2rem',
            border: '1px solid var(--border-color)',
            fontWeight: 700
          }}
        >
          <ArrowLeft size={16} /> 이전 페이지
        </button>

        {/* 전술판에서 이 선수 불러올 때의 연계성 버튼 제공 */}
        <Link 
          to={`/tactics`} 
          className="btn btn-primary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            borderRadius: '20px',
            padding: '0.5rem 1.2rem',
            fontSize: '0.9rem',
            fontWeight: 700
          }}
        >
          <Trello size={15} /> 나만의 전술판 이동
        </Link>
      </div>

      {/* 선수 프로필 상세 카드 레이아웃 */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '2.5rem', 
          background: theme.bgGradient, 
          borderColor: theme.borderColor,
          borderWidth: '1px',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          boxShadow: 'var(--hover-shadow)'
        }}
      >
        {/* 상단 영역: 선수 초상화 + 핵심 메타데이터 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* 선수 메인 초상화 이미지 래퍼 */}
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '24px',
            background: 'var(--bg-color)',
            border: `2px solid ${theme.color}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            overflow: 'hidden',
            boxShadow: 'var(--soft-shadow)',
            position: 'relative',
            margin: '0 auto'
          }}>
            {player.image ? (
              <img 
                src={player.image} 
                alt={player.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{
              display: player.image ? 'none' : 'flex',
              color: 'var(--text-muted)',
              fontSize: '4rem',
              fontWeight: 800,
              alignItems: 'center',
              justifyContent: 'center'
            }}>?</div>
          </div>

          {/* 선수 텍스트 메타데이터 */}
          <div style={{ flex: '1 1 300px' }}>
            {/* 일어 가나 및 별칭 표출 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {player.kana || '일어 가나 정보 없음'}
              </span>
              {player.nickname && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: theme.color, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: `1px solid ${theme.borderColor}`,
                  borderRadius: '6px', 
                  padding: '2px 6px',
                  fontWeight: 700
                }}>
                  {player.nickname}
                </span>
              )}
            </div>

            {/* 선수 이름 및 속성 뱃지 (이름 중복 시 버전 괄호 명시 적용) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-1.5px' }}>
                {getPlayerDisplayName(player, charactersData)}
              </h1>
              <span className={theme.badgeClass} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {theme.icon} {player.element || '무'}속성
              </span>
            </div>

            {/* 포지션, 성별, 분류 일람표 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>포지션</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={16} color="var(--primary-color)" /> {player.position || '포지션 미정'}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>성별</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Heart size={16} color="#EC4899" /> {player.gender || '정보 없음'}
                </div>
              </div>

              {/* 카테고리 (일어 번역 매핑 적용 완료) */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>카테고리</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {categoryTranslation[player.category] || player.category || '선수'}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 중간 구분선 */}
        <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

        {/* 하단 영역: 상세 인포메이션 세부 사항 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* 선수 설명 및 소속 팀 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* 소속 팀 정보 영역 (구글 번역 API 및 정밀 치환 연동) */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                소속 팀
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {translatedTeams.length > 0 ? (
                  translatedTeams.map((team, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        background: 'rgba(37, 99, 235, 0.08)', 
                        border: '1px solid rgba(37, 99, 235, 0.2)', 
                        color: 'var(--primary-color)',
                        padding: '0.4rem 0.85rem', 
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      {team}
                    </span>
                  ))
                ) : teams.length > 0 ? (
                  // 번역 로딩(대기) 시 기본 한글 매핑 또는 원본 일어 노출
                  teams.map((team, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-muted)',
                        padding: '0.4rem 0.85rem', 
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      {teamTranslation[team] || team}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>소속 팀 정보 없음</span>
                )}
              </div>
            </div>

            {/* 인게임 설명문 (다중 번역 엔진 & 캐시 & 재번역 컨트롤 탑재) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  인게임 프로필 설명
                </h3>
                
                {/* 번역 컨트롤 버튼 그룹 */}
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {player.description && (
                    <button
                      onClick={() => setShowOriginal(!showOriginal)}
                      className="btn btn-secondary"
                      style={{
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                      title={showOriginal ? '한국어 번역으로 보기' : '일본어 원문 보기'}
                    >
                      <Globe size={13} /> {showOriginal ? '🇰🇷 번역 보기' : '🇯🇵 원문'}
                    </button>
                  )}

                  <button
                    onClick={() => loadTranslation(true)}
                    disabled={isTranslating}
                    className="btn btn-secondary"
                    style={{
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      color: 'var(--primary-color)',
                      cursor: isTranslating ? 'wait' : 'pointer'
                    }}
                    title="번역 다시 시도"
                  >
                    <RefreshCw size={13} className={isTranslating ? 'spin-anim' : ''} /> {isTranslating ? '번역 중...' : '다시 번역'}
                  </button>
                </div>
              </div>

              <div style={{ 
                color: 'var(--text-main)', 
                lineHeight: 1.65, 
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'rgba(0, 0, 0, 0.12)',
                padding: '1.2rem',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                margin: 0,
                whiteSpace: 'pre-line',
                position: 'relative'
              }}>
                {isTranslating ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontStyle: 'italic' }}>
                    <RefreshCw size={15} className="spin-anim" /> 일어 설명을 한국어로 번역하고 있습니다...
                  </div>
                ) : showOriginal ? (
                  <div style={{ color: 'var(--text-muted)' }}>
                    {player.description || '선수 소개 글이 등록되어 있지 않습니다.'}
                  </div>
                ) : (
                  <div>
                    {translatedDesc || player.description || '선수 소개 글이 등록되어 있지 않습니다.'}
                  </div>
                )}
              </div>
            </div>
            
            {/* 출신 오리지널 시리즈 정보 (한글 번역 매핑 적용) */}
            {player.series && (
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  출신 작품 시리즈
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {seriesTranslation[player.series] || player.series}
                </span>
              </div>
            )}

          </div>

          {/* 역대 이나즈마 일레븐 시리즈 등장 기록 표출 */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={18} /> 시리즈별 참전 기록
            </h3>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '16px',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.6rem'
            }}>
              {seriesNames.map((sName, idx) => {
                // 등장 여부 데이터 (○ = 참전, × = 미참전)
                const isAppeared = player.appearances && player.appearances[idx] === '○';
                return (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '10px',
                      background: isAppeared ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.02)',
                      border: `1px solid ${isAppeared ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.08)'}`
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isAppeared ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {sName}
                    </span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 800, 
                      color: isAppeared ? '#10B981' : '#F43F5E' 
                    }}>
                      {isAppeared ? "참전 (○)" : "미등장 (×)"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
