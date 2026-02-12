// ============================================================
// DYNASTY BRUHHH DUNGEON - Main Game Loop (Entry Point)
// ============================================================

// --- Screen Transition System ---
const TRANSITION = {
    active: false,
    phase: 'none',   // 'fadeOut', 'fadeIn', 'none'
    alpha: 0,
    duration: 0.35,   // seconds per phase
    timer: 0,
    pendingState: null,
    pendingCallback: null
};

function transitionTo(newState, callback, duration) {
    if (TRANSITION.active) return; // prevent overlapping transitions
    TRANSITION.active = true;
    TRANSITION.phase = 'fadeOut';
    TRANSITION.alpha = 0;
    TRANSITION.timer = 0;
    TRANSITION.duration = duration || 0.35;
    TRANSITION.pendingState = newState;
    TRANSITION.pendingCallback = callback || null;
}

function updateTransition(dt) {
    if (!TRANSITION.active) return;
    TRANSITION.timer += dt;
    const progress = Math.min(TRANSITION.timer / TRANSITION.duration, 1);

    if (TRANSITION.phase === 'fadeOut') {
        TRANSITION.alpha = progress;
        if (progress >= 1) {
            // Switch state at peak darkness
            if (TRANSITION.pendingState) G.state = TRANSITION.pendingState;
            if (TRANSITION.pendingCallback) TRANSITION.pendingCallback();
            TRANSITION.phase = 'fadeIn';
            TRANSITION.timer = 0;
        }
    } else if (TRANSITION.phase === 'fadeIn') {
        TRANSITION.alpha = 1 - progress;
        if (progress >= 1) {
            TRANSITION.active = false;
            TRANSITION.phase = 'none';
            TRANSITION.alpha = 0;
        }
    }
}

function drawTransition() {
    if (!TRANSITION.active || TRANSITION.alpha <= 0) return;
    ctx.fillStyle = `rgba(0,0,0,${TRANSITION.alpha})`;
    ctx.fillRect(0, 0, GAME_W, GAME_H);
}

// --- Game Persistence (localStorage) ---
const SAVE_KEY = 'dbd_save_v1';

function saveGameSettings() {
    try {
        const data = {
            lang: G.lang || 'vi',
            audioEnabled: audioEnabled,
            selectedHero: G.selectedHero || 'berserker',
            totalRuns: (G._stats && G._stats.totalRuns) || 0,
            totalKills: (G._stats && G._stats.totalKills) || 0,
            bestFloor: (G._stats && G._stats.bestFloor) || 0,
            arcanaXP: typeof ArcanaState !== 'undefined' ? ArcanaState.xp : 0,
            arcanaLevel: typeof ArcanaState !== 'undefined' ? ArcanaState.level : 0,
            arcanaUnlocked: typeof ArcanaState !== 'undefined' ? ArcanaState.unlocked : [],
            // K004: Difficulty tiers
            difficulty: G.difficulty || 0,
            difficultyUnlocked: G.difficultyUnlocked || [true, false, false, false],
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) { /* localStorage not available */ }
}

function loadGameSettings() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.lang) { G.lang = data.lang; if (typeof setLang === 'function') setLang(data.lang); }
        if (typeof data.audioEnabled === 'boolean') audioEnabled = data.audioEnabled;
        if (data.selectedHero) G.selectedHero = data.selectedHero;
        // Restore persistent stats
        G._stats = {
            totalRuns: data.totalRuns || 0,
            totalKills: data.totalKills || 0,
            bestFloor: data.bestFloor || 0,
        };
        // Restore Arcana if exists
        if (typeof ArcanaState !== 'undefined') {
            ArcanaState.xp = data.arcanaXP || 0;
            ArcanaState.level = data.arcanaLevel || 0;
            ArcanaState.unlocked = data.arcanaUnlocked || [];
        }
        // K004: Difficulty
        if (data.difficulty !== undefined) G.difficulty = data.difficulty;
        if (data.difficultyUnlocked) G.difficultyUnlocked = data.difficultyUnlocked;
    } catch (e) { /* corrupted data — silently ignore */ }
}

function updatePersistentStats() {
    if (!G._stats) G._stats = { totalRuns: 0, totalKills: 0, bestFloor: 0 };
    G._stats.totalRuns++;
    G._stats.totalKills += G.totalKills || 0;
    if (G.floor > G._stats.bestFloor) G._stats.bestFloor = G.floor;
    // K004: Check difficulty tier unlocks
    if (typeof DIFFICULTY_TIERS !== 'undefined') {
        for (let i = 1; i < DIFFICULTY_TIERS.length; i++) {
            if (!G.difficultyUnlocked[i] && G.floor >= DIFFICULTY_TIERS[i].unlockFloor) {
                G.difficultyUnlocked[i] = true;
            }
        }
    }
    saveGameSettings();
}

// --- Run Persistence (Suspend & Resume) ---
const RUN_SAVE_KEY = 'dbd_run_save_v1';

function hasSavedRun() {
    return !!localStorage.getItem(RUN_SAVE_KEY);
}

function clearRunState() {
    localStorage.removeItem(RUN_SAVE_KEY);
}

function saveRunState() {
    // Only save in valid states
    if (G.state !== 'PLAYING' && G.state !== 'PAUSED' && G.state !== 'BLESSING_SELECT' && G.state !== 'SHOP' && G.state !== 'BLESSING_CHOICE') return;

    try {
        const runData = {
            floor: G.floor,
            score: G.score,
            time: G.time,
            totalKills: G.totalKills,
            combo: G.combo,
            maxCombo: G.maxCombo,
            killStreak: G.killStreak,
            difficulty: G.difficulty,

            heroId: P.heroId,
            hp: P.hp,
            maxHp: P.maxHp,
            xp: P.xp,
            level: P.level,
            mp: P.mp,

            weapons: G.weapons.map(w => ({ id: w.id, level: w.level })),
            equipment: G.equipment,

            blessingState: BlessingState,
            blessingChoices: G.blessingChoices, // Save choices if in selection screen

            // Minimal ally data implies they respawn from Bonding logic or are ephemeral
            // For now, relies on initBondingForRun() on load

            state: G.state,
            room: G.room,
            roomState: G.roomState,

            timestamp: Date.now()
        };
        localStorage.setItem(RUN_SAVE_KEY, JSON.stringify(runData));
        console.log("Run saved.");
    } catch (e) { console.error("Save failed", e); }
}

function loadRunState() {
    const raw = localStorage.getItem(RUN_SAVE_KEY);
    if (!raw) return false;

    try {
        const data = JSON.parse(raw);
        console.log("Loading run:", data);

        // Restore Stats
        G.floor = data.floor;
        G.score = data.score;
        G.time = data.time;
        G.totalKills = data.totalKills;
        G.combo = data.combo;
        G.maxCombo = data.maxCombo;
        G.killStreak = data.killStreak;
        G.difficulty = data.difficulty;
        G.room = data.room || 1;
        G.roomState = data.roomState || 'FIGHTING';

        // Init Player (base)
        const hero = getHeroDef(data.heroId);
        P.heroId = data.heroId;
        P.x = G.arenaW / 2; P.y = G.arenaH / 2;
        P.speed = hero.speed;
        P.element = hero.element;

        // Override Player Stats
        P.hp = data.hp;
        P.maxHp = data.maxHp;
        P.xp = data.xp;
        P.level = data.level;
        P.mp = data.mp;
        P.mpMax = hero.mp;

        // Re-create Weapons & Restore Passives
        G.weapons = [];
        // Reset passives
        if (typeof window.passives !== 'undefined') {
            window.passives.atkSpd = 0; window.passives.maxHp = 0; window.passives.moveSpd = 0;
            window.passives.pickupRange = 0; window.passives.xpGain = 0;
        }

        for (const wData of data.weapons) {
            const def = (window.WEAPON_DEFS || []).find(d => d.id === wData.id);
            if (def) {
                if (def.type === 'passive' && typeof window.passives !== 'undefined') {
                    // Update passive stats without re-buffing P.maxHp (since P.maxHp is already loaded)
                    window.passives[def.stat] = (window.passives[def.stat] || 0) + def.val * wData.level;
                } else {
                    const newW = (window.createWeapon) ? window.createWeapon(def) : null;
                    if (newW) {
                        newW.level = wData.level;
                        G.weapons.push(newW);
                    }
                }
            }
        }

        // Restore Blessings
        // Restore Blessings
        if (data.blessingState && window.BlessingState) {
            Object.assign(window.BlessingState, data.blessingState);
        }

        // Equipment
        G.equipment = data.equipment || { armor: null, talisman: null, mount: null };

        // Allies
        G.allies = [];
        initBondingForRun();

        // State
        G.state = data.state;
        if (G.state === 'BLESSING_SELECT') {
            G.blessingChoices = data.blessingChoices || ((typeof generateBlessingChoices === 'function') ? generateBlessingChoices(3) : []);
        } else {
            G.state = 'PLAYING'; // Fallback to playing if saved in transition
        }

        G.blessingOfferTimer = 0;

        return true;
    } catch (e) { console.error("Load failed", e); return false; }
}

// Load settings on boot
loadGameSettings();

// --- Start Game ---
function startGame() {
    SFX.menuClick();
    G.state = 'PLAYING';
    G.floor = 1; G.score = 0; G.combo = 0; G.maxCombo = 0;
    G.enemies = []; G.bullets = []; G.particles = []; G.pickups = []; G.dmgNums = [];
    G.weapons = [];
    G.spawnTimer = 0; G.spawnRate = 1.2; G.enemiesPerWave = 12;
    G.enemiesKilled = 0; G.enemiesNeeded = 40;
    G.portalActive = false; G.portal = null;
    G.treasureRoom = null; G.archerBullets = [];
    G.yinYang = { yin: 0, yang: 0, state: 'NEUTRAL', timer: 0 };
    G.totalKills = 0; G.chainTimer = 0; G.chainCount = 0; G.chainBest = 0; G.killMilestone = 0;
    // N002: Reset kill streak
    G.killStreak = 0; G.killStreakTimer = 0; G.killStreakTier = 0; G.killStreakXpMult = 1; G.killStreakAnnounce = null;
    // N004: Reset Blood Moon
    G.bloodMoon = false; G.bloodMoonTimer = 0; G.bloodMoonCooldown = 30; G.bloodMoonWaves = 0;
    G.allies = [];
    G.sacredBeast = null;
    G.equipment = { armor: null, talisman: null, mount: null };

    // Death Defiance (Hades-style extra lives)
    G.deathDefiance = 1; // Base 1 charge, upgradeable via Arcana
    G.deathDefianceMax = 1;
    G.deathDefianceVFX = 0; // Timer for revival VFX

    // Reroll/Banish QoL (K005)
    G.rerollCount = 0; // Times rerolled this run (cost escalates)
    G.banishedWeapons = []; // Weapon IDs banished from run pool

    // K002: Wu Xing Blessings
    if (typeof resetBlessings === 'function') resetBlessings();
    G.blessingChoices = null; // Active blessing choice cards
    G.blessingOfferTimer = 0; // Timer for blessing offer after room clear

    // L001: Wu Xing Elemental Combo counters
    G.comboCount = 0; // Total elemental combos triggered this run
    G.comboNotification = null; // Active combo notification
    G._forgeBuff = 0; // Forge Strike damage buff timer
    G._forgeTimer = 0;

    // L002: Minimap
    G.showMinimap = true;

    // L003: Victory Timer + Final Boss
    G.runTimer = 0; // Total run time in seconds
    G.bossWarning = false; // 20:00 warning triggered
    G.bossSpawned = false; // Final boss spawned
    G.finalBoss = null; // Reference to final boss enemy
    G.victoryTimer = 0; // VFX timer for victory celebration

    // K001: Room-Based Dungeon Progression
    G.room = 1; // Current room number
    G.roomsPerFloor = 6; // Rooms per floor (5-7, varies)
    G.roomType = 'COMBAT'; // Current room type
    G.roomState = 'FIGHTING'; // FIGHTING → CLEARED → DOOR_CHOICE → TRANSITIONING
    G.doorChoices = null; // Available door options
    G.roomCleared = false;
    G.roomTransition = 0; // Fade transition timer
    G.roomHistory = []; // Track visited room types

    // Apply hero stats
    const hero = getHeroDef(G.selectedHero || 'berserker');
    P.heroId = hero.id;
    P.x = G.arenaW / 2; P.y = G.arenaH / 2;
    P.hp = hero.hp; P.maxHp = hero.hp;
    P.xp = 0; P.xpNeeded = 20; P.level = 1;
    P.speed = hero.speed;
    P.invincible = 0; P.damageFlash = 0;
    P.element = hero.element;
    P.dodgeTimer = 0; P.dodgeCd = 0; P.dodgeDx = 0; P.dodgeDy = 0;
    // MP & Musou
    P.mp = hero.mp; P.mpMax = hero.mp; P.mpRegen = hero.mpRegen; P.mpRegenDelay = 0;
    P.musou = 0; P.musouMax = 100;
    P.tacticalCd = 0; P.ultimateActive = 0;
    P.shieldWall = 0; P.rageModeTimer = 0;

    // Reset passives
    passives.atkSpd = 0; passives.maxHp = 0; passives.moveSpd = 0;
    passives.pickupRange = 0; passives.xpGain = 0;

    // Initialize bonding system for this run
    initBondingForRun();

    // Apply equipment bonuses
    const armor = G.equipment.armor;
    if (armor) {
        P.maxHp += armor.hp || 0;
        P.hp = P.maxHp;
    }
    const mount = G.equipment.mount;
    if (mount) {
        P.speed *= (1 + (mount.speed || 0));
        P.mpRegen += mount.mpRegen || 0;
    }

    // Start with hero's weapon
    const startWep = WEAPON_DEFS.find(w => w.id === hero.startWeapon) || WEAPON_DEFS[0];
    G.weapons.push(createWeapon(startWep));

    // Spawn AI companions from equipped bond
    if (BondingState.equippedBond && typeof getCompanionsForBond === 'function') {
        const compDefs = getCompanionsForBond(BondingState.equippedBond);
        compDefs.forEach((c, i) => {
            G.allies.push({
                name: c.name, behavior: c.behavior,
                x: P.x + (i === 0 ? -30 : 30), y: P.y + 20,
                hp: c.hp, maxHp: c.hp, dmg: c.dmg,
                atkRate: c.atkRate, atkCd: 0, range: c.range,
                speed: c.speed, color: c.color,
                target: null, respawnTimer: 0
            });
        });
    }

    G.camX = P.x - GAME_W / 2; G.camY = P.y - GAME_H / 2;
    if (typeof HUD !== 'undefined') { HUD.hpDisplay = 1; HUD.xpDisplay = 0; HUD.killTimer = 0; }
}

// --- Update Player ---
function updatePlayer(dt) {
    // Input
    let dx = 0, dy = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A'] || keys['KeyA']) dx -= 1;
    if (keys['ArrowRight'] || keys['d'] || keys['D'] || keys['KeyD']) dx += 1;
    if (keys['ArrowUp'] || keys['w'] || keys['W'] || keys['KeyW']) dy -= 1;
    if (keys['ArrowDown'] || keys['s'] || keys['S'] || keys['KeyS']) dy += 1;

    // Touch joystick
    if (touch.active) {
        const tdx = touch.cx - touch.sx;
        const tdy = touch.cy - touch.sy;
        const td = Math.hypot(tdx, tdy);
        if (td > 5) {
            dx = tdx / td; dy = tdy / td;
        }
    }

    // Normalize diagonal
    const len = Math.hypot(dx, dy);
    if (len > 0) { dx /= len; dy /= len; }

    // Confusion debuff (Diao Chan) — reverse controls
    if (P.confused && P.confused > 0) {
        P.confused -= dt;
        dx = -dx; dy = -dy;
    }

    // Apply speed
    const spd = P.speed * (1 + passives.moveSpd);
    // Yin-Yang state bonuses
    let spdMult = 1;
    if (G.yinYang.state === 'CHAOS') spdMult = 1.3;
    else if (G.yinYang.state === 'HARMONY') spdMult = 1.15;

    // Phase G: Morale speed bonus
    const morale = G.morale || 0;
    if (morale >= 80) spdMult *= 1.10;
    else if (morale >= 60) spdMult *= 1.05;

    // P001: Physics Hazard Slow
    if (P._inHazardSlow > 0) {
        spdMult *= (1 - P._inHazardSlow);
    }
    // Physics Slide handling? (Not fully implemented yet, but flag exists)
    // if (P._inHazardSlide) { ... override control ... }

    P.vx = dx * spd * spdMult;
    P.vy = dy * spd * spdMult;

    // P001: Slide momentum override
    /*
    if (P._inHazardSlide) {
        // Simple slide: preserve previous velocity with slight decay, ignore input
        P.vx = (P.vx || 0) * 0.98 + (dx * 10); // small steering
        P.vy = (P.vy || 0) * 0.98 + (dy * 10);
    } 
    */

    P.x += P.vx * dt;
    P.y += P.vy * dt;

    // Facing
    if (dx > 0.1) P.facing = 1;
    else if (dx < -0.1) P.facing = -1;

    // Arena bounds
    P.x = clamp(P.x, 10, G.arenaW - 10);
    P.y = clamp(P.y, 10, G.arenaH - 10);

    // Invincibility / flash
    if (P.invincible > 0) P.invincible -= dt;
    if (P.damageFlash > 0) P.damageFlash -= dt;

    // Dodge roll
    if (P.dodgeCd > 0) P.dodgeCd -= dt;
    if (P.dodgeTimer > 0) {
        P.dodgeTimer -= dt;
        P.x += P.dodgeDx * dt;
        P.y += P.dodgeDy * dt;
        // Hero-specific dodge trail
        const hero = getHeroDef(P.heroId);
        if (Math.random() < 0.5) spawnParticles(P.x, P.y, hero.dodgeTrail || '#aaaaff', 1, 15);
    }

    // MP regeneration (pause after skill use)
    if (P.mpRegenDelay > 0) {
        P.mpRegenDelay -= dt;
    } else {
        P.mp = clamp(P.mp + P.mpRegen * dt, 0, P.mpMax);
    }

    // Tactical cooldown
    if (P.tacticalCd > 0) P.tacticalCd -= dt;

    // Rage mode timer (Berserker)
    if (P.rageModeTimer > 0) {
        P.rageModeTimer -= dt;
        if (P.rageModeTimer <= 0) {
            spawnParticles(P.x, P.y, '#ff4400', 8, 40);
        }
    }

    // Shield wall timer (Vanguard)
    if (P.shieldWall > 0) P.shieldWall -= dt;

    // Chain kill timer
    if (G.chainTimer > 0) {
        G.chainTimer -= dt;
        if (G.chainTimer <= 0) {
            if (G.chainCount > G.chainBest) G.chainBest = G.chainCount;
            G.chainCount = 0;
        }
    }

    // N002: Kill Streak timer — reset streak after 3s without a kill
    if (G.killStreak > 0) {
        G.killStreakTimer += dt;
        if (G.killStreakTimer >= 3.0) {
            G.killStreak = 0;
            G.killStreakTimer = 0;
            G.killStreakTier = 0;
            G.killStreakXpMult = 1;
        }
    }
    // N002: Streak announcement timer
    if (G.killStreakAnnounce) {
        G.killStreakAnnounce.timer -= dt;
        if (G.killStreakAnnounce.timer <= 0) G.killStreakAnnounce = null;
    }

    // N004: Blood Moon Event System
    if (G.bloodMoon) {
        G.bloodMoonTimer -= dt;
        // Extra enemy waves during Blood Moon
        G._bloodMoonSpawnTick = (G._bloodMoonSpawnTick || 0) + dt;
        if (G._bloodMoonSpawnTick >= 1.5) {
            G._bloodMoonSpawnTick = 0;
            G.bloodMoonWaves++;
            // Spawn a burst of enemies
            if (typeof spawnEnemy === 'function') {
                const count = 3 + Math.floor(G.floor * 0.5);
                for (let bmi = 0; bmi < count; bmi++) {
                    const edge = Math.floor(Math.random() * 4);
                    let sx, sy;
                    if (edge === 0) { sx = Math.random() * G.arenaW; sy = 5; }
                    else if (edge === 1) { sx = Math.random() * G.arenaW; sy = G.arenaH - 5; }
                    else if (edge === 2) { sx = 5; sy = Math.random() * G.arenaH; }
                    else { sx = G.arenaW - 5; sy = Math.random() * G.arenaH; }
                    const types = ['fodder', 'grunt', 'fast', 'grunt'];
                    spawnEnemy(sx, sy, types[Math.floor(Math.random() * types.length)]);
                }
            }
        }
        // Blood Moon end
        if (G.bloodMoonTimer <= 0) {
            G.bloodMoon = false;
            G.bloodMoonCooldown = 45 + Math.random() * 15;
            G._bloodMoonSpawnTick = 0;
            G.floorAnnounce = { text: '🌕 BLOOD MOON FADES', timer: 2 };
        }
    } else {
        // Cooldown tick
        if (G.bloodMoonCooldown > 0) {
            G.bloodMoonCooldown -= dt;
        } else if (G.floor >= 3 && G.roomState === 'FIGHTING' && Math.random() < 0.0002) {
            // Trigger Blood Moon!
            G.bloodMoon = true;
            G.bloodMoonTimer = 15; // 15s event
            G.bloodMoonWaves = 0;
            G._bloodMoonSpawnTick = 0;
            G.floorAnnounce = { text: '🌑 BLOOD MOON RISES 🌑', timer: 3, color: '#cc0000' };
            shake(6, 0.4);
            triggerFlash('#cc0000', 0.4);
            if (typeof triggerChromatic === 'function') triggerChromatic(3);
        }
    }

    // K002: Update Wu Xing Blessings (per-frame effects)
    if (typeof updateBlessings === 'function') updateBlessings(dt);

    // K001: Room state machine update
    if (G.roomTransition > 0) {
        G.roomTransition -= dt;
        if (G.roomTransition <= 0) {
            // Transition complete — setup new room
            if (typeof setupRoom === 'function') setupRoom();
        }
    }
    // Check room clear condition
    if (G.roomState === 'FIGHTING' && (G.roomType === 'COMBAT' || G.roomType === 'ELITE')) {
        if (G.enemiesKilled >= G.enemiesNeeded && !G.roomCleared) {
            G.roomCleared = true;
            G.roomState = 'CLEARED';
            const remaining = G.roomsPerFloor - G.room;
            if (remaining <= 1) {
                // Last room before boss — show door choice (boss vs prepare)
                setTimeout(() => {
                    if (G.state === 'PLAYING' && G.roomState === 'CLEARED') {
                        G.roomState = 'DOOR_CHOICE';
                        if (typeof generateDoorChoices === 'function') generateDoorChoices();
                    }
                }, 2000);
            } else {
                // Mid-floor: auto-progress to random next room (no popup!)
                setTimeout(() => {
                    if (G.state === 'PLAYING' && G.roomState === 'CLEARED') {
                        if (typeof autoProgressRoom === 'function') autoProgressRoom();
                    }
                }, 1500);
            }
        }
    }

    // Equipment: HP regen from armor
    const eqArmor = G.equipment.armor;
    if (eqArmor && eqArmor.hpRegen) {
        P.hp = clamp(P.hp + eqArmor.hpRegen * dt, 0, P.maxHp);
    }

    // Yin from idling
    if (len === 0) G.yinYang.yin = clamp(G.yinYang.yin + dt * 5, 0, 100);
}

// --- Main Update ---
function update(dt) {
    if (G.hitStop > 0) { G.hitStop -= dt; return; }

    updatePlayer(dt);
    updateWeapons(dt);
    if (window.Physics) window.Physics.update(dt);
    updateEnemies(dt);
    if (typeof updateArcherProjectiles === 'function') updateArcherProjectiles(dt);

    // Death Defiance VFX timer
    if (G.deathDefianceVFX > 0) G.deathDefianceVFX -= dt;

    // Death check — MUST be after updateEnemies (where damage is dealt)
    if (P.hp <= 0) {
        // Priority 1: Death Defiance (Hades-style extra life)
        if (G.deathDefiance > 0) {
            G.deathDefiance--;
            P.hp = Math.ceil(P.maxHp * 0.3); // Revive at 30% HP
            P.invincible = 2; // 2s invincibility
            G.deathDefianceVFX = 1.5; // Phoenix burst VFX timer
            G.hitStop = 0.3; // Dramatic freeze-frame
            // Dramatic revival effects
            if (typeof SFX !== 'undefined') SFX.revive();
            spawnParticles(P.x, P.y, '#ffd700', 40, 120);
            spawnParticles(P.x, P.y, '#ff4400', 30, 100);
            spawnElementParticles(P.x, P.y, 'FIRE', 25, 90);
            spawnDmgNum(P.x, P.y - 25, 0, '#ffd700', true);
            triggerFlash('#ffd700', 0.5);
            triggerChromatic(4);
            shake(8, 0.5);
            // Priority 2: Bond revive (existing system)
        } else if (checkBondRevive()) {
            SFX.revive();
            spawnDmgNum(P.x, P.y - 20, 0, '#ffd700', false);
        } else {
            endRunBonding();
            SFX.gameOver();
            G.state = 'GAME_OVER';
            // Save high score
            if (typeof saveHighScore === 'function') saveHighScore();
            if (typeof updatePersistentStats === 'function') updatePersistentStats();
            spawnDeathExplosion(P.x, P.y, '#ff2222', '#ff6644', 12);
            spawnElementParticles(P.x, P.y, P.element, 20, 80);
            triggerFlash('#ff0000', 0.4);
            triggerChromatic(3);
            shake(6, 0.4);
            return; // Stop updating
        }
    }

    // Dodge roll end shake
    if (P.dodgeTimer > 0 && P.dodgeTimer - dt <= 0) {
        shake(1, 0.1);
    }

    // Combo milestone shakes
    if (G.combo > 0 && (G.combo === 20 || G.combo === 50 || G.combo === 100)) {
        if (!G._lastComboShake || G._lastComboShake !== G.combo) {
            G._lastComboShake = G.combo;
            shake(2, 0.15);
            spawnParticles(P.x, P.y, '#ffd700', 10, 50);
        }
    }

    updatePickups(dt);
    updateYinYang(dt);
    updatePortal(dt);
    updateCamera();
    checkLevelUp();

    // Treasure room
    if (typeof updateTreasureRoom === 'function') updateTreasureRoom(dt);

    // Spawn timer (skip in treasure rooms)
    if (!G.treasureRoom) {
        G.spawnTimer -= dt;
        if (G.spawnTimer <= 0 && G.enemiesKilled < G.enemiesNeeded) {
            G.spawnTimer = G.spawnRate;
            spawnWave();
        }

        // Boss on floor 5, 10, etc.
        if (G.floor % 5 === 0 && G.enemiesKilled === 0 && G.enemies.length === 0) {
            const bx = G.arenaW / 2 + rng(-100, 100);
            const by = G.arenaH / 2 + rng(-100, 100);
            spawnEnemy(bx, by, 'boss');
            triggerFlash('#ff0000', 0.2);
            triggerChromatic(2);
        }

        // Mini-boss on floors 3, 7, 8, 12, 13
        const minibossFloors = [3, 7, 8, 12, 13, 17, 18];
        if (minibossFloors.includes(G.floor) && G.enemiesKilled === 0 && !G.enemies.find(e => e.type === 'miniboss') && !G._minibossSpawned) {
            G._minibossSpawned = true;
            const mbx = G.arenaW / 2 + rng(-80, 80);
            const mby = G.arenaH / 2 + rng(-80, 80);
            spawnEnemy(mbx, mby, 'miniboss');
        }
    }

    // Update ambient particles
    if (typeof updateAmbientParticles === 'function') updateAmbientParticles(dt);

    // Update evolution popup
    if (typeof updateEvolutionPopup === 'function') updateEvolutionPopup(dt);

    // Update floor announcement
    if (G.floorAnnounce) {
        G.floorAnnounce.timer -= dt;
        if (G.floorAnnounce.timer <= 0) G.floorAnnounce = null;
    }

    // Update HUD animations
    if (typeof updateHUD === 'function') updateHUD(dt);

    // Update AI companions
    if (typeof updateAllies === 'function') updateAllies(dt);

    // Update sacred beast
    if (typeof updateSacredBeast === 'function') updateSacredBeast(dt);

    // Update skill VFX
    if (typeof updateSkillEffects === 'function') updateSkillEffects(dt);

    // L003: Run Timer + Boss Warning/Spawn + Victory Check
    G.runTimer += dt;

    // 20:00 warning
    if (G.runTimer >= 1200 && !G.bossWarning) {
        G.bossWarning = true;
        G.floorAnnounce = {
            text: '⚔ THE DYNASTY AWAITS... ⚔',
            sub: 'Prepare for the final battle',
            timer: 3,
            color: '#ff2222'
        };
        shake(4, 0.5);
        triggerFlash('#ff0000', 0.3);
        triggerChromatic(3);
    }

    // 25:00 — Spawn Final Boss: Dong Zhuo, The Tyrant
    if (G.runTimer >= 1500 && !G.bossSpawned) {
        G.bossSpawned = true;
        if (typeof spawnFinalBoss === 'function') spawnFinalBoss();
    }

    // Check if final boss is defeated → VICTORY
    if (G.finalBoss && G.finalBoss.dead) {
        G.state = 'VICTORY';
        G.victoryTimer = 5; // 5 seconds of celebration
        // Dramatic celebration effects
        spawnParticles(P.x, P.y, '#ffd700', 60, 150);
        spawnParticles(P.x, P.y, '#ff8800', 40, 120);
        triggerFlash('#ffd700', 0.6);
        triggerChromatic(5);
        shake(8, 0.5);
        if (typeof SFX !== 'undefined') SFX.revive();
        // Save stats
        if (typeof saveHighScore === 'function') saveHighScore();
        if (typeof updatePersistentStats === 'function') updatePersistentStats();
        // Unlock next difficulty
        if (typeof DIFFICULTY_TIERS !== 'undefined') {
            const nextDiff = (G.difficulty || 0) + 1;
            if (nextDiff < DIFFICULTY_TIERS.length) {
                const unlocked = JSON.parse(localStorage.getItem('dbd_unlockedDifficulties') || '[]');
                if (!unlocked.includes(nextDiff)) {
                    unlocked.push(nextDiff);
                    localStorage.setItem('dbd_unlockedDifficulties', JSON.stringify(unlocked));
                }
            }
        }
    }

    // L001: Combo notification timer
    if (G.comboNotification) {
        G.comboNotification.timer -= dt;
        if (G.comboNotification.timer <= 0) G.comboNotification = null;
    }
    // L001: Forge buff timer
    if (G._forgeBuff > 0) G._forgeBuff -= dt;

    // M002: Achievement checks (every 2 seconds for performance)
    if (!G._achCheckTimer) G._achCheckTimer = 0;
    G._achCheckTimer += dt;
    if (G._achCheckTimer >= 2.0) {
        G._achCheckTimer = 0;
        if (typeof AchievementState !== 'undefined') AchievementState.checkAll();
    }
    // M002: Achievement toast update
    if (typeof AchievementState !== 'undefined') AchievementState.updateToast(dt);
}

// --- Main Draw ---
function draw() {
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    if (G.state === 'MENU') {
        drawMenuScreen();
    } else if (G.state === 'DAILY_PREVIEW') {
        // M003: Daily challenge preview
        if (typeof DailyState !== 'undefined') DailyState.drawChallengePreview(ctx, GAME_W, GAME_H);
    } else if (G.state === 'HERO_SELECT') {
        if (typeof drawHeroSelectScreen === 'function') drawHeroSelectScreen();
    } else if (G.state === 'BONDING') {
        drawBondingScreen();
    } else if (G.state === 'PLAYING') {
        drawGame();
        if (typeof drawAllies === 'function') drawAllies();
        if (typeof drawSacredBeast === 'function') drawSacredBeast();
        if (typeof drawTreasureRoom === 'function') drawTreasureRoom();
        if (typeof drawArcherProjectiles === 'function') drawArcherProjectiles();
        if (typeof drawEvolutionPopup === 'function') drawEvolutionPopup();
        // K001: Room indicator & door choices
        if (typeof drawRoomIndicator === 'function') drawRoomIndicator();
        if (typeof drawDoorChoices === 'function') drawDoorChoices();
        // K002: Active blessings display
        if (typeof drawActiveBlessings === 'function') drawActiveBlessings();
        drawFloorAnnounce();
        // M003: Daily Challenge HUD indicator
        if (typeof DailyState !== 'undefined') DailyState.drawHUD(ctx, GAME_W);
        // Phase I: Brotherhood Combo cinematic screen darken
        if (G._comboDarken > 0) {
            ctx.fillStyle = `rgba(0,0,0,${Math.min(G._comboDarken * 0.6, 0.3)})`;
            ctx.fillRect(0, 0, GAME_W, GAME_H);
        }
    } else if (G.state === 'PAUSED') {
        drawGame();
        if (typeof drawPauseMenu === 'function') drawPauseMenu();
    } else if (G.state === 'LEVEL_UP') {
        drawGame();
        drawLevelUpScreen();
    } else if (G.state === 'SHOP') {
        // K001: Shop room
        drawGame();
        if (typeof drawShopScreen === 'function') drawShopScreen();
    } else if (G.state === 'BLESSING_CHOICE') {
        // K002: Blessing choice room
        drawGame();
        if (typeof drawBlessingChoiceScreen === 'function') drawBlessingChoiceScreen();
    } else if (G.state === 'BLESSING_SELECT') {
        // N006: Stage Clear Blessing selection
        drawGame();
        if (typeof drawBlessingSelectScreen === 'function') drawBlessingSelectScreen();
    } else if (G.state === 'GAME_OVER') {
        drawGame();
        drawGameOverScreen();
    } else if (G.state === 'VICTORY') {
        drawGame();
        if (typeof drawVictoryScreen === 'function') drawVictoryScreen();
    } else if (G.state === 'ACHIEVEMENTS') {
        // M002: Achievement list overlay
        drawGame();
        if (typeof AchievementState !== 'undefined') AchievementState.drawAchievementList(ctx, GAME_W, GAME_H);
    }

    // K001: Room transition overlay
    if (typeof drawRoomTransition === 'function') drawRoomTransition();

    // M002: Achievement toast (always on top, before transitions)
    if (typeof AchievementState !== 'undefined') AchievementState.drawToast(ctx, GAME_W, GAME_H);

    // Screen transition overlay (always on top)
    drawTransition();
}

// --- Game Loop ---
function gameLoop(timestamp) {
    G.dt = Math.min((timestamp - G.lastTime) / 1000, 0.05); // cap dt at 50ms
    G.lastTime = timestamp;
    G.time += G.dt;

    // FPS counter
    G.fps = lerp(G.fps, 1 / Math.max(G.dt, 0.001), 0.05);

    if (G.state === 'PLAYING') {
        // Phase I: Brotherhood Combo time-slow effect
        if (G._comboTimeSlow > 0) {
            G._comboTimeSlow -= G.dt;
            G.dt *= 0.2; // 20% speed for cinematic freeze-frame
        }
        if (G._comboDarken > 0) {
            G._comboDarken -= G.dt * 2; // ticks down at 2x
        }
        update(G.dt);
    }

    updateTransition(Math.min((timestamp - (G._prevRawTime || timestamp)) / 1000, 0.05));
    G._prevRawTime = timestamp;
    if (typeof updateBGM === 'function') updateBGM();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- Boot ---
G.lastTime = performance.now();
requestAnimationFrame(gameLoop);
