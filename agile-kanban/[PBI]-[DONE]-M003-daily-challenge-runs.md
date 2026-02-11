# M003: Daily Challenge Runs (Seeded)

## Priority: MEDIUM
## Effort: Large
## Phase: M — The Infinite

## Description
Add daily challenge runs with a seeded random number generator. Every player gets the same rooms, enemies, and level-up choices for that day. Enables competition via shared leaderboards.

## Acceptance Criteria
- [ ] Seeded PRNG using date-based seed (e.g., YYYYMMDD as seed)
- [ ] Daily challenge option in main menu
- [ ] Fixed hero + element for each day (rotates through roster)
- [ ] Same room sequence, enemy spawns, blessing choices
- [ ] Daily leaderboard stored in localStorage (personal best)
- [ ] Special daily modifier (e.g., "No Healing", "Double Speed", "Fire Only")
- [ ] Daily challenge indicator in HUD
- [ ] Results screen shows daily rank potential

## Technical Notes
- Implement mulberry32 or similar seeded PRNG
- Replace `Math.random()` calls with `seededRandom()` during daily mode
- Store daily best scores in localStorage keyed by date
- Modifier system: array of daily modifiers that cycle
