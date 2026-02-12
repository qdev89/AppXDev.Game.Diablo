# Team Tasks: Dynasty Bruhhh Dungeon — Comprehensive Bug Hunt

## Team ID: team-2026-02-13-game-bughunt
## Template: bug-hunt (adapted)

| ID | Task | Agent | Depends On | Status | Priority |
|----|------|-------|------------|--------|----------|
| T-01 | Static: Find all undefined function calls (SFX.*, typeof checks) | code-scanner | none | TODO | HIGH |
| T-02 | Static: Find all bare `passives` refs (not window.passives) | code-scanner | none | TODO | HIGH |
| T-03 | Static: Find undefined variable/function refs across all .js | code-scanner | none | TODO | HIGH |
| T-04 | Runtime: Boot game → Menu → Hero Select → Start Game → Play 10s | playwright | none | TODO | HIGH |
| T-05 | Runtime: Test all 6 heroes start without crash | playwright | T-04 | TODO | HIGH |
| T-06 | Runtime: Test tactical skills (E key) for each hero | playwright | T-04 | TODO | MEDIUM |
| T-07 | Runtime: Test ultimate skills (Q key) for each hero | playwright | T-04 | TODO | MEDIUM |
| T-08 | Static: Check all new system files (mutations, aspects, mandate, relics, lineage, workshop) | code-scanner | none | TODO | MEDIUM |
| T-09 | Fix all discovered bugs | fixer | T-01..T-08 | BLOCKED | HIGH |
