import 'package:flutter/material.dart';
import '../../models/character.dart';
import '../../core/theme/app_theme.dart';

/// 👤 모바일 선수 상세 프로필 화면
class PlayerProfileScreen extends StatelessWidget {
  final Character character;

  const PlayerProfileScreen({super.key, required this.character});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final elemColor = AppTheme.getElementColor(character.element);

    return Scaffold(
      appBar: AppBar(
        title: Text(character.displayName),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // 프로필 아바타
            Center(
              child: Container(
                width: 130,
                height: 130,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: elemColor.withOpacity(0.15),
                  border: Border.all(color: elemColor, width: 3),
                  boxShadow: [
                    BoxShadow(color: elemColor.withOpacity(0.25), blurRadius: 18),
                  ],
                ),
                child: Center(
                  child: character.image.isNotEmpty
                      ? Image.network(
                          character.image,
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 60),
                        )
                      : const Icon(Icons.person, size: 60),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // 선수 이름
            Text(character.displayName, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
            const SizedBox(height: 4),
            Text(character.team, style: TextStyle(fontSize: 13, color: Colors.grey[400], fontWeight: FontWeight.w600)),
            const SizedBox(height: 16),

            // 속성 / 포지션 뱃지
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildBadge(character.element, elemColor),
                const SizedBox(width: 8),
                _buildBadge(character.position, theme.primaryColor),
              ],
            ),
            const SizedBox(height: 24),

            // 상세 프로필 스펙 카드
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: theme.colorScheme.outline),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('선수 프로필 스펙', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                  const Divider(height: 20),
                  _buildRow('소속 팀', character.team),
                  _buildRow('메인 포지션', character.position),
                  _buildRow('속성', character.element),
                  if (character.gender != null) _buildRow('성별', character.gender!),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
      decoration: BoxDecoration(
        color: color.withOpacity(0.18),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color, width: 1),
      ),
      child: Text(text, style: TextStyle(color: color, fontWeight: FontWeight.w900, fontSize: 12)),
    );
  }

  Widget _buildRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
        ],
      ),
    );
  }
}
