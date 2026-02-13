# PBI-P007: Historical Synergies (Codex)

**Epic:** Phase P: The Ascendant (v1.3)
**Priority:** MEDIUM (RICE 160)
**Status:** TODO

## Description
Specific weapon + blessing + hero combinations trigger lore-accurate bonus effects. Synergies are hidden until triggered for the first time, then recorded in a discoverable "Codex" menu. Encourages experimentation and historical knowledge.

## Synergy Definitions

| Synergy | Historical Event | Requirements | Bonus |
|---------|-----------------|-------------|-------|
| 🔥 Battle of Red Cliffs | 赤壁之戰 | Fire weapon + Water blessing | Steam AoE on hit |
| 🔥 Burning of Luoyang | 火燒洛陽 | 3+ Fire blessings + Lu Bu | All fire damage +100% |
| 🛡️ Changban Bridge | 長坂橋 | Zhao Yun + no allies | +50% damage, +50% speed |
| 🔮 Eight Trigrams | 八陣圖 | Zhuge Liang + 4+ blessings | Enemies in range confused |
| 🤝 Peach Garden Oath | 桃園結義 | 3+ Brotherhood bonds | Start with +50 HP |

## Mechanics
- **Discovery:** Hidden until first trigger. "🔓 SYNERGY DISCOVERED!" announcement
- **Persistence:** Discovered synergies stored in localStorage
- **Codex:** Menu screen showing all synergies (discovered = details, undiscovered = "???")
- **Active Display:** Small icon on HUD when a synergy is active

## Technical Details
- New `synergies.js` file with definitions and check logic
- Check synergies on blessing acquisition, hero selection, bond changes
- Codex UI in `hud.js` accessible from pause menu
- localStorage key: `discoveredSynergies`
