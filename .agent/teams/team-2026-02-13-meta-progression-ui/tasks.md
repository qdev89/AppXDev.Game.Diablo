# Team Tasks: Meta-Progression UI Implementation

> Goal: Make ALL game systems fully accessible to players while preserving existing working mechanics.

| ID | Task | Assigned To | Backend | Depends On | Status | Priority |
|----|------|-------------|---------|------------|--------|----------|
| T-01 | Add Aspect Selector to Hero Select screen | lead | direct | none | TODO | HIGH |
| T-02 | Add Workshop/Lineage/Mandate tabs to Brotherhood screen | lead | direct | none | TODO | HIGH |
| T-03 | Implement Mandate Configurator panel content | lead | direct | T-02 | TODO | MEDIUM |
| T-04 | Implement Workshop Crafting panel content | lead | direct | T-02 | TODO | MEDIUM |
| T-05 | Implement Lineage Selection panel content | lead | direct | T-02 | TODO | MEDIUM |
| T-06 | Comprehensive browser verification | verifier | browser_subagent | T-01..T-05 | BLOCKED | HIGH |
| T-07 | Bump SW cache + final cleanup | lead | direct | T-06 | BLOCKED | HIGH |

## Execution Plan
- **Wave 1**: T-01 (hero select aspect picker)
- **Wave 2**: T-02 (tab navigation in bonding screen)
- **Wave 3**: T-03 + T-04 + T-05 (panel content — sequential due to shared hud.js)
- **Wave 4**: T-06 (browser verification)
- **Wave 5**: T-07 (SW cache bump)

## Risk Registry
- hud.js is a 154KB monolith — edits must be surgically precise
- All existing canvas rendering must not be disrupted
- Click handler coordinates are pixel-based — new UI elements need accurate hit detection
