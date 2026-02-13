# PBI-P006: Gathering Nodes in Rooms

**Epic:** Phase P: The Ascendant (v1.3)
**Priority:** HIGH (RICE 220)
**Status:** TODO

## Description
Add breakable environmental objects to dungeon rooms that drop Workshop resources when destroyed. Inspired by Hades 2's gathering system. Makes rooms feel more interactive and gives runs tangible meta-progression value.

## Breakable Objects

| Object | Visual | Drop | Rooms |
|--------|--------|------|-------|
| 🪨 Jade Deposit | Green crystal cluster | 2-5 Spirit Jade | Combat, Rest |
| ⚒️ War Forge Scrap | Red metallic pile | 1-3 War Iron | Elite, Boss |
| 🧵 Silk Loom | Gold fabric roll | 1 Heavenly Silk | Treasure, Boss |
| 🎋 Bamboo Cluster | Green stalks | 1-3 Spirit Jade | Any |
| 💀 Ancient Bones | Skeletal remains | 1 Mystic Essence | Elite (rare, 10%) |

## Mechanics
- **Spawning:** 3-5 objects per room, randomly placed in valid floor tiles
- **Destruction:** Walk near (pickup range) → object breaks → drops magnetize to player
- **VFX:** Particle burst matching resource color when broken
- **Sound:** Satisfying crunch/shatter SFX
- **Resources:** Stored in Workshop state, carried between runs

## Technical Details
- Add `gatherNodes[]` array to room generation in `systems.js`
- Render objects as simple pixel art sprites in `renderer.js`
- Collision check in `updatePlayer()` using pickup range
- Tie into existing Workshop resource economy
