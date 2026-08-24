import 'package:flutter/material.dart';
import '../widgets/responsive_scaffold.dart';

/// 🏠 메인 홈 및 빠른 바로가기 화면
class HomeScreen extends StatelessWidget {
  final Function(int) onNavigate;

  const HomeScreen({super.key, required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveScaffold.isMobile(context);
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 32,
        vertical: 20,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. 히어로 환영 배너
          Container(
            width: double.infinity,
            padding: EdgeInsets.all(isMobile ? 20 : 28),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  theme.primaryColor.withOpacity(0.2),
                  Colors.teal.withOpacity(0.15),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: theme.primaryColor.withOpacity(0.3),
                width: 1.5,
              ),
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
                      child: const Icon(Icons.bolt, color: Colors.white, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        '이나즈마 스테이션 모바일',
                        style: TextStyle(
                          fontSize: isMobile ? 20 : 26,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  '빅토리로드 5,400여 명의 선수 도감과 스마트 전술 포메이션 스튜디오를 어디서나 편리하게 이용하세요!',
                  style: TextStyle(
                    fontSize: isMobile ? 13 : 15,
                    color: Colors.grey[300],
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 12,
                  runSpacing: 10,
                  children: [
                    ElevatedButton.icon(
                      onPressed: () => onNavigate(2),
                      icon: const Icon(Icons.sports_soccer),
                      label: const Text('전술판 시작하기'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.primaryColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                    OutlinedButton.icon(
                      onPressed: () => onNavigate(1),
                      icon: const Icon(Icons.search),
                      label: const Text('선수 도감 검색'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: BorderSide(color: theme.colorScheme.outline),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 2. 퀵 메뉴 카드 그리드
          Text(
            '주요 기능 허브',
            style: TextStyle(
              fontSize: isMobile ? 17 : 20,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 14),

          GridView.count(
            crossAxisCount: isMobile ? 2 : 4,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            childAspectRatio: isMobile ? 1.15 : 1.3,
            children: [
              _buildFeatureCard(
                context,
                title: '캐릭터 대도감',
                subtitle: '5,400+ 선수 DB',
                icon: Icons.menu_book_rounded,
                color: Colors.blue,
                onTap: () => onNavigate(1),
              ),
              _buildFeatureCard(
                context,
                title: '축구 전술판',
                subtitle: '8종 포메이션 & 빌더',
                icon: Icons.sports_soccer_rounded,
                color: Colors.emerald,
                onTap: () => onNavigate(2),
              ),
              _buildFeatureCard(
                context,
                title: '전술 파일 가져오기',
                subtitle: 'JSON 내보내기/불러오기',
                icon: Icons.file_upload_outlined,
                color: Colors.amber,
                onTap: () => onNavigate(2),
              ),
              _buildFeatureCard(
                context,
                title: '환경 설정',
                subtitle: '다크모드 & 테마',
                icon: Icons.settings_rounded,
                color: Colors.purple,
                onTap: () => onNavigate(3),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: theme.colorScheme.outline, width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(color: Colors.grey[400], fontSize: 11),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

extension on Colors {
  static const Color emerald = Color(0xFF10B981);
}
