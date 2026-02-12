# PBI-T001: Mandate of Heaven (Heat System)

**Epic:** Phase T: The Mandate (v1.6)
**Priority:** CRITICAL (RICE 380)
**Status:** IN-PROGRESS

## Description
Post-first-victory difficulty modifier system inspired by Hades' Pact of Punishment. Players choose modifiers for better Jade rewards.

## Modifiers (10 total)
See BRAINSTORM-HADES-ROGUELIKE-MEWGENICS-2026-02-12.md for full details.

## Technical Details
- New file: mandate.js
- Mandate state persisted to localStorage
- Pre-run screen for modifier selection
- Total Mandate level = sum of all active modifiers
- Jade reward multiplier scales with total
