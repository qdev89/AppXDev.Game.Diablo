# PBI-O003: Duo Wu Xing Combinations

**Epic:** Phase O: The Evolution (v1.3)
**Priority:** HIGH (RICE 149)
**Status:** TODO

## Description
Unlock powerful "Duo Blessings" when possessing 2+ different elemental blessings. These act as synergy bonuses for combining elements.

## Mechanics
- **Trigger:** Having at least 1 blessing of Element A AND 1 blessing of Element B.
- **Effect:** Grants a unique effect combining aspects of both elements (e.g., Fire + Water = Steam Barrier).
- **Visual:** Unique icon representing combined elements (Blue + Red glow).

## Duo Combinations (Initial Set)
1. **Steam Barrier (Fire + Water):** AoE Damage Cloud + Damage Shield.
2. **Blade Storm (Wood + Metal):** Spinning blade projectiles + Lifesteal.
3. **Magma Zone (Earth + Fire):** Ground creates lava pools under enemies.
4. **Frozen Earth (Earth + Water):** Enemies in range are Rooted + Slowed.
5. **Thunder Strike (Metal + Wood):** Chain lightning between enemies.
6. **Void Rift (All 5):** ULTIMATE: Black Hole pulling enemies + heavy damage.

## Technical Details
- Extend `BlessingState` in `blessings.js` to track elemental combinations.
- Implement `checkDuoBlessings` logic.
- Add `duoBlessings` definitions.
