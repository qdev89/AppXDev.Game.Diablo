# Blackboard — Meta-Progression UI Team

## Shared Findings

### Verified Working Systems (DO NOT TOUCH)
- ✅ Combat mechanics (weapons, damage, DOTs, killEnemy)
- ✅ Element system + elemental combos
- ✅ Blessing/boon system
- ✅ Wu Xing Mutations
- ✅ Weapon evolution (level-up integration)
- ✅ Reroll/Banish buttons
- ✅ Room-based dungeon with doors
- ✅ Boss/Mini-boss spawning
- ✅ Death Defiance
- ✅ Kill streaks + Blood Moon
- ✅ Daily challenges + Achievements
- ✅ **NEW** Hero Aspects (S001) — applied to damage, speed, combat effects
- ✅ **NEW** Mandate of Heaven (T001) — applied to enemy HP/speed/DR

### Systems Needing UI Only
- ⚠️ Aspect selection — data exists in aspects.js, needs picker in hero select
- ⚠️ Mandate configurator — data exists in mandate.js, needs config screen
- ⚠️ Workshop crafting — data exists in workshop.js, needs crafting screen
- ⚠️ Lineage ghost selection — data exists in lineage.js, needs selection screen
- ⚠️ Brotherhood tabs — currently only Bonds + Arcana, needs 3 more tabs

## Architecture Notes
- ALL UI rendering happens in `hud.js` via canvas 2D context
- Click handlers use pixel coordinates and state checks (`G.state`)
- Tab-based screens use state variables like `G.bonding.tab`
