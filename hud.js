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

    // --- XP Bar (animated with glow on near-level) ---
    const xpY = hpY + hpH + 4;
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

    // --- Boss HP Bar (top center) ---
    drawBossHPBar();

    // --- Kill Progress ---
    if (!G.portalActive) {
        const kpW = 100, kpH = 6;
        const kpX = GAME_W / 2 - kpW / 2, kpY = 4;
        drawBar(kpX, kpY, kpW, kpH, G.enemiesKilled / G.enemiesNeeded, '#ff8800', '#1a1a1a', '#555');
        drawText(`${G.enemiesKilled}/${G.enemiesNeeded}`, GAME_W / 2, kpY + kpH + 2, { font: 'bold 9px monospace', fill: '#eee', align: 'center' });
    } else {
        drawText('⚡ PORTAL OPEN! ⚡', GAME_W / 2, 5, { font: 'bold 14px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });
    }

    // --- Minimap ---
    drawMinimap();

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

    // Version
    drawText('v0.5.0 — Premium Edition', GAME_W / 2, GAME_H - 18, { font: '8px monospace', fill: '#444', align: 'center', outline: false });
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

    // Title
    drawText('BROTHERHOOD BONDS', GAME_W / 2, 8, { font: 'bold 14px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });

    // Darkness counter
    drawText(`⬥ ${BondingState.darkness}`, GAME_W - 10, 10, { font: 'bold 10px monospace', fill: '#bb77ff', align: 'right' });

    // Bond Selection — 3x3 grid
    const factions = ['Shu', 'Wei', 'Wu'];
    const factionColors = { Shu: '#ff4444', Wei: '#4488ff', Wu: '#44dd44', Other: '#ffd700' };
    const cardW = 70, cardH = 38, gapX = 6, gapY = 6;
    const gridStartX = 10, gridStartY = 28;

    for (let fi = 0; fi < factions.length; fi++) {
        const faction = factions[fi];
        const fBonds = BONDS.filter(b => b.faction === faction);
        for (let bi = 0; bi < fBonds.length; bi++) {
            const bond = fBonds[bi];
            const bx = gridStartX + bi * (cardW + gapX);
            const by = gridStartY + fi * (cardH + gapY);
            const isEquipped = BondingState.equippedBond === bond.id;
            const level = BondingState.bondLevels[bond.id] || 0;

            // Card background
            ctx.fillStyle = isEquipped ? 'rgba(60,40,20,0.95)' : 'rgba(15,12,25,0.9)';
            ctx.fillRect(bx, by, cardW, cardH);
            ctx.strokeStyle = isEquipped ? '#ffd700' : (factionColors[faction] || '#555');
            ctx.lineWidth = isEquipped ? 2 : 1;
            ctx.strokeRect(bx, by, cardW, cardH);

            // Equipped glow
            if (isEquipped) {
                ctx.fillStyle = '#ffd700'; ctx.globalAlpha = 0.15;
                ctx.fillRect(bx + 1, by + 1, cardW - 2, cardH - 2);
                ctx.globalAlpha = 1;
            }

            // Bond name (truncated)
            const shortName = bond.name.length > 12 ? bond.name.substring(0, 11) + '…' : bond.name;
            drawText(shortName, bx + cardW / 2, by + 4, { font: 'bold 7px monospace', fill: isEquipped ? '#ffd700' : '#ddd', align: 'center', outlineWidth: 2 });

            // Level dots
            for (let l = 0; l < 3; l++) {
                const dotX = bx + cardW / 2 - 8 + l * 8;
                ctx.fillStyle = l < level ? '#ffd700' : '#333';
                ctx.beginPath(); ctx.arc(dotX, by + 17, 2.5, 0, Math.PI * 2); ctx.fill();
            }

            // Effect text
            if (level > 0) {
                const fx = bond.levels[level - 1];
                const fxShort = fx.name.length > 12 ? fx.name.substring(0, 11) + '…' : fx.name;
                drawText(fxShort, bx + cardW / 2, by + 24, { font: '6px monospace', fill: '#999', align: 'center', outline: false });
            } else {
                drawText('Locked', bx + cardW / 2, by + 24, { font: '6px monospace', fill: '#555', align: 'center', outline: false });
            }

            // Faction label
            ctx.fillStyle = factionColors[faction]; ctx.globalAlpha = 0.4;
            ctx.fillRect(bx + 1, by + cardH - 8, cardW - 2, 7);
            ctx.globalAlpha = 1;
            drawText(faction, bx + cardW / 2, by + cardH - 8, { font: 'bold 6px monospace', fill: '#fff', align: 'center', outline: false });
        }
    }

    // Skill Tree Section — right side
    const treeX = GAME_W / 2 + 20;
    drawText('ARCANA CARDS', treeX + 90, 28, { font: 'bold 11px monospace', fill: '#aa88ff', align: 'center', outlineWidth: 3 });

    // Grasp budget
    const maxGrasp = 5 + Math.floor(BondingState.darkness / 50);
    let usedGrasp = 0;
    BondingState.equippedCards.forEach(id => {
        const card = SKILL_TREE.find(c => c.id === id);
        if (card) usedGrasp += card.grasp;
    });
    drawText(`Grasp: ${usedGrasp}/${maxGrasp}`, treeX + 90, 42, { font: 'bold 9px monospace', fill: usedGrasp <= maxGrasp ? '#88ff88' : '#ff4444', align: 'center' });
    drawBar(treeX + 30, 54, 120, 5, usedGrasp / maxGrasp, usedGrasp <= maxGrasp ? '#88ff88' : '#ff4444', '#1a1a1a', '#333');

    // Draw skill cards in 4 rows
    const scW = 50, scH = 28, scGap = 4;
    const rows = [0, 1, 2, 3];
    let scY = 64;

    for (const row of rows) {
        const rowCards = SKILL_TREE.filter(c => c.row === row);
        const rowW = rowCards.length * (scW + scGap) - scGap;
        let scX = treeX + 90 - rowW / 2;

        for (const card of rowCards) {
            const isEquipped = BondingState.equippedCards.includes(card.id);
            const isUnlocked = card.unlocked || BondingState.unlockedCards.includes(card.id);

            ctx.fillStyle = isEquipped ? 'rgba(80,60,120,0.9)' : isUnlocked ? 'rgba(20,15,30,0.9)' : 'rgba(10,8,15,0.7)';
            ctx.fillRect(scX, scY, scW, scH);
            ctx.strokeStyle = isEquipped ? '#ffd700' : isUnlocked ? '#8866cc' : '#333';
            ctx.lineWidth = isEquipped ? 2 : 1;
            ctx.strokeRect(scX, scY, scW, scH);

            // Icon + name
            drawText(card.icon, scX + 4, scY + 4, { font: '10px monospace', fill: isUnlocked ? '#fff' : '#444', outline: false });
            const sName = card.name.length > 7 ? card.name.substring(0, 6) + '…' : card.name;
            drawText(sName, scX + 18, scY + 5, { font: 'bold 6px monospace', fill: isEquipped ? '#ffd700' : isUnlocked ? '#ccc' : '#444', outline: false });

            // Grasp cost
            drawText(`◆${card.grasp}`, scX + scW - 4, scY + 18, { font: '6px monospace', fill: isEquipped ? '#ffd700' : '#777', align: 'right', outline: false });

            // Lock icon
            if (!isUnlocked) {
                drawText('🔒', scX + 4, scY + 16, { font: '7px monospace', fill: '#555', outline: false });
                drawText(`${card.cost}⬥`, scX + 18, scY + 17, { font: '6px monospace', fill: '#bb77ff', outline: false });
            }

            scX += scW + scGap;
        }
        scY += scH + scGap + 2;
    }

    // Start button
    const btnW = 160, btnH = 24;
    const btnX = GAME_W / 2 - btnW / 2;
    const btnY = GAME_H - 40;
    const pulse = Math.sin(G.time * 4) * 0.1 + 0.9;

    ctx.fillStyle = `rgba(40,100,40,${pulse})`; ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.strokeStyle = '#44ff44'; ctx.lineWidth = 2; ctx.strokeRect(btnX, btnY, btnW, btnH);
    drawText('⚔ BEGIN DUNGEON ⚔', GAME_W / 2, btnY + 5, { font: 'bold 12px monospace', fill: '#ffffff', align: 'center', outlineWidth: 3 });
}

// --- Handle Bonding Screen Click ---
function handleBondingClick(mx, my) {
    // Check Start button
    const btnW = 160, btnH = 24;
    const btnX = GAME_W / 2 - btnW / 2;
    const btnY = GAME_H - 40;
    if (mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH) {
        SFX.menuClick();
        startGame();
        return;
    }

    // Check bond cards
    const factions = ['Shu', 'Wei', 'Wu'];
    const cardW = 70, cardH = 38, gapX = 6, gapY = 6;
    const gridStartX = 10, gridStartY = 28;

    for (let fi = 0; fi < factions.length; fi++) {
        const faction = factions[fi];
        const fBonds = BONDS.filter(b => b.faction === faction);
        for (let bi = 0; bi < fBonds.length; bi++) {
            const bond = fBonds[bi];
            const bx = gridStartX + bi * (cardW + gapX);
            const by = gridStartY + fi * (cardH + gapY);
            const level = BondingState.bondLevels[bond.id] || 0;

            if (mx >= bx && mx <= bx + cardW && my >= by && my <= by + cardH) {
                if (level > 0) {
                    // Toggle equip/unequip
                    BondingState.equippedBond = (BondingState.equippedBond === bond.id) ? null : bond.id;
                    SFX.menuClick();
                }
                return;
            }
        }
    }

    // Check skill tree cards
    const treeX = GAME_W / 2 + 20;
    const scW = 50, scH = 28, scGap = 4;
    const rows = [0, 1, 2, 3];
    let scY = 64;

    for (const row of rows) {
        const rowCards = SKILL_TREE.filter(c => c.row === row);
        const rowW = rowCards.length * (scW + scGap) - scGap;
        let scX = treeX + 90 - rowW / 2;

        for (const card of rowCards) {
            if (mx >= scX && mx <= scX + scW && my >= scY && my <= scY + scH) {
                const isUnlocked = card.unlocked || BondingState.unlockedCards.includes(card.id);
                const isEquipped = BondingState.equippedCards.includes(card.id);

                if (!isUnlocked && BondingState.darkness >= card.cost) {
                    // Unlock it
                    BondingState.darkness -= card.cost;
                    BondingState.unlockedCards.push(card.id);
                    SFX.goldPickup();
                } else if (isUnlocked && !isEquipped) {
                    // Equip it
                    BondingState.equippedCards.push(card.id);
                    SFX.menuClick();
                } else if (isEquipped) {
                    // Unequip it
                    BondingState.equippedCards = BondingState.equippedCards.filter(id => id !== card.id);
                    SFX.menuClick();
                }
                return;
            }
            scX += scW + scGap;
        }
        scY += scH + scGap + 2;
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
