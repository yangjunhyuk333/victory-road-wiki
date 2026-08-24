import '../../models/tactic.dart';

/// ⚽ 지원 포메이션 8종 기본 레이아웃 정의 (0~100% 비율 좌표계)
class Formations {
  static final Map<String, List<TacticPosition>> defaultPresets = {
    '4-4-2': [
      TacticPosition(id: 0, role: 'GK', top: 85, left: 50),
      TacticPosition(id: 1, role: 'LB', top: 68, left: 15),
      TacticPosition(id: 2, role: 'LCB', top: 70, left: 35),
      TacticPosition(id: 3, role: 'RCB', top: 70, left: 65),
      TacticPosition(id: 4, role: 'RB', top: 68, left: 85),
      TacticPosition(id: 5, role: 'LM', top: 44, left: 15),
      TacticPosition(id: 6, role: 'LCM', top: 46, left: 36),
      TacticPosition(id: 7, role: 'RCM', top: 46, left: 64),
      TacticPosition(id: 8, role: 'RM', top: 44, left: 85),
      TacticPosition(id: 9, role: 'LS', top: 18, left: 35),
      TacticPosition(id: 10, role: 'RS', top: 18, left: 65),
    ],
    '4-3-3': [
      TacticPosition(id: 0, role: 'GK', top: 85, left: 50),
      TacticPosition(id: 1, role: 'LB', top: 68, left: 15),
      TacticPosition(id: 2, role: 'LCB', top: 70, left: 35),
      TacticPosition(id: 3, role: 'RCB', top: 70, left: 65),
      TacticPosition(id: 4, role: 'RB', top: 68, left: 85),
      TacticPosition(id: 5, role: 'LCM', top: 48, left: 30),
      TacticPosition(id: 6, role: 'CM', top: 52, left: 50),
      TacticPosition(id: 7, role: 'RCM', top: 48, left: 70),
      TacticPosition(id: 8, role: 'LW', top: 22, left: 20),
      TacticPosition(id: 9, role: 'CF', top: 18, left: 50),
      TacticPosition(id: 10, role: 'RW', top: 22, left: 80),
    ],
    '3-5-2': [
      TacticPosition(id: 0, role: 'GK', top: 85, left: 50),
      TacticPosition(id: 1, role: 'LCB', top: 70, left: 25),
      TacticPosition(id: 2, role: 'CB', top: 72, left: 50),
      TacticPosition(id: 3, role: 'RCB', top: 70, left: 75),
      TacticPosition(id: 4, role: 'LWB', top: 50, left: 15),
      TacticPosition(id: 5, role: 'LDM', top: 54, left: 35),
      TacticPosition(id: 6, role: 'CAM', top: 38, left: 50),
      TacticPosition(id: 7, role: 'RDM', top: 54, left: 65),
      TacticPosition(id: 8, role: 'RWB', top: 50, left: 85),
      TacticPosition(id: 9, role: 'LS', top: 18, left: 35),
      TacticPosition(id: 10, role: 'RS', top: 18, left: 65),
    ],
    '4-2-3-1': [
      TacticPosition(id: 0, role: 'GK', top: 85, left: 50),
      TacticPosition(id: 1, role: 'LB', top: 68, left: 15),
      TacticPosition(id: 2, role: 'LCB', top: 70, left: 35),
      TacticPosition(id: 3, role: 'RCB', top: 70, left: 65),
      TacticPosition(id: 4, role: 'RB', top: 68, left: 85),
      TacticPosition(id: 5, role: 'LDM', top: 52, left: 35),
      TacticPosition(id: 6, role: 'RDM', top: 52, left: 65),
      TacticPosition(id: 7, role: 'LAM', top: 34, left: 20),
      TacticPosition(id: 8, role: 'CAM', top: 32, left: 50),
      TacticPosition(id: 9, role: 'RAM', top: 34, left: 80),
      TacticPosition(id: 10, role: 'ST', top: 16, left: 50),
    ],
  };

  static List<TacticPosition> getPositions(String formation) {
    return (defaultPresets[formation] ?? defaultPresets['4-4-2']!)
        .map((p) => TacticPosition(id: p.id, role: p.role, top: p.top, left: p.left))
        .toList();
  }
}
