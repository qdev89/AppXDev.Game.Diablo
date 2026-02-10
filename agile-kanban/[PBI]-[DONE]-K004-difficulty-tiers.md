# K004: Difficulty Tiers

## Priority: HIGH
## Effort: Small
## Phase: K — The Roguelike Soul

## Description
Add 4 difficulty tiers (like Dead Cells' Boss Cells) that scale enemy power and rewards, providing replayability for skilled players.

## Acceptance Criteria
- [ ] 4 tiers: Apprentice (1.0×), Warrior (1.5×), Master (2.0×), Legend (3.0×)
- [ ] Tier selection on Hero Select screen
- [ ] Each tier modifies: enemy HP multiplier, enemy speed bonus, reward multiplier
- [ ] Higher tiers unlock progressively:
  - Warrior: Beat Floor 10 on Apprentice
  - Master: Beat Floor 15 on Warrior
  - Legend: Beat Floor 20 on Master
- [ ] Unlocked tiers saved to localStorage
- [ ] Visual indicator during gameplay (tier icon on HUD)
- [ ] Bilingual names (VI/EN)

## Technical Notes
- Add `G.difficulty` to game state
- Modify enemy stats in `systems.js` with difficulty multiplier
- Modify reward drops with difficulty multiplier
- Save unlock state via `saveGameSettings()` in `game.js`
- Add tier selector UI to hero select in `hud.js`
