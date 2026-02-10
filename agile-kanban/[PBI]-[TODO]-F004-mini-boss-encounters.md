# [PBI] F004 - Mini-Boss Encounters ("The Generals")

## Priority: MEDIUM
## Estimate: Large (2-3hr)

## Problem Statement
Between boss floors (5/10/15), gameplay becomes repetitive. Adding named mini-boss "generals" with unique attack patterns would add variety, challenge, and Dynasty Warriors flavor.

## Acceptance Criteria
- [ ] 5 named mini-bosses (one per element) with unique appearances
- [ ] Each mini-boss has 2-3 telegraphed attack patterns
- [ ] Mini-boss HP bar with name display (like bosses but smaller)
- [ ] Mini-bosses spawn on floors 3, 7, 8, 12, 13 (between boss floors)
- [ ] Killing a mini-boss grants a guaranteed equipment drop
- [ ] Mini-boss entrance announcement (name + title banner)
- [ ] Death VFX + reward fanfare

## Mini-Boss Roster
| Name | Element | Behavior | Signature Attack |
|------|---------|----------|-----------------|
| Dong Zhuo | FIRE | Slow + AoE slam | Fire ring explosion |
| Yuan Shao | WOOD | Summon archers | Arrow volley |
| Cao Cao | METAL | Fast + dodge | Triple slash combo |
| Sun Jian | EARTH | Shield + charge | Tiger charge |
| Diao Chan | WATER | Teleport + charm | Confusion debuff |

## Technical Plan
1. Add MINI_BOSS_DEFS to `heroes.js` or new `miniboss.js`
2. Add spawn logic to `systems.js` (spawnWave / nextFloor)
3. Add mini-boss AI patterns to `updateEnemies()`
4. Add mini-boss HP bar to HUD
5. Add entrance banner to renderer
6. Add guaranteed equipment drop to killEnemy
