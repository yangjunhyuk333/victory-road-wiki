import 'package:flutter/material.dart';

/// 📱/💻 화면 크기에 따라 모바일 바텀 네비 vs 태블릿/PC 상단 툴바를 자동 전환하는 반응형 레이아웃 스캐폴드
class ResponsiveScaffold extends StatelessWidget {
  final int currentIndex;
  final Function(int) onNavigationChanged;
  final Widget body;
  final String title;
  final List<Widget>? actions;

  const ResponsiveScaffold({
    super.key,
    required this.currentIndex,
    required this.onNavigationChanged,
    required this.body,
    required this.title,
    this.actions,
  });

  static bool isMobile(BuildContext context) => MediaQuery.of(context).size.width < 768;
  static bool isTablet(BuildContext context) => 
      MediaQuery.of(context).size.width >= 768 && MediaQuery.of(context).size.width < 1200;
  static bool isDesktop(BuildContext context) => MediaQuery.of(context).size.width >= 1200;

  @override
  Widget build(BuildContext context) {
    final bool mobile = isMobile(context);
    final theme = Theme.of(context);

    if (mobile) {
      // 📱 1. 스마트폰 모바일 화면: 상단 슬림 앱바 + 바디 + 플로팅 바텀 네비게이션 바
      return Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: theme.primaryColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.flash_on, color: theme.primaryColor, size: 20),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 17),
              ),
            ],
          ),
          actions: actions,
        ),
        body: SafeArea(
          bottom: false,
          child: body,
        ),
        bottomNavigationBar: _buildMobileBottomNav(context),
      );
    } else {
      // 💻 2. 태블릿 및 데스크톱 대화면: 상단 와이드 헤더 + 탭 네비게이션 + 대화면 뷰
      return Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(72),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            decoration: BoxDecoration(
              color: theme.scaffoldBackgroundColor,
              border: Border(
                bottom: BorderSide(color: theme.colorScheme.outline, width: 1),
              ),
            ),
            child: Row(
              children: [
                // 브랜드 로고
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [theme.primaryColor, Colors.teal],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.sports_soccer, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      '이나즈마 스테이션',
                      style: TextStyle(fontSize: 19, fontWeight: FontWeight.w900),
                    ),
                  ],
                ),
                const SizedBox(width: 32),

                // 상단 탭 네비게이션 버튼 그룹 (웹/데스크톱 스타일)
                _buildDesktopTabButton(context, 0, '홈', Icons.home_outlined, Icons.home),
                const SizedBox(width: 8),
                _buildDesktopTabButton(context, 1, '캐릭터 도감', Icons.book_outlined, Icons.book),
                const SizedBox(width: 8),
                _buildDesktopTabButton(context, 2, '나만의 전술판', Icons.dashboard_outlined, Icons.dashboard),
                const SizedBox(width: 8),
                _buildDesktopTabButton(context, 3, '설정', Icons.settings_outlined, Icons.settings),

                const Spacer(),
                if (actions != null) ...actions!,
              ],
            ),
          ),
        ),
        body: body,
      );
    }
  }

  // 📱 모바일 전용 플로팅 바텀 네비게이션 위젯
  Widget _buildMobileBottomNav(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        bottom: MediaQuery.of(context).padding.bottom + 8,
        top: 4,
      ),
      child: Container(
        height: 64,
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: theme.colorScheme.outline, width: 1.2),
          boxShadow: [
            BoxStyle(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(0, Icons.home_rounded, '홈', theme),
            _buildNavItem(1, Icons.menu_book_rounded, '도감', theme),
            _buildNavItem(2, Icons.sports_soccer_rounded, '전술판', theme),
            _buildNavItem(3, Icons.settings_rounded, '설정', theme),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label, ThemeData theme) {
    final isSelected = currentIndex == index;
    final color = isSelected ? theme.primaryColor : Colors.grey;

    return InkWell(
      onTap: () => onNavigationChanged(index),
      borderRadius: BorderRadius.circular(24),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDesktopTabButton(
    BuildContext context,
    int index,
    String label,
    IconData defaultIcon,
    IconData activeIcon,
  ) {
    final isSelected = currentIndex == index;
    final theme = Theme.of(context);

    return InkWell(
      onTap: () => onNavigationChanged(index),
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? theme.primaryColor.withOpacity(0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? theme.primaryColor : Colors.transparent,
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? activeIcon : defaultIcon,
              size: 18,
              color: isSelected ? theme.primaryColor : Colors.grey,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? theme.primaryColor : Colors.grey,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
