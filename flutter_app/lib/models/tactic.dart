import 'character.dart';

/// 📍 전술판 내 선수 카드 위치 좌표 노드
class TacticPosition {
  final int id;
  final String role;
  double top;
  double left;

  TacticPosition({
    required this.id,
    required this.role,
    required this.top,
    required this.left,
  });

  factory TacticPosition.fromJson(Map<String, dynamic> json) {
    return TacticPosition(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      role: json['role'] ?? 'MF',
      top: (json['top'] as num?)?.toDouble() ?? 50.0,
      left: (json['left'] as num?)?.toDouble() ?? 50.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'role': role,
      'top': top,
      'left': left,
    };
  }
}

/// 📋 전술 데이터 모델 (JSON 파일 내보내기/불러오기 완벽 호환)
class Tactic {
  final String id;
  String title;
  String formation;
  Map<String, Character> squad;
  Map<String, Character> bench;
  Character? coach;
  List<TacticPosition> positions;
  DateTime createdAt;
  DateTime updatedAt;

  Tactic({
    required this.id,
    required this.title,
    required this.formation,
    required this.squad,
    required this.bench,
    this.coach,
    required this.positions,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Tactic.fromJson(Map<String, dynamic> json) {
    // squad 파싱
    Map<String, Character> squadMap = {};
    if (json['squad'] is Map) {
      (json['squad'] as Map).forEach((k, v) {
        if (v is Map<String, dynamic>) {
          squadMap[k.toString()] = Character.fromJson(v);
        }
      });
    }

    // bench 파싱
    Map<String, Character> benchMap = {};
    if (json['bench'] is Map) {
      (json['bench'] as Map).forEach((k, v) {
        if (v is Map<String, dynamic>) {
          benchMap[k.toString()] = Character.fromJson(v);
        }
      });
    }

    // positions 파싱
    List<TacticPosition> posList = [];
    if (json['positions'] is List) {
      posList = (json['positions'] as List)
          .map((p) => TacticPosition.fromJson(p as Map<String, dynamic>))
          .toList();
    }

    return Tactic(
      id: json['id']?.toString() ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: json['title'] ?? '무제 전술',
      formation: json['formation'] ?? '4-4-2',
      squad: squadMap,
      bench: benchMap,
      coach: json['coach'] != null ? Character.fromJson(json['coach']) : null,
      positions: posList,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt']) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'formation': formation,
      'squad': squad.map((k, v) => MapEntry(k, v.toJson())),
      'bench': bench.map((k, v) => MapEntry(k, v.toJson())),
      'coach': coach?.toJson(),
      'positions': positions.map((p) => p.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
