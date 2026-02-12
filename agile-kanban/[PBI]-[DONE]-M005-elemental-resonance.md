# PBI: Elemental Resonance System

## Description
Implement a system where the Hero's core element interacts with or enhances all equipped weapons.
- **Fire Hero**: Passive 10% chance to Burn on all attacks.
- **Ice Hero**: Passive 10% chance to Slow on all attacks.
- **Wood Hero**: Passive 1% lifesteal (vampirism) on all attacks.
- **Metal Hero**: +15% Critical Chance on all attacks.
- **Earth Hero**: Small Knockback on all attacks.

## Acceptance Criteria
- [ ] Identifying a hero's core element (Fire, Wood, etc) dynamically.
- [ ] Modifying `weapons.js` bullet creation logic to inject these passive effects.
- [ ] Visual indicator (tint) for infused projectiles (optional but good).
- [ ] Verified in-game that a non-elemental weapon (e.g. Throwing Knife) applies the hero's element effect.

## Technical Details
- Modify `G.hero` initialization to ensure `el` property is set.
- In `fireWeapon` / `createBullet`: Check `G.hero.el`.
- Apply `burnDot`, `slowPct`, `heal`, `crit`, or `knockback` modifiers to the bullet object.
