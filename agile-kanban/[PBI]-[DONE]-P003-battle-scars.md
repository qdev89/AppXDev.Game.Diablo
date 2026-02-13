# PBI-P003: Battle Scars System

**Epic:** Phase P: The Ascendant (v1.3)
**Priority:** MEDIUM-HIGH (RICE 200)
**Status:** TODO

## Description
Heroes gain permanent "Battle Scars" after surviving boss fights — a paired buff AND debuff that creates character history across runs. Inspired by Mewgenics' mental disorders system. Scars persist in localStorage per hero.

## Mechanics
- **Trigger:** Defeating a boss (mini-boss or final boss)
- **Assignment:** Random scar from pool based on boss element
- **Persistence:** Stored in localStorage per hero ID, across runs
- **Limit:** Max 3 scars per hero. New scars replace oldest if at cap.
- **Healing:** Can spend Workshop resources to remove a scar

## Scar Definitions

| Boss Element | Scar Name | Buff | Debuff |
|-------------|-----------|------|--------|
| FIRE | 🔥 Burns of War | +15% Fire resistance | -10% Water resistance |
| METAL | ⚔️ Iron Scars | +10% armor | -5% movement speed |
| WATER | 🌊 Drowned Memories | +15% Lifesteal | -10% max HP |
| EARTH | ⛰️ Quake Survivor | +10% stun resist | -5% attack speed |
| WOOD | 🌿 Forest Marked | +15% heal potency | -10% damage |
| BOSS | 💀 Mark of the Tyrant | +20% all damage | -15% max HP |

## Technical Details
- New `scars.js` file or section in `heroes.js`
- `localStorage` persistence: `heroScars_${heroId}` key
- Apply scar stats at run start in `initGame()`
- Display scar icons on hero select screen
- Add scar removal recipe to Workshop
