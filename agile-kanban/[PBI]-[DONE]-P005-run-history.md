# PBI-P005: Run History & Statistics

**Epic:** Phase P: The Ascendant (v1.3)
**Priority:** MEDIUM (RICE 135)
**Status:** TODO

## Description
Track and display comprehensive run history and player statistics. Accessible from the main menu. Makes every run feel meaningful by recording progress.

## Features

### Run Log (Last 20 runs)
- Hero used + aspect
- Floor reached
- Total kills
- Run duration
- Cause of death (enemy type or "Victory!")
- Blessings collected
- Score

### All-Time Statistics
- Total runs
- Total kills
- Total jade earned
- Total bosses defeated
- Highest floor reached
- Longest kill streak
- Most used hero
- Fastest victory

### Per-Hero Stats
- Runs played
- Best floor
- Best kills
- Total play time
- Win rate

## Technical Details
- Store in localStorage as JSON array (capped at 20 entries)
- New menu screen accessible from title screen or pause menu
- Display as scrollable list with summary cards
- Tie into Achievement system for milestone-based unlocks
