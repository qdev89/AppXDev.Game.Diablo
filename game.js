// ============================================================
// DYNASTY BRUHHH DUNGEON - Main Game Loop (Entry Point)
// ============================================================

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
    G.allies = [];
    G.sacredBeast = null;
    G.equipment = { armor: null, talisman: null, mount: null };

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

    // Apply speed
    const spd = P.speed * (1 + passives.moveSpd);
    // Yin-Yang state bonuses
    let spdMult = 1;
    if (G.yinYang.state === 'CHAOS') spdMult = 1.3;
    else if (G.yinYang.state === 'HARMONY') spdMult = 1.15;

    P.vx = dx * spd * spdMult;
    P.vy = dy * spd * spdMult;
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
    updateEnemies(dt);
    if (typeof updateArcherProjectiles === 'function') updateArcherProjectiles(dt);

    // Death check — MUST be after updateEnemies (where damage is dealt)
    if (P.hp <= 0) {
        if (checkBondRevive()) {
            SFX.revive();
            spawnDmgNum(P.x, P.y - 20, 0, '#ffd700', false);
        } else {
            endRunBonding();
            SFX.gameOver();
            G.state = 'GAME_OVER';
            // Save high score
            if (typeof saveHighScore === 'function') saveHighScore();
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
}

// --- Main Draw ---
function draw() {
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    if (G.state === 'MENU') {
        drawMenuScreen();
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
        drawFloorAnnounce();
    } else if (G.state === 'LEVEL_UP') {
        drawGame();
        drawLevelUpScreen();
    } else if (G.state === 'GAME_OVER') {
        drawGame();
        drawGameOverScreen();
    }
}

// --- Game Loop ---
function gameLoop(timestamp) {
    G.dt = Math.min((timestamp - G.lastTime) / 1000, 0.05); // cap dt at 50ms
    G.lastTime = timestamp;
    G.time += G.dt;

    // FPS counter
    G.fps = lerp(G.fps, 1 / Math.max(G.dt, 0.001), 0.05);

    if (G.state === 'PLAYING') {
        update(G.dt);
    }

    draw();
    requestAnimationFrame(gameLoop);
}

// --- Boot ---
G.lastTime = performance.now();
requestAnimationFrame(gameLoop);
