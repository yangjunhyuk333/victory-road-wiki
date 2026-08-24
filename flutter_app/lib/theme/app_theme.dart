import 'package:flutter/material.dart';

/// 🎨 이나즈마 스테이션 테마 및 컬러 팔레트 정의
class AppTheme {
  // 브랜드 메인 및 액센트 색상
  static const Color primaryBlue = Color(0xFF3B82F6);
  static const Color primaryGreen = Color(0xFF10B981);
  static const Color accentAmber = Color(0xFFF59E0B);
  static const Color accentPurple = Color(0xFF8B5CF6);
  static const Color accentRose = Color(0xFFF43F5E);

  // 다크 테마 배경 및 표면 색상
  static const Color darkBackground = Color(0xFF0B1120);
  static const Color darkSurface = Color(0xFF1E293B);
  static const Color darkSurfaceCard = Color(0xFF162032);
  static const Color darkBorder = Color(0xFF334155);

  // 라이트 테마 배경 및 표면 색상
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightBorder = Color(0xFFE2E8F0);

  // 속성별 시그니처 색상 (화/풍/림/산)
  static const Color elementFire = Color(0xFFEF4444);
  static const Color elementWind = Color(0xFF0EA5E9);
  static const Color elementWood = Color(0xFF10B981);
  static const Color elementEarth = Color(0xFFF59E0B);

  static Color getElementColor(String element) {
    switch (element) {
      case '화': return elementFire;
      case '풍': return elementWind;
      case '림': return elementWood;
      case '산': return elementEarth;
      default: return primaryBlue;
    }
  }

  // 다크 모드 테마 데이터
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: primaryBlue,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: primaryBlue,
        secondary: primaryGreen,
        surface: darkSurface,
        surfaceContainerHighest: darkSurfaceCard,
        outline: darkBorder,
      ),
      cardTheme: CardTheme(
        color: darkSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: darkBorder, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }

  // 라이트 모드 테마 데이터
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryBlue,
      scaffoldBackgroundColor: lightBackground,
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: primaryGreen,
        surface: lightSurface,
        surfaceContainerHighest: Color(0xFFF1F5F9),
        outline: lightBorder,
      ),
      cardTheme: CardTheme(
        color: lightSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: lightBorder, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: lightSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: Color(0xFF0F172A),
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
