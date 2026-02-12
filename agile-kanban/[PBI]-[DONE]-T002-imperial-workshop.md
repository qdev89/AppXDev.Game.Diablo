# [PBI] T002 — Imperial Workshop
**Status**: ✅ DONE  
**Priority**: P1  
**Sprint**: Roguelike Phase 2  
**Estimated**: 4h | **Actual**: 1.5h  

## Description
Meta-progression crafting system: 5 resources, 14 recipes across weapons, sacred beasts, aspects, rooms, and meta upgrades.

## Implementation
- `workshop.js` — Full crafting system with resource management
- Integrates with Mandate jade multiplier for high-difficulty rewards
- Persistent state via localStorage
- Resource grants on floor clear, boss kill, elite kill, treasure rooms

## Files Modified
- `workshop.js` (NEW)
- `game.js` (resource grants + meta effects at run start)
- `systems.js` (floor clear resource grants)
- `index.html` (script tag)
