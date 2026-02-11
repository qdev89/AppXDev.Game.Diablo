# L001: Status Effect Synergy Combos

## Priority: HIGH
## Effort: Medium
## Phase: L — The Living World

## Description
Implement Wu Xing generating/overcoming cycle synergies between status effects. When two different elemental debuffs are on the same enemy, trigger a powerful combo effect. This creates emergent build depth and rewards players who collect blessings from multiple elements.

## Acceptance Criteria
- [ ] Wu Xing Generating Cycle combos (5):
  - WOOD → FIRE: "Wildfire" — Poison + Burn = spreading fire explosion
  - FIRE → EARTH: "Magma Flow" — Burn + Stun = lava pool AoE
  - EARTH → METAL: "Shatter" — Stun + Bleed = armor break (2x damage for 3s)
  - METAL → WATER: "Frost Blade" — Bleed + Freeze = instant shatter (3x damage burst)
  - WATER → WOOD: "Overgrowth" — Freeze + Poison = vines root + massive DoT
- [ ] Wu Xing Overcoming Cycle combos (5):
  - WOOD *overcomes* EARTH: "Upheaval" — roots + stun = earthquake AoE
  - EARTH *overcomes* WATER: "Dam Break" — stun + freeze = ice explosion
  - WATER *overcomes* FIRE: "Steam Burst" — freeze + burn = fog cloud (blind area)
  - FIRE *overcomes* METAL: "Forge Strike" — burn + bleed = molten weapons (+50% dmg 5s)
  - METAL *overcomes* WOOD: "Harvest" — bleed + poison = HP orb drops
- [ ] Visual VFX burst when combo triggers (unique per combo)
- [ ] Combo notification text appears on screen ("WILDFIRE!", "STEAM BURST!", etc.)
- [ ] Combo damage scales with player level and blessing count
- [ ] Combo cooldown per enemy (1.5s) to prevent spam
- [ ] Combo counter in HUD (total combos this run)

## Technical Notes
- Add `checkElementalCombo(enemy)` in `systems.js` — called when any debuff is applied
- Combo VFX in `renderer.js` or `postfx.js`
- Combo notification in `hud.js`
- Reference Wu Xing cycles from `engine.js` ELEMENTS data
