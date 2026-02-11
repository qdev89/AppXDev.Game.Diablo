# M002: Achievement System

## Priority: MEDIUM
## Effort: Medium
## Phase: M — The Infinite

## Description
Track player milestones across runs and award achievements. Adds long-term goals beyond individual runs and incentivizes mastery of all game systems.

## Acceptance Criteria
- [ ] Achievement definitions (15-20 achievements across categories)
- [ ] Achievement categories: Combat, Exploration, Mastery, Secret
- [ ] Toast notification when achievement unlocked (gold popup with icon)
- [ ] Achievement tracker in pause menu or dedicated screen
- [ ] Persistent via localStorage (survives browser refresh)
- [ ] Some achievements unlock cosmetic effects or titles
- [ ] Achievement examples:
  - "First Blood" — Kill 100 enemies in a single run
  - "Elemental Master" — Collect 5 blessings of the same element
  - "Tyrant Slayer" — Defeat Đổng Trác
  - "Speed Demon" — Complete a run in under 20 minutes
  - "Dynasty Hero" — Reach Floor 10 with all 6 heroes
  - "Combo King" — Achieve a 50+ Wu Xing combo

## Technical Notes
- New `achievements.js` file
- `AchievementState` global manager
- Check triggers in game.js update loop and state transitions
- localStorage key: `dbd_achievements`
