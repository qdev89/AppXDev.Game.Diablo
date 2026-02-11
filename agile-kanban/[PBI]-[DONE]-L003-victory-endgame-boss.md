# L003: Victory Timer + Endgame Boss

## Priority: HIGH
## Effort: Medium
## Phase: L — The Living World

## Description
Add a victory condition — survive and progress through rooms for 25 minutes to reach the Final Boss encounter. Killing the Final Boss completes the run with a Victory Screen showing stats. This transforms the game from "endless survival" to "roguelike with a finish line."

## Acceptance Criteria
- [ ] Run timer displayed in HUD (counts up from 0:00)
- [ ] At 20:00, warning: "THE DYNASTY AWAITS..." with dramatic effects
- [ ] At 25:00, force-spawn the Final Boss regardless of room state
- [ ] Final Boss: "Dong Zhuo, The Tyrant" — massive HP, unique abilities
  - Phase 1: Summons officer waves while attacking
  - Phase 2 (50% HP): Enrages — faster, AOE fire attacks
  - Phase 3 (25% HP): Desperation — spawns Lu Bu clone ally
- [ ] Killing Final Boss → VICTORY state with celebration VFX
- [ ] Victory Screen shows:
  - Total time, floor reached, rooms cleared
  - Enemies killed, combos triggered
  - Blessings collected, element affinity
  - Difficulty tier, hero used
  - "RUN COMPLETE" title with gold flourish
- [ ] Victory unlocks next difficulty tier
- [ ] Player can continue playing after victory (endless mode)

## Technical Notes
- Add `G.runTimer` incrementing in `update()`
- Final Boss spawning logic in `systems.js`
- New VICTORY state and `drawVictoryScreen()` in `hud.js`
- Boss abilities as special attack patterns in `weapons.js`
- Victory screen reuses stats from `G` state variables
