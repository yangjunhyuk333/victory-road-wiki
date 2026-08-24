import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:convert';
import 'core/theme/app_theme.dart';
import 'models/character.dart';
import 'presentation/widgets/custom_bottom_nav.dart';
import 'presentation/screens/mobile_home_screen.dart';
import 'presentation/screens/mobile_zukan_screen.dart';
import 'presentation/screens/mobile_tactics_screen.dart';
import 'presentation/screens/settings_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const InazumaStationMobileApp());
}

class InazumaStationMobileApp extends StatefulWidget {
  const InazumaStationMobileApp({super.key});

  @override
  State<InazumaStationMobileApp> createState() => _InazumaStationMobileAppState();
}

class _InazumaStationMobileAppState extends State<InazumaStationMobileApp> {
  bool _isDarkMode = true;

  void _toggleTheme() {
    setState(() => _isDarkMode = !_isDarkMode);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '이나즈마 스테이션',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: MainMobileController(
        isDarkMode: _isDarkMode,
        onToggleTheme: _toggleTheme,
      ),
    );
  }
}

class MainMobileController extends StatefulWidget {
  final bool isDarkMode;
  final VoidCallback onToggleTheme;

  const MainMobileController({
    super.key,
    required this.isDarkMode,
    required this.onToggleTheme,
  });

  @override
  State<MainMobileController> createState() => _MainMobileControllerState();
}

class _MainMobileControllerState extends State<MainMobileController> {
  int _currentIndex = 0;
  List<Character> _characters = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCharacters();
  }

  Future<void> _loadCharacters() async {
    try {
      final String dataStr = await rootBundle.loadString('assets/data/characters.json');
      final List<dynamic> jsonList = json.decode(dataStr);
      setState(() {
        _characters = jsonList.map((j) => Character.fromJson(j)).toList();
        _isLoading = false;
      });
    } catch (e) {
      // 로컬 파일 미탑재 시 기본 데모 선수 로드
      setState(() {
        _characters = [
          Character(id: '1', name: '엔도 마모루', element: '화', position: 'GK', team: '라이몬 중학교', image: ''),
          Character(id: '2', name: '고엔지 슈야', element: '화', position: 'FW', team: '라이몬 중학교', image: ''),
          Character(id: '3', name: '키도 유우토', element: '풍', position: 'MF', team: '라이몬 중학교', image: ''),
          Character(id: '4', name: '카제마루 이치로타', element: '풍', position: 'DF', team: '라이몬 중학교', image: ''),
          Character(id: '5', name: '카베야마 헤이고로', element: '산', position: 'DF', team: '라이몬 중학교', image: ''),
          Character(id: '6', name: '후부키 시로', element: '풍', position: 'FW', team: '하쿠렌 중학교', image: ''),
        ];
        _isLoading = false;
      });
    }
  }

  String _getTitle() {
    switch (_currentIndex) {
      case 0: return '이나즈마 스테이션';
      case 1: return '캐릭터 대도감';
      case 2: return '축구 전술판 스튜디오';
      case 3: return '환경 설정';
      default: return '이나즈마 스테이션';
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final screenWidth = MediaQuery.of(context).size.width;
    final bool isMobile = screenWidth < 768;
    final theme = Theme.of(context);

    final screens = [
      MobileHomeScreen(characters: _characters, onNavigate: (i) => setState(() => _currentIndex = i)),
      MobileZukanScreen(characters: _characters),
      MobileTacticsScreen(allCharacters: _characters),
      SettingsScreen(isDarkMode: widget.isDarkMode, onToggleTheme: widget.onToggleTheme),
    ];

    if (isMobile) {
      // 📱 스마트폰 모바일 레이아웃
      return Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: theme.primaryColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.flash_on_rounded, color: theme.primaryColor, size: 20),
              ),
              const SizedBox(width: 8),
              Text(_getTitle(), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
            ],
          ),
        ),
        body: SafeArea(
          bottom: false,
          child: screens[_currentIndex],
        ),
        bottomNavigationBar: CustomBottomNav(
          currentIndex: _currentIndex,
          onTap: (i) => setState(() => _currentIndex = i),
        ),
      );
    } else {
      // 💻 태블릿/데스크톱 2-Column 대화면 레이아웃
      return Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              const Icon(Icons.sports_soccer, color: Colors.blue),
              const SizedBox(width: 10),
              const Text('이나즈마 스테이션 스튜디오 (태블릿/PC)', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
              const Spacer(),
              _buildTabletTab(0, '홈'),
              _buildTabletTab(1, '캐릭터 도감'),
              _buildTabletTab(2, '전술판'),
              _buildTabletTab(3, '설정'),
            ],
          ),
        ),
        body: screens[_currentIndex],
      );
    }
  }

  Widget _buildTabletTab(int idx, String label) {
    final isSelected = _currentIndex == idx;
    return Padding(
      padding: const EdgeInsets.only(left: 8),
      child: TextButton(
        onPressed: () => setState(() => _currentIndex = idx),
        style: TextButton.styleFrom(
          foregroundColor: isSelected ? Colors.blue : Colors.grey,
          textStyle: TextStyle(fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600),
        ),
        child: Text(label),
      ),
    );
  }
}
