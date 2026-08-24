import { useState, useEffect, useMemo, useRef } from 'react';
import charactersData from '../data/characters.json';
import { Search, Save, Trash2, FolderOpen, RefreshCw, X, Award, Flame, Wind, TreePine, Mountain, Move } from 'lucide-react';

// 고도화: 지원 포메이션 확장 라인업 (총 8종의 기본 레이아웃 정의)
const FORMATIONS = {
    '4-4-2': [
        { id: 0, role: 'GK', top: 85, left: 50 },
        { id: 1, role: 'LB', top: 68, left: 15 },
        { id: 2, role: 'LCB', top: 70, left: 35 },
        { id: 3, role: 'RCB', top: 70, left: 65 },
        { id: 4, role: 'RB', top: 68, left: 85 },
        { id: 5, role: 'LM', top: 44, left: 15 },
        { id: 6, role: 'LCM', top: 46, left: 36 },
        { id: 7, role: 'RCM', top: 46, left: 64 },
        { id: 8, role: 'RM', top: 44, left: 85 },
        { id: 9, role: 'LS', top: 18, left: 35 },
        { id: 10, role: 'RS', top: 18, left: 65 }
    ],
    '4-3-3': [
        { id: 0, role: 'GK', top: 85, left: 50 },
        { id: 1, role: 'LB', top: 68, left: 15 },
        { id: 2, role: 'LCB', top: 70, left: 35 },
        { id: 3, role: 'RCB', top: 70, left: 65 },
        { id: 4, role: 'RB', top: 68, left: 85 },
        { id: 5, role: 'LCM', top: 48, left: 30 },
        { id: 6, role: 'CM', top: 52, left: 50 },
        { id: 7, role: 'RCM', top: 48, left: 70 },
        { id: 8, role: 'LW', top: 22, left: 20 },
        { id: 9, role: 'CF', top: 18, left: 50 },
        { id: 10, role: 'RW', top: 22, left: 80 }
    ],
    '3-5-2': [
        { id: 0, role: 'GK', top: 85, left: 50 },
        { id: 1, role: 'LCB', top: 70, left: 25 },
        { id: 2, role: 'CB', top: 72, left: 50 },
        { id: 3, role: 'RCB', top: 70, left: 75 },
        { id: 4, role: 'LWB', top: 50, left: 15 },
        { id: 5, role: 'LDM', top: 54, left: 35 },
        { id: 6, role: 'RDM', top: 54, left: 65 },
        { id: 7, role: 'RWB', top: 50, left: 85 },
        { id: 8, role: 'AM', top: 35, left: 50 },
        { id: 9, role: 'LS', top: 18, left: 35 },
        { id: 10, role: 'RS', top: 18, left: 65 }
    ],
    '4-2-3-1': [
        { id: 0, role: 'GK', top: 86, left: 50 },
        { id: 1, role: 'LB', top: 68, left: 15 },
        { id: 2, role: 'LCB', top: 71, left: 35 },
        { id: 3, role: 'RCB', top: 71, left: 65 },
        { id: 4, role: 'RB', top: 68, left: 85 },
        { id: 5, role: 'LDM', top: 53, left: 35 },
        { id: 6, role: 'RDM', top: 53, left: 65 },
        { id: 7, role: 'LM', top: 34, left: 18 },
        { id: 8, role: 'AM', top: 34, left: 50 },
        { id: 9, role: 'RM', top: 34, left: 82 },
        { id: 10, role: 'CF', top: 16, left: 50 }
    ],
    '3-4-3': [
        { id: 0, role: 'GK', top: 85, left: 50 },
        { id: 1, role: 'LCB', top: 70, left: 25 },
        { id: 2, role: 'CB', top: 72, left: 50 },
        { id: 3, role: 'RCB', top: 70, left: 75 },
        { id: 4, role: 'LM', top: 48, left: 15 },
        { id: 5, role: 'LCM', top: 48, left: 38 },
        { id: 6, role: 'RCM', top: 48, left: 62 },
        { id: 7, role: 'RM', top: 48, left: 85 },
        { id: 8, role: 'LF', top: 20, left: 25 },
        { id: 9, role: 'CF', top: 16, left: 50 },
        { id: 10, role: 'RF', top: 20, left: 75 }
    ],
    '5-3-2': [
        { id: 0, role: 'GK', top: 86, left: 50 },
        { id: 1, role: 'LWB', top: 60, left: 12 },
        { id: 2, role: 'LCB', top: 72, left: 30 },
        { id: 3, role: 'CB', top: 74, left: 50 },
        { id: 4, role: 'RCB', top: 72, left: 70 },
        { id: 5, role: 'RWB', top: 60, left: 88 },
        { id: 6, role: 'LCM', top: 44, left: 30 },
        { id: 7, role: 'CM', top: 46, left: 50 },
        { id: 8, role: 'RCM', top: 44, left: 70 },
        { id: 9, role: 'LS', top: 18, left: 35 },
        { id: 10, role: 'RS', top: 18, left: 65 }
    ],
    '4-1-4-1': [
        { id: 0, role: 'GK', top: 85, left: 50 },
        { id: 1, role: 'LB', top: 68, left: 15 },
        { id: 2, role: 'LCB', top: 70, left: 35 },
        { id: 3, role: 'RCB', top: 70, left: 65 },
        { id: 4, role: 'RB', top: 68, left: 85 },
        { id: 5, role: 'DM', top: 54, left: 50 },
        { id: 6, role: 'LM', top: 35, left: 15 },
        { id: 7, role: 'LCM', top: 36, left: 38 },
        { id: 8, role: 'RCM', top: 36, left: 62 },
        { id: 9, role: 'RM', top: 35, left: 85 },
        { id: 10, role: 'CF', top: 16, left: 50 }
    ],
    '5-4-1': [
        { id: 0, role: 'GK', top: 85, left: 50 },
        { id: 1, role: 'LWB', top: 60, left: 12 },
        { id: 2, role: 'LCB', top: 72, left: 30 },
        { id: 3, role: 'CB', top: 74, left: 50 },
        { id: 4, role: 'RCB', top: 72, left: 70 },
        { id: 5, role: 'RWB', top: 60, left: 88 },
        { id: 6, role: 'LM', top: 38, left: 18 },
        { id: 7, role: 'LCM', top: 40, left: 38 },
        { id: 8, role: 'RCM', top: 40, left: 62 },
        { id: 9, role: 'RM', top: 38, left: 82 },
        { id: 10, role: 'CF', top: 16, left: 50 }
    ]
};

export default function Tactics() {
    const fieldRef = useRef(null); // 경기장 DOM 참조를 위해 선언
    const [selectedFormation, setSelectedFormation] = useState('4-4-2');
    const [squad, setSquad] = useState({});                               // 포지션 ID별 선수 스토리지
    const [positions, setPositions] = useState(() => FORMATIONS['4-4-2']); // 실시간 좌표를 관리하는 상태 추가 (자유배치 대응)
    const [tacticsTitle, setTacticsTitle] = useState('');                 // 전술명 인풋
    
    // 모달 및 드래그 제어
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [activeSlotId, setActiveSlotId] = useState(null);
    const [activePositionSlotId, setActivePositionSlotId] = useState(null); // 포지션 역할 변경 모달 타겟 ID
    const [searchTerm, setSearchTerm] = useState('');
    const [limit, setLimit] = useState(50);                               // 선수 모달창 무한 로딩 리미트 추가
    const [isDragMode, setIsDragMode] = useState(false);                 // 자유 이동(드래그) 모드 활성화 여부
    const [draggingId, setDraggingId] = useState(null);                   // 현재 드래그 중인 포지션 ID

    const [savedTactics, setSavedTactics] = useState([]);
    const [savedFormations, setSavedFormations] = useState([]);           // 고도화: 저장된 포메이션 좌표셋 리스트
    const [archiveTab, setArchiveTab] = useState('tactics');             // 아카이브 탭 전환 상태 ('tactics' / 'formations')
    const [isSaving, setIsSaving] = useState(false);
    const [isFetchingList, setIsFetchingList] = useState(false);

    // 선수 속성 미니 아이콘 반환
    const getElementIcon = (elem) => {
        switch (elem) {
            case '화': return <Flame size={10} color="#EF4444" fill="#EF4444" />;
            case '풍': return <Wind size={10} color="#3B82F6" />;
            case '림': return <TreePine size={10} color="#10B981" fill="#10B981" />;
            case '산': return <Mountain size={10} color="#F59E0B" fill="#F59E0B" />;
            default: return null;
        }
    };

    // 검색 필터 조건이 가미된 전체 매칭 리스트 생성
    const filteredList = useMemo(() => {
        const lower = searchTerm.toLowerCase().trim();
        if (!lower) return charactersData;
        return charactersData.filter(char => {
            return char.name.toLowerCase().includes(lower) ||
                   (char.nickname || '').toLowerCase().includes(lower) ||
                   (char.position || '').toLowerCase().includes(lower);
        });
    }, [searchTerm]);

    // 한 화면(모달 스크롤)에 limit 만큼 슬라이싱하여 표출
    const searchedCharacters = useMemo(() => {
        return filteredList.slice(0, limit);
    }, [filteredList, limit]);

    // 내 로컬스토리지 저장 전술 목록 수집 (0ms 즉각 처리)
    const fetchSavedTacticsList = () => {
        setIsFetchingList(true);
        try {
            const localData = localStorage.getItem('victory_road_tactics');
            const list = localData ? JSON.parse(localData) : [];
            // 생성일자 기준 정렬 (최신순)
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setSavedTactics(list);
        } catch (error) {
            console.error("로컬 전술 라이브러리 조회 실패:", error);
        } finally {
            setIsFetchingList(false);
        }
    };

    // 고도화: 내 로컬스토리지 저장 포메이션(좌표셋) 목록 수집 (0ms 즉각 처리)
    const fetchSavedFormationsList = () => {
        try {
            const localData = localStorage.getItem('victory_road_formations');
            const list = localData ? JSON.parse(localData) : [];
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setSavedFormations(list);
        } catch (error) {
            console.error("로컬 포메이션 목록 조회 실패:", error);
        }
    };

    // 마운트 시 초기 목록 불러오기 (로그인 체크 무관하게 작동)
    useEffect(() => {
        fetchSavedTacticsList();
        fetchSavedFormationsList();
    }, []);

    // 바깥 영역 클릭 시 포지션 드롭다운 닫기 (Click Outside)
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (activePositionSlotId !== null) {
                const path = e.composedPath ? e.composedPath() : [];
                const clickedInside = path.some(el => 
                    el.classList && (
                        el.classList.contains('tactics-position-dropdown') || 
                        el.classList.contains('tactics-card-badge-pos') || 
                        el.classList.contains('tactics-card-empty-role')
                    )
                );
                if (!clickedInside) {
                    setActivePositionSlotId(null);
                }
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [activePositionSlotId]);

    // 포메이션 템플릿 변경 시 노드 위치 초기화
    const handleFormationChange = (formName) => {
        setSelectedFormation(formName);
        // 새로운 포메이션의 디폴트 위치값 세팅
        setPositions(FORMATIONS[formName]);
    };

    // 1. 마우스 드래그 시작 핸들러 (PC 환경 대응 - DOM 직접 조작으로 60fps 프레임 보장)
    const handleMouseDown = (slotId, e) => {
        if (!isDragMode) return;    // 자유 이동 모드가 꺼져 있으면 마우스 드래그 불가
        if (e.button !== 0) return; // 왼쪽 마우스 클릭만 허용
        e.preventDefault();
        
        const fieldElement = fieldRef.current;
        const slotElement = e.currentTarget; // 드래그할 대상 tactics-slot DOM 엘리먼트
        if (!fieldElement || !slotElement) return;

        // 중요: transition이 활성화되어 있으면 마우스 이동 시 딜레이(렉)가 걸리므로 강제 종료
        slotElement.style.transition = 'none';
        slotElement.style.zIndex = '1000';

        setDraggingId(slotId);

        // 드래그 중인 실시간 비율을 임시 보관할 변수
        let finalLeft = parseFloat(slotElement.style.left);
        let finalTop = parseFloat(slotElement.style.top);
        let hasMoved = false;

        const onMouseMove = (moveEvent) => {
            const rect = fieldElement.getBoundingClientRect();
            
            // 컨테이너 범위 대비 백분율(%) 좌표 산출
            let leftPercent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
            let topPercent = ((moveEvent.clientY - rect.top) / rect.height) * 100;
            
            // 경계이탈 방지를 위해 가두기 (6% ~ 94% 안전선)
            if (leftPercent < 6) leftPercent = 6;
            if (leftPercent > 94) leftPercent = 94;
            if (topPercent < 6) topPercent = 6;
            if (topPercent > 94) topPercent = 94;

            finalLeft = leftPercent;
            finalTop = topPercent;
            hasMoved = true;

            // React 상태 업데이트 없이 DOM의 인라인 스타일을 직접 갱신하여 렌더링 버벅임 원천 차단
            slotElement.style.left = `${leftPercent}%`;
            slotElement.style.top = `${topPercent}%`;
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            
            // 드래그가 끝나면 최종 변경된 위치 정보를 React 상태에 1회 동기화하여 영속화
            if (hasMoved) {
                setSelectedFormation('커스텀');
                setPositions(prev => prev.map(pos => 
                    pos.id === slotId ? { ...pos, top: finalTop, left: finalLeft } : pos
                ));
            }
            
            setDraggingId(null);
            // transition 원복 및 zIndex 리셋
            slotElement.style.transition = '';
            slotElement.style.zIndex = '';
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // 2. 모바일 터치 드래그 시작 핸들러 (모바일 기기 대응 - DOM 직접 조작으로 60fps 프레임 보장)
    const handleTouchStart = (slotId, e) => {
        if (!isDragMode) return;    // 자유 이동 모드가 꺼져 있으면 터치 드래그 불가
        
        const fieldElement = fieldRef.current;
        const slotElement = e.currentTarget;
        if (!fieldElement || !slotElement) return;

        // 중요: 드래그 중인 동안에는 모바일에서도 레이턴시를 0으로 하기 위해 transition 강제 종료
        slotElement.style.transition = 'none';
        slotElement.style.zIndex = '1000';

        setDraggingId(slotId);

        let finalLeft = parseFloat(slotElement.style.left);
        let finalTop = parseFloat(slotElement.style.top);
        let hasMoved = false;

        const onTouchMove = (moveEvent) => {
            const rect = fieldElement.getBoundingClientRect();
            const touch = moveEvent.touches[0];
            
            let leftPercent = ((touch.clientX - rect.left) / rect.width) * 100;
            let topPercent = ((touch.clientY - rect.top) / rect.height) * 100;
            
            if (leftPercent < 6) leftPercent = 6;
            if (leftPercent > 94) leftPercent = 94;
            if (topPercent < 6) topPercent = 6;
            if (topPercent > 94) topPercent = 94;

            finalLeft = leftPercent;
            finalTop = topPercent;
            hasMoved = true;

            // React 리렌더링 부하 없이 모바일 기기 터치 무브 시 DOM 인라인 style 직접 가속
            slotElement.style.left = `${leftPercent}%`;
            slotElement.style.top = `${topPercent}%`;
        };

        const onTouchEnd = () => {
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            
            // 터치 드래그 종료 시 최종 비율값 React 위치 상태에 1회 반영
            if (hasMoved) {
                setSelectedFormation('커스텀');
                setPositions(prev => prev.map(pos => 
                    pos.id === slotId ? { ...pos, top: finalTop, left: finalLeft } : pos
                ));
            }
            
            setDraggingId(null);
            // transition 원복 및 zIndex 리셋
            slotElement.style.transition = '';
            slotElement.style.zIndex = '';
        };

        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);
    };

    // 포지션 노드 클릭 (선수 모달 띄우기)
    const handleSlotClick = (slotId) => {
        if (isDragMode) return; // 드래그 모드 중에는 클릭 모달 팝업을 차단
        setActiveSlotId(slotId);
        setSearchTerm('');
        setLimit(50); // 리스트 로딩 리미트 초기화
        setIsSearchModalOpen(true);
    };

    // 선수 모달창 바인딩 선택
    const handleSelectPlayer = (player) => {
        setSquad(prev => ({
            ...prev,
            [activeSlotId]: {
                id: player.id,
                name: player.name,
                image: player.image,
                position: player.position,
                element: player.element
            }
        }));
        setIsSearchModalOpen(false);
    };

    // 배치된 선수 지우기
    const handleClearSlot = (slotId, e) => {
        e.stopPropagation(); // 카드 자체의 클릭 이벤트 버블링 차단
        setSquad(prev => {
            const next = { ...prev };
            delete next[slotId];
            return next;
        });
    };

    // 현재의 전술판 배치 및 좌표 셋을 localStorage에 저장 (0ms 지연)
    const handleSaveTactics = () => {
        if (!tacticsTitle.trim()) {
            alert("전술 이름을 입력해 주세요.");
            return;
        }

        setIsSaving(true);
        try {
            const newTacticsItem = {
                id: Date.now().toString(),
                title: tacticsTitle.trim(),
                formation: selectedFormation,
                squad: squad,
                positions: positions,
                createdAt: new Date().toISOString()
            };

            const localData = localStorage.getItem('victory_road_tactics');
            const currentList = localData ? JSON.parse(localData) : [];
            const nextList = [newTacticsItem, ...currentList];
            localStorage.setItem('victory_road_tactics', JSON.stringify(nextList));

            alert("나만의 전술 배치가 로컬 저장소에 저장되었습니다!");
            setTacticsTitle('');
            fetchSavedTacticsList();
        } catch (error) {
            console.error("전술 저장 에러:", error);
            alert(`전술 저장 중 오류가 발생했습니다.`);
        } finally {
            setIsSaving(false);
        }
    };

    // 저장되었던 전술 라이브러리 상태 가져오기
    const handleLoadTactics = (tactics) => {
        setSelectedFormation(tactics.formation);
        setSquad(tactics.squad || {});
        // 개별 좌표가 저장되어 있으면 로드하고, 없으면 포메이션 기본값 사용
        setPositions(tactics.positions || FORMATIONS[tactics.formation]);
        setTacticsTitle(tactics.title);
        alert(`"${tactics.title}" 전술을 성공적으로 불러왔습니다.`);
    };

    // 저장 전술 데이터 삭제 (0ms 지연)
    const handleDeleteTactics = (tacticsId, e) => {
        e.stopPropagation();
        if (!window.confirm("이 전술 배치를 삭제하시겠습니까?")) return;

        try {
            const localData = localStorage.getItem('victory_road_tactics');
            const currentList = localData ? JSON.parse(localData) : [];
            const nextList = currentList.filter(item => item.id !== tacticsId);
            localStorage.setItem('victory_road_tactics', JSON.stringify(nextList));
            fetchSavedTacticsList();
        } catch (error) {
            console.error("전술 삭제 에러:", error);
            alert(`삭제하는 과정에서 에러가 발생했습니다.`);
        }
    };

    // 신규: 포메이션 대형(좌표)만 단독 저장 (0ms 지연)
    const handleSaveFormationOnly = () => {
        if (!tacticsTitle.trim()) {
            alert("저장할 포메이션 이름을 입력해 주세요.");
            return;
        }

        setIsSaving(true);
        try {
            const newFormItem = {
                id: Date.now().toString(),
                title: tacticsTitle.trim(),
                formation: selectedFormation,
                positions: positions.map(p => ({ id: p.id, role: p.role, top: p.top, left: p.left })),
                createdAt: new Date().toISOString()
            };

            const localData = localStorage.getItem('victory_road_formations');
            const currentList = localData ? JSON.parse(localData) : [];
            const nextList = [newFormItem, ...currentList];
            localStorage.setItem('victory_road_formations', JSON.stringify(nextList));

            alert("나만의 포메이션 대형(좌표)이 로컬 저장소에 성공적으로 저장되었습니다!");
            setTacticsTitle('');
            fetchSavedFormationsList();
        } catch (error) {
            console.error("포메이션 저장 에러:", error);
            alert(`포메이션 저장 중 오류가 발생했습니다.`);
        } finally {
            setIsSaving(false);
        }
    };

    // 신규: 포메이션 대형(좌표)만 로드 (선수 정보 squad는 그대로 보존)
    const handleLoadFormationOnly = (formItem) => {
        setPositions(formItem.positions || FORMATIONS['4-4-2']);
        setSelectedFormation('커스텀');
        alert(`"${formItem.title}" 포메이션 대형을 불러왔습니다. (배치된 선수 유지)`);
    };

    // 신규: 저장된 포메이션 단독 데이터 삭제 (0ms 지연)
    const handleDeleteFormationOnly = (formId, e) => {
        e.stopPropagation();
        if (!window.confirm("이 포메이션 대형을 삭제하시겠습니까?")) return;

        try {
            const localData = localStorage.getItem('victory_road_formations');
            const currentList = localData ? JSON.parse(localData) : [];
            const nextList = currentList.filter(item => item.id !== formId);
            localStorage.setItem('victory_road_formations', JSON.stringify(nextList));
            fetchSavedFormationsList();
        } catch (error) {
            console.error("포메이션 삭제 에러:", error);
            alert(`삭제하는 중 에러가 발생했습니다.`);
        }
    };

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            
            {/* 타이틀 헤더 */}
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1.5px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Award size={32} color="var(--primary-color)" /> 자유 포메이션 전술판
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 600 }}>
                    포메이션 템플릿을 선택한 뒤 **마우스로 드래그**하여 선수들의 위치를 세밀하게 조정하고 나만의 전술로 저장하세요.
                </p>
            </div>

            {/* 레이아웃 분할: 좌측(축구장) / 우측(컨트롤 바 및 아카이브) */}
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                
                {/* 1. 축구장 렌더링 영역 */}
                <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
                    
                    {/* 자유 이동 모드 제어 스위치 헤더 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '580px',
                        background: 'var(--bg-surface)',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--soft-shadow)'
                    }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                            {isDragMode ? '⚙️ 드래그하여 선수 위치를 변경하는 모드' : '👉 카드를 클릭하여 선수를 교체하는 모드'}
                        </span>
                        <button
                            className={`btn ${isDragMode ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setIsDragMode(!isDragMode)}
                            style={{
                                padding: '0.45rem 1.1rem',
                                fontSize: '0.8rem',
                                borderRadius: '10px',
                                borderWidth: '1.5px',
                                boxShadow: isDragMode ? '0 0 10px var(--primary-glow)' : 'none'
                            }}
                        >
                            {isDragMode ? '이동 모드 (ON)' : '클릭 선택 모드'}
                        </button>
                    </div>

                    <div ref={fieldRef} className="soccer-field-container">
                        {/* 축구장 내부 무늬 및 라인 레이어 */}
                        <div className="soccer-field-stripes"></div>
                        <div className="soccer-field-lines">
                            <div className="field-center-line"></div>
                            <div className="field-center-circle"></div>
                            <div className="field-penalty-top"></div>
                            <div className="field-penalty-bottom"></div>
                            <div className="field-goal-top"></div>
                            <div className="field-goal-bottom"></div>
                        </div>

                        {/* 포지션 노드 오버레이 (둥근 사각형 카드 디자인 전면 채용) */}
                        {positions.map((slot) => {
                            const player = squad[slot.id];
                            const isCurrentlyDragging = draggingId === slot.id;

                            return (
                                <div 
                                    key={slot.id}
                                    className={`tactics-slot ${isCurrentlyDragging ? 'is-dragging' : ''}`}
                                    style={{ 
                                        top: `${slot.top}%`, 
                                        left: `${slot.left}%`,
                                        touchAction: 'none', // 모달 터치 스크롤 방지
                                        transition: isCurrentlyDragging ? 'none' : 'all var(--transition-speed) ease',
                                        zIndex: isCurrentlyDragging ? 1000 : (activePositionSlotId === slot.id ? 1050 : 10)
                                    }}
                                    onMouseDown={(e) => handleMouseDown(slot.id, e)}
                                    onTouchStart={(e) => handleTouchStart(slot.id, e)}
                                >
                                    {player ? (
                                        // 둥근 사각형 선수 카드 구조 (선수 배치 상태)
                                        <div 
                                            className={`tactics-card ${isCurrentlyDragging ? 'is-dragging' : ''}`}
                                            onClick={() => handleSlotClick(slot.id)}
                                            style={{ cursor: isDragMode ? 'move' : 'pointer' }}
                                        >
                                            {/* 상단 미니 포지션 뱃지 (역할명) - 클릭 시 선택 변경 */}
                                            <span 
                                                className="tactics-card-badge-pos"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 카드 선택 모달 활성화 차단
                                                    if (isDragMode) return;
                                                    setActivePositionSlotId(slot.id);
                                                }}
                                                style={{
                                                    cursor: isDragMode ? 'move' : 'pointer',
                                                    transition: 'all 0.2s',
                                                    backgroundColor: 'var(--primary-color)',
                                                    border: '1.5px solid #fff'
                                                }}
                                                onMouseOver={e => {
                                                    if (!isDragMode) {
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                        e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                                                    }
                                                }}
                                                onMouseOut={e => {
                                                    e.currentTarget.style.transform = '';
                                                    e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                                }}
                                                title="클릭하여 포지션 역할 변경"
                                            >
                                                {slot.role}
                                            </span>

                                            {/* 상단 미니 속성 뱃지 */}
                                            {player.element && (
                                                <span className="tactics-card-badge-elem">
                                                    {getElementIcon(player.element)}
                                                </span>
                                            )}

                                            {/* 카드 아바타 초상화 */}
                                            <div className="tactics-card-avatar">
                                                {player.image ? (
                                                    <img 
                                                        src={player.image} 
                                                        alt={player.name}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                {/* 이미지 누락 시 글자 대용 렌더링 */}
                                                <div style={{
                                                    display: player.image ? 'none' : 'flex',
                                                    width: '100%', height: '100%',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.4rem', fontWeight: 800,
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    {player.name.charAt(0)}
                                                </div>
                                            </div>

                                            {/* 카드 하단 선수 이름 */}
                                            <div className="tactics-card-info">
                                                {player.name}
                                            </div>

                                            {/* 개별 제거 버튼 (X) */}
                                            <button
                                                onClick={(e) => handleClearSlot(slot.id, e)}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '18px', right: '4px',
                                                    width: '15px', height: '15px',
                                                    borderRadius: '50%',
                                                    background: '#EF4444',
                                                    color: '#fff',
                                                    border: 'none',
                                                    fontSize: '9px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    fontWeight: 900,
                                                    zIndex: 10
                                                }}
                                                title="선수 비우기"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        // 비어 있는 사각형 점선 슬롯 카드
                                        <div 
                                            className="tactics-card-empty"
                                            onClick={() => handleSlotClick(slot.id)}
                                            style={{ cursor: isDragMode ? 'move' : 'pointer' }}
                                        >
                                            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>+</span>
                                            <span 
                                                className="tactics-card-empty-role"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isDragMode) return;
                                                    setActivePositionSlotId(slot.id);
                                                }}
                                                style={{
                                                    cursor: isDragMode ? 'move' : 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={e => {
                                                    if (!isDragMode) {
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                        e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                                                    }
                                                }}
                                                onMouseOut={e => {
                                                    e.currentTarget.style.transform = '';
                                                    e.currentTarget.style.backgroundColor = '';
                                                }}
                                                title="클릭하여 포지션 역할 변경"
                                            >
                                                {slot.role}
                                            </span>
                                        </div>
                                    )}

                                    {/* 힌트 아이콘: 이동 모드 활성화 시 표시 */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-15px',
                                        opacity: isCurrentlyDragging || isDragMode ? 0.9 : 0,
                                        transition: 'opacity 0.2s',
                                        background: 'var(--primary-color)',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        padding: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                                        pointerEvents: 'none' // 클릭 차단
                                    }}>
                                        <Move size={10} />
                                    </div>

                                    {/* 포지션 역할명 변경 드롭다운 팝오버 */}
                                    {activePositionSlotId === slot.id && (
                                        <div 
                                            className="tactics-position-dropdown"
                                            style={{
                                                position: 'absolute',
                                                zIndex: 1100,
                                                width: '210px',
                                                padding: '0.75rem',
                                                background: 'var(--bg-surface-pure)',
                                                borderRadius: '16px',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                                                border: '1.5px solid var(--primary-color)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                cursor: 'default',
                                                // 경기장 가두기식 드롭다운 배치 오프셋 계산
                                                ...(slot.left < 30 ? { left: '10%' } : slot.left > 70 ? { right: '10%' } : { left: '50%', transform: 'translateX(-50%)' }),
                                                ...(slot.top > 70 ? { bottom: '110%' } : { top: '110%' })
                                            }}
                                            onClick={(e) => e.stopPropagation()} // 클릭 전파 방지
                                            onMouseDown={(e) => e.stopPropagation()} // 드래그 앤 드롭 마우스 리스너 차단
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.3rem', marginBottom: '0.2rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)' }}>역할 지정</span>
                                                <button 
                                                    onClick={() => setActivePositionSlotId(null)}
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '2px' }}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                            <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '2px' }} className="custom-scrollbar">
                                                {Object.entries({
                                                    '공격수 (FW)': ['ST', 'CF', 'SS', 'LW', 'RW', 'LF', 'RF'],
                                                    '미드필더 (MF)': ['AM', 'CAM', 'LM', 'RM', 'CM', 'LCM', 'RCM', 'DM', 'LDM', 'RDM'],
                                                    '수비수 (DF)': ['CB', 'LCB', 'RCB', 'LB', 'RB', 'LWB', 'RWB'],
                                                    '골키퍼 (GK)': ['GK']
                                                }).map(([groupName, posList]) => (
                                                    <div key={groupName} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                                            {groupName}
                                                        </span>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                            {posList.map(pos => {
                                                                const isCurrent = slot.role === pos;
                                                                return (
                                                                    <button
                                                                        key={pos}
                                                                        onClick={() => {
                                                                            setPositions(prev => prev.map(p => 
                                                                                p.id === slot.id ? { ...p, role: pos } : p
                                                                            ));
                                                                            if (selectedFormation !== '커스텀') {
                                                                                setSelectedFormation('커스텀');
                                                                            }
                                                                            setActivePositionSlotId(null);
                                                                        }}
                                                                        className={`btn ${isCurrent ? 'btn-primary' : 'btn-secondary'}`}
                                                                        style={{
                                                                            padding: '0.2rem 0.4rem',
                                                                            fontSize: '0.62rem',
                                                                            borderRadius: '6px',
                                                                            borderWidth: '1px',
                                                                            fontWeight: 700
                                                                        }}
                                                                    >
                                                                        {pos}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. 전술 제어 바 및 아카이브 스토리지 리스트 */}
                <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* 전술 변경 및 저장 설정 카드 */}
                    <div className="glass-card">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>전술 셋업</h2>
                        
                        {/* 포메이션 템플릿 8선 라디오 칩셋 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>포메이션 프리셋</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                                {Object.keys(FORMATIONS).map(formName => (
                                    <button
                                        key={formName}
                                        onClick={() => handleFormationChange(formName)}
                                        className={`btn ${selectedFormation === formName ? 'btn-primary' : 'btn-secondary'}`}
                                        style={{ 
                                            padding: '0.45rem 0.25rem', 
                                            fontSize: '0.75rem',
                                            borderRadius: '8px',
                                            borderWidth: '1px'
                                        }}
                                    >
                                        {formName}
                                    </button>
                                ))}
                                {/* 커스텀 프리셋 동적 칩 추가 */}
                                {selectedFormation === '커스텀' && (
                                    <button
                                        className="btn btn-primary"
                                        style={{ 
                                            padding: '0.45rem 0.25rem', 
                                            fontSize: '0.75rem',
                                            borderRadius: '8px',
                                            borderWidth: '1.5px',
                                            borderColor: 'var(--accent-color)',
                                            color: '#fff'
                                        }}
                                        disabled
                                    >
                                        커스텀
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 저장용 인풋 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>이름 입력 (전술 / 포메이션 공용)</label>
                            <input 
                                type="text"
                                className="input-field"
                                placeholder="예: 번개 1군 전술, 닥공 포메이션"
                                value={tacticsTitle}
                                onChange={(e) => setTacticsTitle(e.target.value)}
                            />
                        </div>

                        {/* 신규: 듀얼 저장 실행 버튼 (전체 전술 저장 / 포메이션 좌표 단독 저장) */}
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button 
                                className="btn btn-primary"
                                style={{ flex: 1.2, padding: '0.8rem 0.5rem', fontSize: '0.85rem' }}
                                onClick={handleSaveTactics}
                                disabled={isSaving}
                                title="현재 선수 배치와 대형을 모두 함께 저장합니다"
                            >
                                <Save size={15} /> 전체 전술 저장
                            </button>
                            <button 
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: '0.8rem 0.5rem', fontSize: '0.85rem', borderColor: 'var(--primary-color)', color: 'var(--primary-color)', background: 'transparent' }}
                                onClick={handleSaveFormationOnly}
                                disabled={isSaving}
                                title="배치된 선수는 빼고 오직 11명의 위치 레이아웃만 저장합니다"
                            >
                                <Save size={15} /> 포메이션만 저장
                            </button>
                        </div>
                    </div>

                    {/* 클라우드 불러오기 리스트 (내 전술 / 내 포메이션 탭 방식 채택) */}
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(100, 116, 139, 0.06)', padding: '3px', borderRadius: '10px' }}>
                                <button
                                    className={`btn ${archiveTab === 'tactics' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setArchiveTab('tactics')}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px', border: 'none' }}
                                >
                                    내 전술 (스쿼드 포함)
                                </button>
                                <button
                                    className={`btn ${archiveTab === 'formations' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setArchiveTab('formations')}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px', border: 'none' }}
                                >
                                    내 포메이션 (대형만)
                                </button>
                            </div>
                            <button 
                                onClick={() => {
                                    fetchSavedTacticsList();
                                    fetchSavedFormationsList();
                                }}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                title="라이브러리 새로고침"
                            >
                                <RefreshCw size={16} className={isFetchingList ? 'spin-animation' : ''} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                            {archiveTab === 'tactics' ? (
                                // 1. 내 전술 목록 렌더링
                                savedTactics.length > 0 ? (
                                    savedTactics.map((tact) => (
                                        <div 
                                            key={tact.id}
                                            onClick={() => handleLoadTactics(tact)}
                                            style={{
                                                padding: '1rem',
                                                background: 'rgba(100, 116, 139, 0.04)',
                                                borderRadius: '14px',
                                                border: '1px solid var(--border-color)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                                            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                        >
                                            <div>
                                                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                                    {tact.title}
                                                </h3>
                                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                    포메이션: {tact.formation} │ 등록선수: {Object.keys(tact.squad || {}).length}명
                                                </span>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDeleteTactics(tact.id, e)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-muted)',
                                                    padding: '4px'
                                                }}
                                                onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
                                                onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        저장된 전술(스쿼드) 정보가 없습니다.
                                    </div>
                                )
                            ) : (
                                // 2. 내 포메이션 목록 렌더링
                                savedFormations.length > 0 ? (
                                    savedFormations.map((form) => (
                                        <div 
                                            key={form.id}
                                            onClick={() => handleLoadFormationOnly(form)}
                                            style={{
                                                padding: '1rem',
                                                background: 'rgba(100, 116, 139, 0.04)',
                                                borderRadius: '14px',
                                                border: '1px solid var(--border-color)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                                            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                        >
                                            <div>
                                                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                                    {form.title}
                                                </h3>
                                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                    기반 프리셋: {form.formation} │ 좌표 노드: {form.positions?.length || 11}개
                                                </span>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDeleteFormationOnly(form.id, e)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-muted)',
                                                    padding: '4px'
                                                }}
                                                onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
                                                onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        저장된 포메이션 대형(좌표) 정보가 없습니다.
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                </div>

            </div>

            {/* 3. 선수 검색 및 모달창 (Zukan 대도감 검색 기능 기반) */}
            {isSearchModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    padding: '1.5rem'
                }}
                    onClick={() => setIsSearchModalOpen(false)}
                >
                    <div className="glass-card" style={{
                        width: '100%',
                        maxWidth: '520px',
                        background: 'var(--bg-surface-pure)',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2rem',
                        position: 'relative'
                    }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsSearchModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-muted)'
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>선수 영입 및 배치</h2>

                        {/* 모달 검색바 */}
                        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                            <input 
                                type="text"
                                className="input-field"
                                placeholder="선수명, 별칭을 검색하여 포지션에 배치..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setLimit(50); }}
                                style={{ paddingLeft: '2.8rem' }}
                                autoFocus
                            />
                        </div>

                        {/* 필터링 선수 목록 스크롤러 */}
                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {searchedCharacters.length > 0 ? (
                                <>
                                    {searchedCharacters.map((char) => (
                                        <div 
                                            key={char.id}
                                            onClick={() => handleSelectPlayer(char)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.85rem',
                                                padding: '0.65rem 0.85rem',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                background: 'rgba(100, 116, 139, 0.04)',
                                                border: '1px solid transparent',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={e => {
                                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                                e.currentTarget.style.background = 'var(--bg-surface-pure)';
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.borderColor = 'transparent';
                                                e.currentTarget.style.background = 'rgba(100, 116, 139, 0.04)';
                                            }}
                                        >
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {char.image ? (
                                                    <img 
                                                        src={char.image} 
                                                        alt={char.name} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'block';
                                                        }}
                                                    />
                                                ) : null}
                                                <span style={{ display: char.image ? 'none' : 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>?</span>
                                                <span style={{ display: 'none', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>?</span>
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{char.name}</h4>
                                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{char.team || '소속 팀 없음'}</span>
                                            </div>

                                            <span className="position-badge" style={{ fontSize: '0.65rem', padding: '0.2rem 0.45rem' }}>
                                                {char.position}
                                            </span>
                                            <span className={`element-badge ${char.element === '화' ? 'element-fire' : char.element === '풍' ? 'element-wind' : char.element === '림' ? 'element-wood' : char.element === '산' ? 'element-mountain' : 'element-none'}`} style={{ fontSize: '0.7rem' }}>
                                                {getElementIcon(char.element)} {char.element || '무'}
                                            </span>
                                        </div>
                                    ))}
                                    
                                    {/* 대규모 선수 리스트 무한 더보기 페이징 처리 */}
                                    {filteredList.length > searchedCharacters.length && (
                                        <div style={{ textAlign: 'center', marginTop: '1rem', paddingBottom: '0.5rem' }}>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setLimit(prev => prev + 100)}
                                                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', fontSize: '0.88rem' }}
                                            >
                                                선수 더 보기 ({searchedCharacters.length} / {filteredList.length})
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    선수 정보가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
