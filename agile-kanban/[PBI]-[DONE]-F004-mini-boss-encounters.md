# [PBI] F004 - Mini-Boss Encounters ("The Generals")

## Status: ✅ DONE (v0.7.2)
## Priority: MEDIUM
## Estimate: Large (2-3hr)

## Problem Statement
Between boss floors (5/10/15), gameplay becomes repetitive. Adding named mini-boss "generals" with unique attack patterns would add variety, challenge, and Dynasty Warriors flavor.

## Acceptance Criteria
- [x] 5 named mini-bosses (one per element) with unique appearances
- [x] Each mini-boss has 2-3 telegraphed attack patterns
- [x] Mini-boss HP bar with name display (like bosses but smaller)
- [x] Mini-bosses spawn on floors 3, 7, 8, 12, 13, 17, 18 (between boss floors)
- [x] Killing a mini-boss grants a guaranteed equipment drop
- [x] Mini-boss entrance announcement (name + title banner)
- [x] Death VFX + reward fanfare

## Mini-Boss Roster
| Name | Element | Behavior | Signature Attack |
|------|---------|----------|-----------------|
| Dong Zhuo | FIRE | Slow + AoE slam | Fire ring explosion |
| Yuan Shao | WOOD | Summon archers | Arrow volley (spawns 3 archers) |
| Cao Cao | METAL | Fast + dodge | Triple slash combo (3 projectiles spread) |
| Sun Jian | EARTH | Shield + charge | Tiger charge (dash + AoE damage) |
| Diao Chan | WATER | Teleport + charm | Confusion debuff (2.5s reversed controls) |

## Implementation Log
### Files Modified:
- **systems.js**: Added miniboss type to spawnEnemy, full AI in updateEnemies (entrance freeze, enrage at 30%, special ability cooldowns), _minibossSpawned flag reset in nextFloor
- **game.js**: Mini-boss spawn trigger on floors [3,7,8,12,13,17,18], confusion debuff handler in updatePlayer (reversed controls)
- **weapons.js**: killEnemy rewards for miniboss: celebration VFX, guaranteed equipment drop (armor/talisman/mount with quality scaling), stat bonuses, bonus gold
- **hud.js**: Extended drawBossHPBar for mini-boss HP bar (smaller, gold-tinted, name+title), confusion debuff visual overlay, equipment display on HUD, version bump to v0.7.2
- **renderer.js**: Extended enemy aura system for miniboss type (distinct amber/gold aura with element ring)

### Key Design Decisions:
- Equipment drops auto-equip (no inventory system yet) with stat bonuses: armor=+HP, talisman=+dmg%, mount=+speed
- Quality scales by floor: common(<5), uncommon(5-9), rare(10+)
- Cao Cao's projectiles use archerBullets system for proper player collision
- Generals assigned semi-randomly to floors (floor + random offset mod 5)
