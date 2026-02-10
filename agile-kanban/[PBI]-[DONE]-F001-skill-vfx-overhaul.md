# [PBI] F001 - Skill VFX Overhaul ("The Spectacle")

## Priority: CRITICAL
## Estimate: Large (2-3hr)

## Problem Statement
All 10 skills look identical (generic colored particles). The renderer has ZERO visual feedback for active skill states.
- No buff auras (Rage Mode, Shield Wall invisible)
- No unique skill animations (all use same spawnParticles)
- Wrong SFX (all use menuClick)
- No persistent effect rendering

## Acceptance Criteria
- [ ] Skill effects engine (G.skillEffects[] + drawSkillEffects())
- [ ] 5 unique tactical skill VFX (ground_slam, wind_burst, shadow_strike, shield_wall, life_drain)
- [ ] 5 unique ultimate skill VFX (rage_mode, eight_trigrams, blade_storm, changban_charge, phoenix_summon)
- [ ] Persistent buff auras on player (rage=fire, shield=dome)
- [ ] Skill-specific SFX (replace menuClick)
- [ ] Buff duration indicators visible on player character
- [ ] 60fps maintained (bounded particle count)

## Technical Plan
1. Add `G.skillEffects = []` to engine.js game state
2. Add `drawSkillEffects()` to renderer.js (called after drawPlayer)
3. Rework `fireTacticalSkill()` in game.js with unique VFX per skill
4. Rework `fireUltimateSkill()` in game.js with unique VFX per skill
5. Add persistent aura rendering in `drawPlayer()` for buff states
6. Add skill SFX functions to sound.js
7. Verify in-game via browser playtest

## YOLO Session Log
### Started: 2026-02-10T14:40:00+07:00
- **Agent:** Antigravity YOLO Mode
- **Estimated:** Large
