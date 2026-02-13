# PBI-P001: Purge Shrine Room Type

**Epic:** Phase P: The Ascendant (v1.3)
**Priority:** HIGH (RICE 220)
**Status:** TODO

## Description
Implement a Purge Shrine room where players can strategically REMOVE one active blessing from their build. Inspired by Slay the Spire's card removal mechanic. Workshop already references `purge_shrine` unlock but the room doesn't exist.

## Mechanics
- **Room Trigger:** Appears as a door choice (purple shrine icon) starting Floor 3
- **Frequency:** Max 1 purge shrine per floor, 20% chance to appear as a door option
- **UI:** Shows all active blessings in a grid. Click one to remove it permanently
- **Confirmation:** "Remove [Blessing Name]? This cannot be undone." dialog
- **VFX:** Purple flame dissolve effect when blessing is purged
- **Strategy:** Removing weak blessings increases odds of getting better ones at level-up

## Technical Details
- Add `PURGE` room type to `systems.js` door generation
- Create `drawPurgeShrine()` and `handlePurgeShrineClick()` in `hud.js`
- Gate behind Workshop unlock (`unlock_purge_shrine` already defined in `workshop.js`)
- Remove blessing from `BlessingState.active[]` and recalculate affinity
