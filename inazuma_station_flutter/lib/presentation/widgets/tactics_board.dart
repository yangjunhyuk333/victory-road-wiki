import 'package:flutter/material.dart';
import '../../models/character.dart';
import '../../models/tactic.dart';
import '../../core/theme/app_theme.dart';

/// ⚽ 모바일 축구장 인터랙티브 전술 보드 위젯
class TacticsBoard extends StatelessWidget {
  final List<TacticPosition> positions;
  final Map<String, Character> squad;
  final Function(int) onPositionTap;
  final Function(int) onPositionClear;

  const TacticsBoard({
    super.key,
    required this.positions,
    required this.squad,
    required this.onPositionTap,
    required this.onPositionClear,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (ctx, constraints) {
        final fieldWidth = constraints.maxWidth;
        final fieldHeight = constraints.maxHeight;

        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1B3828), Color(0xFF11261B)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white24, width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.4),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(22),
            child: Stack(
              children: [
                // 1. 축구장 내부 라인 그리기
                CustomPaint(
                  size: Size(fieldWidth, fieldHeight),
                  painter: _SoccerFieldPainter(),
                ),

                // 2. 포지션 노드들 배치 (0~100% 비율 기반)
                ...positions.map((pos) {
                  final player = squad[pos.id.toString()];
                  final nodeWidth = 62.0;
                  final nodeHeight = 78.0;

                  final topPos = (pos.top / 100) * (fieldHeight - nodeHeight - 16) + 8;
                  final leftPos = (pos.left / 100) * (fieldWidth - nodeWidth - 16) + 8;

                  return Positioned(
                    top: topPos,
                    left: leftPos,
                    child: _buildPlayerNode(context, pos, player),
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPlayerNode(BuildContext context, TacticPosition pos, Character? player) {
    final theme = Theme.of(context);
    final elemColor = player != null ? AppTheme.getElementColor(player.element) : Colors.transparent;

    return GestureDetector(
      onTap: () => onPositionTap(pos.id),
      child: Container(
        width: 62,
        height: 78,
        decoration: BoxDecoration(
          color: theme.colorScheme.surface.withOpacity(0.95),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: player != null ? elemColor : Colors.white30,
            width: player != null ? 2 : 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Stack(
          children: [
            Center(
              child: player != null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircleAvatar(
                          radius: 16,
                          backgroundColor: elemColor.withOpacity(0.2),
                          child: Text(
                            player.element,
                            style: TextStyle(color: elemColor, fontSize: 10, fontWeight: FontWeight.w900),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 2),
                          child: Text(
                            player.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900),
                          ),
                        ),
                        Text(
                          pos.role,
                          style: TextStyle(fontSize: 8, color: theme.primaryColor, fontWeight: FontWeight.w900),
                        ),
                      ],
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.add_circle_outline, size: 20, color: Colors.grey),
                        const SizedBox(height: 2),
                        Text(
                          pos.role,
                          style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.w800),
                        ),
                      ],
                    ),
            ),

            // 선수 삭제(클리어) 버튼
            if (player != null)
              Positioned(
                top: 0,
                right: 0,
                child: GestureDetector(
                  onTap: () => onPositionClear(pos.id),
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.close, size: 10, color: Colors.white),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// 🎨 축구장 잔디 라인 페인터
class _SoccerFieldPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    // 외곽 테두리
    canvas.drawRect(Rect.fromLTWH(8, 8, size.width - 16, size.height - 16), paint);

    // 중앙선
    final centerY = size.height / 2;
    canvas.drawLine(Offset(8, centerY), Offset(size.width - 8, centerY), paint);

    // 센터 서클
    canvas.drawCircle(Offset(size.width / 2, centerY), 45, paint);

    // 상단 페널티 에어리어
    canvas.drawRect(
      Rect.fromLTWH(size.width * 0.25, 8, size.width * 0.5, size.height * 0.16),
      paint,
    );

    // 하단 페널티 에어리어
    canvas.drawRect(
      Rect.fromLTWH(size.width * 0.25, size.height - 8 - size.height * 0.16, size.width * 0.5, size.height * 0.16),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
