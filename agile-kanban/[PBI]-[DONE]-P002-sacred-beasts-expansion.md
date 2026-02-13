# PBI-P002: Four Sacred Beasts Expansion (Tứ Linh)

**Epic:** Phase P: The Ascendant (v1.3)
**Priority:** HIGH (RICE 280)
**Status:** TODO

## Description
Expand the Sacred Beast system from only Phụng (Phoenix/Fire) to all four Chinese guardian beasts. Workshop unlock recipes already exist in `workshop.js`. `SACRED_BEASTS` dictionary in `heroes.js` only has Phoenix. Need to add 3 more beasts with distinct combat styles.

## Existing Infrastructure
- `SACRED_BEASTS{}` in `heroes.js` — only has Phoenix
- Workshop recipes for Azure Dragon, White Tiger, Black Tortoise — already defined
- `updateSacredBeast()` / `drawSacredBeast()` in `hud.js` — working
- `G.sacredBeast` state management — working

## New Beasts

| Beast | Element | Combat Style | Special |
|-------|---------|-------------|---------|
| 🐲 Thanh Long (Azure Dragon) | WOOD | Charges through enemies in a line | Leaves healing trail for player |
| 🐅 Bạch Hổ (White Tiger) | METAL | Lunges at nearest elite/strongest | Executes enemies below 10% HP |
| 🐢 Huyền Vũ (Black Tortoise) | WATER | Orbits player as shield | Absorbs projectiles, reflects as ice shards |
| 🔥 Chu Tước (Phoenix) | FIRE | Orbits + fire AoE | ✅ Already implemented |

## Technical Details
- Add 3 entries to `SACRED_BEASTS{}` in `heroes.js`
- Each beast needs: `update(dt)` behavior, `draw()` visuals, unique VFX
- Wire Workshop unlock → beast availability at hero select
- Beast element matching hero element = Resonance Bonus (+25% beast damage)
