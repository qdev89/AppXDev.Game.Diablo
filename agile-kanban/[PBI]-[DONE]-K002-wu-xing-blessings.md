# K002: Wu Xing Blessing System

## Priority: CRITICAL
## Effort: Medium
## Phase: K — The Roguelike Soul

## Description
Implement Hades-style boon system themed around Wu Xing (Five Elements). Five elemental deities offer themed blessings that synergize with each other, replacing generic level-up stat boosts with build-defining choices.

## Acceptance Criteria
- [ ] 5 Elemental Deities with unique blessing pools:
  - 🌿 Shennong (WOOD): Healing, thorns, poison
  - 🔥 Zhurong (FIRE): Damage, burn, explosions
  - ⛰️ Houtu (EARTH): Armor, stun, shields
  - ⚔️ Bai Hu (METAL): Speed, pierce, bleed
  - 🌊 Gonggong (WATER): Freeze, life steal, wave clear
- [ ] Each deity has 4-6 blessings (Common → Rare → Epic)
- [ ] Blessings appear as room rewards and level-up choices
- [ ] Blessing card UI shows deity icon, element color, effect description
- [ ] Element affinity tracker: count blessings per element
- [ ] Bonus at 3+ blessings of same element (set bonus)
- [ ] At least 3 Duo Blessings (combining 2 elements)
- [ ] Blessings persist for entire run, reset on death
- [ ] Blessing inventory viewable from pause menu

## Technical Notes
- New `blessings.js` file for blessing definitions and logic
- Modify `hud.js` level-up card system to show blessing cards
- Blessing effects applied in `weapons.js` and `systems.js`
- Wu Xing generating cycle: WOOD→FIRE→EARTH→METAL→WATER
