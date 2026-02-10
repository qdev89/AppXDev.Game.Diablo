# PBI-E005: AI Hero Companions from Bonds

## Priority: HIGH
## Points: 5

## Description
Brotherhood Bond heroes fight alongside the player as AI companions.
Equipping "Peach Garden Oath" spawns Liu Bei + Guan Yu + Zhang Fei as allies.

## AI Behaviors
- Melee Fighter: charges nearest enemy, attacks, retreats when low HP
- Ranged Support: stays at 80-120px from player, shoots projectiles
- Tank: stays near player, taunts enemies, absorbs damage

## Acceptance Criteria
- [ ] G.allies array with companion entities
- [ ] Companions spawn based on equipped bond's hero list
- [ ] 3 AI behavior types: melee, ranged, tank
- [ ] Companions have HP bars, can die, respawn after 10s
- [ ] Companions drawn with faction-colored pixel sprites
- [ ] Max 2-3 companions on screen
