import 'package:flutter/material.dart';

/// ⚙️ 모바일 환경설정 화면
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
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('환경 설정', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          const SizedBox(height: 12),

          // 테마 설정 카드
          Container(
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: theme.colorScheme.outline),
            ),
            child: ListTile(
              leading: Icon(isDarkMode ? Icons.dark_mode : Icons.light_mode, color: theme.primaryColor),
              title: const Text('다크 테마 모드', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
              subtitle: Text(isDarkMode ? '어두운 테마 사용 중' : '밝은 테마 사용 중', style: const TextStyle(fontSize: 12)),
              trailing: Switch(value: isDarkMode, onChanged: (_) => onToggleTheme()),
            ),
          ),
          const SizedBox(height: 16),

          // 앱 정보 카드
          Container(
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: theme.colorScheme.outline),
            ),
            child: const Column(
              children: [
                ListTile(
                  leading: Icon(Icons.verified, color: Colors.blue),
                  title: Text('이나즈마 스테이션 모바일', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                  subtitle: Text('버전 1.0.0 (Native Flutter)', style: TextStyle(fontSize: 12)),
                ),
                Divider(height: 1),
                ListTile(
                  leading: Icon(Icons.devices, color: Colors.green),
                  title: Text('크로스 플랫폼 지원', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                  subtitle: Text('Android, iOS, iPadOS, Windows PC', style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
