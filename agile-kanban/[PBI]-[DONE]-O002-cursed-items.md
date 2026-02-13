# PBI-O002: Cursed Items (Dark Blessings)

**Epic:** Phase O: The Evolution (v1.3)
**Priority:** HIGH (RICE 221)
**Status:** TODO

## Description
Introduce "Cursed Items" (Dark Blessings) that significantly boost player power but come with severe downsides (curses). These are optional challenges that provide high risk/reward.

## Mechanics
- **Trigger:** Offered occasionally in dungeon choices (purple glow / skull icon).
- **Effect:** Apply a specific Curse alongside a strong Bonus.
- **Visual:** Ominous UI (red/purple border, static effect), audio cue.

## Cursed Items List
- **Blood Oath:** +80% Damage / Lose 2 HP/sec.
- **Glass Cannon:** +200% Damage / Max HP = 1.
- **Soul Harvest:** +100% XP / No healing from any source.
- **Berserker's Rage:** +10% Dmg per missing 10% HP / Can't gain shields.
- **Time Dilation:** +50% Atk Speed / Move 30% slower.
- **Golden Touch:** 3x Gold / -50% Damage.

## Technical Details
- Extend `Blessing` types in `blessings.js` to include "cursed" category.
- Update `applyPassive` and specific stat calculations (e.g., `updateBlessings`) to handle curses (e.g., ticking damage for Blood Oath, max HP scaling logic).
- UI changes in blessing selection to distinguish cursed items.
