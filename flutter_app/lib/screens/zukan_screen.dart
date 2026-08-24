import 'package:flutter/material.dart';
import '../models/character.dart';
import '../theme/app_theme.dart';
import '../widgets/responsive_scaffold.dart';
import 'player_detail_screen.dart';

/// 📖 캐릭터 대도감 화면 (스마트폰 그리드 2~3열, 태블릿 4~6열 적응형 반응형)
class ZukanScreen extends StatefulWidget {
  final List<Character> characters;

  const ZukanScreen({super.key, required this.characters});

  @override
  State<ZukanScreen> createState() => _ZukanScreenState();
}

class _ZukanScreenState extends State<ZukanScreen> {
  String _searchQuery = '';
  String _selectedElement = '전체';
  String _selectedPosition = '전체';

  final List<String> elements = ['전체', '화', '풍', '림', '산'];
  final List<String> positions = ['전체', 'FW', 'MF', 'DF', 'GK'];

  List<Character> get filteredCharacters {
    return widget.characters.where((c) {
      final matchesSearch = _searchQuery.isEmpty ||
          c.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          c.team.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesElement =
          _selectedElement == '전체' || c.element == _selectedElement;
      final matchesPosition =
          _selectedPosition == '전체' || c.position == _selectedPosition;
      return matchesSearch && matchesElement && matchesPosition;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveScaffold.isMobile(context);
    final theme = Theme.of(context);
    final list = filteredCharacters;

    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 24,
        vertical: 12,
      ),
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
                // 검색 텍스트 필드
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: '선수명 또는 팀 이름으로 검색...',
                    prefixIcon: const Icon(Icons.search),
                    filled: true,
                    fillColor: theme.scaffoldBackgroundColor,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  ),
                ),
                const SizedBox(height: 10),

                // 속성 & 포지션 칩 스크롤 바
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      // 속성 필터 칩
                      ...elements.map((elem) {
                        final isSelected = _selectedElement == elem;
                        return Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: FilterChip(
                            label: Text(elem),
                            selected: isSelected,
                            onSelected: (_) =>
                                setState(() => _selectedElement = elem),
                            selectedColor: AppTheme.getElementColor(elem).withOpacity(0.25),
                            side: BorderSide(
                              color: isSelected
                                  ? AppTheme.getElementColor(elem)
                                  : theme.colorScheme.outline,
                            ),
                          ),
                        );
                      }),
                      const SizedBox(width: 8),
                      Container(width: 1, height: 24, color: theme.colorScheme.outline),
                      const SizedBox(width: 8),
                      // 포지션 필터 칩
                      ...positions.map((pos) {
                        final isSelected = _selectedPosition == pos;
                        return Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: FilterChip(
                            label: Text(pos),
                            selected: isSelected,
                            onSelected: (_) =>
                                setState(() => _selectedPosition = pos),
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
          const SizedBox(height: 12),

          // 2. 선수 목록 헤더 (카운트)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '검색 결과 ${list.length}명',
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // 3. 적응형 캐릭터 카드 그리드
          Expanded(
            child: list.isEmpty
                ? const Center(
                    child: Text('조건에 일치하는 선수가 없습니다.'),
                  )
                : GridView.builder(
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: isMobile ? 3 : (ResponsiveScaffold.isTablet(context) ? 4 : 6),
                      childAspectRatio: 0.72,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                    ),
                    itemCount: list.length,
                    itemBuilder: (context, index) {
                      final char = list[index];
                      return _buildCharacterCard(context, char);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildCharacterCard(BuildContext context, Character char) {
    final theme = Theme.of(context);
    final elemColor = AppTheme.getElementColor(char.element);

    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PlayerDetailScreen(character: char),
          ),
        );
      },
      borderRadius: BorderRadius.circular(14),
      child: Container(
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: theme.colorScheme.outline, width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 이미지 및 상단 속성/포지션 뱃지
            Expanded(
              child: Stack(
                children: [
                  Center(
                    child: char.image.isNotEmpty
                        ? Image.network(
                            char.image,
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 40),
                          )
                        : const Icon(Icons.person, size: 40),
                  ),
                  Positioned(
                    top: 6,
                    left: 6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                      decoration: BoxDecoration(
                        color: elemColor,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        char.element,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 6,
                    right: 6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        char.position,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // 이름 및 팀명
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: theme.scaffoldBackgroundColor.withOpacity(0.6),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(14),
                  bottomRight: Radius.circular(14),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    char.displayName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11),
                  ),
                  Text(
                    char.team,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: Colors.grey[400], fontSize: 9),
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
