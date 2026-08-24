import 'package:flutter/material.dart';
import '../../models/character.dart';
import '../../core/theme/app_theme.dart';
import 'player_profile_screen.dart';

/// 🏠 모바일 전용 메인 홈 허브 대시보드
class MobileHomeScreen extends StatelessWidget {
  final List<Character> characters;
  final Function(int) onNavigate;

  const MobileHomeScreen({
    super.key,
    required this.characters,
    required this.onNavigate,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // 오늘의 추천 선수 (엔도 마모루 또는 첫 번째 선수)
    final featuredPlayer = characters.isNotEmpty ? characters.first : null;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. 네온 히어로 배너
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  theme.primaryColor.withOpacity(0.25),
                  const Color(0xFF06B6D4).withOpacity(0.15),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: theme.primaryColor.withOpacity(0.4),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: theme.primaryColor.withOpacity(0.15),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: theme.primaryColor,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.flash_on_rounded, color: Colors.white, size: 20),
                    ),
                    const SizedBox(width: 10),
                    const Text(
                      '이나즈마 스테이션 모바일',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  '빅토리로드 5,400+ 선수 도감과 스마트 전술 포메이션 스튜디오를 휴대폰에서 완벽하게 즐겨보세요!',
                  style: TextStyle(fontSize: 12, color: Colors.grey[300], height: 1.4),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => onNavigate(2),
                        icon: const Icon(Icons.sports_soccer, size: 18),
                        label: const Text('전술판 바로가기'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => onNavigate(1),
                        icon: const Icon(Icons.search, size: 18),
                        label: const Text('선수 검색'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white,
                          side: BorderSide(color: theme.colorScheme.outline),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // 2. 주요 기능 퀵 그리드
          const Text('핵심 스튜디오 메뉴', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
          const SizedBox(height: 12),

          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.25,
            children: [
              _buildMenuCard(
                context,
                title: '캐릭터 대도감',
                desc: '5,400+ 선수 DB & 필터',
                icon: Icons.menu_book_rounded,
                color: Colors.blue,
                onTap: () => onNavigate(1),
              ),
              _buildMenuCard(
                context,
                title: '축구 전술판',
                desc: '8종 포메이션 & 대형 빌더',
                icon: Icons.sports_soccer_rounded,
                color: Colors.green,
                onTap: () => onNavigate(2),
              ),
              _buildMenuCard(
                context,
                title: '전술 파일 관리',
                desc: 'JSON 내보내기/불러오기',
                icon: Icons.file_download_outlined,
                color: Colors.amber,
                onTap: () => onNavigate(2),
              ),
              _buildMenuCard(
                context,
                title: '환경 설정',
                desc: '다크모드 & 앱 정보',
                icon: Icons.settings_rounded,
                color: Colors.purple,
                onTap: () => onNavigate(3),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // 3. 오늘의 추천 선수 카드
          if (featuredPlayer != null) ...[
            const Text('오늘의 추천 선수', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
            const SizedBox(height: 10),
            InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => PlayerProfileScreen(character: featuredPlayer),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(18),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: theme.colorScheme.outline),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: AppTheme.getElementColor(featuredPlayer.element),
                      child: Text(
                        featuredPlayer.element,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            featuredPlayer.displayName,
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${featuredPlayer.team} │ ${featuredPlayer.position}',
                            style: TextStyle(color: Colors.grey[400], fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: Colors.grey),
                  ],
                ),
              ),
            ),
          ],
          const SizedBox(height: 80), // 바텀바 여백
        ],
      ),
    );
  }

  Widget _buildMenuCard(
    BuildContext context, {
    required String title,
    required String desc,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: theme.colorScheme.outline),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.18),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13)),
                Text(desc, style: TextStyle(color: Colors.grey[400], fontSize: 10)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
