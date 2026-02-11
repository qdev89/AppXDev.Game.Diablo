# L002: Minimap Radar

## Priority: MEDIUM
## Effort: Small
## Phase: L — The Living World

## Description
Add a minimap radar overlay in the corner of the screen showing relative positions of enemies, pickups, portals, and room boundaries. Essential for tactical awareness in the room-based dungeon system.

## Acceptance Criteria
- [ ] Minimap renders in top-right corner (80x80px semi-transparent)
- [ ] Player dot (white) always centered
- [ ] Enemy dots (red, scaled by type: fodder=small, officer=medium, boss=large)
- [ ] Pickup dots (green for HP, yellow for gold, blue for XP gems)
- [ ] Portal marker (cyan pulsing dot) when portal is active
- [ ] Room boundary shown as faint border
- [ ] Minimap toggleable with M key
- [ ] Minimap alpha: 0.6 (semi-transparent, doesn't obstruct gameplay)
- [ ] Scale adapts to arena size

## Technical Notes
- New `drawMinimap()` function in `hud.js`
- Simple circle-based rendering (no complex sprites)
- Use relative coordinates: `(entity.x / arenaW) * minimapSize`
- Toggle state stored in `G.showMinimap` (default: true)
- Add M key binding in `engine.js` input handler
