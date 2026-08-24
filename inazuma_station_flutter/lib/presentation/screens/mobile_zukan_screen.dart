import 'package:flutter/material.dart';
import '../../models/character.dart';
import '../../core/theme/app_theme.dart';
import 'player_profile_screen.dart';

/// 📖 모바일 전용 캐릭터 도감 화면
class MobileZukanScreen extends StatefulWidget {
  final List<Character> characters;

  const MobileZukanScreen({super.key, required this.characters});

  @override
  State<MobileZukanScreen> createState() => _MobileZukanScreenState();
}

class _MobileZukanScreenState extends State<MobileZukanScreen> {
  String _searchQuery = '';
  String _selectedElement = '전체';
  String _selectedPosition = '전체';

  final List<String> elements = ['전체', '화', '풍', '림', '산'];
  final List<String> positions = ['전체', 'FW', 'MF', 'DF', 'GK'];

  List<Character> get filteredList {
    return widget.characters.where((c) {
      final matchesSearch = _searchQuery.isEmpty ||
          c.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          c.team.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesElem = _selectedElement == '전체' || c.element == _selectedElement;
      final matchesPos = _selectedPosition == '전체' || c.position == _selectedPosition;
      return matchesSearch && matchesElem && matchesPos;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final list = filteredList;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      child: Column(
        children: [
          // 1. 검색창 및 필터 컨트롤 바
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: theme.colorScheme.outline),
            ),
            child: Column(
              children: [
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: '선수명 또는 팀 이름으로 검색...',
                    prefixIcon: const Icon(Icons.search, size: 20),
                    filled: true,
                    fillColor: theme.scaffoldBackgroundColor,
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // 속성/포지션 칩
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      ...elements.map((elem) {
                        final isSel = _selectedElement == elem;
                        return Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: FilterChip(
                            label: Text(elem, style: const TextStyle(fontSize: 11)),
                            selected: isSel,
                            onSelected: (_) => setState(() => _selectedElement = elem),
                            selectedColor: AppTheme.getElementColor(elem).withOpacity(0.25),
                          ),
                        );
                      }),
                      const SizedBox(width: 6),
                      Container(width: 1, height: 20, color: theme.colorScheme.outline),
                      const SizedBox(width: 6),
                      ...positions.map((pos) {
                        final isSel = _selectedPosition == pos;
                        return Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: FilterChip(
                            label: Text(pos, style: const TextStyle(fontSize: 11)),
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
          const SizedBox(height: 8),

          // 검색 결과 카운트
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('검색 결과 ${list.length}명', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 6),

          // 2. 모바일 3열 그리드
          Expanded(
            child: list.isEmpty
                ? const Center(child: Text('조건에 일치하는 선수가 없습니다.'))
                : GridView.builder(
                    padding: const EdgeInsets.only(bottom: 80),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      childAspectRatio: 0.72,
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                    ),
                    itemCount: list.length,
                    itemBuilder: (ctx, idx) {
                      final char = list[idx];
                      return _buildPlayerCard(context, char);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerCard(BuildContext context, Character char) {
    final theme = Theme.of(context);
    final elemColor = AppTheme.getElementColor(char.element);

    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => PlayerProfileScreen(character: char)),
        );
      },
      borderRadius: BorderRadius.circular(14),
      child: Container(
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: theme.colorScheme.outline),
        ),
        child: Column(
          children: [
            Expanded(
              child: Stack(
                children: [
                  Center(
                    child: char.image.isNotEmpty
                        ? Image.network(
                            char.image,
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 36),
                          )
                        : const Icon(Icons.person, size: 36),
                  ),
                  Positioned(
                    top: 4,
                    left: 4,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      decoration: BoxDecoration(
                        color: elemColor,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        char.element,
                        style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 4,
                    right: 4,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        char.position,
                        style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
              width: double.infinity,
              decoration: BoxDecoration(
                color: theme.scaffoldBackgroundColor.withOpacity(0.5),
                borderRadius: const BorderRadius.vertical(bottom: Radius.circular(14)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    char.displayName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 10),
                  ),
                  Text(
                    char.team,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: Colors.grey[400], fontSize: 8),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
