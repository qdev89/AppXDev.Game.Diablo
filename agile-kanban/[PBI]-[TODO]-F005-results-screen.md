# [PBI] F005 - Results Screen ("The Aftermath")

## Priority: MEDIUM
## Estimate: Small (30min-1hr)

## Problem Statement
Game Over screen is bare — just "GAME OVER" text and restart. Players have no satisfying end-of-run summary showing their accomplishments.

## Acceptance Criteria
- [ ] Full stats breakdown: Kills, Floor reached, Time survived, DPS
- [ ] Kill breakdown by enemy type (fodder/grunt/elite/boss)
- [ ] Weapons acquired list with levels
- [ ] Equipment collected
- [ ] Highest combo/chain achieved
- [ ] Grade rating (S/A/B/C/D based on performance)
- [ ] "Play Again" and "Change Hero" buttons
- [ ] Animated stat counter reveal (numbers count up)
- [ ] Track all-time high score across sessions (localStorage)

## Technical Plan
1. Track additional stats during gameplay in `game.js` (time, dps, kill breakdown)
2. Add results screen state to `engine.js` game state machine
3. Draw results screen in `hud.js` (drawResultsScreen)
4. Add grade calculation logic
5. Add localStorage high score persistence
6. Add animated number counter effect
