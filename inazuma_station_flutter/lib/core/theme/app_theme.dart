import 'package:flutter/material.dart';

/// 🎨 이나즈마 스테이션 모바일 전용 프리미엄 테마 시스템
class AppTheme {
  // 브랜드 메인 & 액센트 컬러
  static const Color primaryBlue = Color(0xFF3B82F6);
  static const Color primaryCyan = Color(0xFF06B6D4);
  static const Color primaryGreen = Color(0xFF10B981);
  static const Color primaryAmber = Color(0xFFF59E0B);
  static const Color primaryPurple = Color(0xFF8B5CF6);

  // 다크 테마 표면 & 배경
  static const Color darkBg = Color(0xFF0A0F1D);
  static const Color darkCard = Color(0xFF131C2E);
  static const Color darkSurface = Color(0xFF1E293B);
  static const Color darkBorder = Color(0xFF2E3D56);

  // 라이트 테마 표면 & 배경
  static const Color lightBg = Color(0xFFF1F5F9);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color lightBorder = Color(0xFFE2E8F0);

  // 속성 컬러 (화/풍/림/산)
  static const Color fire = Color(0xFFEF4444);
  static const Color wind = Color(0xFF0EA5E9);
  static const Color wood = Color(0xFF10B981);
  static const Color earth = Color(0xFFF59E0B);

  static Color getElementColor(String elem) {
    switch (elem) {
      case '화': return fire;
      case '풍': return wind;
      case '림': return wood;
      case '산': return earth;
      default: return primaryBlue;
    }
  }

  // 모바일 다크 테마
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: primaryBlue,
      scaffoldBackgroundColor: darkBg,
      colorScheme: const ColorScheme.dark(
        primary: primaryBlue,
        secondary: primaryGreen,
        surface: darkCard,
        outline: darkBorder,
      ),
      cardTheme: CardTheme(
        color: darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: darkBorder, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkCard,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  // 모바일 라이트 테마
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryBlue,
      scaffoldBackgroundColor: lightBg,
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: primaryGreen,
        surface: lightCard,
        outline: lightBorder,
      ),
      cardTheme: CardTheme(
        color: lightCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: lightBorder, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: lightCard,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: Color(0xFF0F172A),
          fontSize: 18,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}
