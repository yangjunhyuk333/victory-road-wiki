import 'dart:convert';
import 'package:flutter/material.dart';
import '../../models/character.dart';
import '../../models/tactic.dart';
import '../../core/constants/formations.dart';
import '../widgets/tactics_board.dart';
import '../widgets/player_picker_bottom_sheet.dart';

/// ⚽ 모바일 전용 축구 전술판 화면
class MobileTacticsScreen extends StatefulWidget {
  final List<Character> allCharacters;

  const MobileTacticsScreen({super.key, required this.allCharacters});

  @override
  State<MobileTacticsScreen> createState() => _MobileTacticsScreenState();
}

class _MobileTacticsScreenState extends State<MobileTacticsScreen> {
  String _title = '베스트 일레븐 전술';
  String _formation = '4-4-2';
  Map<String, Character> _squad = {};
  Map<String, Character> _bench = {};
  Character? _coach;
  List<TacticPosition> _positions = [];

  final List<String> _availableFormations = ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1'];

  @override
  void initState() {
    super.initState();
    _positions = Formations.getPositions(_formation);
  }

  void _onFormationChange(String newForm) {
    setState(() {
      _formation = newForm;
      _positions = Formations.getPositions(newForm);
    });
  }

  void _handleAutoAlign() {
    setState(() {
      for (var pos in _positions) {
        if (pos.role == 'GK' || pos.role == 'CB' || pos.role == 'CM' || pos.role == 'CF' || pos.role == 'CAM' || pos.role == 'ST') {
          pos.left = 50.0;
        }
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('중앙선(50%)에 맞추어 자동 정렬되었습니다!')),
    );
  }

  void _openPlayerPicker(String slotKey, bool isBench) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return PlayerPickerBottomSheet(
          allCharacters: widget.allCharacters,
          title: isBench ? '후보 ${int.parse(slotKey) + 1} 선수 선택' : '주전 선수 선택',
          onSelect: (selectedChar) {
            setState(() {
              if (isBench) {
                _bench[slotKey] = selectedChar;
              } else {
                _squad[slotKey] = selectedChar;
              }
            });
          },
        );
      },
    );
  }

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
        title: const Text('전술 JSON 데이터'),
        content: SizedBox(
          width: 320,
          child: SingleChildScrollView(
            child: SelectableText(jsonStr, style: const TextStyle(fontFamily: 'monospace', fontSize: 10)),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('닫기')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        // 1. 상단 모바일 컨트롤 바 (이름, 포메이션, 자동정렬, 내보내기)
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            border: Border(bottom: BorderSide(color: theme.colorScheme.outline)),
          ),
          child: Row(
            children: [
              // 전술 이름
              Expanded(
                child: TextField(
                  controller: TextEditingController(text: _title),
                  onChanged: (val) => _title = val,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                  decoration: InputDecoration(
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    filled: true,
                    fillColor: theme.scaffoldBackgroundColor,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // 포메이션 드롭다운
              DropdownButton<String>(
                value: _formation,
                underline: const SizedBox(),
                dropdownColor: theme.colorScheme.surface,
                items: _availableFormations.map((f) {
                  return DropdownMenuItem(value: f, child: Text(f, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)));
                }).toList(),
                onChanged: (val) {
                  if (val != null) _onFormationChange(val);
                },
              ),
              const SizedBox(width: 4),

              // 자동정렬 버튼
              IconButton(
                icon: const Icon(Icons.auto_fix_high, size: 20),
                tooltip: '자동 정렬',
                onPressed: _handleAutoAlign,
              ),

              // JSON 내보내기 버튼
              IconButton(
                icon: const Icon(Icons.file_download_outlined, size: 20),
                tooltip: 'JSON 내보내기',
                onPressed: _handleExportJson,
              ),
            ],
          ),
        ),

        // 2. 축구장 전술 보드
        Expanded(
          child: TacticsBoard(
            positions: _positions,
            squad: _squad,
            onPositionTap: (posId) => _openPlayerPicker(posId.toString(), false),
            onPositionClear: (posId) => setState(() => _squad.remove(posId.toString())),
          ),
        ),

        // 3. 하단 벤치 후보 라인업 바
        Container(
          height: 76,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          color: theme.colorScheme.surface,
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: theme.primaryColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text('벤치\n후보', textAlign: TextAlign.center, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: 7,
                  itemBuilder: (ctx, i) {
                    final sub = _bench[i.toString()];
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => _openPlayerPicker(i.toString(), true),
                        child: Container(
                          width: 54,
                          decoration: BoxDecoration(
                            color: theme.scaffoldBackgroundColor,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: sub != null ? theme.primaryColor : theme.colorScheme.outline),
                          ),
                          child: Center(
                            child: Text(
                              sub != null ? sub.name : '+ SUB ${i + 1}',
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: sub != null ? Colors.white : Colors.grey),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
