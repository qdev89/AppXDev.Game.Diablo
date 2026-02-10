# K001: Room-Based Dungeon Progression

## Priority: CRITICAL
## Effort: Large
## Phase: K — The Roguelike Soul

## Description
Replace single open arena with Hades-style room-based dungeon progression. Each floor = sequence of rooms with door choices between them.

## Acceptance Criteria
- [ ] Each floor has 5-7 rooms before boss room
- [ ] Room types: Combat, Elite, Shop, Rest, Treasure, Boss
- [ ] Player chooses from 2-3 doors after clearing a room
- [ ] Door preview shows reward type (icon: gold/HP/weapon/blessing)
- [ ] Combat rooms spawn scaled enemy waves
- [ ] Elite rooms feature a mini-boss general
- [ ] Shop rooms allow spending gold for items
- [ ] Rest rooms heal 30% HP
- [ ] Treasure rooms give free weapon/blessing
- [ ] Boss room triggers floor boss fight
- [ ] Portal transitions between rooms with fade effect
- [ ] Room counter HUD element (e.g., "Room 3/6")

## Technical Notes
- New room state machine in `game.js`: ROOM_CLEAR → DOOR_CHOICE → ROOM_ENTER
- Door choice UI in `hud.js`
- Room generation logic in `systems.js`
- Reuse existing portal/transition system from Phase J
