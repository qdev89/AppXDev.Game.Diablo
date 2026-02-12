# [PBI] N002: Kill Streak & Combo System

**Priority:** HIGH (RICE: 270)
**Estimate:** 1.5 hours
**Phase:** N — The Visceral (v1.2)

## Description
Track rapid kills and announce milestones with dramatic on-screen text. Creates exciting "power fantasy" moments.

## Acceptance Criteria
- [ ] Kill streak counter increments on each enemy kill
- [ ] Combo timer: 3 seconds between kills to maintain streak (resets to 0 if exceeded)
- [ ] Milestone announcements at kill thresholds:
  - 25 kills: "KILLING SPREE!" (+10% XP)
  - 50 kills: "RAMPAGE!" (+20% XP)
  - 100 kills: "MASSACRE!" (+30% XP)
  - 200 kills: "UNSTOPPABLE!" (+50% XP)
  - 500 kills: "GODLIKE!" (+100% XP)
- [ ] Announcements appear center-screen, large font, dramatic colors, fade after 2s
- [ ] Current streak count shown on HUD (small, near kill counter or XP bar)
- [ ] XP bonus is multiplicative during the streak tier
- [ ] Streak resets on death (not on room transition)
- [ ] Visual: screen edge glow intensifies with higher streaks

## Technical Notes
- Track `G.killStreak`, `G.killStreakTimer`, `G.killStreakTier`
- Announcement system: queue of text items with priority rendering
- XP bonus calculation in existing XP award code

## Why This Matters
Kill streaks create emergent "moments" — the player's heart races as they try to keep the combo going. This mechanic turns routine grinding into exciting gameplay without changing any core systems.
