import { useState, useEffect } from 'react';
import { X, Smartphone, Tablet, Monitor, Download, Share2, PlusSquare, CheckCircle2, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';
import { detectDeviceOS } from '../utils/deviceDetector';

/**
 * 📲 OS 자동 인식 스마트 앱 다운로드 센터 모달
 * 접속한 기기를 자동 감지하여 갤럭시/아이폰/아이패드/윈도우에 가장 적합한 설치 옵션을 우선 추천합니다.
 */
export default function AppDownloadModal({ isOpen, onClose }) {
    const [deviceInfo, setDeviceInfo] = useState(() => detectDeviceOS());
    const [selectedTab, setSelectedTab] = useState('auto');
    const [pwaPrompt, setPwaPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isDownloadingApk, setIsDownloadingApk] = useState(false);

    useEffect(() => {
        const detected = detectDeviceOS();
        setDeviceInfo(detected);
        if (selectedTab === 'auto') {
            if (detected.os === 'android') setSelectedTab('android');
            else if (detected.os === 'ios') setSelectedTab('ios');
            else if (detected.os === 'ipados') setSelectedTab('ipados');
            else if (detected.os === 'windows') setSelectedTab('windows');
            else setSelectedTab('android');
        }

        // PWA 설치 이벤트 캐치
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setPwaPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, [isOpen]);

    if (!isOpen) return null;

    // 안전한 직접 APK 파일 다운로드 핸들러
    const handleDownloadApk = async () => {
        try {
            setIsDownloadingApk(true);
            const apkUrl = `${import.meta.env.BASE_URL}downloads/InazumaStation.apk`;
            const response = await fetch(apkUrl);
            if (!response.ok) throw new Error('Download failed');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/vnd.android.package-archive' }));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'InazumaStation.apk';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            // Fallback: 직접 링크 열기
            const link = document.createElement('a');
            link.href = `${import.meta.env.BASE_URL}downloads/InazumaStation.apk`;
            link.download = 'InazumaStation.apk';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setIsDownloadingApk(false);
        }
    };

    // PWA 즉시 설치 트리거 핸들러
    const handleInstallPWA = async () => {
        if (pwaPrompt) {
            pwaPrompt.prompt();
            const { outcome } = await pwaPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsInstalled(true);
            }
            setPwaPrompt(null);
        } else {
            alert("스마트폰 브라우저 상단/하단 메뉴(⋮ 또는 공유)에서 '홈 화면에 추가' 또는 '앱 설치'를 눌러주시면 즉시 1초 만에 앱으로 설치됩니다!");
        }
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    background: 'var(--bg-surface-pure, #1e293b)',
                    border: '1.5px solid var(--border-color, #334155)',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '560px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    color: 'var(--text-main, #f8fafc)',
                    position: 'relative',
                    padding: '1.75rem'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        background: 'rgba(100, 116, 139, 0.15)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted, #94a3b8)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'}
                >
                    <X size={18} />
                </button>

                {/* 헤더 */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.15))',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '20px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: 'var(--primary-color, #3B82F6)',
                        marginBottom: '0.75rem'
                    }}>
                        <Sparkles size={14} /> 이나즈마 스테이션 앱 다운로드 센터
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        내 기기에 꼭 맞는 전용 앱 설치
                    </h2>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
                        모바일에서는 바텀 네비게이션, 태블릿·PC에서는 대화면 듀얼 전술판을 즐겨보세요!
                    </p>
                </div>

                {/* 🎯 접속 기기 자동 인식 하이라이트 배너 */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12))',
                    border: '1.5px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '16px',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.8rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'var(--primary-color, #3B82F6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                        }}>
                            {deviceInfo.isTablet ? <Tablet size={22} /> : (deviceInfo.isMobile ? <Smartphone size={22} /> : <Monitor size={22} />)}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary-color, #3B82F6)', fontWeight: 800 }}>
                                현재 감지된 접속 기기
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                                {deviceInfo.displayName}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setSelectedTab(deviceInfo.os === 'android' ? 'android' : (deviceInfo.os === 'ios' ? 'ios' : (deviceInfo.os === 'ipados' ? 'ipados' : 'windows')))}
                        style={{
                            background: 'var(--primary-color, #3B82F6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        맞춤 설치 보기 👉
                    </button>
                </div>

                {/* OS 선택 탭 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.4rem',
                    background: 'rgba(100, 116, 139, 0.08)',
                    padding: '4px',
                    borderRadius: '14px',
                    marginBottom: '1.25rem'
                }}>
                    <button
                        onClick={() => setSelectedTab('android')}
                        style={{
                            padding: '0.55rem 0.3rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: selectedTab === 'android' ? 'var(--primary-color, #3B82F6)' : 'transparent',
                            color: selectedTab === 'android' ? '#fff' : 'var(--text-muted, #94a3b8)',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Smartphone size={15} />
                        갤럭시/Android
                    </button>

                    <button
                        onClick={() => setSelectedTab('ios')}
                        style={{
                            padding: '0.55rem 0.3rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: selectedTab === 'ios' ? 'var(--primary-color, #3B82F6)' : 'transparent',
                            color: selectedTab === 'ios' ? '#fff' : 'var(--text-muted, #94a3b8)',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Smartphone size={15} />
                        아이폰 (iOS)
                    </button>

                    <button
                        onClick={() => setSelectedTab('ipados')}
                        style={{
                            padding: '0.55rem 0.3rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: selectedTab === 'ipados' ? 'var(--primary-color, #3B82F6)' : 'transparent',
                            color: selectedTab === 'ipados' ? '#fff' : 'var(--text-muted, #94a3b8)',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Tablet size={15} />
                        아이패드
                    </button>

                    <button
                        onClick={() => setSelectedTab('windows')}
                        style={{
                            padding: '0.55rem 0.3rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: selectedTab === 'windows' ? 'var(--primary-color, #3B82F6)' : 'transparent',
                            color: selectedTab === 'windows' ? '#fff' : 'var(--text-muted, #94a3b8)',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Monitor size={15} />
                        윈도우 PC
                    </button>
                </div>

                {/* 탭 내용 영역 */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid var(--border-color, #334155)',
                    borderRadius: '16px',
                    padding: '1.25rem'
                }}>
                    {/* 1. 갤럭시 / 안드로이드 탭 */}
                    {selectedTab === 'android' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Smartphone size={18} color="#10B981" />
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>
                                    갤럭시 및 Android 정식 APK 앱 설치
                                </h3>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                                <strong>정식 디지털 서명(v2/v3) 및 바이트코드 컴파일</strong>이 완료되어 패키지 오류 없이 스마트폰에 독립 앱으로 즉시 설치되는 <strong>InazumaStation.apk</strong>입니다.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {/* 1. 정식 서명된 APK 직접 다운로드 (최우선) */}
                                <button
                                    onClick={handleDownloadApk}
                                    disabled={isDownloadingApk}
                                    style={{
                                        background: 'linear-gradient(135deg, #10B981, #059669)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '14px',
                                        padding: '0.9rem',
                                        fontSize: '0.92rem',
                                        fontWeight: 900,
                                        cursor: isDownloadingApk ? 'wait' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                                    }}
                                >
                                    <Download size={18} /> {isDownloadingApk ? 'APK 파일 다운로드 중...' : 'InazumaStation.apk 독립 앱 직접 다운로드'}
                                </button>

                                {/* 2. APK 설치 팁 가이드 */}
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.08)',
                                    border: '1px solid rgba(16, 185, 129, 0.25)',
                                    borderRadius: '14px',
                                    padding: '0.85rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.45rem',
                                    fontSize: '0.78rem'
                                }}>
                                    <div style={{ fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <CheckCircle2 size={14} /> 정식 안드로이드 v2/v3 보안 서명 완료:
                                    </div>
                                    <div style={{ color: 'var(--text-muted, #94a3b8)', lineHeight: 1.45 }}>
                                        1. 다운로드 완료 후 알림창의 <code>InazumaStation.apk</code> 터치<br/>
                                        2. <strong>'출처를 알 수 없는 앱 설치 허용'</strong>을 켜주시면 즉시 정상 설치 완료!
                                    </div>
                                </div>

                                {/* 3. 브라우저 원클릭 홈 화면 추가 옵션 */}
                                <button
                                    onClick={handleInstallPWA}
                                    style={{
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: 'var(--primary-color, #3B82F6)',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '12px',
                                        padding: '0.65rem',
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.4rem'
                                    }}
                                >
                                    <Sparkles size={14} /> 간편 원클릭 홈 화면 앱 등록 (브라우저 연동)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 2. 아이폰 (iOS) 탭 */}
                    {selectedTab === 'ios' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Smartphone size={18} color="#3B82F6" />
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>
                                    아이폰 (iPhone / iOS) 개발자 앱 설치
                                </h3>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                                iOS 기기에서는 <strong>개발자 사이드로딩(AltStore / Sideloadly)</strong> 또는 <strong>Safari 홈 화면 추가</strong>를 통해 독립 앱으로 실행하실 수 있습니다.
                            </p>

                            <div style={{
                                background: 'rgba(59, 130, 246, 0.08)',
                                border: '1px solid rgba(59, 130, 246, 0.25)',
                                borderRadius: '14px',
                                padding: '0.85rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.6rem',
                                fontSize: '0.8rem'
                            }}>
                                <div style={{ fontWeight: 800, color: 'var(--primary-color, #3B82F6)', marginBottom: '0.2rem' }}>
                                    🍏 개발자 사이드로딩 (AltStore / Sideloadly):
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>
                                    1. <code>inazuma_station_flutter</code>에서 <code>flutter build ipa</code>로 빌드된 <code>.ipa</code> 파일 준비<br/>
                                    2. AltStore 또는 Sideloadly를 통해 아이폰에 개발자 서명 후 직접 설치
                                </div>

                                <div style={{ height: '1px', background: 'rgba(59, 130, 246, 0.2)', margin: '0.3rem 0' }} />

                                <div style={{ fontWeight: 800, color: '#10B981', marginBottom: '0.2rem' }}>
                                    ⚡ 간편 1초 설치 (Safari 홈 화면 추가):
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ background: 'var(--primary-color, #3B82F6)', color: '#fff', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>1</span>
                                    <span>하단 <strong>공유 아이콘 (<Share2 size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />)</strong> 클릭</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ background: 'var(--primary-color, #3B82F6)', color: '#fff', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>2</span>
                                    <span><strong>'홈 화면에 추가 (<PlusSquare size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />)'</strong> 선택</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. 아이패드 (iPadOS) 탭 */}
                    {selectedTab === 'ipados' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Tablet size={18} color="#8B5CF6" />
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>
                                    아이패드 (iPad / iPadOS) 대화면 앱 설치
                                </h3>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                                아이패드의 넓은 화면에 최적화된 <strong>2-Column 전술판과 도감 레이아웃</strong>을 단독 개발자 앱 또는 홈 화면 앱으로 즐기실 수 있습니다.
                            </p>

                            <div style={{
                                background: 'rgba(139, 92, 246, 0.08)',
                                border: '1px solid rgba(139, 92, 246, 0.25)',
                                borderRadius: '14px',
                                padding: '0.85rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.6rem',
                                fontSize: '0.8rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle2 size={16} color="#8B5CF6" />
                                    <span>AltStore / Sideloadly를 통한 iPadOS 개발자 IPA 사이드로딩 지원</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle2 size={16} color="#8B5CF6" />
                                    <span>Safari 우측 상단 <strong>공유(<Share2 size={12} style={{ display: 'inline' }} />) → '홈 화면에 추가'</strong> 지원</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. 윈도우 PC 탭 */}
                    {selectedTab === 'windows' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Monitor size={18} color="#0EA5E9" />
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>
                                    Windows PC 데스크톱 프로그램
                                </h3>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                                웹 브라우저 없이 바탕화면에서 바로 켤 수 있는 고성능 윈도우 독립 실행형 프로그램(`InazumaStation.exe`)입니다.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                {/* 윈도우 데스크톱 프로그램 안내 및 실행 */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(2, 132, 199, 0.15))',
                                    border: '1.5px solid rgba(14, 165, 233, 0.4)',
                                    borderRadius: '14px',
                                    padding: '0.9rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.4rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#38BDF8', fontSize: '0.88rem' }}>
                                        <Monitor size={16} /> PC 즉시 실행 (무설치 포터블)
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>
                                        바탕화면의 <strong>[이나즈마 스테이션.lnk]</strong> 또는 <code>InazumaStation_App/InazumaStation.exe</code>를 실행하면 인터넷 창 없이 독립 프로그램으로 구동됩니다.
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: '0.75rem',
                                    background: 'rgba(100, 116, 139, 0.1)',
                                    borderRadius: '10px',
                                    padding: '0.6rem 0.8rem',
                                    color: 'var(--text-muted, #94a3b8)',
                                    lineHeight: 1.4
                                }}>
                                    ✨ <strong>로컬 바로가기</strong>: 로컬 프로젝트의 <code>InazumaStation_App/InazumaStation-win32-x64/InazumaStation.exe</code> 또는 바탕화면의 <code>이나즈마 스테이션.lnk</code>를 누르면 즉시 실행됩니다.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 하단 플러터 모바일 앱 소스 안내 */}
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)' }}>
                        📱 독립 격리된 Flutter 모바일 전용 앱 프로젝트: <code>inazuma_station_flutter/</code>
                    </span>
                </div>
            </div>
        </div>
    );
}
