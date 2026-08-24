import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trello, Download, Settings } from 'lucide-react';

/**
 * 📱 스마트폰 모바일 전용 현대적 플로팅 바텀 네비게이션 바
 * 화면 너비 768px 미만의 모바일 기기에서만 화면 하단에 고정 표시됩니다.
 */
export default function MobileBottomNav() {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/', label: '홈', icon: Home },
        { path: '/zukan', label: '캐릭터 도감', icon: BookOpen },
        { path: '/tactics', label: '전술판', icon: Trello }
    ];

    return (
        <div className="mobile-bottom-nav-container">
            <nav className="mobile-bottom-nav">
                {navItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = !item.isAction && currentPath === item.path;

                    if (item.isAction) {
                        return (
                            <button
                                key={index}
                                onClick={item.action}
                                className={`mobile-nav-item ${item.highlight ? 'highlight' : ''}`}
                                title={item.label}
                            >
                                <div className="mobile-nav-icon-wrapper">
                                    <IconComponent size={20} />
                                </div>
                                <span className="mobile-nav-label">{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="mobile-nav-icon-wrapper">
                                <IconComponent size={20} />
                                {isActive && <div className="mobile-nav-indicator" />}
                            </div>
                            <span className="mobile-nav-label">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
