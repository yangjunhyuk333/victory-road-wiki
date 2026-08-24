import 'package:flutter/material.dart';
import '../models/character.dart';
import '../theme/app_theme.dart';

/// 👤 선수 상세 프로필 및 능력치/기술 화면
class PlayerDetailScreen extends StatelessWidget {
  final Character character;

  const PlayerDetailScreen({super.key, required this.character});

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
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // 프로필 아바타
            Center(
              child: Container(
                width: 140,
                height: 140,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: elemColor.withOpacity(0.15),
                  border: Border.all(color: elemColor, width: 3),
                  boxShadow: [
                    BoxShadow(
                      color: elemColor.withOpacity(0.3),
                      blurRadius: 20,
                    ),
                  ],
                ),
                child: Center(
                  child: character.image.isNotEmpty
                      ? Image.network(
                          character.image,
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 70),
                        )
                      : const Icon(Icons.person, size: 70),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // 이름 및 소속 팀
            Text(
              character.displayName,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 4),
            Text(
              character.team,
              style: TextStyle(fontSize: 14, color: Colors.grey[400], fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),

            // 속성, 포지션 뱃지
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildBadge(character.element, elemColor),
                const SizedBox(width: 8),
                _buildBadge(character.position, theme.primaryColor),
                if (character.grade != null) ...[
                  const SizedBox(width: 8),
                  _buildBadge(character.grade!, Colors.amber),
                ],
              ],
            ),
            const SizedBox(height: 24),

            // 기본 스펙 카드
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
                  const Text('선수 프로필 정보', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
                  const Divider(height: 20),
                  _buildInfoRow('속성', character.element),
                  _buildInfoRow('메인 포지션', character.position),
                  _buildInfoRow('소속 팀', character.team),
                  if (character.gender != null) _buildInfoRow('성별', character.gender!),
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
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      decoration: BoxDecoration(
        color: color.withOpacity(0.18),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color, width: 1.2),
      ),
      child: Text(
        text,
        style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 12),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
        ],
      ),
    );
  }
}
