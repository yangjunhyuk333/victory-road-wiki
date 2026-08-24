import 'package:flutter/material.dart';

/// ⚙️ 설정 및 환경설정 화면
class SettingsScreen extends StatelessWidget {
  final bool isDarkMode;
  final VoidCallback onToggleTheme;

  const SettingsScreen({
    super.key,
    required this.isDarkMode,
    required this.onToggleTheme,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '환경 설정',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 16),

          // 테마 설정 카드
          Container(
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: theme.colorScheme.outline),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: Icon(
                    isDarkMode ? Icons.dark_mode : Icons.light_mode,
                    color: theme.primaryColor,
                  ),
                  title: const Text('다크 모드 테마', style: TextStyle(fontWeight: FontWeight.w800)),
                  subtitle: Text(isDarkMode ? '다크 테마 적용 중' : '라이트 테마 적용 중'),
                  trailing: Switch(
                    value: isDarkMode,
                    onChanged: (_) => onToggleTheme(),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // 앱 정보 카드
          Container(
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: theme.colorScheme.outline),
            ),
            child: Column(
              children: [
                const ListTile(
                  leading: Icon(Icons.info_outline, color: Colors.blue),
                  title: Text('이나즈마 스테이션 모바일', style: TextStyle(fontWeight: FontWeight.w800)),
                  subtitle: Text('버전 1.0.0 (Flutter Multiplatform)'),
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.devices, color: Colors.green),
                  title: Text('크로스 플랫폼 지원', style: TextStyle(fontWeight: FontWeight.w800)),
                  subtitle: Text('Android, iOS, iPadOS, Web, Windows PC 지원'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
