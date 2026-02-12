# PBI-O001: Weapon Evolution System

**Epic:** Phase O: The Evolution (v1.3)
**Priority:** CRITICAL (RICE 180)
**Status:** TODO

## Description
Implement a weapon evolution mechanic similar to Vampire Survivors. Players can evolve weapons by upgrading them to max level and having a matching passive item.

## Mechanics
- **Trigger:** Weapon LvMAX + Passive LvMAX (or specific level) -> Chest or explicit evolution trigger.
- **Effect:** Transform into a powerful Evolved Weapon.
- **Visual:** Dramatic full-screen flash, "WEAPON EVOLVED!" announcement.
- **Stats:** significant boost (e.g., +100% base damage, +50% attack speed, unique effects).

## Evolution Recipes (Initial Set)
1. **Inferno Dragon (Guan Yu):** Green Dragon Halberd + Fire Blessing -> AoE fire wave every 5th hit.
2. **Tide Piercer (Zhao Yun):** Dragon Spear + Water Blessing -> Projectile passes through enemies.
3. **Mountain Cleaver (Dian Wei):** Twin Axes + Earth Blessing -> Shockwave on ground slam.
4. **Storm Blades (Sun Shangxiang):** Dual Chakrams + Metal Blessing -> Boomerang returns + homing.
5. **Spirit Wind (Zhuge Liang):** Feather Fan + Wood Blessing -> Summons 3 tracking wisps.

## Technical Details
- Extend `Weapon` definition in `weapons.js` to support `evolvesTo` property.
- Add evolution logic in `updateWeapons` or a specific evolution check function.
- Create new weapon definitions for the evolved forms.
