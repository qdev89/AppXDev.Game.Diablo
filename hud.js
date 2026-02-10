// ============================================================
// DYNASTY BRUHHH DUNGEON - HUD & Menus (v3 - Premium)
// ============================================================

// Smooth HUD state (lerps toward actual values)
const HUD = {
    hpDisplay: 100, xpDisplay: 0,
    comboFlash: 0, comboLabel: '', comboLabelTimer: 0,
    killTimer: 0
};

function updateHUD(dt) {
    HUD.hpDisplay = lerp(HUD.hpDisplay, P.hp / P.maxHp, dt * 8);
    HUD.xpDisplay = lerp(HUD.xpDisplay, P.xp / P.xpNeeded, dt * 10);
    if (HUD.comboFlash > 0) HUD.comboFlash -= dt;
    if (HUD.comboLabelTimer > 0) HUD.comboLabelTimer -= dt;
    HUD.killTimer += dt;
}

function drawAnimatedBar(x, y, w, h, pct, displayPct, color, trailColor) {
    // Background
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(x, y, w, h);
    // Trail (delayed damage indicator)
    if (displayPct > pct) {
        ctx.fillStyle = trailColor || '#ff444488';
        ctx.fillRect(x + 1, y + 1, (w - 2) * displayPct, h - 2);
    }
    // Actual bar
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, (w - 2) * Math.max(0, pct), h - 2);
    // Shine line
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(x + 1, y + 1, (w - 2) * Math.max(0, pct), 1);
    // Border
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
}

function drawHUD() {
    ctx.textBaseline = 'top';

    // --- HP Bar (animated with damage trail) ---
    const hpW = 100, hpH = 10, hpX = 8, hpY = 8;
    const hpPct = P.hp / P.maxHp;
    const hpColor = hpPct > 0.5 ? '#00dd55' : hpPct > 0.25 ? '#ddaa00' : '#dd2222';
    drawAnimatedBar(hpX, hpY, hpW, hpH, hpPct, HUD.hpDisplay, hpColor, '#ff333366');
    drawText(`${Math.ceil(P.hp)}/${P.maxHp}`, hpX + hpW / 2, hpY - 1, { font: 'bold 10px monospace', fill: '#fff', align: 'center' });
    // Low HP warning pulse
    if (hpPct < 0.25) {
        const pulse = Math.sin(G.time * 6) * 0.15 + 0.15;
        ctx.fillStyle = `rgba(255,0,0,${pulse})`;
        ctx.fillRect(0, 0, GAME_W, GAME_H);
    }

    // --- MP Bar (blue) ---
    const mpY = hpY + hpH + 2;
    const mpPct = P.mp / P.mpMax;
    drawAnimatedBar(hpX, mpY, hpW, 6, mpPct, mpPct, '#4488ff', '#2244aa66');
    drawText(`MP ${Math.ceil(P.mp)}`, hpX + hpW + 4, mpY - 1, { font: '8px monospace', fill: '#4488ff', outline: false });

    // --- XP Bar (animated with glow on near-level) ---
    const xpY = mpY + 10;
    const xpPct = P.xp / P.xpNeeded;
    drawAnimatedBar(hpX, xpY, hpW, 6, xpPct, HUD.xpDisplay, '#44bbff', '#2288cc66');
    if (xpPct > 0.85) {
        ctx.fillStyle = `rgba(68,187,255,${Math.sin(G.time * 5) * 0.1 + 0.1})`;
        ctx.fillRect(hpX, xpY, hpW * xpPct, 6);
    }
    drawText(`Lv.${P.level}`, hpX, xpY + 8, { font: 'bold 11px monospace', fill: '#44ddff' });

    // --- Yin-Yang Bars ---
    const yyX = 8, yyY = xpY + 24, yyW = 70, yyH = 6;
    const yy = G.yinYang;
    drawBar(yyX, yyY, yyW, yyH, yy.yin / 100, '#5577dd', '#0a0a1a', '#334');
    drawText('陰', yyX + yyW + 4, yyY - 2, { font: 'bold 10px monospace', fill: '#88bbff' });
    drawBar(yyX, yyY + yyH + 3, yyW, yyH, yy.yang / 100, '#dd4444', '#1a0a0a', '#433');
    drawText('陽', yyX + yyW + 4, yyY + yyH + 1, { font: 'bold 10px monospace', fill: '#ff8888' });

    // State indicator
    if (yy.state !== 'NEUTRAL') {
        const stateColors = { HARMONY: '#ffd700', CHAOS: '#ff3333', SERENITY: '#66aaff' };
        const stateNames = { HARMONY: '☯ HARMONY', CHAOS: '🔥 CHAOS', SERENITY: '🧊 SERENITY' };
        drawText(stateNames[yy.state], yyX, yyY + yyH * 2 + 10, { font: 'bold 12px monospace', fill: stateColors[yy.state] });
    }

    // --- Bonding Keepsake (if equipped) ---
    if (G.bonding && G.bonding.equipped) {
        const bk = G.bonding.equipped;
        const bkY = yyY + yyH * 2 + 28;
        ctx.fillStyle = 'rgba(20,15,30,0.8)'; ctx.fillRect(yyX - 2, bkY - 2, 110, 22);
        ctx.strokeStyle = bk.color || '#ffd700'; ctx.lineWidth = 1; ctx.strokeRect(yyX - 2, bkY - 2, 110, 22);
        drawText(bk.name, yyX + 3, bkY, { font: 'bold 9px monospace', fill: bk.color || '#ffd700' });
        drawText(bk.desc, yyX + 3, bkY + 11, { font: '7px monospace', fill: '#aaa', outline: false });
    }

    // --- Combo Counter (Escalating) ---
    if (G.combo > 0) {
        const comboX = GAME_W - 12, comboY = 25;
        const baseSize = 14 + G.combo / 6;
        const flashBump = HUD.comboFlash > 0 ? HUD.comboFlash * 20 : 0;
        const comboSize = Math.min(36, baseSize + flashBump);
        const comboColor = G.combo >= 200 ? '#ffd700' : G.combo >= 100 ? '#ff8800' : G.combo >= 50 ? '#ff4444' : G.combo >= 20 ? '#ff6666' : '#ffffff';

        // Glow behind combo number
        if (G.combo >= 20) {
            ctx.globalAlpha = 0.12 + Math.sin(G.time * 4) * 0.06;
            ctx.fillStyle = comboColor;
            ctx.beginPath();
            ctx.arc(comboX - 20, comboY + 10, 25 + G.combo * 0.05, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        drawText(`x${G.combo}`, comboX, comboY, { font: `bold ${Math.round(comboSize)}px monospace`, fill: comboColor, align: 'right', outlineWidth: 4 });
        const comboLabel = G.combo >= 200 ? 'DYNASTY!!!' : G.combo >= 100 ? 'MASSACRE!' : G.combo >= 50 ? 'RAMPAGE!' : G.combo >= 20 ? 'UNSTOPPABLE!' : 'COMBO';
        drawText(comboLabel, comboX, comboY + comboSize + 2, { font: 'bold 9px monospace', fill: '#ccc', align: 'right' });
    }

    // --- Floor & Score ---
    drawText(`Floor ${G.floor}`, GAME_W - 12, 6, { font: 'bold 14px monospace', fill: '#fff', align: 'right', outlineWidth: 4 });
    drawText(`${G.score}G`, GAME_W - 12, 60, { font: 'bold 11px monospace', fill: '#ffdd44', align: 'right' });
    // Kill timer
    const mins = Math.floor(HUD.killTimer / 60);
    const secs = Math.floor(HUD.killTimer % 60);
    drawText(`${mins}:${secs.toString().padStart(2, '0')}`, GAME_W - 12, 74, { font: '9px monospace', fill: '#888', align: 'right', outline: false });

    // --- FPS ---
    drawText(`${Math.round(G.fps)}fps ${G.enemies.length}e`, GAME_W - 5, GAME_H - 14, { font: '8px monospace', fill: '#666', align: 'right', outline: false });

    // --- Weapon Slots (with cd radial) ---
    const slotSize = 22, slotY = GAME_H - slotSize - 12, slotStart = 8;
    let slotIdx = 0;
    for (let i = 0; i < G.weapons.length; i++) {
        const w = G.weapons[i];
        if (w.type === 'passive') continue;
        const sx = slotStart + slotIdx * (slotSize + 5);
        const el = ELEMENTS[w.el] || ELEMENTS.METAL;
        // Slot bg
        ctx.fillStyle = 'rgba(10,10,20,0.85)'; ctx.fillRect(sx, slotY, slotSize, slotSize);
        ctx.strokeStyle = el.light; ctx.lineWidth = 1.5; ctx.strokeRect(sx, slotY, slotSize, slotSize);
        // Cooldown overlay (sweeping)
        const cdPct = w.timer > 0 ? w.timer / w.cd : 0;
        if (cdPct > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(sx + 1, slotY + 1, slotSize - 2, (slotSize - 2) * cdPct);
        }
        // Element colored fill
        ctx.fillStyle = el.color;
        ctx.fillRect(sx + 3, slotY + 3, slotSize - 6, slotSize - 6);
        ctx.fillStyle = el.light;
        ctx.fillRect(sx + 5, slotY + 5, slotSize - 10, slotSize - 10);
        // Ready flash
        if (cdPct === 0 && w.timer <= 0) {
            ctx.globalAlpha = Math.sin(G.time * 6) * 0.1 + 0.05;
            ctx.fillStyle = '#fff';
            ctx.fillRect(sx + 1, slotY + 1, slotSize - 2, slotSize - 2);
            ctx.globalAlpha = 1;
        }
        // Level number
        drawText(`${w.level}`, sx + slotSize / 2, slotY + slotSize + 1, { font: 'bold 9px monospace', fill: '#fff', align: 'center' });
        slotIdx++;
    }

    // --- Dodge Cooldown Indicator ---
    const dodgeCdPct = P.dodgeCd > 0 ? P.dodgeCd / 1.0 : 0;
    const dodgeBarX = slotStart + slotIdx * (slotSize + 5) + 4;
    const dodgeBarY = slotY + 4;
    const dodgeBarW = 28, dodgeBarH = 14;
    ctx.fillStyle = 'rgba(10,10,20,0.85)'; ctx.fillRect(dodgeBarX, dodgeBarY, dodgeBarW, dodgeBarH);
    ctx.strokeStyle = dodgeCdPct > 0 ? '#555' : '#aaaaff'; ctx.lineWidth = 1; ctx.strokeRect(dodgeBarX, dodgeBarY, dodgeBarW, dodgeBarH);
    if (dodgeCdPct > 0) {
        ctx.fillStyle = '#555566'; ctx.fillRect(dodgeBarX + 1, dodgeBarY + 1, (dodgeBarW - 2) * (1 - dodgeCdPct), dodgeBarH - 2);
    } else {
        ctx.fillStyle = '#6666ff'; ctx.fillRect(dodgeBarX + 1, dodgeBarY + 1, dodgeBarW - 2, dodgeBarH - 2);
        // Ready glow
        ctx.globalAlpha = Math.sin(G.time * 5) * 0.15 + 0.1;
        ctx.fillStyle = '#aaaaff'; ctx.fillRect(dodgeBarX + 1, dodgeBarY + 1, dodgeBarW - 2, dodgeBarH - 2);
        ctx.globalAlpha = 1;
    }
    drawText('⚡', dodgeBarX + dodgeBarW / 2, dodgeBarY, { font: 'bold 10px monospace', fill: dodgeCdPct > 0 ? '#666' : '#aaf', align: 'center' });

    // --- Boss HP Bar (top center) ---
    drawBossHPBar();

    // --- Kill Progress ---
    if (G.treasureRoom) {
        drawText('🏛️ TREASURE ROOM', GAME_W / 2, 5, { font: 'bold 12px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });
    } else if (!G.portalActive) {
        const kpW = 100, kpH = 6;
        const kpX = GAME_W / 2 - kpW / 2, kpY = 4;
        const kpPct = G.enemiesNeeded > 0 ? G.enemiesKilled / G.enemiesNeeded : 0;
        drawBar(kpX, kpY, kpW, kpH, kpPct, '#ff8800', '#1a1a1a', '#555');
        drawText(`${G.enemiesKilled}/${G.enemiesNeeded}`, GAME_W / 2, kpY + kpH + 2, { font: 'bold 9px monospace', fill: '#eee', align: 'center' });
    } else {
        drawText('⚡ PORTAL OPEN! ⚡', GAME_W / 2, 5, { font: 'bold 14px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });
    }

    // --- Minimap ---
    drawMinimap();

    // --- Phase E: Musou Bar, Skill Icons, Kill Counter ---
    if (typeof drawMusouBar === 'function') drawMusouBar();
    if (typeof drawSkillIcons === 'function') drawSkillIcons();
    if (typeof drawKillCounter === 'function') drawKillCounter();

    // Hero name display
    const hero = typeof getHeroDef === 'function' ? getHeroDef(P.heroId) : null;
    if (hero) {
        drawText(`${hero.name}`, hpX, hpY - 12, { font: 'bold 9px monospace', fill: hero.colors.accent, outline: false });
        // Rage mode indicator
        if (P.rageModeTimer > 0) {
            drawText('🔥 RAGE MODE', GAME_W / 2, 35, { font: 'bold 12px monospace', fill: '#ff4400', align: 'center', outlineWidth: 3 });
        }
        // Shield wall indicator
        if (P.shieldWall > 0) {
            drawText('🛡️ SHIELD WALL', GAME_W / 2, 35, { font: 'bold 12px monospace', fill: '#ddaa44', align: 'center', outlineWidth: 3 });
        }
    }

    // --- Touch Joystick ---
    if (touch.active) {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(touch.sx, touch.sy, 30, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#fff';
        const jx = touch.sx + clamp(touch.cx - touch.sx, -30, 30);
        const jy = touch.sy + clamp(touch.cy - touch.sy, -30, 30);
        ctx.beginPath(); ctx.arc(jx, jy, 10, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// --- Boss HP Bar ---
function drawBossHPBar() {
    const boss = G.enemies.find(e => e.type === 'boss' && !e.dead);
    if (!boss) return;

    const bW = 200, bH = 8;
    const bX = GAME_W / 2 - bW / 2, bY = GAME_H - 20;
    const bPct = boss.hp / boss.maxHp;
    const elDef = ELEMENTS[boss.el] || ELEMENTS.METAL;

    // Background panel
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(bX - 4, bY - 14, bW + 8, bH + 22);
    ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1; ctx.strokeRect(bX - 4, bY - 14, bW + 8, bH + 22);

    // Boss name
    drawText(`💀 ${boss.type.toUpperCase()} — ${elDef.symbol} ${elDef.name}`, GAME_W / 2, bY - 12, {
        font: 'bold 9px monospace', fill: '#ff6666', align: 'center'
    });

    // HP bar with segmented look
    ctx.fillStyle = '#1a0a0a'; ctx.fillRect(bX, bY, bW, bH);
    // Red trail
    ctx.fillStyle = '#881111'; ctx.fillRect(bX + 1, bY + 1, (bW - 2) * bPct, bH - 2);
    // Main bar
    const bColor = bPct > 0.5 ? '#ff4444' : bPct > 0.25 ? '#ff8800' : '#ff0000';
    ctx.fillStyle = bColor; ctx.fillRect(bX + 1, bY + 1, (bW - 2) * bPct, bH - 2);
    // Pulsing edge at low HP
    if (bPct < 0.3) {
        ctx.globalAlpha = Math.sin(G.time * 8) * 0.3 + 0.3;
        ctx.fillStyle = '#ff0000'; ctx.fillRect(bX, bY, bW, bH);
        ctx.globalAlpha = 1;
    }
    // Segments
    for (let s = 1; s < 10; s++) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(bX + (bW / 10) * s, bY, 1, bH);
    }
    ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.strokeRect(bX, bY, bW, bH);
    // HP text
    drawText(`${Math.ceil(boss.hp)}`, GAME_W / 2, bY - 1, { font: 'bold 7px monospace', fill: '#fff', align: 'center', outline: false });
}

// --- Minimap ---
function drawMinimap() {
    const mW = 50, mH = 50;
    const mX = GAME_W - mW - 6, mY = GAME_H - mH - 20;
    const scaleX = mW / G.arenaW, scaleY = mH / G.arenaH;

    // Background
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(mX, mY, mW, mH);
    ctx.strokeStyle = '#444'; ctx.lineWidth = 1; ctx.strokeRect(mX, mY, mW, mH);
    ctx.globalAlpha = 1;

    // Enemies as colored dots
    for (const e of G.enemies) {
        if (e.dead) continue;
        const ex = mX + e.x * scaleX;
        const ey = mY + e.y * scaleY;
        ctx.fillStyle = e.type === 'boss' ? '#ff0000' : e.type === 'elite' ? '#ffaa00' : e.lightColor;
        const dotSize = e.type === 'boss' ? 2.5 : e.type === 'elite' ? 1.5 : 1;
        ctx.fillRect(ex - dotSize / 2, ey - dotSize / 2, dotSize, dotSize);
    }

    // Portal
    if (G.portalActive && G.portal) {
        const px = mX + G.portal.x * scaleX;
        const py = mY + G.portal.y * scaleY;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
    }

    // Player (white blinking dot)
    const ppx = mX + P.x * scaleX;
    const ppy = mY + P.y * scaleY;
    ctx.fillStyle = Math.sin(G.time * 6) > 0 ? '#ffffff' : '#88ff88';
    ctx.fillRect(ppx - 1.5, ppy - 1.5, 3, 3);

    // View frustum rectangle
    const viewX = mX + G.camX * scaleX;
    const viewY = mY + G.camY * scaleY;
    const viewW = GAME_W * scaleX;
    const viewH = GAME_H * scaleY;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 0.5;
    ctx.strokeRect(viewX, viewY, viewW, viewH);
}

// --- Level Up Screen ---
function drawLevelUpScreen() {
    ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, 0, GAME_W, GAME_H);

    drawText('LEVEL UP!', GAME_W / 2, GAME_H / 2 - 75, { font: 'bold 22px monospace', fill: '#ffd700', align: 'center', outlineWidth: 5 });
    drawText('Choose an upgrade:', GAME_W / 2, GAME_H / 2 - 50, { font: 'bold 11px monospace', fill: '#ddd', align: 'center' });

    const choices = G.levelUpChoices;
    const boxW = 130, boxH = 90, gap = 12;
    const totalW = choices.length * boxW + (choices.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 + 5;

    for (let i = 0; i < choices.length; i++) {
        const c = choices[i];
        const bx = startX + i * (boxW + gap);
        const el = c.def.el ? ELEMENTS[c.def.el] : null;
        const borderColor = el ? el.light : '#ffffff';
        const isEvo = c.isEvolution;

        // Box with semi-transparent bg
        ctx.fillStyle = isEvo ? 'rgba(30,20,5,0.95)' : 'rgba(15,12,25,0.92)';
        ctx.fillRect(bx, startY, boxW, boxH);
        ctx.strokeStyle = isEvo ? '#ffd700' : borderColor;
        ctx.lineWidth = isEvo ? 3 : 2;
        ctx.strokeRect(bx, startY, boxW, boxH);

        if (isEvo) {
            // Double golden border for evolution
            ctx.strokeStyle = 'rgba(255,221,0,0.4)'; ctx.lineWidth = 1;
            ctx.strokeRect(bx + 3, startY + 3, boxW - 6, boxH - 6);
        }

        // Hover glow effect (top line)
        ctx.fillStyle = borderColor;
        ctx.globalAlpha = 0.3; ctx.fillRect(bx + 1, startY + 1, boxW - 2, 3); ctx.globalAlpha = 1;

        // Name
        drawText(c.def.name, bx + boxW / 2, startY + 8, { font: 'bold 11px monospace', fill: borderColor, align: 'center' });

        // Level / NEW / EVOLUTION tag
        const isEvoTag = c.isEvolution;
        const lvlColor = isEvoTag ? '#ffd700' : c.isUpgrade ? '#ffaa00' : '#44ff44';
        const lvlText = isEvoTag ? '⚡ EVOLUTION ⚡' : c.isUpgrade ? `Upgrade → Lv.${c.level}` : '★ NEW ★';
        drawText(lvlText, bx + boxW / 2, startY + 24, { font: 'bold 9px monospace', fill: lvlColor, align: 'center' });

        // Description (word wrap)
        const desc = c.def.desc || '';
        drawText(desc.substring(0, 22), bx + boxW / 2, startY + 42, { font: '8px monospace', fill: '#bbb', align: 'center', outline: false });
        if (desc.length > 22) drawText(desc.substring(22), bx + boxW / 2, startY + 54, { font: '8px monospace', fill: '#bbb', align: 'center', outline: false });

        // Element bar at bottom
        if (el) {
            ctx.fillStyle = el.color; ctx.fillRect(bx + 1, startY + boxH - 14, boxW - 2, 13);
            ctx.globalAlpha = 0.4; ctx.fillStyle = '#000'; ctx.fillRect(bx + 1, startY + boxH - 14, boxW - 2, 13); ctx.globalAlpha = 1;
            drawText(el.symbol + ' ' + el.name, bx + boxW / 2, startY + boxH - 13, { font: 'bold 10px monospace', fill: el.light, align: 'center' });
        }
    }
}

// --- Menu Screen ---
function drawMenuScreen() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Background particles
    for (let i = 0; i < 20; i++) {
        const px = (GAME_W * 0.1 + Math.sin(G.time * 0.3 + i * 1.7) * GAME_W * 0.4);
        const py = (GAME_H * 0.1 + Math.cos(G.time * 0.2 + i * 2.1) * GAME_H * 0.4);
        const el = ELEMENTS[EL_KEYS[i % 5]];
        ctx.globalAlpha = 0.15 + Math.sin(G.time + i) * 0.1;
        ctx.fillStyle = el.color;
        ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;

    // Title
    drawText('DYNASTY BRUHHH', GAME_W / 2, GAME_H / 2 - 70, { font: 'bold 24px monospace', fill: '#ffd700', align: 'center', outlineWidth: 5 });
    drawText('DUNGEON', GAME_W / 2, GAME_H / 2 - 42, { font: 'bold 30px monospace', fill: '#ff4444', align: 'center', outlineWidth: 6 });

    // Subtitle
    drawText('Vampire Survivors × Dynasty Warriors', GAME_W / 2, GAME_H / 2 - 8, { font: 'bold 10px monospace', fill: '#999', align: 'center' });

    // Elements display
    EL_KEYS.forEach((k, i) => {
        const el = ELEMENTS[k];
        drawText(el.symbol, GAME_W / 2 - 60 + i * 30, GAME_H / 2 + 12, { font: 'bold 16px monospace', fill: el.light, align: 'center', outlineWidth: 4 });
    });

    // Start prompt
    const blink = Math.sin(G.time * 3) > 0;
    if (blink) {
        drawText('[ CLICK / TAP TO START ]', GAME_W / 2, GAME_H / 2 + 50, { font: 'bold 13px monospace', fill: '#ffffff', align: 'center', outlineWidth: 4 });
    }

    // Controls hint
    drawText('WASD/Arrows: Move • Auto-attack • Space: Dodge Roll', GAME_W / 2, GAME_H / 2 + 75, { font: '9px monospace', fill: '#666', align: 'center', outline: false });

    // High Score Leaderboard
    const scores = getHighScores();
    if (scores.length > 0) {
        drawText('⭐ HIGH SCORES', GAME_W / 2, GAME_H / 2 + 100, { font: 'bold 10px monospace', fill: '#ffd700', align: 'center', outlineWidth: 3 });
        for (let i = 0; i < Math.min(scores.length, 5); i++) {
            const s = scores[i];
            const gradeColor = { S: '#ffd700', A: '#44ff44', B: '#44bbff', C: '#ffaa00', D: '#ff4444' }[s.grade] || '#888';
            const dateStr = s.date || '';
            drawText(
                `${i + 1}. ${s.score}G  F${s.floor}  ${s.grade}  ${dateStr}`,
                GAME_W / 2, GAME_H / 2 + 115 + i * 13,
                { font: '8px monospace', fill: i === 0 ? '#ffd700' : '#888', align: 'center', outline: false }
            );
        }
    }

    // Version
    drawText('v0.6.0 — Premium Edition', GAME_W / 2, GAME_H - 18, { font: '8px monospace', fill: '#444', align: 'center', outline: false });
}

// --- High Score System ---
function getHighScores() {
    try {
        return JSON.parse(localStorage.getItem('dbd_highscores') || '[]');
    } catch (e) { return []; }
}

function saveHighScore() {
    const timeAlive = HUD.killTimer || 0;
    const gradeScore = G.score + G.maxCombo * 5 + G.floor * 100 + P.level * 50;
    const grade = gradeScore >= 5000 ? 'S' : gradeScore >= 3000 ? 'A' : gradeScore >= 1500 ? 'B' : gradeScore >= 500 ? 'C' : 'D';
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}`;
    const entry = { score: G.score, floor: G.floor, level: P.level, grade, date: dateStr, combo: G.maxCombo };
    const scores = getHighScores();
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    if (scores.length > 10) scores.length = 10;
    try { localStorage.setItem('dbd_highscores', JSON.stringify(scores)); } catch (e) { }
}

// --- Game Over Screen (Run Stats) ---
function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(5,0,0,0.92)'; ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Decorative border
    ctx.strokeStyle = '#ff333366'; ctx.lineWidth = 2;
    ctx.strokeRect(20, 15, GAME_W - 40, GAME_H - 30);
    ctx.strokeStyle = '#ff111133'; ctx.lineWidth = 1;
    ctx.strokeRect(24, 19, GAME_W - 48, GAME_H - 38);

    drawText('YOU HAVE FALLEN', GAME_W / 2, 25, { font: 'bold 20px monospace', fill: '#ff3333', align: 'center', outlineWidth: 5 });

    // Grade calculation
    const timeAlive = HUD.killTimer || 0;
    const gradeScore = G.score + G.maxCombo * 5 + G.floor * 100 + P.level * 50;
    const grade = gradeScore >= 5000 ? 'S' : gradeScore >= 3000 ? 'A' : gradeScore >= 1500 ? 'B' : gradeScore >= 500 ? 'C' : 'D';
    const gradeColor = { S: '#ffd700', A: '#44ff44', B: '#44bbff', C: '#ffaa00', D: '#ff4444' }[grade];

    // Grade display (large, right side)
    drawText(grade, GAME_W - 60, 50, { font: 'bold 48px monospace', fill: gradeColor, align: 'center', outlineWidth: 6 });
    drawText('GRADE', GAME_W - 60, 100, { font: 'bold 9px monospace', fill: '#888', align: 'center' });

    // Stats panel (left side)
    const sx = 40, sy = 55;
    const statLine = (label, val, color, y) => {
        drawText(label, sx, y, { font: 'bold 9px monospace', fill: '#888', outline: false });
        drawText(val, sx + 130, y, { font: 'bold 10px monospace', fill: color, align: 'left' });
    };

    statLine('Floor Reached', `${G.floor}`, '#fff', sy);
    statLine('Player Level', `${P.level}`, '#44ddff', sy + 16);
    statLine('Gold Earned', `${G.score}G`, '#ffdd44', sy + 32);
    statLine('Enemies Slain', `${G.enemiesKilled}`, '#ff8888', sy + 48);
    statLine('Max Combo', `x${G.maxCombo}`, '#ffaa00', sy + 64);

    // Time survived
    const mins = Math.floor(timeAlive / 60);
    const secs = Math.floor(timeAlive % 60);
    statLine('Time Survived', `${mins}:${secs.toString().padStart(2, '0')}`, '#aaaaff', sy + 80);

    // DPS
    const dps = timeAlive > 0 ? Math.round(G.score / timeAlive) : 0;
    statLine('Score/sec', `${dps}`, '#ff88ff', sy + 96);

    // Weapons used
    const weaponCount = G.weapons ? G.weapons.filter(w => w.type !== 'passive').length : 0;
    statLine('Weapons Used', `${weaponCount}`, '#88ff88', sy + 112);

    // Weapon list (bottom strip)
    if (G.weapons && G.weapons.length > 0) {
        const wY = sy + 132;
        let wX = sx;
        for (const w of G.weapons) {
            if (w.type === 'passive') continue;
            const el = ELEMENTS[w.el] || ELEMENTS.METAL;
            ctx.fillStyle = 'rgba(20,15,30,0.8)'; ctx.fillRect(wX, wY, 62, 18);
            ctx.strokeStyle = el.light; ctx.lineWidth = 1; ctx.strokeRect(wX, wY, 62, 18);
            const wName = w.id.length > 8 ? w.id.substring(0, 7) + '.' : w.id;
            drawText(`${wName} L${w.level}`, wX + 31, wY + 4, { font: 'bold 7px monospace', fill: el.light, align: 'center', outline: false });
            wX += 67;
        }
    }

    // Darkness earned
    if (G.bonding) {
        const dk = G.bonding.darknessEarned || 0;
        drawText(`⬥ Darkness +${dk}`, GAME_W / 2 - 50, GAME_H - 55, { font: 'bold 10px monospace', fill: '#bb77ff' });
        drawText(`Brotherhood XP +${G.bonding.xpEarned || 0}`, GAME_W / 2 + 50, GAME_H - 55, { font: 'bold 10px monospace', fill: '#ffd700' });
    }

    const blink = Math.sin(G.time * 3) > 0;
    if (blink) {
        drawText('[ CLICK TO CONTINUE ]', GAME_W / 2, GAME_H - 35, { font: 'bold 12px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });
    }
}

// --- Bonding Screen (Pre-Run) ---
function drawBondingScreen() {
    ctx.fillStyle = '#080818'; ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Background effect
    for (let i = 0; i < 30; i++) {
        const px = GAME_W * 0.5 + Math.sin(G.time * 0.15 + i * 1.3) * GAME_W * 0.45;
        const py = GAME_H * 0.5 + Math.cos(G.time * 0.2 + i * 0.8) * GAME_H * 0.45;
        ctx.globalAlpha = 0.08 + Math.sin(G.time * 0.5 + i) * 0.04;
        ctx.fillStyle = i % 2 ? '#6644aa' : '#4488aa';
        ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;

    // --- Tab state ---
    if (typeof G.bondingTab === 'undefined') G.bondingTab = 0;

    // --- Title ---
    drawText('BROTHERHOOD', GAME_W / 2, 6, { font: 'bold 16px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });

    // --- Darkness counter (top-right) ---
    drawText(`◆ ${BondingState.darkness}`, GAME_W - 15, 8, { font: 'bold 11px monospace', fill: '#bb77ff', align: 'right' });

    // --- Tabs ---
    const tabY = 26, tabH = 18, tabW = 130;
    const tab0X = GAME_W / 2 - tabW - 5;
    const tab1X = GAME_W / 2 + 5;

    // Tab 0: BONDS
    ctx.fillStyle = G.bondingTab === 0 ? 'rgba(80,60,20,0.9)' : 'rgba(15,12,25,0.7)';
    ctx.fillRect(tab0X, tabY, tabW, tabH);
    ctx.strokeStyle = G.bondingTab === 0 ? '#ffd700' : '#444';
    ctx.lineWidth = G.bondingTab === 0 ? 2 : 1;
    ctx.strokeRect(tab0X, tabY, tabW, tabH);
    drawText('⚔ BONDS', tab0X + tabW / 2, tabY + 2, { font: 'bold 11px monospace', fill: G.bondingTab === 0 ? '#ffd700' : '#666', align: 'center', outlineWidth: 2 });

    // Tab 1: ARCANA
    ctx.fillStyle = G.bondingTab === 1 ? 'rgba(60,40,100,0.9)' : 'rgba(15,12,25,0.7)';
    ctx.fillRect(tab1X, tabY, tabW, tabH);
    ctx.strokeStyle = G.bondingTab === 1 ? '#aa88ff' : '#444';
    ctx.lineWidth = G.bondingTab === 1 ? 2 : 1;
    ctx.strokeRect(tab1X, tabY, tabW, tabH);
    drawText('🔮 ARCANA', tab1X + tabW / 2, tabY + 2, { font: 'bold 11px monospace', fill: G.bondingTab === 1 ? '#aa88ff' : '#666', align: 'center', outlineWidth: 2 });

    // --- Tab Content ---
    if (G.bondingTab === 0) {
        drawBondsTab();
    } else {
        drawArcanaTab();
    }

    // --- Start button (always visible) ---
    const btnW = 200, btnH = 28;
    const btnX = GAME_W / 2 - btnW / 2;
    const btnY = GAME_H - 38;
    const pulse = Math.sin(G.time * 4) * 0.1 + 0.9;
    ctx.fillStyle = `rgba(40,100,40,${pulse})`; ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.strokeStyle = '#44ff44'; ctx.lineWidth = 2; ctx.strokeRect(btnX, btnY, btnW, btnH);
    drawText('⚔ BEGIN DUNGEON ⚔', GAME_W / 2, btnY + 5, { font: 'bold 14px monospace', fill: '#ffffff', align: 'center', outlineWidth: 4 });
}

// --- BONDS TAB ---
function drawBondsTab() {
    const factions = ['Shu', 'Wei', 'Wu'];
    const factionColors = { Shu: '#ff4444', Wei: '#4488ff', Wu: '#44dd44' };
    const cardW = 210, cardH = 52, gapX = 15, gapY = 8;
    const gridStartX = GAME_W / 2 - cardW - gapX / 2;
    const gridStartY = 52;

    let cardIdx = 0;
    for (let fi = 0; fi < factions.length; fi++) {
        const faction = factions[fi];
        const fBonds = BONDS.filter(b => b.faction === faction);
        for (let bi = 0; bi < fBonds.length; bi++) {
            const bond = fBonds[bi];
            const col = cardIdx % 2;
            const row = Math.floor(cardIdx / 2);
            const bx = gridStartX + col * (cardW + gapX);
            const by = gridStartY + row * (cardH + gapY);
            const isEquipped = BondingState.equippedBond === bond.id;
            const level = BondingState.bondLevels[bond.id] || 0;
            cardIdx++;

            // Card background
            ctx.fillStyle = isEquipped ? 'rgba(60,40,20,0.95)' : 'rgba(15,12,25,0.9)';
            ctx.fillRect(bx, by, cardW, cardH);
            ctx.strokeStyle = isEquipped ? '#ffd700' : (factionColors[faction] || '#555');
            ctx.lineWidth = isEquipped ? 2.5 : 1;
            ctx.strokeRect(bx, by, cardW, cardH);

            // Equipped glow
            if (isEquipped) {
                ctx.fillStyle = '#ffd700'; ctx.globalAlpha = 0.12;
                ctx.fillRect(bx + 1, by + 1, cardW - 2, cardH - 2);
                ctx.globalAlpha = 1;
            }

            // Faction color strip (left edge)
            ctx.fillStyle = factionColors[faction]; ctx.globalAlpha = 0.5;
            ctx.fillRect(bx + 1, by + 1, 4, cardH - 2);
            ctx.globalAlpha = 1;

            // Bond name — FULL, no truncation
            drawText(bond.name, bx + 12, by + 5, { font: 'bold 11px monospace', fill: isEquipped ? '#ffd700' : '#eee', outlineWidth: 2 });

            // Rank stars
            let starStr = '';
            for (let l = 0; l < 3; l++) starStr += l < level ? '★' : '☆';
            drawText(starStr, bx + 12, by + 21, { font: '11px monospace', fill: level > 0 ? '#ffd700' : '#444', outline: false });

            // Faction tag
            drawText(faction, bx + cardW - 10, by + 5, { font: 'bold 10px monospace', fill: factionColors[faction], align: 'right' });

            // Effect or locked status
            if (level > 0) {
                const fx = bond.levels[level - 1];
                drawText(fx.name, bx + 12, by + 36, { font: '9px monospace', fill: '#aaa', outline: false });
            } else {
                drawText('Locked', bx + 12, by + 36, { font: '9px monospace', fill: '#555', outline: false });
            }
        }
    }
}

// --- ARCANA TAB ---
function drawArcanaTab() {
    // Grasp budget
    const maxGrasp = 5 + Math.floor(BondingState.darkness / 50);
    let usedGrasp = 0;
    BondingState.equippedCards.forEach(id => {
        const card = SKILL_TREE.find(c => c.id === id);
        if (card) usedGrasp += card.grasp;
    });
    drawText(`Grasp: ${usedGrasp}/${maxGrasp}`, GAME_W / 2, 50, { font: 'bold 11px monospace', fill: usedGrasp <= maxGrasp ? '#88ff88' : '#ff4444', align: 'center' });
    drawBar(GAME_W / 2 - 60, 64, 120, 5, usedGrasp / maxGrasp, usedGrasp <= maxGrasp ? '#88ff88' : '#ff4444', '#1a1a1a', '#333');

    // Skill cards — tiered rows (dynamic width for rows with many cards)
    const scH = 42, scGap = 8;
    let scY = 78;

    for (let row = 0; row < 4; row++) {
        const rowCards = SKILL_TREE.filter(c => c.row === row);
        const scW = rowCards.length >= 5 ? 86 : 130;
        const rowW = rowCards.length * (scW + scGap) - scGap;
        let scX = GAME_W / 2 - rowW / 2;

        for (const card of rowCards) {
            const isEquipped = BondingState.equippedCards.includes(card.id);
            const isUnlocked = card.unlocked || BondingState.unlockedCards.includes(card.id);

            ctx.fillStyle = isEquipped ? 'rgba(80,60,120,0.9)' : isUnlocked ? 'rgba(20,15,30,0.9)' : 'rgba(10,8,15,0.7)';
            ctx.fillRect(scX, scY, scW, scH);
            ctx.strokeStyle = isEquipped ? '#ffd700' : isUnlocked ? '#8866cc' : '#333';
            ctx.lineWidth = isEquipped ? 2 : 1;
            ctx.strokeRect(scX, scY, scW, scH);

            // Icon + name (adaptive size for narrow cards)
            const isNarrow = scW < 100;
            const iconFont = isNarrow ? '10px monospace' : '14px monospace';
            const nameFont = isNarrow ? 'bold 8px monospace' : 'bold 10px monospace';
            const nameX = isNarrow ? 18 : 24;
            drawText(card.icon, scX + 6, scY + (isNarrow ? 6 : 4), { font: iconFont, fill: isUnlocked ? '#fff' : '#444', outline: false });
            drawText(card.name, scX + nameX, scY + 5, { font: nameFont, fill: isEquipped ? '#ffd700' : isUnlocked ? '#ddd' : '#555', outlineWidth: isNarrow ? 1 : 2 });

            // Grasp cost
            drawText(`◆${card.grasp}`, scX + scW - 6, scY + 5, { font: isNarrow ? '7px monospace' : 'bold 9px monospace', fill: isEquipped ? '#ffd700' : '#777', align: 'right', outline: false });

            // Lock / effect
            if (!isUnlocked) {
                drawText(`🔒 ${card.cost}◆`, scX + 6, scY + 26, { font: '9px monospace', fill: '#bb77ff', outline: false });
            } else {
                drawText(card.desc || 'Equipped', scX + 6, scY + 26, { font: '8px monospace', fill: '#888', outline: false });
            }

            scX += scW + scGap;
        }
        scY += scH + scGap;
    }
}

// --- Handle Bonding Screen Click ---
function handleBondingClick(mx, my) {
    // Check Start button
    const btnW = 200, btnH = 28;
    const btnX = GAME_W / 2 - btnW / 2;
    const btnY = GAME_H - 38;
    if (mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH) {
        SFX.menuClick();
        startGame();
        return;
    }

    // Check tab clicks
    const tabY = 26, tabH = 18, tabW = 130;
    const tab0X = GAME_W / 2 - tabW - 5;
    const tab1X = GAME_W / 2 + 5;
    if (my >= tabY && my <= tabY + tabH) {
        if (mx >= tab0X && mx <= tab0X + tabW) { G.bondingTab = 0; SFX.menuClick(); return; }
        if (mx >= tab1X && mx <= tab1X + tabW) { G.bondingTab = 1; SFX.menuClick(); return; }
    }

    if (G.bondingTab === 0) {
        // Check bond cards
        const factions = ['Shu', 'Wei', 'Wu'];
        const cardW = 210, cardH = 52, gapX = 15, gapY = 8;
        const gridStartX = GAME_W / 2 - cardW - gapX / 2;
        const gridStartY = 52;

        let cardIdx = 0;
        for (let fi = 0; fi < factions.length; fi++) {
            const faction = factions[fi];
            const fBonds = BONDS.filter(b => b.faction === faction);
            for (let bi = 0; bi < fBonds.length; bi++) {
                const bond = fBonds[bi];
                const col = cardIdx % 2;
                const row = Math.floor(cardIdx / 2);
                const bx = gridStartX + col * (cardW + gapX);
                const by = gridStartY + row * (cardH + gapY);
                const level = BondingState.bondLevels[bond.id] || 0;
                cardIdx++;

                if (mx >= bx && mx <= bx + cardW && my >= by && my <= by + cardH) {
                    if (level > 0) {
                        BondingState.equippedBond = (BondingState.equippedBond === bond.id) ? null : bond.id;
                        SFX.menuClick();
                    }
                    return;
                }
            }
        }
    } else {
        // Check skill tree cards
        const scH = 42, scGap = 8;
        let scY = 78;

        for (let row = 0; row < 4; row++) {
            const rowCards = SKILL_TREE.filter(c => c.row === row);
            const scW = rowCards.length >= 5 ? 86 : 130;
            const rowW = rowCards.length * (scW + scGap) - scGap;
            let scX = GAME_W / 2 - rowW / 2;

            for (const card of rowCards) {
                if (mx >= scX && mx <= scX + scW && my >= scY && my <= scY + scH) {
                    const isUnlocked = card.unlocked || BondingState.unlockedCards.includes(card.id);
                    const isEquipped = BondingState.equippedCards.includes(card.id);

                    if (!isUnlocked && BondingState.darkness >= card.cost) {
                        BondingState.darkness -= card.cost;
                        BondingState.unlockedCards.push(card.id);
                        SFX.goldPickup();
                    } else if (isUnlocked && !isEquipped) {
                        BondingState.equippedCards.push(card.id);
                        SFX.menuClick();
                    } else if (isEquipped) {
                        BondingState.equippedCards = BondingState.equippedCards.filter(id => id !== card.id);
                        SFX.menuClick();
                    }
                    return;
                }
                scX += scW + scGap;
            }
            scY += scH + scGap;
        }
    }
}

// --- Floor Announcement ---
function drawFloorAnnounce() {
    if (!G.floorAnnounce) return;
    const fa = G.floorAnnounce;
    const alpha = fa.timer > 1.5 ? (2.5 - fa.timer) : fa.timer > 0.5 ? 1 : fa.timer * 2;

    ctx.globalAlpha = Math.max(0, alpha);

    // Background bar
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, GAME_H * 0.35, GAME_W, 36);

    // Text
    drawText(fa.text, GAME_W / 2, GAME_H * 0.35 + 8, {
        font: 'bold 16px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4
    });

    ctx.globalAlpha = 1;
}

// ============================================================
// PHASE E: Hero Select Screen, Musou Bar, Skills, Allies, Beast
// ============================================================

// --- Musou Bar (drawn as part of HUD, call from drawHUD area) ---
function drawMusouBar() {
    const barW = 140, barH = 10;
    const barX = GAME_W / 2 - barW / 2;
    const barY = GAME_H - 18;
    const pct = P.musou / P.musouMax;
    const isFull = pct >= 1;

    // Background
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(barX, barY, barW, barH);
    // Fill
    const fillColor = isFull ? `hsl(${(G.time * 120) % 360}, 80%, 55%)` : '#ccaa22';
    ctx.fillStyle = fillColor;
    ctx.fillRect(barX + 1, barY + 1, (barW - 2) * clamp(pct, 0, 1), barH - 2);
    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(barX + 1, barY + 1, (barW - 2) * clamp(pct, 0, 1), 2);
    // Border
    ctx.strokeStyle = isFull ? '#ffd700' : '#555';
    ctx.lineWidth = isFull ? 2 : 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // Label
    const label = isFull ? '⚡ MUSOU READY [Q] ⚡' : `Musou ${Math.floor(pct * 100)}%`;
    const labelColor = isFull ? '#ffd700' : '#999';
    drawText(label, GAME_W / 2, barY - 10, { font: `bold ${isFull ? '9' : '7'}px monospace`, fill: labelColor, align: 'center', outlineWidth: isFull ? 3 : 0, outline: isFull });

    // Full pulse
    if (isFull) {
        ctx.fillStyle = `rgba(255,215,0,${Math.sin(G.time * 6) * 0.08 + 0.08})`;
        ctx.fillRect(barX, barY, barW, barH);
    }
}

// --- Kill Counter & Chain Display ---
function drawKillCounter() {
    // Kill count top-right
    const killText = `斬 ${G.totalKills.toLocaleString()}`;
    drawText(killText, GAME_W - 8, 8, { font: 'bold 11px monospace', fill: '#ffd700', align: 'right' });

    // Chain display
    if (G.chainCount >= 5) {
        const chainSize = Math.min(20, 10 + G.chainCount * 0.3);
        const chainColor = G.chainCount >= 30 ? '#ff4400' : G.chainCount >= 15 ? '#ffd700' : '#ffaa44';
        drawText(`CHAIN ×${G.chainCount}`, GAME_W / 2, 50, {
            font: `bold ${Math.floor(chainSize)}px monospace`, fill: chainColor, align: 'center', outlineWidth: 3
        });
    }

    // Kill milestones
    if (G.killMilestone > 0 && G.time - G._milestoneTime < 2) {
        const mt = G.time - G._milestoneTime;
        const ma = mt < 1.5 ? 1 : 1 - (mt - 1.5) / 0.5;
        ctx.globalAlpha = clamp(ma, 0, 1);
        drawText(`${G.killMilestone} SLAIN!`, GAME_W / 2, 70, {
            font: 'bold 18px monospace', fill: '#ff4444', align: 'center', outlineWidth: 4
        });
        ctx.globalAlpha = 1;
    }
}

// --- Skill Cooldown Icons ---
function drawSkillIcons() {
    const hero = getHeroDef(P.heroId);
    const iconY = GAME_H - 38;

    // Tactical (E) — left of musou bar
    const eX = GAME_W / 2 - 90;
    const tac = hero.tactical;
    const eCdPct = P.tacticalCd > 0 ? P.tacticalCd / tac.cd : 0;
    const eReady = P.tacticalCd <= 0 && P.mp >= tac.mpCost;

    ctx.fillStyle = eReady ? 'rgba(40,80,40,0.9)' : 'rgba(20,20,30,0.9)';
    ctx.fillRect(eX, iconY, 28, 28);
    ctx.strokeStyle = eReady ? '#44ff44' : '#444';
    ctx.lineWidth = eReady ? 2 : 1;
    ctx.strokeRect(eX, iconY, 28, 28);

    // Cooldown overlay
    if (eCdPct > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(eX + 1, iconY + 1, 26, 26 * eCdPct);
    }
    drawText(tac.icon, eX + 3, iconY + 3, { font: '14px monospace', fill: eReady ? '#fff' : '#666', outline: false });
    drawText('[E]', eX + 14, iconY + 20, { font: 'bold 6px monospace', fill: eReady ? '#44ff44' : '#444', align: 'center', outline: false });

    // Ultimate (Q) — right of musou bar
    const qX = GAME_W / 2 + 62;
    const ult = hero.ultimate;
    const qReady = P.musou >= P.musouMax;

    ctx.fillStyle = qReady ? `rgba(80,60,20,${0.7 + Math.sin(G.time * 5) * 0.2})` : 'rgba(20,20,30,0.9)';
    ctx.fillRect(qX, iconY, 28, 28);
    ctx.strokeStyle = qReady ? '#ffd700' : '#444';
    ctx.lineWidth = qReady ? 2 : 1;
    ctx.strokeRect(qX, iconY, 28, 28);

    drawText(ult.icon, qX + 3, iconY + 3, { font: '14px monospace', fill: qReady ? '#ffd700' : '#666', outline: false });
    drawText('[Q]', qX + 14, iconY + 20, { font: 'bold 6px monospace', fill: qReady ? '#ffd700' : '#444', align: 'center', outline: false });
}

// --- Hero Select Screen ---
function drawHeroSelectScreen() {
    ctx.fillStyle = '#060612'; ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Animated background particles
    for (let i = 0; i < 40; i++) {
        const px = GAME_W * 0.5 + Math.sin(G.time * 0.1 + i * 1.5) * GAME_W * 0.48;
        const py = GAME_H * 0.5 + Math.cos(G.time * 0.15 + i * 0.9) * GAME_H * 0.48;
        ctx.globalAlpha = 0.06 + Math.sin(G.time * 0.3 + i) * 0.03;
        ctx.fillStyle = ['#ff4400', '#44ff44', '#aaaaff', '#ddaa44', '#4466ff'][i % 5];
        ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;

    // Title
    drawText('CHOOSE YOUR HERO', GAME_W / 2, 8, { font: 'bold 16px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });

    // Hero cards — 5 cards
    const cardW = 88, cardH = 240, gap = 4;
    const totalW = HEROES.length * (cardW + gap) - gap;
    const startX = GAME_W / 2 - totalW / 2;
    const startY = 30;

    for (let i = 0; i < HEROES.length; i++) {
        const h = HEROES[i];
        const cx = startX + i * (cardW + gap);
        const cy = startY;
        const isHover = G._heroHover === i;
        const elColor = ELEMENTS[h.element] ? ELEMENTS[h.element].color : '#888';

        // Card bg
        ctx.fillStyle = isHover ? 'rgba(30,25,50,0.95)' : 'rgba(12,10,20,0.9)';
        ctx.fillRect(cx, cy, cardW, cardH);

        // Element glow border
        ctx.strokeStyle = elColor;
        ctx.lineWidth = isHover ? 3 : 1;
        ctx.strokeRect(cx, cy, cardW, cardH);

        // Hero pixel art preview (simple colored rectangle for now)
        const previewY = cy + 6;
        ctx.fillStyle = h.colors.body;
        ctx.fillRect(cx + cardW / 2 - 8, previewY, 16, 20);
        ctx.fillStyle = h.colors.accent;
        ctx.fillRect(cx + cardW / 2 - 6, previewY + 2, 12, 5); // head
        ctx.fillStyle = h.colors.hair;
        ctx.fillRect(cx + cardW / 2 - 6, previewY, 12, 3); // hair

        // Element symbol
        const elSym = ELEMENTS[h.element] ? ELEMENTS[h.element].symbol : '?';
        drawText(elSym, cx + cardW - 6, cy + 4, { font: 'bold 12px monospace', fill: elColor, align: 'right' });

        // Name
        drawText(h.name, cx + cardW / 2, cy + 32, { font: 'bold 10px monospace', fill: '#fff', align: 'center', outlineWidth: 2 });
        // Title
        drawText(h.title, cx + cardW / 2, cy + 44, { font: '8px monospace', fill: '#aaa', align: 'center', outline: false });

        // Class ID
        drawText(h.id.toUpperCase(), cx + cardW / 2, cy + 56, { font: 'bold 8px monospace', fill: elColor, align: 'center' });

        // Stats
        const statsY = cy + 72;
        drawText(`HP: ${h.hp}`, cx + 4, statsY, { font: '8px monospace', fill: '#44dd44', outline: false });
        drawText(`SPD: ${h.speed}`, cx + 4, statsY + 11, { font: '8px monospace', fill: '#44bbff', outline: false });
        drawText(`MP: ${h.mp}`, cx + 4, statsY + 22, { font: '8px monospace', fill: '#4488ff', outline: false });

        // Passive
        drawText('PASSIVE:', cx + 4, statsY + 38, { font: 'bold 7px monospace', fill: '#ffd700', outline: false });
        drawText(h.passive.name, cx + 4, statsY + 48, { font: '7px monospace', fill: '#ddd', outline: false });

        // Tactical
        const tac = h.tactical;
        drawText(`[E] ${tac.icon} ${tac.name}`, cx + 4, statsY + 64, { font: 'bold 7px monospace', fill: '#44ff44', outline: false });
        drawText(`${tac.mpCost} MP`, cx + 4, statsY + 74, { font: '7px monospace', fill: '#4488ff', outline: false });

        // Ultimate
        const ult = h.ultimate;
        drawText(`[Q] ${ult.icon} ${ult.name}`, cx + 4, statsY + 90, { font: 'bold 7px monospace', fill: '#ffd700', outline: false });
        drawText('Musou gauge', cx + 4, statsY + 100, { font: '7px monospace', fill: '#ccaa22', outline: false });

        // Element bar at bottom
        ctx.fillStyle = elColor; ctx.globalAlpha = 0.3;
        ctx.fillRect(cx + 1, cy + cardH - 14, cardW - 2, 13);
        ctx.globalAlpha = 1;
        drawText(ELEMENTS[h.element] ? ELEMENTS[h.element].name : h.element, cx + cardW / 2, cy + cardH - 13, {
            font: 'bold 9px monospace', fill: '#fff', align: 'center', outline: false
        });
    }

    // Instructions
    drawText('Click a hero to begin', GAME_W / 2, GAME_H - 18, { font: '9px monospace', fill: '#666', align: 'center', outline: false });
}

// --- Handle Hero Select Click ---
function handleHeroSelectClick(mx, my) {
    const cardW = 88, cardH = 240, gap = 4;
    const totalW = HEROES.length * (cardW + gap) - gap;
    const startX = GAME_W / 2 - totalW / 2;
    const startY = 30;

    for (let i = 0; i < HEROES.length; i++) {
        const cx = startX + i * (cardW + gap);
        if (mx >= cx && mx <= cx + cardW && my >= startY && my <= startY + cardH) {
            G.selectedHero = HEROES[i].id;
            SFX.menuClick();
            G.state = 'BONDING';
            return;
        }
    }
}

// --- Tactical Skill Execution (E key) ---
function fireTacticalSkill() {
    const hero = getHeroDef(P.heroId);
    const tac = hero.tactical;
    if (P.tacticalCd > 0 || P.mp < tac.mpCost) return;

    P.mp -= tac.mpCost;
    P.tacticalCd = tac.cd;
    P.mpRegenDelay = 1.5;
    SFX.menuClick();

    switch (tac.id) {
        case 'ground_slam': // Berserker — AoE stun
            shake(3, 0.2);
            spawnParticles(P.x, P.y, '#ff4400', 15, 60);
            G.enemies.forEach(e => {
                if (dist(P, e) < tac.range) {
                    damageEnemy(e, tac.dmg, P.element);
                    e.stunTimer = (e.stunTimer || 0) + tac.stunDur;
                    e.speed *= 0; // Will recover after stun
                }
            });
            break;

        case 'wind_burst': // Strategist — Cone knockback
            spawnParticles(P.x, P.y, '#44ff44', 12, 50);
            G.enemies.forEach(e => {
                if (dist(P, e) < tac.range) {
                    damageEnemy(e, tac.dmg, P.element);
                    const dx = e.x - P.x, dy = e.y - P.y;
                    const d = Math.hypot(dx, dy) || 1;
                    e.x += (dx / d) * tac.knockback;
                    e.y += (dy / d) * tac.knockback;
                }
            });
            shake(2, 0.15);
            break;

        case 'shadow_strike': // Assassin — Teleport to nearest
            let nearest = null, minD = tac.teleRange;
            G.enemies.forEach(e => {
                const d = dist(P, e);
                if (d < minD) { minD = d; nearest = e; }
            });
            if (nearest) {
                spawnParticles(P.x, P.y, '#ccccff', 6, 30); // Trail from start
                P.x = nearest.x; P.y = nearest.y - 10;
                damageEnemy(nearest, tac.dmg, P.element);
                spawnParticles(P.x, P.y, '#aaaaff', 10, 40);
                shake(2, 0.1);
                hitStop(0.05);
            }
            break;

        case 'shield_wall': // Vanguard — Block all damage
            P.shieldWall = tac.blockDur;
            P.invincible = tac.blockDur;
            spawnParticles(P.x, P.y, '#ddaa44', 8, 30);
            break;

        case 'life_drain': // Mystic — Steal HP
            let healed = 0;
            spawnParticles(P.x, P.y, '#5588ff', 10, 40);
            G.enemies.forEach(e => {
                if (dist(P, e) < tac.range) {
                    const drainDmg = Math.min(e.hp, 10);
                    damageEnemy(e, drainDmg, P.element);
                    healed += drainDmg;
                }
            });
            P.hp = clamp(P.hp + Math.min(healed, tac.healAmt), 0, P.maxHp);
            spawnDmgNum(P.x, P.y - 20, Math.min(healed, tac.healAmt), '#44ff44', false);
            break;
    }
}

// --- Ultimate / Musou Execution (Q key) ---
function fireUltimateSkill() {
    if (P.musou < P.musouMax) return;

    const hero = getHeroDef(P.heroId);
    P.musou = 0;
    P.ultimateActive = hero.ultimate.duration || 3;

    // Screen flash + big shake for all ultimates
    if (typeof triggerFlash === 'function') triggerFlash('#ffd700', 0.3);
    if (typeof triggerChromatic === 'function') triggerChromatic(3);
    shake(5, 0.3);
    spawnParticles(P.x, P.y, '#ffd700', 25, 80);
    SFX.goldPickup();

    switch (hero.ultimate.id) {
        case 'rage_mode': // Berserker — 2x dmg, 1.5x speed for 6s
            P.rageModeTimer = hero.ultimate.duration;
            spawnParticles(P.x, P.y, '#ff4400', 20, 60);
            break;

        case 'eight_trigrams': // Strategist — 8 elemental bolts
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                G.bullets.push({
                    x: P.x, y: P.y,
                    vx: Math.cos(angle) * 120,
                    vy: Math.sin(angle) * 120,
                    dmg: hero.ultimate.dmg, el: EL_KEYS[i % 5],
                    life: 3, r: 5, pierce: 3
                });
            }
            break;

        case 'blade_storm': // Assassin — Dash through nearby enemies
            const nearby = G.enemies.filter(e => dist(P, e) < hero.ultimate.range).slice(0, hero.ultimate.hits);
            nearby.forEach((e, i) => {
                setTimeout(() => {
                    if (e.hp > 0) {
                        damageEnemy(e, hero.ultimate.dmg, P.element);
                        spawnParticles(e.x, e.y, '#ccccff', 5, 30);
                    }
                }, i * 50);
            });
            P.invincible = Math.max(P.invincible, 1.5);
            break;

        case 'changban_charge': // Vanguard — Invincible charge
            P.invincible = Math.max(P.invincible, 2);
            P.dodgeDx = P.facing * hero.ultimate.chargeSpeed;
            P.dodgeDy = 0;
            P.dodgeTimer = 0.8;
            // AoE damage at endpoint after delay
            setTimeout(() => {
                G.enemies.forEach(e => {
                    if (dist(P, e) < hero.ultimate.range) {
                        damageEnemy(e, hero.ultimate.dmg, P.element);
                    }
                });
                shake(4, 0.3);
                spawnParticles(P.x, P.y, '#ddaa44', 20, 60);
            }, 800);
            break;

        case 'phoenix_summon': // Mystic — Summon phoenix for 10s
            G.sacredBeast = {
                type: 'phoenix', x: P.x, y: P.y - 30,
                angle: 0, affinity: 50,
                atkCd: 0, timer: hero.ultimate.duration,
                dmg: hero.ultimate.dmg
            };
            spawnParticles(P.x, P.y, '#ff4400', 15, 50);
            spawnParticles(P.x, P.y, '#ffd700', 10, 40);
            break;
    }
}

// --- AI Companion Update ---
function updateAllies(dt) {
    G.allies.forEach(ally => {
        if (ally.hp <= 0) {
            ally.respawnTimer -= dt;
            if (ally.respawnTimer <= 0) {
                ally.hp = ally.maxHp;
                ally.x = P.x + rng(-30, 30);
                ally.y = P.y + rng(-30, 30);
            }
            return;
        }

        // Find target
        let target = null, minDist = 150;
        G.enemies.forEach(e => {
            const d = dist(ally, e);
            if (d < minDist) { minDist = d; target = e; }
        });

        if (target) {
            const dx = target.x - ally.x, dy = target.y - ally.y;
            const d = Math.hypot(dx, dy) || 1;

            if (ally.behavior === 'melee' || ally.behavior === 'tank') {
                // Move toward target
                if (d > ally.range) {
                    ally.x += (dx / d) * ally.speed * dt;
                    ally.y += (dy / d) * ally.speed * dt;
                }
            } else if (ally.behavior === 'ranged') {
                // Keep distance
                if (d < 50) {
                    ally.x -= (dx / d) * ally.speed * dt;
                    ally.y -= (dy / d) * ally.speed * dt;
                } else if (d > 100) {
                    ally.x += (dx / d) * ally.speed * dt * 0.5;
                    ally.y += (dy / d) * ally.speed * dt * 0.5;
                }
            }

            // Attack
            ally.atkCd -= dt;
            if (ally.atkCd <= 0 && d < (ally.behavior === 'ranged' ? 120 : ally.range + 15)) {
                ally.atkCd = ally.atkRate;
                if (ally.behavior === 'ranged') {
                    // Fire projectile
                    G.bullets.push({
                        x: ally.x, y: ally.y,
                        vx: (dx / d) * 100, vy: (dy / d) * 100,
                        dmg: ally.dmg, el: P.element, life: 2, r: 3
                    });
                } else {
                    // Melee hit
                    damageEnemy(target, ally.dmg, P.element);
                    spawnParticles(target.x, target.y, ally.color, 3, 20);
                }
            }
        } else {
            // Follow player
            const pdx = P.x - ally.x, pdy = P.y - ally.y;
            const pd = Math.hypot(pdx, pdy) || 1;
            if (pd > 40) {
                ally.x += (pdx / pd) * ally.speed * 0.8 * dt;
                ally.y += (pdy / pd) * ally.speed * 0.8 * dt;
            }
        }

        // Bounds
        ally.x = clamp(ally.x, 5, G.arenaW - 5);
        ally.y = clamp(ally.y, 5, G.arenaH - 5);
    });
}

// --- Draw Allies ---
function drawAllies() {
    G.allies.forEach(ally => {
        if (ally.hp <= 0) return;
        const sx = ally.x - G.camX + G.shakeX;
        const sy = ally.y - G.camY + G.shakeY;
        if (sx < -20 || sx > GAME_W + 20 || sy < -20 || sy > GAME_H + 20) return;

        // Body
        ctx.fillStyle = ally.color;
        ctx.fillRect(sx - 5, sy - 6, 10, 12);
        // Head
        ctx.fillStyle = '#ddc';
        ctx.fillRect(sx - 3, sy - 9, 6, 4);
        // Weapon indicator
        ctx.fillStyle = ally.behavior === 'ranged' ? '#4488ff' : '#ff8844';
        ctx.fillRect(sx + (ally.behavior === 'ranged' ? 5 : -7), sy - 3, 3, 6);

        // HP bar
        const hpPct = ally.hp / ally.maxHp;
        ctx.fillStyle = '#333'; ctx.fillRect(sx - 8, sy - 13, 16, 2);
        ctx.fillStyle = hpPct > 0.5 ? '#44dd44' : '#dd4444';
        ctx.fillRect(sx - 8, sy - 13, 16 * hpPct, 2);

        // Name
        drawText(ally.name, sx, sy + 9, { font: '6px monospace', fill: ally.color, align: 'center', outline: false });
    });
}

// --- Sacred Beast Update ---
function updateSacredBeast(dt) {
    const beast = G.sacredBeast;
    if (!beast) return;

    beast.timer -= dt;
    if (beast.timer <= 0) { G.sacredBeast = null; return; }

    // Orbit player
    beast.angle += 2.5 * dt;
    beast.x = P.x + Math.cos(beast.angle) * 35;
    beast.y = P.y + Math.sin(beast.angle) * 35 - 10;

    // Attack nearest enemy
    beast.atkCd -= dt;
    if (beast.atkCd <= 0) {
        let nearest = null, minD = 120;
        G.enemies.forEach(e => {
            const d = dist(beast, e);
            if (d < minD) { minD = d; nearest = e; }
        });
        if (nearest) {
            beast.atkCd = 1.8;
            const dx = nearest.x - beast.x, dy = nearest.y - beast.y;
            const d = Math.hypot(dx, dy) || 1;
            G.bullets.push({
                x: beast.x, y: beast.y,
                vx: (dx / d) * 130, vy: (dy / d) * 130,
                dmg: beast.dmg || 12, el: 'FIRE', life: 2, r: 4
            });
            spawnParticles(beast.x, beast.y, '#ff4400', 3, 20);
        }
    }

    // Trail particles
    if (Math.random() < 0.3) {
        spawnParticles(beast.x, beast.y, '#ff8800', 1, 10);
    }
}

// --- Draw Sacred Beast ---
function drawSacredBeast() {
    const beast = G.sacredBeast;
    if (!beast) return;

    const sx = beast.x - G.camX + G.shakeX;
    const sy = beast.y - G.camY + G.shakeY;
    if (sx < -20 || sx > GAME_W + 20 || sy < -20 || sy > GAME_H + 20) return;

    // Glow
    ctx.globalAlpha = 0.3 + Math.sin(G.time * 4) * 0.1;
    ctx.fillStyle = '#ff4400';
    ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Phoenix body (red-gold bird shape)
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(sx - 4, sy - 3, 8, 6); // body
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(sx - 2, sy - 5, 4, 3); // head
    // Wings
    ctx.fillStyle = '#ff6600';
    const wingOffset = Math.sin(G.time * 8) * 2;
    ctx.fillRect(sx - 7, sy - 1 + wingOffset, 3, 4); // left wing
    ctx.fillRect(sx + 4, sy - 1 - wingOffset, 3, 4); // right wing
    // Tail
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(sx - 2, sy + 3, 4, 3);

    // Timer display
    const timeLeft = Math.ceil(beast.timer);
    drawText(`${timeLeft}s`, sx, sy + 10, { font: 'bold 7px monospace', fill: '#ffd700', align: 'center' });
}

// Extend drawHUD to include new elements
const _origDrawHUD = typeof drawHUD_orig === 'undefined' ? null : drawHUD_orig;

// Override drawGame to add musou bar, skill icons, and kill counter after existing HUD
const _origDrawGame = typeof drawGame === 'function' ? drawGame : null;
