import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:convert';
import 'theme/app_theme.dart';
import 'models/character.dart';
import 'widgets/responsive_scaffold.dart';
import 'screens/home_screen.dart';
import 'screens/zukan_screen.dart';
import 'screens/tactics_screen.dart';
import 'screens/settings_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const InazumaStationApp());
}

class InazumaStationApp extends StatefulWidget {
  const InazumaStationApp({super.key});

  @override
  State<InazumaStationApp> createState() => _InazumaStationAppState();
}

class _InazumaStationAppState extends State<InazumaStationApp> {
  bool _isDarkMode = true;

  void _toggleTheme() {
    setState(() {
      _isDarkMode = !_isDarkMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '이나즈마 스테이션',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: MainNavigationController(
        isDarkMode: _isDarkMode,
        onToggleTheme: _toggleTheme,
      ),
    );
  }
}

/// 🎛️ 메인 네비게이션 컨트롤러
class MainNavigationController extends StatefulWidget {
  final bool isDarkMode;
  final VoidCallback onToggleTheme;

  const MainNavigationController({
    super.key,
    required this.isDarkMode,
    required this.onToggleTheme,
  });

  @override
  State<MainNavigationController> createState() => _MainNavigationControllerState();
}

class _MainNavigationControllerState extends State<MainNavigationController> {
  int _currentIndex = 0;
  List<Character> _characters = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCharacterData();
  }

  Future<void> _loadCharacterData() async {
    try {
      final String jsonString = await rootBundle.loadString('assets/data/characters.json');
      final List<dynamic> jsonList = json.decode(jsonString);
      setState(() {
        _characters = jsonList.map((j) => Character.fromJson(j)).toList();
        _isLoading = false;
      });
    } catch (e) {
      // 로컬 파일 경로 대체 또는 기본 데모 데이터
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
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    final List<Widget> screens = [
      HomeScreen(onNavigate: (index) => setState(() => _currentIndex = index)),
      ZukanScreen(characters: _characters),
      TacticsScreen(allCharacters: _characters),
      SettingsScreen(
        isDarkMode: widget.isDarkMode,
        onToggleTheme: widget.onToggleTheme,
      ),
    ];

    return ResponsiveScaffold(
      currentIndex: _currentIndex,
      onNavigationChanged: (index) => setState(() => _currentIndex = index),
      title: _getTitle(),
      body: screens[_currentIndex],
    );
  }
}
