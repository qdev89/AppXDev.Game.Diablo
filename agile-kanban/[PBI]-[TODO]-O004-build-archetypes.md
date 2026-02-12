# PBI-O004: Build Archetype Bonuses

**Epic:** Phase O: The Evolution (v1.3)
**Priority:** MEDIUM-HIGH (RICE 112)
**Status:** TODO

## Description
Encourage focused builds by offering bonuses when stacking enough items of a specific theme (Archetypes).

## Mechanics
- **Trigger:** Having 3+ items of the same theme or hitting a specific stat threshold.
- **Bonus:** Grants a permanent or conditional bonus aligned with the theme.
- **Visual:** Display Archetype name (e.g., "Pyromancer") and icon on HUD.

## Archetypes
1. **Pyromancer:** 3+ Fire items = Fire Damage +50%.
2. **Cryomancer:** 3+ Water items = Freeze Duration +100%.
3. **Berserker:** Damage > 200% Base = Attack Speed +30%.
4. **Juggernaut:** HP > 200% Base = Damage Reduction +30%.
5. **Speedster:** Move Speed > 150% = Dodge Chance +20%.

## Technical Details
- Implement `checkArchetypeBonuses` in `blessings.js` or `systems.js`.
- Update `hud.js` to display the active Archetype.
