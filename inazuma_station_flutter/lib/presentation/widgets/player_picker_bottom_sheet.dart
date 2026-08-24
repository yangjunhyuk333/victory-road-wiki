import 'package:flutter/material.dart';
import '../../models/character.dart';
import '../../core/theme/app_theme.dart';

/// 📱 모바일 터치 최적화 선수 선택 바텀 시트
class PlayerPickerBottomSheet extends StatefulWidget {
  final List<Character> allCharacters;
  final String title;
  final Function(Character) onSelect;

  const PlayerPickerBottomSheet({
    super.key,
    required this.allCharacters,
    required this.title,
    required this.onSelect,
  });

  @override
  State<PlayerPickerBottomSheet> createState() => _PlayerPickerBottomSheetState();
}

class _PlayerPickerBottomSheetState extends State<PlayerPickerBottomSheet> {
  String _query = '';
  String _selectedElement = '전체';
  String _selectedPosition = '전체';

  final List<String> elements = ['전체', '화', '풍', '림', '산'];
  final List<String> positions = ['전체', 'FW', 'MF', 'DF', 'GK'];

  List<Character> get filteredList {
    return widget.allCharacters.where((p) {
      final matchesSearch = _query.isEmpty ||
          p.name.toLowerCase().contains(_query.toLowerCase()) ||
          p.team.toLowerCase().contains(_query.toLowerCase());
      final matchesElement = _selectedElement == '전체' || p.element == _selectedElement;
      final matchesPos = _selectedPosition == '전체' || p.position == _selectedPosition;
      return matchesSearch && matchesElement && matchesPos;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final list = filteredList;

    return Container(
      height: MediaQuery.of(context).size.height * 0.82,
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        children: [
          // 상단 핸들 & 타이틀 바
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            child: Column(
              children: [
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[600],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      widget.title,
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 17),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // 검색창
                TextField(
                  onChanged: (val) => setState(() => _query = val),
                  decoration: InputDecoration(
                    hintText: '선수명 또는 팀 이름 검색...',
                    prefixIcon: const Icon(Icons.search, size: 20),
                    isDense: true,
                    filled: true,
                    fillColor: theme.scaffoldBackgroundColor,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // 속성/포지션 칩 가로 스크롤
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      ...elements.map((elem) {
                        final isSel = _selectedElement == elem;
                        return Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: FilterChip(
                            label: Text(elem, style: const TextStyle(fontSize: 12)),
                            selected: isSel,
                            onSelected: (_) => setState(() => _selectedElement = elem),
                            selectedColor: AppTheme.getElementColor(elem).withOpacity(0.25),
                          ),
                        );
                      }),
                      const SizedBox(width: 8),
                      ...positions.map((pos) {
                        final isSel = _selectedPosition == pos;
                        return Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: FilterChip(
                            label: Text(pos, style: const TextStyle(fontSize: 12)),
                            selected: isSel,
                            onSelected: (_) => setState(() => _selectedPosition = pos),
                            selectedColor: theme.primaryColor.withOpacity(0.25),
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // 선수 리스트
          Expanded(
            child: list.isEmpty
                ? const Center(child: Text('일치하는 선수가 없습니다.'))
                : ListView.builder(
                    itemCount: list.length,
                    itemBuilder: (ctx, idx) {
                      final p = list[idx];
                      final elemColor = AppTheme.getElementColor(p.element);
                      return ListTile(
                        leading: CircleAvatar(
                          backgroundColor: elemColor,
                          child: Text(
                            p.element,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 12),
                          ),
                        ),
                        title: Text(p.displayName, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                        subtitle: Text('${p.team} │ ${p.position}', style: TextStyle(color: Colors.grey[400], fontSize: 12)),
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: theme.primaryColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            p.position,
                            style: TextStyle(color: theme.primaryColor, fontWeight: FontWeight.w900, fontSize: 11),
                          ),
                        ),
                        onTap: () {
                          widget.onSelect(p);
                          Navigator.pop(context);
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
