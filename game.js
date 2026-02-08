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
    G.spawnTimer = 0; G.spawnRate = 1.5; G.enemiesPerWave = 8;
    G.enemiesKilled = 0; G.enemiesNeeded = 30;
    G.portalActive = false; G.portal = null;
    G.yinYang = { yin: 0, yang: 0, state: 'NEUTRAL', timer: 0 };

    P.x = G.arenaW / 2; P.y = G.arenaH / 2;
    P.hp = 100; P.maxHp = 100; P.xp = 0; P.xpNeeded = 20; P.level = 1;
    P.speed = 100; P.invincible = 0; P.damageFlash = 0;
    P.element = 'METAL';

    // Reset passives
    passives.atkSpd = 0; passives.maxHp = 0; passives.moveSpd = 0;
    passives.pickupRange = 0; passives.xpGain = 0;

    // Initialize bonding system for this run
    initBondingForRun();

    // Start with a basic melee weapon
    G.weapons.push(createWeapon(WEAPON_DEFS[0])); // Fire Sword

    G.camX = P.x - GAME_W / 2; G.camY = P.y - GAME_H / 2;
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

    P.x += dx * spd * spdMult * dt;
    P.y += dy * spd * spdMult * dt;

    // Facing
    if (dx > 0.1) P.facing = 1;
    else if (dx < -0.1) P.facing = -1;

    // Arena bounds
    P.x = clamp(P.x, 10, G.arenaW - 10);
    P.y = clamp(P.y, 10, G.arenaH - 10);

    // Invincibility / flash
    if (P.invincible > 0) P.invincible -= dt;
    if (P.damageFlash > 0) P.damageFlash -= dt;

    // Yin from idling
    if (len === 0) G.yinYang.yin = clamp(G.yinYang.yin + dt * 5, 0, 100);
}

// --- Main Update ---
function update(dt) {
    if (G.hitStop > 0) { G.hitStop -= dt; return; }

    updatePlayer(dt);
    updateWeapons(dt);
    updateEnemies(dt);

    // Death check — MUST be after updateEnemies (where damage is dealt)
    if (P.hp <= 0) {
        if (checkBondRevive()) {
            SFX.revive();
            spawnDmgNum(P.x, P.y - 20, 0, '#ffd700', false);
        } else {
            endRunBonding();
            SFX.gameOver();
            G.state = 'GAME_OVER';
            spawnParticles(P.x, P.y, '#ff0000', 30, 100);
            shake(5, 0.3);
            return; // Stop updating
        }
    }

    updatePickups(dt);
    updateYinYang(dt);
    updatePortal(dt);
    updateCamera();
    checkLevelUp();

    // Spawn timer
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
    }
}

// --- Main Draw ---
function draw() {
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    if (G.state === 'MENU') {
        drawMenuScreen();
    } else if (G.state === 'BONDING') {
        drawBondingScreen();
    } else if (G.state === 'PLAYING') {
        drawGame();
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
