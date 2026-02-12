---
type: PBI
id: N006
title: Stage Clear Blessing System
status: DONE
priority: CRITICAL
---

## Feature: Stage Clear Blessing Selection

### Problem
The current game flow mixes Blessings (major build-defining powers) with standard Level Up choices (weapons/stats), making the progression feel random and "mushy". The user feedback indicates the game is "boring" and specifically requests that "Blessing selection should happen after clearing a stage".

### Solution
Implement a structured "Stage Clear" phase where the player is rewarded with a specialized Blessing Selection screen upon completing a floor (entering the portal). Remove Blessings from the standard Level Up pool to distinctify the two progression systems.

### Impact
- **Pacing:** Breaks up the infinite combat loop with distinct milestones.
- **Strategic Depth:** Guaranteed specialized power-ups after each floor allow for more intentional build crafting.
- **Engagement:** "Clear Stage" becomes a meaningful goal with a high-value reward.

### Implementation Checklist
- [ ] **Remove Blessings from Level Up:**
    - Modify `systems.js`: `generateLevelUpChoices` to exclude `isBlessing: true` items.
    - Ensure standard level-ups only grant Weapons and Passives.

- [ ] **Create Blessing Logic:**
    - Create `generateBlessingChoices(count)` in `blessings.js` (or `systems.js`).
    - Logic should pick 3 random blessings from `BLESSINGS` pool (respecting weights/rarity if applicable, or just random for now).

- [ ] **Implement 'BLESSING_SELECT' State:**
    - Update `game.js`: Add `BLESSING_SELECT` to game states.
    - Update `systems.js`: `nextFloor()` should NOT reset floor immediately. Instead:
        1. Set `G.state = 'BLESSING_SELECT'`.
        2. Generate Blessing Choices (`G.blessingChoices`).
        3. Wait for player input.

- [ ] **Create Blessing UI:**
    - Update `hud.js`: Implement `drawBlessingSelectScreen`.
    - Style: Distinct from Level Up (maybe "Divine" gold theme vs standard).
    - Show Deity info (Icon, Name, Title).
    - Show Blessing info (Name, Desc).

- [ ] **Handle Selection:**
    - Update `hud.js`: `handleInput` (or mouse click) to detect selection in `BLESSING_SELECT` state.
    - On select:
        - Apply Blessing (`applyBlessing` logic).
        - Trigger `initNextFloor` (the logic previously in `nextFloor`, moving actual reset here).
        - Set `G.state = 'PLAYING'`.

### Testing Criteria
- [ ] Level Up NEVER offers Blessings.
- [ ] Entering Portal triggers Blessing Select Screen.
- [ ] Selecting a Blessing applies it correctly (check stats/effects).
- [ ] After selection, the next floor starts (enemies spawn, floor counter increases).
