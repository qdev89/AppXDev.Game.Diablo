# PBI-E007: Equipment Card Drops

## Priority: HIGH
## Points: 5

## Description
Bosses and treasure rooms drop equipment cards that boost the player.
Diablo-style loot system with rarity tiers.

## Equipment Slots
1. Armor — HP, defense
2. Talisman — proc effects (on-hit, on-kill)
3. Mount — speed + ability

## Rarity Tiers
- Common (white) — +5-10% stats
- Uncommon (green) — +15-20% stats
- Rare (blue) — +25-30% stats + proc
- Legendary (gold) — +40% stats + unique proc
- Sacred (red) — +50% stats + game-changing passive

## Example Items
- 🗡️ Green Dragon Blade — +40% melee, every 5th hit = 3x damage
- 🛡️ Mandate of Heaven — -25% dmg taken, +20 max HP
- 📿 Borrowed Arrows Talisman — 15% arrows returned
- 🐴 Red Hare — +40% speed, dodge leaves fire trail

## Acceptance Criteria
- [ ] Equipment data definitions with rarity/stats/procs
- [ ] Boss kill triggers equipment drop popup (like level-up cards)
- [ ] Player can equip 1 per slot
- [ ] Equipment effects applied in combat
- [ ] Visual: rarity-colored borders on equipment cards
