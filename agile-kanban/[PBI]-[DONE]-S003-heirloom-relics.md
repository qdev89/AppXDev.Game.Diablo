# [PBI] S003 — Heirloom Relics
**Status**: ✅ DONE  
**Priority**: P1  
**Sprint**: Roguelike Phase 2  
**Estimated**: 3h | **Actual**: 1h  

## Description
12 legendary relics (one per run) across 4 categories: offensive, defensive, utility, and chaos.

## Implementation
- `relics.js` — Complete relic system with equip, unequip, per-frame update
- Dragon Pearl summon (timed AoE), Void Mirror reflect, Phoenix Feather DD
- Pandora's Urn and Chaos Dice for risk/reward players
- Persistent discovery tracking + relic choices at boss drops

## Files Modified
- `relics.js` (NEW)
- `game.js` (updateRelics integration)
- `index.html` (script tag)
