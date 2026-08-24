/// ⚽ 선수(캐릭터) 데이터 모델
class Character {
  final String id;
  final String name;
  final String? version;
  final String element; // 화, 풍, 림, 산
  final String position; // GK, DF, MF, FW
  final String team;
  final String? gender;
  final String? grade;
  final String image;
  final Map<String, dynamic>? stats;
  final List<dynamic>? skills;

  Character({
    required this.id,
    required this.name,
    this.version,
    required this.element,
    required this.position,
    required this.team,
    this.gender,
    this.grade,
    required this.image,
    this.stats,
    this.skills,
  });

  factory Character.fromJson(Map<String, dynamic> json) {
    return Character(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '이름 없음',
      version: json['version'],
      element: json['element'] ?? '무',
      position: json['position'] ?? 'MF',
      team: json['team'] ?? '무소속',
      gender: json['gender'],
      grade: json['grade'],
      image: json['image'] ?? '',
      stats: json['stats'] is Map<String, dynamic> ? json['stats'] : null,
      skills: json['skills'] is List ? json['skills'] : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'version': version,
      'element': element,
      'position': position,
      'team': team,
      'gender': gender,
      'grade': grade,
      'image': image,
      'stats': stats,
      'skills': skills,
    };
  }

  String get displayName => version != null && version!.isNotEmpty ? '$name ($version)' : name;
}
