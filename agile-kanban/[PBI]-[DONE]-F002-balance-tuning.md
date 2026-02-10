# [PBI] F002 - Balance Tuning ("The Equilibrium")

## Priority: HIGH
## Estimate: Medium (1-2hr)

## Problem Statement
After the VFX overhaul, hero power levels feel uneven. Some tacticals feel too weak, some ultimates too strong. Enemy scaling needs tuning for longer runs. Weapon damage/cooldown ratios need review.

## Acceptance Criteria
- [ ] Hero base stats rebalanced (HP/SPD/MP feel distinct per class)
- [ ] Tactical skill damage/cooldown/range balanced for each hero
- [ ] Ultimate skill damage/duration balanced (Berserker vs Mystic too different)
- [ ] Enemy HP/damage scales better per floor (currently too flat after floor 5)
- [ ] Boss fights feel challenging but fair (HP, damage, phase transitions)
- [ ] Weapon damage progression makes sense (tier 1 < tier 2 < evolved)
- [ ] XP curve feels rewarding (not too fast or slow to level up)
- [ ] Playtest all 5 heroes to floor 10 — none should feel unplayable

## Technical Plan
1. Review hero stats in `heroes.js` — adjust HP/SPD/MP gaps
2. Balance tactical skills in `hud.js` (damage, cooldowns, ranges)
3. Balance ultimate skills in `hud.js` (damage, durations)
4. Adjust enemy scaling formulas in `systems.js` (HP × floor multiplier)
5. Review boss stats in `systems.js` (spawning, HP, damage)
6. Audit weapon WEAPON_DEFS in `weapons.js` (dmg/cd ratios)
7. Verify XP curve in `systems.js` (checkLevelUp thresholds)
