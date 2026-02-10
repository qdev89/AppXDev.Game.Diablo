# [PBI] H004 - General Spawn Banner Announcement

## Description
When a mini-boss general spawns, show a dramatic full-width banner:
- Show general's Vietnamese name + title (e.g. "Quan Vũ — Võ Thánh")
- Element-colored banner background with glow
- Brief screen darkening (0.5s) during spawn
- War horn SFX via procedural audio
- Banner slides in from top, holds 1.5s, fades out

## Acceptance Criteria
- [ ] Banner shows localized name + title using tGen()/tGenTitle()
- [ ] Banner uses element color of the general
- [ ] Screen dims briefly for dramatic effect
- [ ] War horn SFX plays on spawn
- [ ] Banner auto-dismisses after 1.5s
