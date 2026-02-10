# PBI-E003: Dynasty Warriors Musou Feel

## Priority: CRITICAL
## Points: 5

## Description
Transform combat from survival-horror to musou power fantasy.
3x more fodder enemies, chain bonuses, kill counter, crowd-clearing satisfaction.

## Changes
- New enemy type: 'fodder' — { hp: 5, speed: 30, dmg: 2, r: 4, xp: 1 }
- Spawn 15-20 fodder per wave (was 4-6 mixed)
- Keep existing types as 'officers' that appear among fodder
- Kill chain bonus: 10+ rapid kills = gold explosion + 2x score for 3s
- HUD: "SLAIN: X,XXX" persistent kill counter (DW signature)
- Screen-wide "1000 KILLS!" celebration at milestones

## Acceptance Criteria
- [ ] Fodder enemy type added, spawns in groups of 15-20
- [ ] Player can cleave through 10+ fodder in one swing (satisfying)
- [ ] Kill counter displayed on HUD
- [ ] Chain kill bonuses with visual feedback
- [ ] 100/500/1000 kill milestone celebrations
