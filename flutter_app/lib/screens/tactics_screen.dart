import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/character.dart';
import '../models/tactic.dart';
import '../widgets/responsive_scaffold.dart';
import '../theme/app_theme.dart';

/// ⚽ 축구 전술판 스튜디오 (스마트폰 원터치 빌더 vs 태블릿/데스크톱 2-Column 대화면 에디터)
class TacticsScreen extends StatefulWidget {
  final List<Character> allCharacters;

  const TacticsScreen({super.key, required this.allCharacters});

  @override
  State<TacticsScreen> createState() => _TacticsScreenState();
}

class _TacticsScreenState extends State<TacticsScreen> {
  String _title = '베스트 일레븐 전술';
  String _formation = '4-4-2';
  Map<String, Character> _squad = {};
  Map<String, Character> _bench = {};
  Character? _coach;
  List<TacticPosition> _positions = [];

  // 기본 4-4-2 좌표 프리셋
  final List<TacticPosition> _default442 = [
    TacticPosition(id: 0, role: 'GK', top: 85, left: 50),
    TacticPosition(id: 1, role: 'LB', top: 68, left: 15),
    TacticPosition(id: 2, role: 'LCB', top: 70, left: 35),
    TacticPosition(id: 3, role: 'RCB', top: 70, left: 65),
    TacticPosition(id: 4, role: 'RB', top: 68, left: 85),
    TacticPosition(id: 5, role: 'LM', top: 44, left: 15),
    TacticPosition(id: 6, role: 'LCM', top: 46, left: 36),
    TacticPosition(id: 7, role: 'RCM', top: 46, left: 64),
    TacticPosition(id: 8, role: 'RM', top: 44, left: 85),
    TacticPosition(id: 9, role: 'LS', top: 18, left: 35),
    TacticPosition(id: 10, role: 'RS', top: 18, left: 65),
  ];

  @override
  void initState() {
    super.initState();
    _positions = List.from(_default442);
  }

  // 📍 자동 정렬 (좌우 대칭 정렬)
  void _handleAutoAlign() {
    setState(() {
      for (var pos in _positions) {
        if (pos.role == 'GK' || pos.role == 'CB' || pos.role == 'CM' || pos.role == 'CF') {
          pos.left = 50.0;
        }
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('포메이션 노드가 중앙선에 맞추어 자동 정렬되었습니다!')),
    );
  }

  // 📤 전술 JSON 내보내기 시뮬레이션
  void _handleExportJson() {
    final tactic = Tactic(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: _title,
      formation: _formation,
      squad: _squad,
      bench: _bench,
      coach: _coach,
      positions: _positions,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    final jsonStr = const JsonEncoder.withIndent('  ').convert({
      'type': 'inazuma_tactic',
      'version': '1.0.0',
      'tactic': tactic.toJson(),
    });

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('전술 JSON 데이터 내보내기'),
        content: SizedBox(
          width: 400,
          child: SingleChildScrollView(
            child: SelectableText(
              jsonStr,
              style: const TextStyle(fontFamily: 'monospace', fontSize: 11),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('닫기'),
          ),
        ],
      ),
    );
  }

  // 선수 선택 모달
  void _openPlayerPicker(String slotKey, bool isBench) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return SizedBox(
          height: MediaQuery.of(context).size.height * 0.75,
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isBench ? '후보 선수 등록' : '주전 선수 배치 ($slotKey번)',
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const Divider(),
              Expanded(
                child: ListView.builder(
                  itemCount: widget.allCharacters.length > 50 ? 50 : widget.allCharacters.length,
                  itemBuilder: (context, index) {
                    final p = widget.allCharacters[index];
                    return ListTile(
                      leading: CircleAvatar(
                        backgroundColor: AppTheme.getElementColor(p.element),
                        child: Text(p.element, style: const TextStyle(color: Colors.white, fontSize: 12)),
                      ),
                      title: Text(p.displayName, style: const TextStyle(fontWeight: FontWeight.w800)),
                      subtitle: Text('${p.team} │ ${p.position}'),
                      onTap: () {
                        setState(() {
                          if (isBench) {
                            _bench[slotKey] = p;
                          } else {
                            _squad[slotKey] = p;
                          }
                        });
                        Navigator.pop(ctx);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveScaffold.isMobile(context);
    final theme = Theme.of(context);

    return Column(
      children: [
        // 상단 전술 툴바
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            border: Border(bottom: BorderSide(color: theme.colorScheme.outline)),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: TextEditingController(text: _title),
                  onChanged: (val) => _title = val,
                  decoration: const InputDecoration(
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10))),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.auto_fix_high),
                tooltip: '중앙선 자동 정렬',
                onPressed: _handleAutoAlign,
              ),
              IconButton(
                icon: const Icon(Icons.download),
                tooltip: 'JSON 파일 내보내기',
                onPressed: _handleExportJson,
              ),
            ],
          ),
        ),

        // 축구장 전술판
        Expanded(
          child: Stack(
            children: [
              // 축구장 잔디 배경
              Container(
                margin: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E3A2B), Color(0xFF142B20)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white24, width: 2),
                ),
                child: Center(
                  child: Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white24, width: 2),
                    ),
                  ),
                ),
              ),

              // 포지션 노드들
              ..._positions.map((pos) {
                final player = _squad[pos.id.toString()];
                return Positioned(
                  top: (pos.top / 100) * (MediaQuery.of(context).size.height * 0.55),
                  left: (pos.left / 100) * (MediaQuery.of(context).size.width - 80) + 10,
                  child: InkWell(
                    onTap: () => _openPlayerPicker(pos.id.toString(), false),
                    child: Container(
                      width: 58,
                      height: 72,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: player != null ? theme.primaryColor : Colors.white38,
                          width: 1.5,
                        ),
                        boxShadow: const [BoxShadow(color: Colors.black45, blurRadius: 6)],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (player != null) ...[
                            Text(
                              player.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800),
                            ),
                            Text(
                              pos.role,
                              style: TextStyle(fontSize: 8, color: theme.primaryColor, fontWeight: FontWeight.w900),
                            ),
                          ] else ...[
                            const Icon(Icons.add, size: 20, color: Colors.grey),
                            Text(
                              pos.role,
                              style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.w800),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ],
          ),
        ),

        // 하단 벤치 서브 라인업
        Container(
          height: 78,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          color: theme.colorScheme.surface,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: 7,
            itemBuilder: (ctx, i) {
              final subPlayer = _bench[i.toString()];
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: InkWell(
                  onTap: () => _openPlayerPicker(i.toString(), true),
                  child: Container(
                    width: 60,
                    decoration: BoxDecoration(
                      color: theme.scaffoldBackgroundColor,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: theme.colorScheme.outline),
                    ),
                    child: Center(
                      child: Text(
                        subPlayer != null ? subPlayer.name : 'SUB ${i + 1}',
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
