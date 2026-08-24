import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import charactersData from '../data/characters.json';
import { Search, Save, Trash2, FolderOpen, RefreshCw, X, Award, Flame, Wind, TreePine, Mountain, Move, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

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
    const [searchParams] = useSearchParams();
    const loadId = searchParams.get('load');

    // 토스트 알림창 상태 ({ show, message, type })
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    // 커스텀 확인 모달창 상태 ({ show, message, onConfirm })
    const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

    // 토스트 노출 헬퍼 함수 (alert 대체)
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // 토스트 3초 후 자동 페이드아웃 타이머
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const [selectedFormation, setSelectedFormation] = useState('4-4-2');
    const [squad, setSquad] = useState({});                               // 포지션 ID별 필드 선수 스토리지
    const [bench, setBench] = useState({});                               // 벤치 후보 선수 스토리지 (0~6 슬롯)
    const [coach, setCoach] = useState(null);                             // 감독 정보 스토리지
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
    const [editingTacticsId, setEditingTacticsId] = useState(null);       // 현재 수정 중인 전술 ID
    const [editingFormationId, setEditingFormationId] = useState(null);   // 현재 수정 중인 포메이션 ID
    const editingTacticsIdRef = useRef(null);                             // 비동기 타이머 클로저 이슈 방지용 실시간 ref
    const editingFormationIdRef = useRef(null);                           // 비동기 타이머 클로저 이슈 방지용 실시간 ref

    // 수정 중인 ID를 State와 Ref에 0ms로 즉각 동기화하는 헬퍼 함수
    const updateEditingTacticsId = (id) => {
        editingTacticsIdRef.current = id;
        setEditingTacticsId(id);
    };

    const updateEditingFormationId = (id) => {
        editingFormationIdRef.current = id;
        setEditingFormationId(id);
    };

    const [archiveTab, setArchiveTab] = useState('tactics');             // 아카이브 탭 전환 상태 ('tactics' / 'formations')
    const [isSaving, setIsSaving] = useState(false);
    const [isFetchingList, setIsFetchingList] = useState(false);

    // ⚡ 실시간 자동 수정 (Auto-Save) 관련 상태
    const [isAutoSave, setIsAutoSave] = useState(true);                  // 자동 수정 활성화 여부 (기본 ON)
    const [autoSaveStatus, setAutoSaveStatus] = useState('idle');        // 'idle' | 'saving' | 'saved'
    const isInitialMount = useRef(true);                                 // 첫 로드 시 자동 저장 방지용 ref
    const isDirtyRef = useRef(false);                                    // 사용자가 실제로 변경을 가했을 때만 자동 수정 트리거
    const autoSaveTimerRef = useRef(null);                               // 자동 수정 디바운스 타이머 ref
    const isSwitchingTacticsRef = useRef(false);                         // 전술 로드/전환 중 자동 저장 간섭 방지 락 ref
    const hasLoadedFromUrlRef = useRef(false);                           // URL loadId 1회만 로드하는 ref

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

    // URL 쿼리 파라미터로 전달된 loadId가 있으면 최초 1회만 자동으로 해당 전술 탑재
    useEffect(() => {
        if (loadId && savedTactics.length > 0 && !hasLoadedFromUrlRef.current) {
            const target = savedTactics.find(t => t.id === loadId);
            if (target) {
                hasLoadedFromUrlRef.current = true;
                handleLoadTactics(target);
            }
        }
    }, [loadId, savedTactics]);

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
        isDirtyRef.current = true; // 사용자의 직접 조작 감지
        setSelectedFormation(formName);
        // 새로운 포메이션의 디폴트 위치값 세팅
        if (FORMATIONS[formName]) {
            setPositions(FORMATIONS[formName]);
        }
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
                isDirtyRef.current = true; // 사용자의 직접 조작 감지
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
                isDirtyRef.current = true; // 사용자의 직접 조작 감지
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

    // 선수/감독 모달창 바인딩 선택
    const handleSelectPlayer = (player) => {
        isDirtyRef.current = true; // 사용자의 직접 조작 감지
        if (activeSlotId === 'coach') {
            // 1. 감독 슬롯 선택
            setCoach({
                id: player.id,
                name: player.name,
                image: player.image,
                position: player.position || '감독',
                element: player.element,
                team: player.team
            });
        } else if (typeof activeSlotId === 'string' && activeSlotId.startsWith('bench_')) {
            // 2. 벤치(후보) 슬롯 선택
            const benchIndex = activeSlotId.replace('bench_', '');
            setBench(prev => ({
                ...prev,
                [benchIndex]: {
                    id: player.id,
                    name: player.name,
                    image: player.image,
                    position: player.position,
                    element: player.element
                }
            }));
        } else {
            // 3. 필드 주전 선수 슬롯 선택
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
        }
        setIsSearchModalOpen(false);
    };

    // 배치된 선수/감독 지우기
    const handleClearSlot = (slotId, e) => {
        e.stopPropagation(); // 카드 자체의 클릭 이벤트 버블링 차단
        isDirtyRef.current = true; // 사용자의 직접 조작 감지
        if (slotId === 'coach') {
            // 감독 비우기
            setCoach(null);
        } else if (typeof slotId === 'string' && slotId.startsWith('bench_')) {
            // 벤치 선수 비우기
            const benchIndex = slotId.replace('bench_', '');
            setBench(prev => {
                const next = { ...prev };
                delete next[benchIndex];
                return next;
            });
        } else {
            // 필드 선수 비우기
            setSquad(prev => {
                const next = { ...prev };
                delete next[slotId];
                return next;
            });
        }
    };

    // ⚡ 실시간 자동 수정(Auto-Save) 훅:
    // 사용자가 불러와서 현재 수정 중인 항목(editingTacticsIdRef.current 또는 editingFormationIdRef.current)이 있을 때만
    // 사용자의 직접 조작(isDirtyRef.current === true)을 500ms 디바운스로 로컬스토리지에 안전하게 자동 덮어씁니다.
    // 전술 전환 락(isSwitchingTacticsRef.current === true) 중에는 이전 전술 데이터 간섭 방지를 위해 절대 동작하지 않습니다.
    useEffect(() => {
        // 첫 렌더링 시에는 자동 수정을 건너뜁니다.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // 전술 전환 중이거나, 사용자가 직접 변경을 가하지 않은 단순 로드 상태거나, 자동 저장이 꺼져 있으면 즉시 중단
        if (isSwitchingTacticsRef.current || !isDirtyRef.current || !isAutoSave) return;

        // 수정 중인 ID가 전혀 없는 신규 작성 상태면 기존 전술을 멋대로 덮어쓰지 않도록 차단
        if (!editingTacticsIdRef.current && !editingFormationIdRef.current) return;

        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        autoSaveTimerRef.current = setTimeout(() => {
            // 실행 직전 한 번 더 락 및 isDirty 확인
            if (isSwitchingTacticsRef.current || !isDirtyRef.current) return;

            const activeEditingId = editingTacticsIdRef.current;
            const activeEditingFormId = editingFormationIdRef.current;
            const title = tacticsTitle.trim();

            try {
                if (activeEditingId) {
                    // [전술 팩 자동 수정]
                    const localData = localStorage.getItem('victory_road_tactics');
                    const currentList = localData ? JSON.parse(localData) : [];

                    const existingIndex = currentList.findIndex(item => item.id === activeEditingId);

                    if (existingIndex !== -1) {
                        setAutoSaveStatus('saving');
                        const targetItem = currentList[existingIndex];
                        const updatedItem = {
                            ...targetItem,
                            title: title || targetItem.title,
                            formation: selectedFormation,
                            squad: squad,
                            bench: bench,
                            coach: coach,
                            positions: positions,
                            updatedAt: new Date().toISOString()
                        };

                        const nextList = [...currentList];
                        nextList[existingIndex] = updatedItem;
                        localStorage.setItem('victory_road_tactics', JSON.stringify(nextList));

                        isDirtyRef.current = false; // 자동 저장 완료로 더티 플래그 안전하게 초기화
                        setAutoSaveStatus('saved');
                        fetchSavedTacticsList();

                        // 2.5초 후 대기 상태로 원복
                        setTimeout(() => {
                            setAutoSaveStatus('idle');
                        }, 2500);
                    }
                } else if (activeEditingFormId) {
                    // [포메이션 팩 자동 수정]
                    const localData = localStorage.getItem('victory_road_formations');
                    const currentList = localData ? JSON.parse(localData) : [];

                    const existingIndex = currentList.findIndex(item => item.id === activeEditingFormId);

                    if (existingIndex !== -1) {
                        setAutoSaveStatus('saving');
                        const targetItem = currentList[existingIndex];
                        const updatedItem = {
                            ...targetItem,
                            title: title || targetItem.title,
                            formation: selectedFormation,
                            positions: positions.map(p => ({ id: p.id, role: p.role, top: p.top, left: p.left })),
                            updatedAt: new Date().toISOString()
                        };

                        const nextList = [...currentList];
                        nextList[existingIndex] = updatedItem;
                        localStorage.setItem('victory_road_formations', JSON.stringify(nextList));

                        isDirtyRef.current = false;
                        setAutoSaveStatus('saved');
                        fetchSavedFormationsList();

                        setTimeout(() => {
                            setAutoSaveStatus('idle');
                        }, 2500);
                    }
                }
            } catch (error) {
                console.error("자동 수정 중 오류:", error);
            }
        }, 500); // 500ms 디바운스

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [squad, bench, coach, positions, selectedFormation, tacticsTitle, isAutoSave, editingTacticsId, editingFormationId]);

    // ✨ 스마트 포메이션 자동 정렬 / 중앙 보정 기능
    const handleAutoAlignPositions = () => {
        // 전술 전환 락이 걸려있으면 자동 정렬 안전 방어
        if (isSwitchingTacticsRef.current) return;

        // 수정 중인 전술이나 포메이션이 있는 경우에만 자동 저장 큐에 플래그 설정
        if (editingTacticsIdRef.current || editingFormationIdRef.current) {
            isDirtyRef.current = true;
        }
        setPositions(prevPositions => {
            return prevPositions.map(pos => {
                // 중앙(X=50) 근처의 노드는 50%로 깔끔하게 중앙 흡착
                if (Math.abs(pos.left - 50) < 4) {
                    return { ...pos, left: 50 };
                }
                return pos;
            });
        });
        showToast("포메이션 대형이 스마트 자동 정렬되었습니다.", "info");
    };

    // 새 전술 작성 모드로 리셋하는 함수
    const handleNewTactics = () => {
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = null;
        }
        isDirtyRef.current = false; // 리셋 시 더티 플래그 해제
        isSwitchingTacticsRef.current = true; // 전환 락 활성화
        setAutoSaveStatus('idle');
        updateEditingTacticsId(null);
        updateEditingFormationId(null);
        setTacticsTitle('');
        setSquad({});
        setBench({});
        setCoach(null);
        setPositions(FORMATIONS[selectedFormation] || FORMATIONS['4-4-2']);
        showToast("새로운 전술 작성을 시작합니다.", "info");

        // React 상태 바인딩 완료 후 락 해제
        setTimeout(() => {
            isDirtyRef.current = false;
            isSwitchingTacticsRef.current = false;
        }, 150);
    };

    // 현재의 전술판 배치 및 좌표 셋을 localStorage에 저장 또는 기존 전술 수정 (0ms 지연)
    const handleSaveTactics = () => {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        isDirtyRef.current = false; // 수동 저장 시 더티 플래그 해제
        const title = tacticsTitle.trim();
        if (!title) {
            showToast("전술 이름을 입력해 주세요.", "error");
            return;
        }

        setIsSaving(true);
        try {
            const localData = localStorage.getItem('victory_road_tactics');
            const currentList = localData ? JSON.parse(localData) : [];

            // 1. 현재 불러와서 수정 중인 전술 ID가 있거나, 또는 입력한 이름과 똑같은 기존 전술이 있는지 확인합니다.
            const existingIndex = currentList.findIndex(item => 
                (editingTacticsIdRef.current && item.id === editingTacticsIdRef.current) || 
                item.title.trim().toLowerCase() === title.toLowerCase()
            );

            let nextList;
            let isUpdate = false;

            if (existingIndex !== -1) {
                // [기존 전술 수정 모드]: 새 전술을 추가하지 않고, 기존 전술 항목의 내용을 최신 상태로 덮어씁니다.
                const targetItem = currentList[existingIndex];
                const updatedItem = {
                    ...targetItem,
                    title: title, // 이름 변경도 반영
                    formation: selectedFormation,
                    squad: squad,
                    bench: bench,
                    coach: coach,
                    positions: positions,
                    updatedAt: new Date().toISOString() // 수정 시각 갱신
                };

                nextList = [...currentList];
                nextList[existingIndex] = updatedItem;
                updateEditingTacticsId(targetItem.id); // 수정 모드 유지 (ref 동기화)
                isUpdate = true;
            } else {
                // [새 전술 신규 저장 모드]: 기존에 없는 이름이므로 새로운 전술 아이템으로 등록합니다.
                const newTacticsItem = {
                    id: Date.now().toString(),
                    title: title,
                    formation: selectedFormation,
                    squad: squad,
                    bench: bench,
                    coach: coach,
                    positions: positions,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                nextList = [newTacticsItem, ...currentList];
                updateEditingTacticsId(newTacticsItem.id); // 저장 후에도 수정 모드로 전환 (ref 동기화)
                isUpdate = false;
            }

            // 로컬스토리지에 최신 목록 영속 저장
            localStorage.setItem('victory_road_tactics', JSON.stringify(nextList));

            if (isUpdate) {
                showToast(`기존 전술 "${title}"이(가) 성공적으로 수정되었습니다!`, "success");
            } else {
                showToast(`새로운 전술 "${title}"이(가) 성공적으로 저장되었습니다!`, "success");
            }

            fetchSavedTacticsList();
        } catch (error) {
            console.error("전술 저장 에러:", error);
            showToast("전술 저장 중 오류가 발생했습니다.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // 저장되었던 전술 라이브러리 상태 가져오기 (수정 모드로 전환)
    const handleLoadTactics = (tactics) => {
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = null;
        }
        isDirtyRef.current = false; // 전술 로드 시에는 자동 수정을 절대 트리거하지 않도록 차단!
        isSwitchingTacticsRef.current = true; // 전환 락 활성화
        setAutoSaveStatus('idle');
        
        updateEditingTacticsId(tactics.id);       // 현재 수정 중인 전술 ID 등록 (ref 동기화)
        updateEditingFormationId(null);           // 포메이션 수정 모드는 해제 (ref 동기화)
        setSelectedFormation(tactics.formation);
        setSquad(tactics.squad || {});
        setBench(tactics.bench || {});
        setCoach(tactics.coach || null);
        // 개별 좌표가 저장되어 있으면 로드하고, 없으면 포메이션 기본값 사용
        setPositions(tactics.positions || FORMATIONS[tactics.formation]);
        setTacticsTitle(tactics.title);
        showToast(`"${tactics.title}" 전술을 불러왔습니다. (수정 모드)`, "success");

        // React 상태 바인딩 완료 후 락 해제
        setTimeout(() => {
            isDirtyRef.current = false;
            isSwitchingTacticsRef.current = false;
        }, 150);
    };

    // 저장 전술 데이터 삭제 (0ms 지연)
    const handleDeleteTactics = (tacticsId, e) => {
        e.stopPropagation();
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        isDirtyRef.current = false;
        setConfirmModal({
            show: true,
            message: "이 전술 배치를 로컬 저장소에서 영구 삭제하시겠습니까?",
            onConfirm: () => {
                try {
                    const localData = localStorage.getItem('victory_road_tactics');
                    const currentList = localData ? JSON.parse(localData) : [];
                    const nextList = currentList.filter(item => item.id !== tacticsId);
                    localStorage.setItem('victory_road_tactics', JSON.stringify(nextList));
                    
                    // 만약 현재 수정 중이던 전술이 삭제되었다면 수정 모드 해제
                    if (editingTacticsIdRef.current === tacticsId) {
                        updateEditingTacticsId(null);
                    }
                    
                    fetchSavedTacticsList();
                    showToast("전술 배치가 삭제되었습니다.", "success");
                } catch (error) {
                    console.error("전술 삭제 에러:", error);
                    showToast("삭제하는 과정에서 에러가 발생했습니다.", "error");
                }
            }
        });
    };

    // 신규: 포메이션 대형(좌표)만 단독 저장 또는 기존 포메이션 대형 수정 (0ms 지연)
    const handleSaveFormationOnly = () => {
        const title = tacticsTitle.trim();
        if (!title) {
            showToast("저장할 포메이션 이름을 입력해 주세요.", "error");
            return;
        }

        setIsSaving(true);
        try {
            const localData = localStorage.getItem('victory_road_formations');
            const currentList = localData ? JSON.parse(localData) : [];

            // 기존 동일 이름 또는 수정 중인 포메이션 검사
            const existingIndex = currentList.findIndex(item => 
                (editingFormationIdRef.current && item.id === editingFormationIdRef.current) || 
                item.title.trim().toLowerCase() === title.toLowerCase()
            );

            let nextList;
            let isUpdate = false;

            if (existingIndex !== -1) {
                // 기존 포메이션 대형 수정
                const targetItem = currentList[existingIndex];
                const updatedItem = {
                    ...targetItem,
                    title: title,
                    formation: selectedFormation,
                    positions: positions.map(p => ({ id: p.id, role: p.role, top: p.top, left: p.left })),
                    updatedAt: new Date().toISOString()
                };

                nextList = [...currentList];
                nextList[existingIndex] = updatedItem;
                updateEditingFormationId(targetItem.id); // ref 동기화
                isUpdate = true;
            } else {
                // 새로운 포메이션 대형 추가
                const newFormItem = {
                    id: Date.now().toString(),
                    title: title,
                    formation: selectedFormation,
                    positions: positions.map(p => ({ id: p.id, role: p.role, top: p.top, left: p.left })),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                nextList = [newFormItem, ...currentList];
                updateEditingFormationId(newFormItem.id); // ref 동기화
                isUpdate = false;
            }

            localStorage.setItem('victory_road_formations', JSON.stringify(nextList));

            if (isUpdate) {
                showToast(`기존 포메이션 "${title}" 대형이 수정되었습니다!`, "success");
            } else {
                showToast(`새로운 포메이션 "${title}" 대형이 저장되었습니다!`, "success");
            }

            fetchSavedFormationsList();
        } catch (error) {
            console.error("포메이션 저장 에러:", error);
            showToast("포메이션 저장 중 오류가 발생했습니다.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // 신규: 포메이션 대형(좌표)만 로드 (선수 정보 squad는 그대로 보존, 수정 모드 전환)
    const handleLoadFormationOnly = (formItem) => {
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = null;
        }
        isDirtyRef.current = false; // 로드 시에는 자동 수정 트리거 방지
        isSwitchingTacticsRef.current = true; // 전환 락 활성화
        setAutoSaveStatus('idle');
        updateEditingTacticsId(null);         // 전술 수정 ID 확실히 해제 (ref 동기화)
        updateEditingFormationId(formItem.id); // 포메이션 수정 모드 등록 (ref 동기화)
        setPositions(formItem.positions || FORMATIONS['4-4-2']);
        setSelectedFormation('커스텀');
        setTacticsTitle(formItem.title);
        showToast(`"${formItem.title}" 포메이션 대형을 불러왔습니다. (선수 배치 유지)`, "success");

        setTimeout(() => {
            isDirtyRef.current = false;
            isSwitchingTacticsRef.current = false;
        }, 150);
    };

    // 신규: 저장된 포메이션 단독 데이터 삭제 (0ms 지연)
    const handleDeleteFormationOnly = (formId, e) => {
        e.stopPropagation();
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        isDirtyRef.current = false;
        setConfirmModal({
            show: true,
            message: "이 포메이션 대형을 로컬 저장소에서 삭제하시겠습니까?",
            onConfirm: () => {
                try {
                    const localData = localStorage.getItem('victory_road_formations');
                    const currentList = localData ? JSON.parse(localData) : [];
                    const nextList = currentList.filter(item => item.id !== formId);
                    localStorage.setItem('victory_road_formations', JSON.stringify(nextList));
                    
                    if (editingFormationIdRef.current === formId) {
                        updateEditingFormationId(null);
                    }
                    
                    fetchSavedFormationsList();
                    showToast("포메이션 대형이 삭제되었습니다.", "success");
                } catch (error) {
                    console.error("포메이션 삭제 에러:", error);
                    showToast("삭제하는 과정에서 에러가 발생했습니다.", "error");
                }
            }
        });
    };

    // 신규: 배치된 모든 선수/벤치/감독 전체 비우기 (에디터 편의 기능)
    const handleClearAllSquad = () => {
        if (Object.keys(squad).length === 0 && Object.keys(bench).length === 0 && !coach) return;
        setConfirmModal({
            show: true,
            message: "현재 배치된 모든 주전, 벤치 후보 및 감독을 비우시겠습니까?",
            onConfirm: () => {
                isDirtyRef.current = true; // 사용자의 직접 조작 감지
                setSquad({});
                setBench({});
                setCoach(null);
                showToast("전술판 스쿼드와 벤치, 감독이 완전히 비워졌습니다.", "info");
            }
        });
    };

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.25rem' }}>
            
            {/* 2. 에디터 레이아웃 구조 적용 */}
            <div className="editor-layout">
                
                {/* 2.1 메인 조작 칼럼 (상단 툴바 + 축구장) */}
                <div className="editor-main-section">
                    
                    {/* 피그마/전문 에디터 스타일의 애플 리퀴드 툴바 */}
                    <div className="editor-toolbar">
                        
                        {/* 툴바 섹션 1: 이름 입력, 수정 상태 뱃지 및 저장/신규 버튼 */}
                        <div className="editor-toolbar-section" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="text"
                                    className="editor-input"
                                    placeholder="전술 / 포메이션명..."
                                    value={tacticsTitle}
                                    onChange={(e) => {
                                        setTacticsTitle(e.target.value);
                                        isDirtyRef.current = true; // 사용자의 텍스트 입력 조작 감지
                                    }}
                                    title="저장할 타이틀 이름 입력"
                                    style={{ paddingRight: (editingTacticsId || editingFormationId) ? '2.2rem' : '0.8rem' }}
                                />
                                {(editingTacticsId || editingFormationId) && (
                                    <button
                                        onClick={handleNewTactics}
                                        style={{
                                            position: 'absolute',
                                            right: '6px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#EF4444',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            fontSize: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontWeight: 800
                                        }}
                                        title="수정 모드 취소 (새 전술로 시작)"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* 저장 버튼: 수정 중이거나 같은 이름이 있으면 [전술 수정], 신규면 [전체 저장] */}
                            <button 
                                className="btn btn-primary"
                                style={{ 
                                    padding: '0.45rem 0.85rem', 
                                    fontSize: '0.75rem', 
                                    borderRadius: '10px',
                                    background: (editingTacticsId || savedTactics.some(t => t.title.trim().toLowerCase() === tacticsTitle.trim().toLowerCase() && tacticsTitle.trim())) 
                                        ? 'linear-gradient(135deg, #10B981, #059669)' 
                                        : 'var(--primary-color)'
                                }}
                                onClick={handleSaveTactics}
                                disabled={isSaving}
                                title={
                                    (editingTacticsId || savedTactics.some(t => t.title.trim().toLowerCase() === tacticsTitle.trim().toLowerCase() && tacticsTitle.trim()))
                                        ? `기존 전술 "${tacticsTitle.trim()}"을(를) 수정하여 저장(덮어쓰기)합니다`
                                        : "새로운 전술 배치를 로컬에 저장합니다"
                                }
                            >
                                <Save size={13} /> 
                                {(editingTacticsId || savedTactics.some(t => t.title.trim().toLowerCase() === tacticsTitle.trim().toLowerCase() && tacticsTitle.trim())) 
                                    ? '전술 수정' 
                                    : '전체 저장'}
                            </button>

                            <button 
                                className="btn btn-secondary"
                                style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', borderRadius: '10px', background: 'transparent' }}
                                onClick={handleSaveFormationOnly}
                                disabled={isSaving}
                                title="배치된 선수는 빼고 오직 포메이션 대형(좌표)만 로컬에 저장/수정합니다"
                            >
                                {(editingFormationId || savedFormations.some(f => f.title.trim().toLowerCase() === tacticsTitle.trim().toLowerCase() && tacticsTitle.trim())) 
                                    ? '대형 수정' 
                                    : '대형 저장'}
                            </button>
                        </div>

                        {/* 툴바 섹션 2: 포메이션 프리셋 선택 드롭다운 */}
                        <div className="editor-toolbar-section" style={{ borderLeft: '1.5px solid var(--border-color)', borderRight: '1.5px solid var(--border-color)', padding: '0 0.8rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>포메이션:</span>
                            <select 
                                value={selectedFormation} 
                                onChange={(e) => handleFormationChange(e.target.value)}
                                style={{
                                    background: 'var(--bg-surface-pure)',
                                    border: '1.5px solid var(--border-color)',
                                    borderRadius: '10px',
                                    padding: '0.35rem 0.65rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    color: 'var(--text-main)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="4-4-2">4-4-2</option>
                                <option value="4-3-3">4-3-3</option>
                                <option value="3-5-2">3-5-2</option>
                                <option value="4-2-3-1">4-2-3-1</option>
                                <option value="3-4-3">3-4-3</option>
                                <option value="5-3-2">5-3-2</option>
                                <option value="4-1-4-1">4-1-4-1</option>
                                <option value="5-4-1">5-4-1</option>
                                {selectedFormation === '커스텀' && <option value="커스텀">커스텀 대형</option>}
                            </select>
                        </div>

                        {/* 툴바 섹션 3: 조작 제어 스위치, 자동 수정, 자동 정렬 & 리셋 */}
                        <div className="editor-toolbar-section">
                            <button
                                className={`btn ${isDragMode ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setIsDragMode(!isDragMode)}
                                style={{
                                    padding: '0.45rem 0.85rem',
                                    fontSize: '0.75rem',
                                    borderRadius: '10px',
                                    borderWidth: '1px',
                                    boxShadow: isDragMode ? '0 0 8px var(--primary-glow)' : 'none',
                                    background: isDragMode ? 'var(--primary-color)' : 'transparent'
                                }}
                                title={isDragMode ? '카드를 드래그하여 옮길 수 있습니다' : '카드를 눌러 선수를 선택합니다'}
                            >
                                {isDragMode ? '이동 모드' : '배치 모드'}
                            </button>

                            {/* ⚡ 자동 수정(Auto-Save) 토글 버튼 & 실시간 상태 표시기 */}
                            <button
                                className={`btn ${isAutoSave ? 'btn-primary' : 'btn-secondary'}`}
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    fontSize: '0.72rem',
                                    borderRadius: '10px',
                                    borderWidth: '1.5px',
                                    background: isAutoSave ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                                    borderColor: isAutoSave ? '#10B981' : 'var(--border-color)',
                                    color: isAutoSave ? '#10B981' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setIsAutoSave(!isAutoSave);
                                    showToast(isAutoSave ? "자동 수정 기능이 꺼졌습니다." : "실시간 자동 수정 기능이 켜졌습니다.", "info");
                                }}
                                title="전술 편집 시 변경사항을 실시간으로 자동 수정/저장합니다"
                            >
                                <span style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: isAutoSave ? (autoSaveStatus === 'saving' ? '#F59E0B' : '#10B981') : 'var(--text-muted)',
                                    boxShadow: isAutoSave ? (autoSaveStatus === 'saving' ? '0 0 8px #F59E0B' : '0 0 8px #10B981') : 'none'
                                }}></span>
                                {autoSaveStatus === 'saving' ? '자동 수정 중...' : (autoSaveStatus === 'saved' ? '자동 수정됨' : (isAutoSave ? '자동 수정 ON' : '자동 수정 OFF'))}
                            </button>

                            {/* ✨ 스마트 대형 자동 정렬 버튼 */}
                            <button
                                className="btn btn-secondary"
                                style={{ padding: '0.45rem 0.65rem', fontSize: '0.72rem', borderRadius: '10px', background: 'transparent' }}
                                onClick={handleAutoAlignPositions}
                                title="포메이션 노드들을 중앙선(50%)에 맞추어 자동 정렬합니다"
                            >
                                ✨ 자동 정렬
                            </button>

                            <button 
                                onClick={handleClearAllSquad}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px',
                                    padding: '0.45rem',
                                    cursor: 'pointer',
                                    color: '#EF4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                title="전술판 선수 모두 지우기"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                    </div>

                    {/* 축구장 및 하단 벤치 래퍼 */}
                    <div className="tactics-field-workspace" style={{ flexDirection: 'column' }}>
                        
                        {/* 2.1.2 축구장 보드 (미니멀 평면 전술판 스타일) */}
                        <div ref={fieldRef} className="soccer-field-container" style={{ outline: 'none' }}>
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

                            {/* 포지션 노드 오버레이 */}
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
                                            touchAction: 'none',
                                            transition: isCurrentlyDragging ? 'none' : 'all var(--transition-speed) ease',
                                            zIndex: isCurrentlyDragging ? 1000 : (activePositionSlotId === slot.id ? 1050 : 10)
                                        }}
                                        onMouseDown={(e) => handleMouseDown(slot.id, e)}
                                        onTouchStart={(e) => handleTouchStart(slot.id, e)}
                                    >
                                        {player ? (
                                            // 선수 장착 카드
                                            <div 
                                                className={`tactics-card ${isCurrentlyDragging ? 'is-dragging' : ''}`}
                                                onClick={() => handleSlotClick(slot.id)}
                                                style={{ cursor: isDragMode ? 'move' : 'pointer' }}
                                            >
                                                {/* 포지션 역할 뱃지 */}
                                                <span 
                                                    className="tactics-card-badge-pos"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                                                {/* 속성 아이콘 */}
                                                {player.element && (
                                                    <span className="tactics-card-badge-elem">
                                                        {getElementIcon(player.element)}
                                                    </span>
                                                )}

                                                {/* 선수 프로필 아바타 이미지 */}
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

                                                {/* 선수 이름 및 정보 */}
                                                <div className="tactics-card-info">
                                                    {player.name}
                                                </div>

                                                {/* 슬롯 비우기 버튼 */}
                                                <button
                                                    onClick={(e) => handleClearSlot(slot.id, e)}
                                                    className="tactics-card-clear-btn"
                                                    title="배치된 선수 비우기"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            // 미배치 빈 슬롯 카드
                                            <div 
                                                className={`tactics-card-empty ${isCurrentlyDragging ? 'is-dragging' : ''}`}
                                                onClick={() => handleSlotClick(slot.id)}
                                                style={{ cursor: isDragMode ? 'move' : 'pointer' }}
                                                title={isDragMode ? '드래그하여 위치 변경' : '클릭하여 선수 배치'}
                                            >
                                                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>+</span>
                                                <span 
                                                    className="tactics-card-empty-role"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isDragMode) return;
                                                        setActivePositionSlotId(slot.id);
                                                    }}
                                                    title="클릭하여 포지션 역할 변경"
                                                >
                                                    {slot.role}
                                                </span>
                                            </div>
                                        )}

                                        {/* 드래그 가능 모드 힌트 인디케이터 아이콘 */}
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
                                            pointerEvents: 'none'
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
                                                    ...(slot.left < 30 ? { left: '10%' } : slot.left > 70 ? { right: '10%' } : { left: '50%', transform: 'translateX(-50%)' }),
                                                    ...(slot.top > 70 ? { bottom: '110%' } : { top: '110%' })
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                onMouseDown={(e) => e.stopPropagation()}
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
                                                                                isDirtyRef.current = true; // 사용자의 직접 조작 감지
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

                        {/* 2.1.2 하단 감독 & 벤치(후보 7인) 섹션 (넉넉하고 큼직한 가로 랙) */}
                        <div className="glass-card tactics-sub-bench-section" style={{ width: '100%', maxWidth: 'var(--field-max-width)', marginTop: '0.6rem' }}>
                            <div className="tactics-bench-wrapper">
                                
                                {/* 감독(Coach) 슬롯 영역 */}
                                <div className="tactics-coach-slot-container">
                                    <span className="tactics-bench-group-title">👔 감독 (Coach)</span>
                                    {coach ? (
                                        <div 
                                            className="tactics-card tactics-bench-card tactics-coach-card"
                                            onClick={() => handleSlotClick('coach')}
                                        >
                                            <span className="tactics-card-badge-pos" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: '1.5px solid #fff', fontSize: '0.62rem', padding: '1px 5px' }}>
                                                👑 감독
                                            </span>
                                            {coach.element && (
                                                <span className="tactics-card-badge-elem">
                                                    {getElementIcon(coach.element)}
                                                </span>
                                            )}
                                            <div className="tactics-card-avatar">
                                                {coach.image ? (
                                                    <img 
                                                        src={coach.image} 
                                                        alt={coach.name}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div style={{
                                                    display: coach.image ? 'none' : 'flex',
                                                    width: '100%', height: '100%',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.4rem', fontWeight: 800,
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    {coach.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="tactics-card-info">
                                                {coach.name}
                                            </div>
                                            <button
                                                onClick={(e) => handleClearSlot('coach', e)}
                                                className="tactics-card-clear-btn"
                                                title="감독 해임/비우기"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div 
                                            className="tactics-card-empty tactics-bench-card-empty"
                                            onClick={() => handleSlotClick('coach')}
                                            title="클릭하여 감독을 선임합니다"
                                        >
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>+</span>
                                            <span className="tactics-card-empty-role" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                                                감독 선임
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* 세로 구분선 */}
                                <div className="tactics-bench-divider"></div>

                                {/* 벤치 후보 선수들 (SUB 1 ~ 7 가로 나열) */}
                                <div className="tactics-sub-slots-container">
                                    <span className="tactics-bench-group-title">💺 후보 (7인)</span>
                                    <div className="tactics-sub-slots-grid custom-scrollbar">
                                        {[0, 1, 2, 3, 4, 5, 6].map((subIdx) => {
                                            const subSlotKey = `bench_${subIdx}`;
                                            const subPlayer = bench[subIdx];

                                            return subPlayer ? (
                                                <div 
                                                    key={subIdx}
                                                    className="tactics-card tactics-bench-card"
                                                    onClick={() => handleSlotClick(subSlotKey)}
                                                >
                                                    <span className="tactics-card-badge-pos" style={{ background: '#64748B', border: '1.5px solid #fff' }}>
                                                        {subPlayer.position || `SUB ${subIdx + 1}`}
                                                    </span>
                                                    {subPlayer.element && (
                                                        <span className="tactics-card-badge-elem">
                                                            {getElementIcon(subPlayer.element)}
                                                        </span>
                                                    )}
                                                    <div className="tactics-card-avatar">
                                                        {subPlayer.image ? (
                                                            <img 
                                                                src={subPlayer.image} 
                                                                alt={subPlayer.name}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div style={{
                                                            display: subPlayer.image ? 'none' : 'flex',
                                                            width: '100%', height: '100%',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '1.4rem', fontWeight: 800,
                                                            color: 'var(--text-muted)'
                                                        }}>
                                                            {subPlayer.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="tactics-card-info">
                                                        {subPlayer.name}
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleClearSlot(subSlotKey, e)}
                                                        className="tactics-card-clear-btn"
                                                        title="후보 선수 비우기"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div 
                                                    key={subIdx}
                                                    className="tactics-card-empty tactics-bench-card-empty"
                                                    onClick={() => handleSlotClick(subSlotKey)}
                                                    title={`후보 ${subIdx + 1} 선수 등록`}
                                                >
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>+</span>
                                                    <span className="tactics-card-empty-role">
                                                        SUB {subIdx + 1}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* 2.2 우측 에디터 사이드바 (저장 목록 아카이브 고화질 뷰어 단독 정돈) */}
                <div className="editor-sidebar">
                    
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', minHeight: '520px' }}>
                        
                        {/* 탭 인터페이스 헤더 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(100, 116, 139, 0.08)', padding: '3px', borderRadius: '10px' }}>
                                <button
                                    className={`btn ${archiveTab === 'tactics' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setArchiveTab('tactics')}
                                    style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem', borderRadius: '8px', border: 'none' }}
                                >
                                    내 전술 팩
                                </button>
                                <button
                                    className={`btn ${archiveTab === 'formations' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setArchiveTab('formations')}
                                    style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem', borderRadius: '8px', border: 'none' }}
                                >
                                    포메이션 팩
                                </button>
                            </div>
                            <button 
                                onClick={() => {
                                    fetchSavedTacticsList();
                                    fetchSavedFormationsList();
                                }}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                title="로컬 라이브러리 새로고침"
                            >
                                <RefreshCw size={14} className={isFetchingList ? 'spin-animation' : ''} />
                            </button>
                        </div>

                        {/* 리스트 목록 뷰포트 (호버 시 그림자가 잘리지 않도록 4방향 여유 패딩 및 하단 여백 적용) */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', padding: '0.5rem 0.6rem 1.5rem 0.5rem' }} className="custom-scrollbar">
                            {archiveTab === 'tactics' ? (
                                savedTactics.length > 0 ? (
                                    savedTactics.map((tact) => {
                                        const isEditing = editingTacticsId === tact.id;
                                        return (
                                            <div 
                                                key={tact.id}
                                                className="tactic-item-card"
                                                onClick={() => handleLoadTactics(tact)}
                                                style={{
                                                    border: isEditing ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                                    background: isEditing ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface-pure)'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                                        <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                                            {tact.title}
                                                        </h3>
                                                        {isEditing && (
                                                            <span style={{ fontSize: '0.62rem', background: 'var(--primary-color)', color: '#fff', padding: '1px 5px', borderRadius: '6px', fontWeight: 800 }}>
                                                                수정 중
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                                        대형: {tact.formation} │ 주전: {Object.keys(tact.squad || {}).length}명 │ 후보: {Object.keys(tact.bench || {}).length}명
                                                        {tact.coach ? ` │ 감독: ${tact.coach.name}` : ''}
                                                        {tact.updatedAt && tact.updatedAt !== tact.createdAt && ' (수정됨)'}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={(e) => handleDeleteTactics(tact.id, e)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: 'var(--text-muted)',
                                                        padding: '4px',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
                                                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                                        저장된 로컬 전술이 없습니다.
                                    </div>
                                )
                            ) : (
                                savedFormations.length > 0 ? (
                                    savedFormations.map((form) => {
                                        const isEditing = editingFormationId === form.id;
                                        return (
                                            <div 
                                                key={form.id}
                                                className="tactic-item-card"
                                                onClick={() => handleLoadFormationOnly(form)}
                                                style={{
                                                    border: isEditing ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                                    background: isEditing ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface-pure)'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                                        <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                                            {form.title}
                                                        </h3>
                                                        {isEditing && (
                                                            <span style={{ fontSize: '0.62rem', background: 'var(--primary-color)', color: '#fff', padding: '1px 5px', borderRadius: '6px', fontWeight: 800 }}>
                                                                수정 중
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                                        기반: {form.formation} │ 좌표 노드: {form.positions?.length || 11}개
                                                        {form.updatedAt && form.updatedAt !== form.createdAt && ' (수정됨)'}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={(e) => handleDeleteFormationOnly(form.id, e)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: 'var(--text-muted)',
                                                        padding: '4px',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
                                                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                                        저장된 로컬 포메이션이 없습니다.
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

                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {activeSlotId === 'coach' ? (
                                <>👔 감독 선임 (코칭스태프)</>
                            ) : (typeof activeSlotId === 'string' && activeSlotId.startsWith('bench_')) ? (
                                <>💺 후보 선수 등록 (SUB {parseInt(activeSlotId.replace('bench_', '')) + 1})</>
                            ) : (
                                <>⚽ 주전 선수 영입 및 배치</>
                            )}
                        </h2>

                        {/* 모달 검색바 */}
                        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                            <input 
                                type="text"
                                className="input-field"
                                placeholder={
                                    activeSlotId === 'coach' 
                                        ? "감독 또는 캐릭터 이름을 검색하여 선임..." 
                                        : (typeof activeSlotId === 'string' && activeSlotId.startsWith('bench_'))
                                            ? "후보 선수 이름을 검색하여 벤치에 등록..."
                                            : "선수명, 별칭을 검색하여 포지션에 배치..."
                                }
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

            {/* 리퀴드 글래스 토스트 알림창 */}
            <div className={`glass-toast ${toast.show ? 'show' : ''}`}>
                {toast.type === 'success' && <CheckCircle size={16} color="var(--primary-color)" />}
                {toast.type === 'error' && <AlertCircle size={16} color="#EF4444" />}
                {toast.type === 'info' && <AlertTriangle size={16} color="var(--accent-color)" />}
                <span>{toast.message}</span>
            </div>

            {/* 리퀴드 글래스 확인/컨펌 모달창 */}
            {confirmModal.show && (
                <div className="glass-modal-overlay" onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}>
                    <div className="glass-modal" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '50%', 
                                background: 'rgba(245, 158, 11, 0.12)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                border: '1px solid rgba(245, 158, 11, 0.2)'
                            }}>
                                <AlertTriangle size={22} color="var(--accent-color)" />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.85rem' }}>확인이 필요합니다</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.8rem' }}>
                            {confirmModal.message}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.55rem 1.5rem', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}
                                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                            >
                                취소
                            </button>
                            <button 
                                className="btn btn-primary" 
                                style={{ padding: '0.55rem 1.5rem', borderRadius: '10px', fontSize: '0.85rem' }}
                                onClick={() => {
                                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                                    setConfirmModal(prev => ({ ...prev, show: false }));
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
