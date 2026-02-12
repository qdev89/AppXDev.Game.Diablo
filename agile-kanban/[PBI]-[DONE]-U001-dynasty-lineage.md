# [PBI] U001 — Dynasty Lineage
**Status**: ✅ DONE  
**Priority**: P1  
**Sprint**: Roguelike Phase 2  
**Estimated**: 3h | **Actual**: 1h  

## Description
Mewgenics-inspired genetic inheritance: dead heroes leave "ghost traits" that future heroes can inherit at 30-70% power.

## Implementation
- `lineage.js` — Ghost trait creation, selection, and application
- Strength scales with floor reached (30% base + 5% per floor, cap 70%)
- Ghost blessing added at run start with weakened effects
- Max 12 ghosts stored, FIFO eviction

## Files Modified
- `lineage.js` (NEW)
- `game.js` (ghost creation on death, ghost application on run start)
- `index.html` (script tag)
