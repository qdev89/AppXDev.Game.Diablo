# Mistake Registry — Dynasty Bruhhh Dungeon

## 1. Death Check Before Enemy Damage
- **Error**: Death check in `updatePlayer()` ran before `updateEnemies()` dealt damage
- **Result**: Player HP could go negative without triggering GAME_OVER
- **Fix**: Moved death check to main `update()` loop, AFTER `updateEnemies()`
- **Rule**: Always check death AFTER all damage sources have executed

## 2. Flex Centering Blocks Canvas Clicks
- **Error**: Added `display: flex; justify-content: center; align-items: center` on `<body>`
- **Result**: Body padding intercepted pointer events, Playwright `page.click('canvas')` timed out
- **Fix**: Removed flex centering, canvas uses `width: 100vw; height: 100vh` directly
- **Rule**: Never use flex/grid centering on `<body>` when a full-viewport canvas needs click events

## 3. Calling Undefined Functions Across Files
- **Error**: Called `initAudioOnInteraction()` in engine.js before sound.js might be loaded
- **Result**: `ReferenceError: initAudioOnInteraction is not defined`
- **Fix**: Guard with `typeof initAudioOnInteraction === 'function'`
- **Rule**: Always guard cross-file function calls with `typeof` check in multi-script setups

## 4. Incorrect Replacement Targets in Multi-File Edits
- **Error**: Portal reset code (`G.portalActive = false; G.portal = null;`) was incorrectly replaced with portal creation code
- **Result**: `nextFloor()` activated portal instead of clearing it
- **Fix**: Corrected replacement targets, verified file contents before editing
- **Rule**: Always view the exact file contents before making edits with replacement tools
