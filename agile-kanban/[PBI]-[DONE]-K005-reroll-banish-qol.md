# K005: Reroll / Banish QoL

## Priority: MEDIUM
## Effort: Small
## Phase: K — The Roguelike Soul

## Description
Add quality-of-life mechanics to the level-up card selection: Reroll refreshes choices, Banish removes unwanted weapons from the pool.

## Acceptance Criteria
- [ ] Reroll button on level-up screen (costs 50 gold, 2 uses per floor)
- [ ] Banish: click small X on a card to remove that weapon from pool for this run
- [ ] 3 banishes max per run
- [ ] Reroll counter and banish counter visible on level-up screen
- [ ] Pity: weapon seen 3+ times auto-removed from pool
- [ ] Gold cost visible on reroll button
- [ ] SFX for reroll (dice roll) and banish (whoosh)
- [ ] Bilingual labels

## Technical Notes
- Modify level-up card generation in `hud.js`
- Track banished weapons in `G.banishedWeapons` array
- Track weapon offer counts in `G.weaponOfferCounts` map
- Reroll decrements `G.rerollsLeft`, deducts gold
