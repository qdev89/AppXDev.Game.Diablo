# Team Tasks: Game Balance & Quality Overhaul

## Task Description
Fix 6 critical game issues: damage too high, weapon class restrictions, level-gated skills, poor enemy quality, missing boss/mini-boss visuals, and no environmental obstacles/traps.

## Parallel Execution Plan

### Wave 1 (Parallel — All Independent)
| ID | Task | Assigned To | Backend | Depends On | Status | Priority |
|----|------|-------------|---------|------------|--------|----------|
| T-01 | Combat balance: reduce weapon damage, scale with levels, rebalance HP curves | balance-agent | subagent | none | DONE | HIGH |
| T-02 | Weapon class locks + level-gated skill evolution | weapon-agent | subagent | none | DONE | HIGH |
| T-03 | Enemy quality overhaul: diverse types, better AI, varied attack patterns | enemy-agent | subagent | none | DONE | HIGH |
| T-04 | Environmental obstacles + traps system | environment-agent | subagent | none | DONE | HIGH |

### Wave 2 (Sequential — Integration)
| ID | Task | Assigned To | Backend | Depends On | Status | Priority |
|----|------|-------------|---------|------------|--------|----------|
| T-05 | Integration + Testing | lead | manual | T-01,T-02,T-03,T-04 | DONE | CRITICAL |
