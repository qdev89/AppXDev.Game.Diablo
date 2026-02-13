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

    // --- Death Defiance Indicator (skull icons) ---
    if (typeof G.deathDefianceMax !== 'undefined' && G.deathDefianceMax > 0) {
        const ddX = hpX + hpW + 6;
        const ddY = hpY + 1;
        for (let i = 0; i < G.deathDefianceMax; i++) {
            const used = i >= G.deathDefiance;
            const pulse = used ? 0 : Math.sin(G.time * 2 + i) * 0.15;
            ctx.globalAlpha = used ? 0.3 : 0.9 + pulse;
            const ddColor = used ? '#555' : '#ffd700';
            drawText('💀', ddX + i * 14, ddY - 1, { font: '10px monospace', fill: ddColor, outline: !used });
            ctx.globalAlpha = 1;
        }
    }

    // --- Death Defiance Phoenix Burst VFX ---
    if (G.deathDefianceVFX > 0) {
        const t = G.deathDefianceVFX / 1.5; // 0→1
        const radius = (1 - t) * 200;
        const alpha = t * 0.35;
        // Phoenix ring expanding outward
        ctx.save();
        const px = P.x - G.camX + G.shakeX;
        const py = P.y - G.camY + G.shakeY;
        const grad = ctx.createRadialGradient(px, py, radius * 0.3, px, py, radius);
        grad.addColorStop(0, `rgba(255,215,0,${alpha})`);
        grad.addColorStop(0.5, `rgba(255,100,0,${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(255,50,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, GAME_W, GAME_H);
        // Phoenix text flash
        if (t > 0.5) {
            drawText('🔥 DEATH DEFIANCE 🔥', GAME_W / 2, GAME_H / 2 - 30,
                { font: 'bold 16px monospace', fill: '#ffd700', align: 'center' });
        }
        ctx.restore();
    }

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

    // --- Confusion Debuff Indicator ---
    if (P.confused && P.confused > 0) {
        const confAlpha = 0.12 + Math.sin(G.time * 8) * 0.08;
        ctx.fillStyle = 'rgba(180,80,220,' + confAlpha + ')';
        ctx.fillRect(0, 0, GAME_W, GAME_H);
        // Swirling border
        ctx.strokeStyle = '#ff66ff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3 + Math.sin(G.time * 6) * 0.2;
        ctx.strokeRect(2, 2, GAME_W - 4, GAME_H - 4);
        ctx.globalAlpha = 1;
        // Text
        drawText('\ud83c\udf00 CONFUSED \ud83c\udf00', GAME_W / 2, 40, {
            font: 'bold 12px monospace',
            fill: Math.sin(G.time * 10) > 0 ? '#ff66ff' : '#cc44cc',
            align: 'center'
        });
    }

    // --- Equipment Display (using EQUIPMENT_DEFS rarity system) ---
    if (G.equipment) {
        const eqY = yyY + yyH * 2 + 54;
        let eqSlot = 0;
        for (const slot of ['armor', 'talisman', 'mount']) {
            const eq = G.equipment[slot];
            if (!eq) continue;
            const cy = eqY + eqSlot * 12;
            const rc = (typeof RARITY_COLORS !== 'undefined' && eq.rarity !== undefined)
                ? RARITY_COLORS[eq.rarity] : '#aaa';
            const rn = (typeof RARITY_NAMES !== 'undefined' && eq.rarity !== undefined)
                ? RARITY_NAMES[eq.rarity] : '';
            drawText((rn ? rn.charAt(0) + ' ' : '') + eq.name, 8, cy, { font: '7px monospace', fill: rc, outline: false });
            eqSlot++;
        }
    }

    // S003: Active Relic Display on HUD
    if (window.RelicState && window.RelicState.active) {
        const relic = window.RelicState.active;
        const relicY = G.equipment ? (yyY + yyH * 2 + 54 + 36) : (yyY + yyH * 2 + 54);
        drawText(relic.icon + ' ' + (typeof relic.name === 'object' ? relic.name[G.lang || 'vi'] : relic.name),
            8, relicY, { font: 'bold 7px monospace', fill: '#ffd700', outline: true, outlineWidth: 2 });
    }

    // --- Mobile Pause Button (top-right corner) ---
    // Rendered for touch devices — always visible as a small ⏸ icon
    const pauseBtnSize = 20;
    const pauseBtnX = GAME_W - pauseBtnSize - 4;
    const pauseBtnY = 4;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(pauseBtnX, pauseBtnY, pauseBtnSize, pauseBtnSize);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.strokeRect(pauseBtnX, pauseBtnY, pauseBtnSize, pauseBtnSize);
    drawText('⏸', pauseBtnX + pauseBtnSize / 2, pauseBtnY + 2, {
        font: '12px monospace', fill: '#ccc', align: 'center', outline: false
    });
    // Store hit area for touch detection
    G._pauseBtnArea = { x: pauseBtnX, y: pauseBtnY, w: pauseBtnSize, h: pauseBtnSize };

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

    // --- L001: Wu Xing Elemental Combo Notification ---
    if (G.comboNotification) {
        const cn = G.comboNotification;
        const t2 = cn.timer / 1.5; // 1 → 0
        const fadeIn = Math.min(1, (1.5 - cn.timer) * 5); // Quick fade in
        const fadeOut = Math.min(1, cn.timer * 3); // Slow fade out
        const alpha = fadeIn * fadeOut;
        const yOff = (1 - fadeIn) * 20; // Slide in from above

        ctx.save();
        ctx.globalAlpha = alpha;

        // Glow behind text
        const glowPulse = Math.sin(G.time * 8) * 0.1 + 0.3;
        const grad = ctx.createLinearGradient(GAME_W / 2 - 80, 0, GAME_W / 2 + 80, 0);
        grad.addColorStop(0, cn.color1 + '00');
        grad.addColorStop(0.3, cn.color1 + '55');
        grad.addColorStop(0.7, cn.color2 + '55');
        grad.addColorStop(1, cn.color2 + '00');
        ctx.fillStyle = grad;
        ctx.fillRect(GAME_W / 2 - 100, 55 - yOff, 200, 24);

        // Combo name text
        const textSize = 14 + (1 - t2) * 4;
        drawText(cn.text, GAME_W / 2, 57 - yOff,
            { font: `bold ${Math.round(textSize)}px monospace`, fill: cn.color1, align: 'center', outlineWidth: 3 });

        // Cycle indicator
        const cycleText = cn.cycle === 'generating' ? '⚡ generating ⚡' : '💀 overcoming 💀';
        drawText(cycleText, GAME_W / 2, 72 - yOff,
            { font: '7px monospace', fill: cn.color2, align: 'center', outline: false });

        ctx.restore();
    }

    // --- L001: Elemental Combo Counter ---
    if (G.comboCount > 0) {
        drawText(`五行 ${G.comboCount}`, hpX, 42, { font: '8px monospace', fill: '#aa88ff', outline: false });
    }

    // --- L001: Forge Strike Buff Indicator ---
    if (G._forgeBuff > 0) {
        const forgeAlpha = Math.min(1, G._forgeBuff);
        ctx.globalAlpha = forgeAlpha;
        drawText('⚔ FORGED +50%', hpX, 52, { font: 'bold 8px monospace', fill: '#ffaa44', outline: false });
        ctx.globalAlpha = 1;
    }

    // --- Floor & Score ---
    drawText(`${typeof t === 'function' ? t('hud_floor') : 'Floor'} ${G.floor}`, GAME_W - 12, 6, { font: 'bold 14px monospace', fill: '#fff', align: 'right', outlineWidth: 4 });
    // K004: Difficulty tier indicator
    if (typeof DIFFICULTY_TIERS !== 'undefined' && G.difficulty > 0) {
        const dTier = DIFFICULTY_TIERS[G.difficulty];
        const lang = G.lang || 'vi';
        drawText(`${dTier.icon} ${dTier.name[lang]}`, GAME_W - 12, 22, { font: 'bold 8px monospace', fill: dTier.color, align: 'right', outline: false });
    }
    drawText(`${G.score}G`, GAME_W - 12, G.difficulty > 0 ? 34 : 60, { font: 'bold 11px monospace', fill: '#ffdd44', align: 'right' });
    // Run timer (L003)
    const mins = Math.floor((G.runTimer || 0) / 60);
    const secs = Math.floor((G.runTimer || 0) % 60);
    const timerColor = (G.runTimer || 0) >= 1200 ? '#ff4444' : (G.runTimer || 0) >= 900 ? '#ffaa44' : '#888';
    drawText(`${mins}:${secs.toString().padStart(2, '0')}`, GAME_W - 12, 74, { font: '9px monospace', fill: timerColor, align: 'right', outline: false });

    // --- Phase G: Morale Bar ---
    const morale = G.morale || 0;
    if (morale > 0 || G.allies.length > 0) {
        const mBarX = GAME_W - 75, mBarY = 85, mBarW = 62, mBarH = 6;
        const moraleLabel = morale >= 80 ? 'OVERWHELMING!' : morale >= 60 ? 'High Spirits' : morale >= 30 ? 'Steady' : 'Wavering';
        const moraleColor = morale >= 80 ? '#ff3300' : morale >= 60 ? '#ff8800' : morale >= 30 ? '#ffcc00' : '#666666';
        const moralePct = morale / 100;

        // Bar background
        ctx.fillStyle = 'rgba(10,10,20,0.7)';
        ctx.fillRect(mBarX, mBarY, mBarW, mBarH);

        // Bar fill with gradient
        if (moralePct > 0) {
            const grad = ctx.createLinearGradient(mBarX, mBarY, mBarX + mBarW * moralePct, mBarY);
            grad.addColorStop(0, moraleColor);
            grad.addColorStop(1, morale >= 80 ? '#ffdd00' : moraleColor);
            ctx.fillStyle = grad;
            ctx.fillRect(mBarX, mBarY, mBarW * moralePct, mBarH);
        }

        // Flame flicker at bar tip when morale > 60
        if (morale >= 60) {
            const fx = mBarX + mBarW * moralePct;
            const flicker = Math.sin(G.time * 12) * 2;
            ctx.fillStyle = morale >= 80 ? '#ff4400' : '#ff8800';
            ctx.globalAlpha = 0.6 + Math.sin(G.time * 15) * 0.3;
            ctx.beginPath();
            ctx.arc(fx, mBarY + mBarH / 2 + flicker, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Border
        ctx.strokeStyle = moraleColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(mBarX, mBarY, mBarW, mBarH);

        // Label
        const lblFont = morale >= 80 ? 'bold 7px monospace' : '6px monospace';
        drawText(moraleLabel, mBarX + mBarW / 2, mBarY + mBarH + 6, {
            font: lblFont, fill: moraleColor, align: 'center', outline: false
        });

        // Overwhelming pulsing effect
        if (morale >= 80) {
            ctx.globalAlpha = 0.05 + Math.sin(G.time * 6) * 0.03;
            ctx.fillStyle = '#ff4400';
            ctx.fillRect(0, 0, GAME_W, GAME_H);
            ctx.globalAlpha = 1;
        }
    }

    // --- Phase H: Brotherhood Combo Gauge ---
    const bGauge = G.brotherhoodGauge || 0;
    if (bGauge > 0 || (typeof getAvailableBrotherhoodCombo === 'function')) {
        const bBarX = GAME_W / 2 - 30, bBarY = 28;
        const bBarW = 60, bBarH = 4;
        const bPct = bGauge / 100;
        const bReady = bGauge >= 100 && G.brotherhoodCooldown <= 0;

        // Background
        ctx.fillStyle = 'rgba(20,10,30,0.6)';
        ctx.fillRect(bBarX - 1, bBarY - 1, bBarW + 2, bBarH + 2);

        // Fill bar
        if (bPct > 0) {
            const bGrad = ctx.createLinearGradient(bBarX, bBarY, bBarX + bBarW * bPct, bBarY);
            bGrad.addColorStop(0, '#8833cc');
            bGrad.addColorStop(1, bReady ? '#ffd700' : '#bb66ff');
            ctx.fillStyle = bGrad;
            ctx.fillRect(bBarX, bBarY, bBarW * bPct, bBarH);
        }

        // Border
        ctx.strokeStyle = bReady ? '#ffd700' : '#8833cc';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bBarX, bBarY, bBarW, bBarH);

        // Label
        const bLabel = bReady ? '⚔ READY! [R]' : '兄弟 ' + Math.floor(bGauge) + '%';
        const bLblColor = bReady ? '#ffd700' : '#bb88ee';
        drawText(bLabel, GAME_W / 2, bBarY + bBarH + 6, {
            font: bReady ? 'bold 7px monospace' : '5px monospace',
            fill: bLblColor, align: 'center', outline: false
        });

        // Pulsing glow when ready
        if (bReady) {
            ctx.globalAlpha = 0.04 + Math.sin(G.time * 8) * 0.03;
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(bBarX - 3, bBarY - 3, bBarW + 6, bBarH + 6);
            ctx.globalAlpha = 1;
        }
    }

    if (G.allyAura && (G.allyAura.dmgReduction > 0 || G.allyAura.atkSpd > 0 || G.allyAura.critBonus > 0)) {
        let auraX = GAME_W - 73, auraY = 100;
        if (G.allyAura.dmgReduction > 0) {
            drawText('🛡' + Math.round(G.allyAura.dmgReduction * 100) + '%', auraX, auraY, {
                font: '6px monospace', fill: '#4488ff', align: 'left', outline: false
            });
            auraX += 22;
        }
        if (G.allyAura.atkSpd > 0) {
            drawText('⚔' + Math.round(G.allyAura.atkSpd * 100) + '%', auraX, auraY, {
                font: '6px monospace', fill: '#ff6644', align: 'left', outline: false
            });
            auraX += 22;
        }
        if (G.allyAura.critBonus > 0) {
            drawText('🎯' + Math.round(G.allyAura.critBonus * 100) + '%', auraX, auraY, {
                font: '6px monospace', fill: '#aa66ff', align: 'left', outline: false
            });
        }
    }

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

    // N004: Blood Moon HUD indicator
    if (G.bloodMoon) {
        const bmPct = G.bloodMoonTimer / 15;
        const barW = 80, barH = 5;
        const barX = GAME_W / 2 - barW / 2;
        const barY = 5;
        const pulse = 0.7 + Math.sin(G.time * 4) * 0.3;
        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
        // Timer bar
        ctx.fillStyle = `rgba(204, 0, 0, ${pulse})`;
        ctx.fillRect(barX, barY, barW * bmPct, barH);
        // Label
        drawText('🌑 BLOOD MOON', GAME_W / 2, barY + barH + 2, {
            font: 'bold 8px monospace', fill: '#ff4444', align: 'center', outlineWidth: 2
        });
        drawText(`+${Math.round((G.bloodMoonRewardMult - 1) * 100)}% REWARDS`, GAME_W / 2, barY + barH + 10, {
            font: '7px monospace', fill: '#ffaa44', align: 'center', outlineWidth: 1
        });
    }

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
    const boss = G.enemies.find(e => (e.type === 'boss' || e.type === 'finalboss') && !e.dead);
    const miniboss = G.enemies.find(e => e.type === 'miniboss' && !e.dead);
    if (!boss && !miniboss) return;

    // Draw mini-boss bar (smaller, positioned higher)
    if (miniboss) {
        const mbW = 160, mbH = 6;
        const mbX = GAME_W / 2 - mbW / 2, mbY = boss ? GAME_H - 38 : GAME_H - 20;
        const mbPct = miniboss.hp / miniboss.maxHp;
        const mbEl = ELEMENTS[miniboss.el] || ELEMENTS.METAL;

        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(mbX - 3, mbY - 12, mbW + 6, mbH + 18);
        ctx.strokeStyle = miniboss.generalColor || '#ffaa00'; ctx.lineWidth = 1;
        ctx.strokeRect(mbX - 3, mbY - 12, mbW + 6, mbH + 18);

        // Name + title
        const mbName = (miniboss.generalName || 'GENERAL') + ' — ' + (miniboss.generalTitle || '');
        drawText('\u2694 ' + mbName, GAME_W / 2, mbY - 10, {
            font: 'bold 8px monospace', fill: miniboss.generalColor || '#ffaa00', align: 'center'
        });

        // HP bar
        ctx.fillStyle = '#1a1a0a'; ctx.fillRect(mbX, mbY, mbW, mbH);
        const mbColor = mbPct > 0.5 ? '#ffaa00' : mbPct > 0.25 ? '#ff6600' : '#ff0000';
        ctx.fillStyle = mbColor; ctx.fillRect(mbX + 1, mbY + 1, (mbW - 2) * mbPct, mbH - 2);
        // Segments
        for (let s = 1; s < 6; s++) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(mbX + (mbW / 6) * s, mbY, 1, mbH);
        }
        ctx.strokeStyle = '#555'; ctx.lineWidth = 0.5; ctx.strokeRect(mbX, mbY, mbW, mbH);
        drawText(Math.ceil(miniboss.hp) + '', GAME_W / 2, mbY - 1, { font: 'bold 6px monospace', fill: '#fff', align: 'center', outline: false });
    }

    if (!boss) return;

    const bW = 200, bH = 8;
    const bX = GAME_W / 2 - bW / 2, bY = GAME_H - 20;
    const bPct = boss.hp / boss.maxHp;
    const elDef = ELEMENTS[boss.el] || ELEMENTS.METAL;

    // Background panel
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(bX - 4, bY - 14, bW + 8, bH + 22);
    ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1; ctx.strokeRect(bX - 4, bY - 14, bW + 8, bH + 22);

    // Boss name
    drawText('\ud83d\udc80 ' + boss.type.toUpperCase() + ' \u2014 ' + elDef.symbol + ' ' + elDef.name, GAME_W / 2, bY - 12, {
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
    drawText(Math.ceil(boss.hp) + '', GAME_W / 2, bY - 1, { font: 'bold 7px monospace', fill: '#fff', align: 'center', outline: false });
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
        const rawName = c.def.name || '???';
        const cardName = typeof rawName === 'object' ? (rawName[G.lang || 'vi'] || rawName.vi || rawName.en || '???') : String(rawName);
        drawText(cardName, bx + boxW / 2, startY + 8, { font: 'bold 11px monospace', fill: borderColor, align: 'center' });

        // Level / NEW / EVOLUTION tag
        const isEvoTag = c.isEvolution;
        const lvlColor = isEvoTag ? '#ffd700' : c.isUpgrade ? '#ffaa00' : '#44ff44';
        const lvlText = isEvoTag ? '⚡ EVOLUTION ⚡' : c.isUpgrade ? `Upgrade → Lv.${c.level}` : '★ NEW ★';
        drawText(lvlText, bx + boxW / 2, startY + 24, { font: 'bold 9px monospace', fill: lvlColor, align: 'center' });

        // Description (word wrap)
        const rawDesc = (c.def && c.def.desc) || '';
        let descVal = typeof rawDesc === 'object' ? (rawDesc[G.lang || 'vi'] || rawDesc.vi || rawDesc.en || '') : rawDesc;
        const desc = String(descVal || '');
        drawText(desc.substring(0, 22), bx + boxW / 2, startY + 42, { font: '8px monospace', fill: '#bbb', align: 'center', outline: false });
        if (desc.length > 22) drawText(desc.substring(22), bx + boxW / 2, startY + 54, { font: '8px monospace', fill: '#bbb', align: 'center', outline: false });

        // Element bar at bottom
        if (el) {
            ctx.fillStyle = el.color; ctx.fillRect(bx + 1, startY + boxH - 14, boxW - 2, 13);
            ctx.globalAlpha = 0.4; ctx.fillStyle = '#000'; ctx.fillRect(bx + 1, startY + boxH - 14, boxW - 2, 13); ctx.globalAlpha = 1;
            drawText(el.symbol + ' ' + el.name, bx + boxW / 2, startY + boxH - 13, { font: 'bold 10px monospace', fill: el.light, align: 'center' });
        }

        // --- Banish Button (✕) on each card (K005 QoL) ---
        if (!c.isEvolution) {
            const banX = bx + boxW - 16, banY = startY + 2;
            ctx.fillStyle = 'rgba(80,20,20,0.8)';
            ctx.fillRect(banX, banY, 14, 14);
            ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1;
            ctx.strokeRect(banX, banY, 14, 14);
            drawText('✕', banX + 7, banY + 1, { font: 'bold 9px monospace', fill: '#ff6666', align: 'center' });
        }
    }

    // --- Reroll Button (K005 QoL) ---
    const rerollCost = 50 + (G.rerollCount || 0) * 50;
    const canAfford = G.score >= rerollCost;
    const rerollBtnW = 80, rerollBtnH = 22;
    const rerollBtnX = GAME_W / 2 - rerollBtnW - 8;
    const rerollBtnY = startY + boxH + 12;
    ctx.fillStyle = canAfford ? 'rgba(40,30,10,0.9)' : 'rgba(30,20,20,0.7)';
    ctx.fillRect(rerollBtnX, rerollBtnY, rerollBtnW, rerollBtnH);
    ctx.strokeStyle = canAfford ? '#ffd700' : '#555';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rerollBtnX, rerollBtnY, rerollBtnW, rerollBtnH);
    drawText(`🔄 Reroll`, rerollBtnX + rerollBtnW / 2, rerollBtnY + 2,
        { font: 'bold 9px monospace', fill: canAfford ? '#ffd700' : '#666', align: 'center' });
    drawText(`${rerollCost}G`, rerollBtnX + rerollBtnW / 2, rerollBtnY + 12,
        { font: '8px monospace', fill: canAfford ? '#ffaa00' : '#555', align: 'center', outline: false });

    // --- Banish Count Info ---
    const banCount = G.banishedWeapons ? G.banishedWeapons.length : 0;
    const banInfoX = GAME_W / 2 + 8;
    ctx.fillStyle = 'rgba(30,15,15,0.8)';
    ctx.fillRect(banInfoX, rerollBtnY, 80, rerollBtnH);
    ctx.strokeStyle = '#884444'; ctx.lineWidth = 1;
    ctx.strokeRect(banInfoX, rerollBtnY, 80, rerollBtnH);
    drawText(`🚫 Banished`, banInfoX + 40, rerollBtnY + 2,
        { font: 'bold 8px monospace', fill: '#ff6666', align: 'center' });
    drawText(`${banCount} weapon${banCount !== 1 ? 's' : ''}`, banInfoX + 40, rerollBtnY + 12,
        { font: '8px monospace', fill: '#aa4444', align: 'center', outline: false });
}

// --- Menu Screen ---
function drawMenuScreen() {
    // --- Animated gradient background ---
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
    grad.addColorStop(0, '#050510');
    grad.addColorStop(0.5, '#0a0a1a');
    grad.addColorStop(1, '#0d0818');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // --- Background grid pattern (subtle) ---
    ctx.strokeStyle = 'rgba(255,215,0,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < GAME_W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_H); ctx.stroke();
    }
    for (let y = 0; y < GAME_H; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_W, y); ctx.stroke();
    }

    // --- Rising ember particles ---
    if (!G._menuEmbers) {
        G._menuEmbers = [];
        for (let i = 0; i < 40; i++) {
            G._menuEmbers.push({
                x: Math.random() * GAME_W, y: Math.random() * GAME_H,
                sz: 1 + Math.random() * 2.5, spd: 8 + Math.random() * 20,
                drift: (Math.random() - 0.5) * 15,
                hue: Math.random() < 0.6 ? 40 : (Math.random() < 0.5 ? 0 : 200),
                a: 0.2 + Math.random() * 0.5, ph: Math.random() * Math.PI * 2
            });
        }
    }
    const mdt = G.dt || 0.016;
    for (const e of G._menuEmbers) {
        e.y -= e.spd * mdt;
        e.x += Math.sin(G.time * 0.8 + e.ph) * e.drift * mdt;
        if (e.y < -5) { e.y = GAME_H + 5; e.x = Math.random() * GAME_W; }
        ctx.globalAlpha = e.a * (0.5 + 0.5 * Math.sin(G.time * 3 + e.ph));
        ctx.fillStyle = 'hsl(' + e.hue + ', 100%, ' + (60 + Math.sin(G.time * 2 + e.ph) * 20) + '%)';
        ctx.beginPath(); ctx.arc(e.x, e.y, e.sz, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // --- Floating element symbols orbiting ---
    EL_KEYS.forEach((k, i) => {
        const el = ELEMENTS[k];
        const angle = G.time * 0.4 + (i / EL_KEYS.length) * Math.PI * 2;
        const ex = GAME_W / 2 + Math.cos(angle) * 140;
        const ey = GAME_H / 2 - 30 + Math.sin(angle) * 35;
        const scale = 0.6 + 0.4 * ((Math.sin(angle) + 1) / 2);
        ctx.globalAlpha = 0.15 + 0.2 * scale;
        drawText(el.symbol, ex, ey, {
            font: 'bold ' + Math.floor(14 * scale) + 'px monospace',
            fill: el.light, align: 'center', outlineWidth: 2
        });
    });
    ctx.globalAlpha = 1;

    // --- Title with glow effect ---
    const glowPulse = 0.6 + 0.4 * Math.sin(G.time * 2);
    ctx.shadowColor = 'rgba(255, 215, 0, ' + (glowPulse * 0.7) + ')';
    ctx.shadowBlur = 15 + glowPulse * 10;
    drawText('DYNASTY BRUHHH', GAME_W / 2, GAME_H / 2 - 70, { font: 'bold 24px monospace', fill: '#ffd700', align: 'center', outlineWidth: 5 });
    ctx.shadowColor = 'rgba(255, 50, 50, ' + (glowPulse * 0.5) + ')';
    ctx.shadowBlur = 12 + glowPulse * 8;
    drawText('DUNGEON', GAME_W / 2, GAME_H / 2 - 42, { font: 'bold 30px monospace', fill: '#ff4444', align: 'center', outlineWidth: 6 });
    ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';

    // Subtitle
    drawText('Vampire Survivors \u00d7 Dynasty Warriors', GAME_W / 2, GAME_H / 2 - 8, { font: 'bold 10px monospace', fill: '#999', align: 'center' });

    // --- Animated Wu Xing element row ---
    EL_KEYS.forEach((k, i) => {
        const el = ELEMENTS[k];
        const bounce = Math.sin(G.time * 2.5 + i * 0.8) * 3;
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(G.time * 3 + i);
        drawText(el.symbol, GAME_W / 2 - 60 + i * 30, GAME_H / 2 + 12 + bounce, {
            font: 'bold 16px monospace', fill: el.light, align: 'center', outlineWidth: 4
        });
    });
    ctx.globalAlpha = 1;

    // --- Continue / New Game Buttons ---
    const hasSave = (typeof hasSavedRun === 'function' && hasSavedRun());
    const breathe = 0.5 + 0.5 * Math.sin(G.time * 2.5);

    if (hasSave) {
        // Continue Button
        const contAlpha = 0.8 + 0.2 * Math.sin(G.time * 3);
        const cy1 = GAME_H / 2 + 40;
        const cy2 = GAME_H / 2 + 80;

        // Draw Continue
        ctx.save();
        ctx.globalAlpha = contAlpha;
        ctx.fillStyle = 'rgba(68, 255, 68, 0.15)';
        ctx.strokeStyle = '#44ff44';
        ctx.lineWidth = 2;
        ctx.fillRect(GAME_W / 2 - 80, cy1 - 15, 160, 30);
        ctx.strokeRect(GAME_W / 2 - 80, cy1 - 15, 160, 30);
        drawText('CONTINUE RUN', GAME_W / 2, cy1 + 5, { font: 'bold 12px monospace', fill: '#44ff44', align: 'center', outlineWidth: 3 });

        // Draw New Game
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'rgba(255, 68, 68, 0.15)';
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 1.5;
        ctx.fillRect(GAME_W / 2 - 70, cy2 - 12, 140, 25);
        ctx.strokeRect(GAME_W / 2 - 70, cy2 - 12, 140, 25);
        drawText('NEW GAME', GAME_W / 2, cy2 + 4, { font: 'bold 10px monospace', fill: '#ff4444', align: 'center', outlineWidth: 3 });
        ctx.restore();

        // Update button hitboxes for engine.js
        G.menuButtons = {
            continue: { x: GAME_W / 2 - 80, y: cy1 - 15, w: 160, h: 30 },
            newGame: { x: GAME_W / 2 - 70, y: cy2 - 12, w: 140, h: 25 }
        };
    } else {
        G.menuButtons = null;
        ctx.globalAlpha = 0.3 + breathe * 0.7;
        ctx.shadowColor = 'rgba(255,255,255,' + (breathe * 0.3) + ')';
        ctx.shadowBlur = breathe * 8;
        drawText('[ CLICK / TAP TO START ]', GAME_W / 2, GAME_H / 2 + 50, { font: 'bold 13px monospace', fill: '#ffffff', align: 'center', outlineWidth: 4 });
        ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
        ctx.globalAlpha = 1;
    }

    // Controls hint
    drawText('WASD/Arrows: Move \u2022 Auto-attack \u2022 Space: Dodge Roll', GAME_W / 2, GAME_H / 2 + 75, { font: '9px monospace', fill: '#666', align: 'center', outline: false });

    // High Score Leaderboard
    const scores = getHighScores();
    if (scores.length > 0) {
        drawText('\u2b50 HIGH SCORES', GAME_W / 2, GAME_H / 2 + 100, { font: 'bold 10px monospace', fill: '#ffd700', align: 'center', outlineWidth: 3 });
        for (let i = 0; i < Math.min(scores.length, 5); i++) {
            const s = scores[i];
            const dateStr = s.date || '';
            drawText(
                (i + 1) + '. ' + s.score + 'G  F' + s.floor + '  ' + s.grade + '  ' + dateStr,
                GAME_W / 2, GAME_H / 2 + 115 + i * 13,
                { font: '8px monospace', fill: i === 0 ? '#ffd700' : '#888', align: 'center', outline: false }
            );
        }
    }

    // M003: Daily Challenge button
    if (typeof DailyState !== 'undefined') DailyState.drawMenuButton(ctx, GAME_W, GAME_H);

    // Version
    drawText('v1.1.1 \u2014 The Infinite', GAME_W / 2, GAME_H - 18, { font: '8px monospace', fill: '#444', align: 'center', outline: false });
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
    // Animated dark background with slow pulse
    const pulse = 0.88 + Math.sin(G.time * 1.5) * 0.04;
    ctx.fillStyle = `rgba(5,0,0,${pulse})`; ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Background particle drift (blood embers)
    for (let i = 0; i < 6; i++) {
        const px = (G.time * 15 + i * 160) % GAME_W;
        const py = (G.time * 8 + i * 110) % GAME_H;
        const sz = 1 + Math.sin(G.time + i) * 0.6;
        ctx.globalAlpha = 0.15 + Math.sin(G.time * 2 + i) * 0.1;
        ctx.fillStyle = '#ff3322';
        ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Decorative double border with glow
    ctx.shadowColor = '#ff3333'; ctx.shadowBlur = 8;
    ctx.strokeStyle = '#ff333388'; ctx.lineWidth = 2;
    ctx.strokeRect(18, 13, GAME_W - 36, GAME_H - 26);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ff111144'; ctx.lineWidth = 1;
    ctx.strokeRect(22, 17, GAME_W - 44, GAME_H - 34);

    // Title with animated flicker
    const titleAlpha = 0.85 + Math.sin(G.time * 4) * 0.15;
    ctx.globalAlpha = titleAlpha;
    drawText('YOU HAVE FALLEN', GAME_W / 2, 25, { font: 'bold 20px monospace', fill: '#ff3333', align: 'center', outlineWidth: 5 });
    ctx.globalAlpha = 1;

    // --- Hero Portrait (left) ---
    const hero = typeof getHeroDef === 'function' ? getHeroDef(P.heroId) : null;
    if (hero) {
        const px = 55, py = 62;
        ctx.globalAlpha = 0.3 + Math.sin(G.time * 2) * 0.15;
        ctx.fillStyle = hero.colors.glow;
        ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = hero.colors.body;
        ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = hero.colors.accent;
        ctx.beginPath(); ctx.arc(px, py - 4, 8, 0, Math.PI * 2); ctx.fill();
        drawText(hero.name, px, py + 22, { font: 'bold 9px monospace', fill: hero.colors.glow, align: 'center' });
        drawText(hero.title, px, py + 33, { font: '7px monospace', fill: '#888', align: 'center', outline: false });
    }

    // --- Grade (animated, right side) ---
    const timeAlive = HUD.killTimer || 0;
    const totalKills = G.totalKills || G.enemiesKilled || 0;
    const chainBest = G.chainBest || 0;
    const bossKills = Math.floor(G.floor / 5);
    const gradeScore = G.score + G.maxCombo * 5 + G.floor * 100 + P.level * 50 + totalKills * 2 + chainBest * 10;
    const grade = gradeScore >= 8000 ? 'S+' : gradeScore >= 5000 ? 'S' : gradeScore >= 3000 ? 'A' : gradeScore >= 1500 ? 'B' : gradeScore >= 500 ? 'C' : 'D';
    const gradeColor = { 'S+': '#ff44ff', S: '#ffd700', A: '#44ff44', B: '#44bbff', C: '#ffaa00', D: '#ff4444' }[grade];

    const gPulse = 1 + Math.sin(G.time * 3) * 0.08;
    ctx.save();
    ctx.translate(GAME_W - 55, 65);
    ctx.scale(gPulse, gPulse);
    ctx.shadowColor = gradeColor; ctx.shadowBlur = 15;
    drawText(grade, 0, -15, { font: 'bold 42px monospace', fill: gradeColor, align: 'center', outlineWidth: 6 });
    ctx.shadowBlur = 0;
    ctx.restore();
    drawText('RANK', GAME_W - 55, 95, { font: 'bold 8px monospace', fill: '#888', align: 'center' });
    drawText(gradeScore + ' pts', GAME_W - 55, 107, { font: '7px monospace', fill: '#666', align: 'center', outline: false });

    // --- Stats Panel (center) ---
    const sx = 115, sy = 50;
    const statLine = (icon, label, val, color, y, barPct) => {
        drawText(icon, sx - 8, y, { font: '8px monospace', fill: color, outline: false });
        drawText(label, sx + 5, y, { font: 'bold 8px monospace', fill: '#999', outline: false });
        drawText(val, sx + 120, y, { font: 'bold 9px monospace', fill: color, align: 'left' });
        if (barPct !== undefined) {
            const bx = sx + 155, bw = 55, bh = 5;
            ctx.fillStyle = '#111'; ctx.fillRect(bx, y + 1, bw, bh);
            ctx.fillStyle = color + '88'; ctx.fillRect(bx, y + 1, bw * Math.min(barPct, 1), bh);
            ctx.strokeStyle = '#333'; ctx.lineWidth = 0.5; ctx.strokeRect(bx, y + 1, bw, bh);
        }
    };

    statLine('\ud83c\udff0', 'Floor Reached', '' + G.floor, '#fff', sy, G.floor / 20);
    statLine('\u2b50', 'Player Level', 'Lv.' + P.level, '#44ddff', sy + 14, P.level / 30);
    statLine('\ud83d\udcb0', 'Gold Earned', G.score + 'G', '#ffdd44', sy + 28, Math.min(G.score / 5000, 1));
    statLine('\ud83d\udc80', 'Enemies Slain', '' + totalKills, '#ff8888', sy + 42, Math.min(totalKills / 500, 1));
    statLine('\u26a1', 'Max Combo', 'x' + G.maxCombo, '#ffaa00', sy + 56, Math.min(G.maxCombo / 100, 1));
    statLine('\ud83d\udd17', 'Best Chain', '' + chainBest, '#ff66cc', sy + 70, Math.min(chainBest / 50, 1));
    statLine('\ud83d\udc79', 'Bosses Killed', '' + bossKills, '#ff4444', sy + 84);

    const mins = Math.floor(timeAlive / 60);
    const secs = Math.floor(timeAlive % 60);
    statLine('\u23f1', 'Time Survived', mins + ':' + secs.toString().padStart(2, '0'), '#aaaaff', sy + 98, Math.min(timeAlive / 600, 1));

    const kpm = timeAlive > 0 ? Math.round(totalKills / (timeAlive / 60)) : 0;
    statLine('\ud83d\udcca', 'Kills/min', '' + kpm, '#ff88ff', sy + 112);

    // --- Weapon Inventory ---
    if (G.weapons && G.weapons.length > 0) {
        const wY = sy + 133;
        drawText('ARSENAL', sx - 8, wY - 5, { font: 'bold 7px monospace', fill: '#666', outline: false });
        let wX = sx - 8;
        for (const w of G.weapons) {
            if (w.type === 'passive') continue;
            const el = ELEMENTS[w.el] || ELEMENTS.METAL;
            ctx.fillStyle = 'rgba(15,10,25,0.9)'; ctx.fillRect(wX, wY + 3, 58, 16);
            ctx.strokeStyle = el.light + '88'; ctx.lineWidth = 1; ctx.strokeRect(wX, wY + 3, 58, 16);
            ctx.fillStyle = el.light;
            ctx.beginPath(); ctx.arc(wX + 6, wY + 11, 2.5, 0, Math.PI * 2); ctx.fill();
            const wName = w.id.length > 7 ? w.id.substring(0, 6) + '.' : w.id;
            drawText(wName + ' L' + w.level, wX + 32, wY + 6, { font: 'bold 6px monospace', fill: el.light, align: 'center', outline: false });
            wX += 63;
        }
    }

    // --- Passives collected ---
    if (G.weapons) {
        const passives = G.weapons.filter(w => w.type === 'passive');
        if (passives.length > 0) {
            const passY = sy + 158;
            let passX = sx - 8;
            drawText('PASSIVES', passX, passY - 5, { font: 'bold 7px monospace', fill: '#555', outline: false });
            for (const p of passives) {
                const def = WEAPON_DEFS.find(d => d.id === p.id);
                const pName = def ? def.name : p.id;
                drawText(pName, passX, passY + 5, { font: '7px monospace', fill: '#88aacc', outline: false });
                passX += 70;
            }
        }
    }

    // --- Rewards bar ---
    if (G.bonding) {
        const dk = G.bonding.darknessEarned || 0;
        const bxp = G.bonding.xpEarned || 0;
        ctx.fillStyle = 'rgba(20,10,40,0.7)';
        ctx.fillRect(30, GAME_H - 68, GAME_W - 60, 22);
        ctx.strokeStyle = '#bb77ff33'; ctx.lineWidth = 1;
        ctx.strokeRect(30, GAME_H - 68, GAME_W - 60, 22);
        drawText('\u2b25 Darkness +' + dk, 70, GAME_H - 60, { font: 'bold 9px monospace', fill: '#bb77ff' });
        drawText('\ud83e\udd1d Brotherhood XP +' + bxp, GAME_W / 2 + 30, GAME_H - 60, { font: 'bold 9px monospace', fill: '#ffd700' });
    }

    // --- New High Score ---
    try {
        const hs = parseInt(localStorage.getItem('dynasty_hs') || '0');
        if (gradeScore > hs) {
            if (Math.sin(G.time * 6) > 0) {
                drawText('\u2605 NEW HIGH SCORE! \u2605', GAME_W / 2, GAME_H - 85, { font: 'bold 11px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });
            }
            localStorage.setItem('dynasty_hs', String(gradeScore));
        }
    } catch (e) { /* localStorage not available */ }

    // Continue prompt
    if (Math.sin(G.time * 3) > 0) {
        drawText('[ CLICK TO RETURN TO MENU ]', GAME_W / 2, GAME_H - 35, { font: 'bold 12px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4 });
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

    // --- Tabs (5 total: Bonds, Arcana, Workshop, Lineage, Mandate) ---
    const tabY = 26, tabH = 16, tabGap = 3;
    const tabNames = [
        { label: '⚔ BONDS', color: '#ffd700', bgActive: 'rgba(80,60,20,0.9)' },
        { label: '🔮 ARCANA', color: '#aa88ff', bgActive: 'rgba(60,40,100,0.9)' },
        { label: '🔨 FORGE', color: '#ff8844', bgActive: 'rgba(80,40,10,0.9)' },
        { label: '👻 LINEAGE', color: '#aaccff', bgActive: 'rgba(30,40,80,0.9)' },
        { label: '⚖ MANDATE', color: '#ff4444', bgActive: 'rgba(80,20,20,0.9)' }
    ];
    const tabW = Math.floor((GAME_W - tabGap * (tabNames.length + 1)) / tabNames.length);
    const tabTotalW = tabNames.length * (tabW + tabGap) - tabGap;
    const tabStartX = Math.floor(GAME_W / 2 - tabTotalW / 2);

    for (let ti = 0; ti < tabNames.length; ti++) {
        const tx = tabStartX + ti * (tabW + tabGap);
        const isActive = G.bondingTab === ti;
        const tab = tabNames[ti];
        ctx.fillStyle = isActive ? tab.bgActive : 'rgba(15,12,25,0.7)';
        ctx.fillRect(tx, tabY, tabW, tabH);
        ctx.strokeStyle = isActive ? tab.color : '#333';
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.strokeRect(tx, tabY, tabW, tabH);
        drawText(tab.label, tx + tabW / 2, tabY + 2, { font: 'bold 7px monospace', fill: isActive ? tab.color : '#555', align: 'center', outlineWidth: 2 });
    }

    // --- Tab Content ---
    if (G.bondingTab === 0) {
        drawBondsTab();
    } else if (G.bondingTab === 1) {
        drawArcanaTab();
    } else if (G.bondingTab === 2) {
        drawWorkshopTab();
    } else if (G.bondingTab === 3) {
        drawLineageTab();
    } else if (G.bondingTab === 4) {
        drawMandateTab();
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
        if (typeof transitionTo === 'function') {
            transitionTo(null, function () { startGame(); }, 0.4);
        } else {
            startGame();
        }
        return;
    }

    // Check tab clicks (5 tabs)
    const tabY = 26, tabH = 16, tabGap = 3;
    const tabCount = 5;
    const tabW = Math.floor((GAME_W - tabGap * (tabCount + 1)) / tabCount);
    const tabTotalW = tabCount * (tabW + tabGap) - tabGap;
    const tabStartX = Math.floor(GAME_W / 2 - tabTotalW / 2);
    if (my >= tabY && my <= tabY + tabH) {
        for (let ti = 0; ti < tabCount; ti++) {
            const tx = tabStartX + ti * (tabW + tabGap);
            if (mx >= tx && mx <= tx + tabW) {
                G.bondingTab = ti;
                SFX.menuClick();
                return;
            }
        }
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
    } else if (G.bondingTab === 1) {
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
    } else if (G.bondingTab === 2) {
        handleWorkshopClick(mx, my);
    } else if (G.bondingTab === 3) {
        handleLineageClick(mx, my);
    } else if (G.bondingTab === 4) {
        handleMandateClick(mx, my);
    }
}

// --- WORKSHOP TAB (T-04) ---
function drawWorkshopTab() {
    const lang = G.lang || 'vi';
    const contentY = 48;

    // Resources bar
    if (typeof WORKSHOP_RESOURCES !== 'undefined') {
        let rx = 8;
        for (const [key, res] of Object.entries(WORKSHOP_RESOURCES)) {
            const amount = (WorkshopState.resources && WorkshopState.resources[key]) || 0;
            drawText(`${res.icon} ${amount}`, rx, contentY, { font: '7px monospace', fill: res.color, outline: false });
            rx += 52;
        }
    }

    // Category filter
    if (typeof G._workshopCat === 'undefined') G._workshopCat = 'all';
    const cats = ['all', 'weapons', 'beasts', 'aspects', 'rooms', 'meta'];
    const catLabels = { all: 'All', weapons: '⚔', beasts: '🐲', aspects: '★', rooms: '🏠', meta: '↑' };
    const catBtnW = 30, catGap = 3;
    const catStartX = GAME_W / 2 - (cats.length * (catBtnW + catGap) - catGap) / 2;
    const catY = contentY + 14;
    for (let ci = 0; ci < cats.length; ci++) {
        const cx = catStartX + ci * (catBtnW + catGap);
        const isActive = G._workshopCat === cats[ci];
        ctx.fillStyle = isActive ? 'rgba(80,60,20,0.9)' : 'rgba(20,15,30,0.8)';
        ctx.fillRect(cx, catY, catBtnW, 12);
        ctx.strokeStyle = isActive ? '#ff8844' : '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, catY, catBtnW, 12);
        drawText(catLabels[cats[ci]], cx + catBtnW / 2, catY + 1, { font: '7px monospace', fill: isActive ? '#ffd700' : '#666', align: 'center', outline: false });
    }

    // Recipe list
    const recipes = typeof WORKSHOP_RECIPES !== 'undefined' ? WORKSHOP_RECIPES : [];
    const filtered = G._workshopCat === 'all' ? recipes : recipes.filter(r => r.category === G._workshopCat);
    const recipeH = 38, recipeGap = 4;
    const recipeStartY = catY + 18;
    const scrollOffset = G._workshopScroll || 0;
    const maxVisible = Math.floor((GAME_H - recipeStartY - 50) / (recipeH + recipeGap));

    for (let ri = 0; ri < Math.min(filtered.length, maxVisible); ri++) {
        const recipe = filtered[ri + scrollOffset];
        if (!recipe) continue;
        const ry = recipeStartY + ri * (recipeH + recipeGap);
        const isCrafted = WorkshopState.crafted && WorkshopState.crafted.includes(recipe.id);
        const affordable = typeof canCraft === 'function' ? canCraft(recipe.id) : false;

        // Card bg
        ctx.fillStyle = isCrafted ? 'rgba(30,50,30,0.9)' : affordable ? 'rgba(40,30,15,0.9)' : 'rgba(15,12,20,0.9)';
        ctx.fillRect(8, ry, GAME_W - 16, recipeH);
        ctx.strokeStyle = isCrafted ? '#44aa44' : affordable ? '#ff8844' : '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(8, ry, GAME_W - 16, recipeH);

        // Icon + Name
        drawText(`${recipe.icon} ${recipe.name[lang] || recipe.name.en}`, 14, ry + 3, { font: 'bold 8px monospace', fill: isCrafted ? '#44aa44' : '#eee', outlineWidth: 2 });

        // Description
        drawText(recipe.desc[lang] || recipe.desc.en, 14, ry + 15, { font: '6px monospace', fill: '#888', outline: false });

        // Cost
        let cx = 14;
        for (const [resId, amount] of Object.entries(recipe.cost)) {
            const res = WORKSHOP_RESOURCES ? WORKSHOP_RESOURCES[resId] : null;
            const have = (WorkshopState.resources && WorkshopState.resources[resId]) || 0;
            const costColor = have >= amount ? '#44dd44' : '#ff4444';
            drawText(`${res ? res.icon : '?'}${amount}`, cx, ry + 27, { font: '6px monospace', fill: costColor, outline: false });
            cx += 40;
        }

        // Status
        if (isCrafted) {
            drawText('✓ DONE', GAME_W - 40, ry + 12, { font: 'bold 8px monospace', fill: '#44aa44', align: 'center' });
        } else if (affordable) {
            ctx.fillStyle = 'rgba(120,80,20,0.9)';
            ctx.fillRect(GAME_W - 58, ry + 6, 44, 16);
            ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1;
            ctx.strokeRect(GAME_W - 58, ry + 6, 44, 16);
            drawText('CRAFT', GAME_W - 36, ry + 8, { font: 'bold 7px monospace', fill: '#ffd700', align: 'center' });
        } else {
            drawText('🔒', GAME_W - 36, ry + 10, { font: '10px monospace', fill: '#444', align: 'center', outline: false });
        }
    }

    // Scroll indicators
    if (scrollOffset > 0) drawText('▲', GAME_W / 2, recipeStartY - 5, { font: '8px monospace', fill: '#888', align: 'center', outline: false });
    if (scrollOffset + maxVisible < filtered.length) drawText('▼', GAME_W / 2, GAME_H - 50, { font: '8px monospace', fill: '#888', align: 'center', outline: false });
}

function handleWorkshopClick(mx, my) {
    const contentY = 48;
    const catY = contentY + 14;
    const cats = ['all', 'weapons', 'beasts', 'aspects', 'rooms', 'meta'];
    const catBtnW = 30, catGap = 3;
    const catStartX = GAME_W / 2 - (cats.length * (catBtnW + catGap) - catGap) / 2;

    // Category filter clicks
    if (my >= catY && my <= catY + 12) {
        for (let ci = 0; ci < cats.length; ci++) {
            const cx = catStartX + ci * (catBtnW + catGap);
            if (mx >= cx && mx <= cx + catBtnW) {
                G._workshopCat = cats[ci];
                G._workshopScroll = 0;
                SFX.menuClick();
                return;
            }
        }
    }

    // Recipe clicks (CRAFT button)
    const recipes = typeof WORKSHOP_RECIPES !== 'undefined' ? WORKSHOP_RECIPES : [];
    const filtered = (G._workshopCat || 'all') === 'all' ? recipes : recipes.filter(r => r.category === G._workshopCat);
    const recipeH = 38, recipeGap = 4;
    const recipeStartY = catY + 18;
    const scrollOffset = G._workshopScroll || 0;
    const maxVisible = Math.floor((GAME_H - recipeStartY - 50) / (recipeH + recipeGap));

    for (let ri = 0; ri < Math.min(filtered.length, maxVisible); ri++) {
        const recipe = filtered[ri + scrollOffset];
        if (!recipe) continue;
        const ry = recipeStartY + ri * (recipeH + recipeGap);
        const isCrafted = WorkshopState.crafted && WorkshopState.crafted.includes(recipe.id);
        const affordable = typeof canCraft === 'function' ? canCraft(recipe.id) : false;

        // Check CRAFT button area
        if (!isCrafted && affordable && mx >= GAME_W - 58 && mx <= GAME_W - 14 && my >= ry + 6 && my <= ry + 22) {
            if (typeof craftRecipe === 'function') {
                craftRecipe(recipe.id);
                SFX.goldPickup();
            }
            return;
        }
    }
}

// --- LINEAGE TAB (T-05) ---
function drawLineageTab() {
    const lang = G.lang || 'vi';
    const contentY = 48;

    drawText(lang === 'vi' ? 'Di Sản Triều Đại' : 'Dynasty Lineage', GAME_W / 2, contentY, { font: 'bold 10px monospace', fill: '#aaccff', align: 'center', outlineWidth: 2 });
    drawText(lang === 'vi' ? 'Kế thừa sức mạnh từ anh hùng đã ngã' : 'Inherit power from fallen heroes', GAME_W / 2, contentY + 14, { font: '7px monospace', fill: '#667', align: 'center', outline: false });

    const ghosts = typeof getLineageDisplay === 'function' ? getLineageDisplay() : [];

    if (ghosts.length === 0) {
        drawText(lang === 'vi' ? 'Chưa có di sản. Hãy chiến đấu!' : 'No ghosts yet. Go fight!', GAME_W / 2, GAME_H / 2 - 10, { font: '9px monospace', fill: '#555', align: 'center', outline: false });
        drawText('👻', GAME_W / 2, GAME_H / 2 + 10, { font: '20px monospace', fill: '#333', align: 'center', outline: false });
        return;
    }

    const cardW = 210, cardH = 36, gapX = 10, gapY = 6;
    const ghostStartY = contentY + 28;
    const maxPerRow = 2;
    const gridStartX = GAME_W / 2 - cardW - gapX / 2;

    for (let gi = 0; gi < ghosts.length && gi < 8; gi++) {
        const ghost = ghosts[gi];
        const col = gi % maxPerRow;
        const row = Math.floor(gi / maxPerRow);
        const gx = gridStartX + col * (cardW + gapX);
        const gy = ghostStartY + row * (cardH + gapY);
        const isSelected = LineageState.selectedGhost &&
            LineageState.ghosts[gi] === LineageState.selectedGhost;

        // Card bg
        ctx.fillStyle = isSelected ? 'rgba(40,50,80,0.95)' : 'rgba(15,15,25,0.9)';
        ctx.fillRect(gx, gy, cardW, cardH);
        ctx.strokeStyle = isSelected ? '#aaccff' : '#334';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.strokeRect(gx, gy, cardW, cardH);

        if (isSelected) {
            ctx.fillStyle = '#aaccff'; ctx.globalAlpha = 0.08;
            ctx.fillRect(gx + 1, gy + 1, cardW - 2, cardH - 2);
            ctx.globalAlpha = 1;
        }

        // Ghost info
        drawText(`${ghost.blessingIcon} ${ghost.heroName}`, gx + 6, gy + 3, { font: 'bold 8px monospace', fill: isSelected ? '#ccddff' : '#ccc', outlineWidth: 2 });
        const bName = typeof ghost.blessingName === 'object' ? (ghost.blessingName[lang] || ghost.blessingName.en) : ghost.blessingName;
        drawText(bName, gx + 6, gy + 15, { font: '6px monospace', fill: '#888', outline: false });
        drawText(`Fl.${ghost.floor} · ${ghost.strength}%`, gx + cardW - 8, gy + 3, { font: '7px monospace', fill: '#aaccff', align: 'right', outline: false });
        drawText(ghost.age, gx + cardW - 8, gy + 15, { font: '6px monospace', fill: '#555', align: 'right', outline: false });

        // Select indicator
        if (isSelected) {
            drawText('✓', gx + cardW - 8, gy + 24, { font: 'bold 8px monospace', fill: '#44ff44', align: 'right' });
        }
    }

    // Clear selection button
    if (LineageState.selectedGhost) {
        const clearX = GAME_W / 2 - 40, clearY = GAME_H - 56;
        ctx.fillStyle = 'rgba(60,20,20,0.9)';
        ctx.fillRect(clearX, clearY, 80, 14);
        ctx.strokeStyle = '#ff6644'; ctx.lineWidth = 1;
        ctx.strokeRect(clearX, clearY, 80, 14);
        drawText(lang === 'vi' ? '✕ Bỏ Chọn' : '✕ Clear', GAME_W / 2, clearY + 1, { font: 'bold 7px monospace', fill: '#ff6644', align: 'center' });
    }
}

function handleLineageClick(mx, my) {
    const contentY = 48;
    const ghosts = typeof getLineageDisplay === 'function' ? getLineageDisplay() : [];
    const cardW = 210, cardH = 36, gapX = 10, gapY = 6;
    const ghostStartY = contentY + 28;
    const maxPerRow = 2;
    const gridStartX = GAME_W / 2 - cardW - gapX / 2;

    for (let gi = 0; gi < ghosts.length && gi < 8; gi++) {
        const col = gi % maxPerRow;
        const row = Math.floor(gi / maxPerRow);
        const gx = gridStartX + col * (cardW + gapX);
        const gy = ghostStartY + row * (cardH + gapY);

        if (mx >= gx && mx <= gx + cardW && my >= gy && my <= gy + cardH) {
            if (typeof selectGhostTrait === 'function') {
                const isAlreadySelected = LineageState.selectedGhost &&
                    LineageState.ghosts[gi] === LineageState.selectedGhost;
                if (isAlreadySelected) {
                    clearGhostSelection();
                } else {
                    selectGhostTrait(gi);
                }
                SFX.menuClick();
            }
            return;
        }
    }

    // Clear selection button
    if (LineageState.selectedGhost) {
        const clearX = GAME_W / 2 - 40, clearY = GAME_H - 56;
        if (mx >= clearX && mx <= clearX + 80 && my >= clearY && my <= clearY + 14) {
            clearGhostSelection();
            SFX.menuClick();
            return;
        }
    }
}

// --- MANDATE TAB (T-03) ---
function drawMandateTab() {
    const lang = G.lang || 'vi';
    const contentY = 48;

    // Title + Total Heat
    const total = MandateState.totalMandate || 0;
    const titleObj = MandateState.currentTitle;
    const titleStr = titleObj ? (titleObj.title[lang] || titleObj.title.en) : '';
    const titleColor = titleObj ? titleObj.color : '#888';

    drawText(lang === 'vi' ? 'Thiên Mệnh' : 'Mandate of Heaven', GAME_W / 2, contentY, { font: 'bold 10px monospace', fill: '#ff6644', align: 'center', outlineWidth: 2 });

    // Heat + Jade bonus
    drawText(`🔥 ${total}`, GAME_W / 2 - 60, contentY + 14, { font: 'bold 9px monospace', fill: '#ff4444', outline: false });
    drawText(`💎 ×${MandateState.jadeMultiplier.toFixed(1)}`, GAME_W / 2 + 20, contentY + 14, { font: 'bold 9px monospace', fill: '#44ffaa', outline: false });
    if (titleStr) {
        drawText(titleStr, GAME_W - 15, contentY + 14, { font: 'bold 8px monospace', fill: titleColor, align: 'right' });
    }

    // Locked check
    if (!MandateState.unlocked) {
        drawText(lang === 'vi' ? '🔒 Thắng lần đầu để mở' : '🔒 Win once to unlock', GAME_W / 2, GAME_H / 2 - 5, { font: '9px monospace', fill: '#666', align: 'center', outline: false });
        return;
    }

    // Modifier list
    const mods = typeof MANDATE_MODIFIERS !== 'undefined' ? MANDATE_MODIFIERS : [];
    const modH = 22, modGap = 3;
    const modStartY = contentY + 28;
    const colW = Math.floor((GAME_W - 20) / 2);

    for (let mi = 0; mi < mods.length; mi++) {
        const mod = mods[mi];
        const col = mi % 2;
        const row = Math.floor(mi / 2);
        const modX = 8 + col * (colW + 4);
        const modY = modStartY + row * (modH + modGap);
        const level = MandateState.levels[mod.id] || 0;
        const isActive = level > 0;

        // Background
        ctx.fillStyle = isActive ? 'rgba(60,20,20,0.9)' : 'rgba(15,12,20,0.9)';
        ctx.fillRect(modX, modY, colW, modH);
        ctx.strokeStyle = isActive ? '#ff4444' : '#222';
        ctx.lineWidth = 1;
        ctx.strokeRect(modX, modY, colW, modH);

        // Icon + Name
        drawText(`${mod.icon} ${mod.name[lang] || mod.name.en}`, modX + 4, modY + 2, { font: 'bold 7px monospace', fill: isActive ? '#ff8844' : '#888', outlineWidth: 1 });

        // Level pips
        let pipStr = '';
        for (let l = 0; l < mod.maxLevel; l++) pipStr += l < level ? '●' : '○';
        drawText(pipStr, modX + 4, modY + 12, { font: '7px monospace', fill: isActive ? '#ff6644' : '#444', outline: false });

        // +/- buttons
        const btnSize = 10;
        // Minus
        const minX = modX + colW - btnSize * 2 - 6;
        ctx.fillStyle = level > 0 ? 'rgba(100,30,30,0.9)' : 'rgba(30,20,20,0.5)';
        ctx.fillRect(minX, modY + 5, btnSize, btnSize);
        ctx.strokeStyle = level > 0 ? '#ff4444' : '#333'; ctx.lineWidth = 1;
        ctx.strokeRect(minX, modY + 5, btnSize, btnSize);
        drawText('-', minX + btnSize / 2, modY + 5, { font: 'bold 8px monospace', fill: level > 0 ? '#ff6644' : '#444', align: 'center', outline: false });

        // Plus
        const plusX = minX + btnSize + 3;
        ctx.fillStyle = level < mod.maxLevel ? 'rgba(30,80,30,0.9)' : 'rgba(20,30,20,0.5)';
        ctx.fillRect(plusX, modY + 5, btnSize, btnSize);
        ctx.strokeStyle = level < mod.maxLevel ? '#44ff44' : '#333'; ctx.lineWidth = 1;
        ctx.strokeRect(plusX, modY + 5, btnSize, btnSize);
        drawText('+', plusX + btnSize / 2, modY + 5, { font: 'bold 8px monospace', fill: level < mod.maxLevel ? '#66ff66' : '#444', align: 'center', outline: false });

        // Jade bonus
        drawText(`+${Math.round(mod.jadeBonus * 100 * level)}%💎`, modX + colW - 3, modY + 2, { font: '6px monospace', fill: '#44aa44', align: 'right', outline: false });
    }
}

function handleMandateClick(mx, my) {
    if (!MandateState.unlocked) return;

    const contentY = 48;
    const mods = typeof MANDATE_MODIFIERS !== 'undefined' ? MANDATE_MODIFIERS : [];
    const modH = 22, modGap = 3;
    const modStartY = contentY + 28;
    const colW = Math.floor((GAME_W - 20) / 2);

    for (let mi = 0; mi < mods.length; mi++) {
        const mod = mods[mi];
        const col = mi % 2;
        const row = Math.floor(mi / 2);
        const modX = 8 + col * (colW + 4);
        const modY = modStartY + row * (modH + modGap);
        const level = MandateState.levels[mod.id] || 0;
        const btnSize = 10;

        // Minus button
        const minX = modX + colW - btnSize * 2 - 6;
        if (mx >= minX && mx <= minX + btnSize && my >= modY + 5 && my <= modY + 5 + btnSize) {
            if (level > 0 && typeof setMandateLevel === 'function') {
                setMandateLevel(mod.id, level - 1);
                SFX.menuClick();
            }
            return;
        }

        // Plus button
        const plusX = minX + btnSize + 3;
        if (mx >= plusX && mx <= plusX + btnSize && my >= modY + 5 && my <= modY + 5 + btnSize) {
            if (level < mod.maxLevel && typeof setMandateLevel === 'function') {
                setMandateLevel(mod.id, level + 1);
                SFX.menuClick();
            }
            return;
        }
    }
}

// --- Floor Announcement ---
function drawFloorAnnounce() {
    if (!G.floorAnnounce) return;
    const fa = G.floorAnnounce;
    const alpha = fa.timer > 1.5 ? (2.5 - fa.timer) : fa.timer > 0.5 ? 1 : fa.timer * 2;

    ctx.globalAlpha = Math.max(0, alpha);

    const bannerY = GAME_H * 0.35;
    const bannerH = fa.color ? 42 : 36; // taller for general banners

    // Element-colored banner for general spawns
    if (fa.color) {
        // Gradient background with element color
        const grad = ctx.createLinearGradient(0, bannerY, GAME_W, bannerY);
        grad.addColorStop(0, 'rgba(0,0,0,0.8)');
        grad.addColorStop(0.3, fa.color + 'cc');
        grad.addColorStop(0.7, fa.color + 'cc');
        grad.addColorStop(1, 'rgba(0,0,0,0.8)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, bannerY, GAME_W, bannerH);
        // Top/bottom border glow
        ctx.fillStyle = fa.color;
        ctx.globalAlpha = Math.max(0, alpha) * 0.6;
        ctx.fillRect(0, bannerY, GAME_W, 2);
        ctx.fillRect(0, bannerY + bannerH - 2, GAME_W, 2);
        ctx.globalAlpha = Math.max(0, alpha);
        // Larger text for generals
        drawText(fa.text, GAME_W / 2, bannerY + 6, {
            font: 'bold 14px monospace', fill: '#ffffff', align: 'center', outlineWidth: 4
        });
        // Subtitle line
        if (fa.subtitle) {
            drawText(fa.subtitle, GAME_W / 2, bannerY + 22, {
                font: '9px monospace', fill: '#ddd', align: 'center', outlineWidth: 2
            });
        }
    } else {
        // Default dark banner for regular announcements
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, bannerY, GAME_W, bannerH);
        drawText(fa.text, GAME_W / 2, bannerY + 8, {
            font: 'bold 16px monospace', fill: '#ffd700', align: 'center', outlineWidth: 4
        });
    }

    ctx.globalAlpha = 1;
}

// ============================================================
// PHASE I: Pause Menu & Settings
// ============================================================
function drawPauseMenu() {
    // Dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    const menuW = 200, menuH = 220;
    const menuX = GAME_W / 2 - menuW / 2;
    const menuY = GAME_H / 2 - menuH / 2;

    // Menu panel
    ctx.fillStyle = 'rgba(20,15,10,0.95)';
    ctx.fillRect(menuX, menuY, menuW, menuH);
    // Gold border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(menuX, menuY, menuW, menuH);
    // Inner border
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(menuX + 3, menuY + 3, menuW - 6, menuH - 6);

    // Title
    drawText('⚔ ' + (typeof t === 'function' ? t('paused') : 'PAUSED') + ' ⚔', GAME_W / 2, menuY + 12, {
        font: 'bold 14px monospace', fill: '#ffd700', align: 'center', outlineWidth: 3
    });

    // Equipment summary line
    if (G.equipment) {
        const eqY = menuY + 28;
        const slots = ['armor', 'talisman', 'mount'];
        let eqText = '';
        for (const s of slots) {
            const eq = G.equipment[s];
            if (eq) {
                const rc = (typeof RARITY_COLORS !== 'undefined') ? RARITY_COLORS[eq.rarity] : '#aaa';
                drawText(s.charAt(0).toUpperCase() + ': ' + eq.name, GAME_W / 2, eqY + slots.indexOf(s) * 9, {
                    font: '6px monospace', fill: rc, align: 'center', outline: false
                });
            } else {
                drawText(s.charAt(0).toUpperCase() + ': (empty)', GAME_W / 2, eqY + slots.indexOf(s) * 9, {
                    font: '6px monospace', fill: '#444', align: 'center', outline: false
                });
            }
        }
    }

    // Menu items
    const items = [
        { label: typeof t === 'function' ? t('resume') : 'Resume', icon: '▶' },
        { label: (typeof t === 'function' ? t('language') : 'Language') + ': ' + (G.lang === 'vi' ? '[VN] Tiếng Việt' : '[EN] English'), icon: '🌐' },
        { label: (typeof t === 'function' ? t('volume') : 'Volume') + ': ' + (audioEnabled ? 'ON' : 'OFF'), icon: audioEnabled ? '🔊' : '🔇' },
        { label: typeof t === 'function' ? t('return_menu') : 'Return to Menu', icon: '🏠' }
    ];

    const itemH = 28;
    const startY = menuY + 38;
    const sel = G.pauseMenuIdx || 0;

    items.forEach((item, i) => {
        const iy = startY + i * itemH;
        const selected = i === sel;

        // Highlight bar
        if (selected) {
            ctx.fillStyle = 'rgba(255,215,0,0.15)';
            ctx.fillRect(menuX + 8, iy, menuW - 16, itemH - 4);
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 1;
            ctx.strokeRect(menuX + 8, iy, menuW - 16, itemH - 4);
        }

        drawText(item.icon + ' ' + item.label, GAME_W / 2, iy + 4, {
            font: (selected ? 'bold ' : '') + '10px monospace',
            fill: selected ? '#ffd700' : '#cccccc',
            align: 'center',
            outlineWidth: 2
        });
    });

    // Hero stats at bottom
    const statsY = menuY + menuH - 30;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(menuX + 5, statsY, menuW - 10, 25);
    const hero = HEROES.find(h => h.id === P.heroId);
    const heroName = typeof t === 'function' ? t('hero_' + P.heroId) : (hero ? hero.name : '???');
    const statsText = heroName + ' | Lv.' + P.level + ' | HP:' + Math.floor(P.hp) + '/' + P.maxHp + ' | F' + G.floor;
    drawText(statsText, GAME_W / 2, statsY + 4, {
        font: '7px monospace', fill: '#aaa', align: 'center', outlineWidth: 1
    });

    // Controls hint
    drawText('↑↓ ' + (typeof t === 'function' ? t('navigate') : 'Navigate') + '  Enter ' + (typeof t === 'function' ? t('select') : 'Select') + '  ESC ' + (typeof t === 'function' ? t('resume') : 'Resume'), GAME_W / 2, GAME_H - 10, {
        font: '6px monospace', fill: '#666', align: 'center'
    });
}

function handlePauseMenuSelect(idx) {
    switch (idx) {
        case 0: // Resume
            G.state = 'PLAYING';
            SFX.menuClick();
            break;
        case 1: // Language toggle
            G.lang = G.lang === 'vi' ? 'en' : 'vi';
            if (typeof setLang === 'function') setLang(G.lang);
            if (typeof saveGameSettings === 'function') saveGameSettings();
            SFX.menuClick();
            break;
        case 2: // Volume toggle
            audioEnabled = !audioEnabled;
            if (!audioEnabled && typeof BGM !== 'undefined') BGM.stop();
            if (typeof saveGameSettings === 'function') saveGameSettings();
            SFX.menuClick();
            break;
        case 3: // Return to Menu
            if (typeof transitionTo === 'function') transitionTo('MENU');
            else G.state = 'MENU';
            SFX.menuClick();
            break;
    }
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
    // Kill count top-right (below floor label)
    const killText = `斬 ${G.totalKills.toLocaleString()}`;
    drawText(killText, GAME_W - 12, 22, { font: 'bold 11px monospace', fill: '#ffd700', align: 'right' });

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

    // N002: Kill Streak counter (top-right, below kill count)
    if (G.killStreak >= 10) {
        const streakPulse = 1 + Math.sin(G.time * 6) * 0.1;
        const streakSz = Math.floor(9 * streakPulse);
        const tierColor = G.killStreakTier > 0 && typeof KILL_STREAK_TIERS !== 'undefined'
            ? KILL_STREAK_TIERS[Math.min(G.killStreakTier - 1, KILL_STREAK_TIERS.length - 1)].color
            : '#ffaa44';
        // Streak timer bar (shows time remaining before reset)
        const timerPct = 1 - (G.killStreakTimer / 3.0);
        const barX = GAME_W - 70, barY = 36, barW = 58, barH = 3;
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = tierColor;
        ctx.fillRect(barX, barY, barW * timerPct, barH);
        // Streak text
        drawText(`🔥 ×${G.killStreak}`, GAME_W - 12, 30, {
            font: `bold ${streakSz}px monospace`, fill: tierColor, align: 'right', outlineWidth: 2
        });
    }

    // N002: Kill Streak milestone announcement (center screen banner)
    if (G.killStreakAnnounce) {
        const sa = G.killStreakAnnounce;
        const alpha = sa.timer > 1.5 ? (2.5 - sa.timer) : sa.timer > 0.5 ? 1 : sa.timer * 2;
        ctx.globalAlpha = clamp(alpha, 0, 1);
        // Banner background
        const bannerY = GAME_H * 0.25;
        const grad = ctx.createLinearGradient(0, bannerY, GAME_W, bannerY);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.2, sa.color + '88');
        grad.addColorStop(0.5, sa.color + 'cc');
        grad.addColorStop(0.8, sa.color + '88');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, bannerY, GAME_W, 32);
        // Glow borders
        ctx.fillStyle = sa.color;
        ctx.globalAlpha = clamp(alpha * 0.5, 0, 1);
        ctx.fillRect(GAME_W * 0.15, bannerY, GAME_W * 0.7, 1);
        ctx.fillRect(GAME_W * 0.15, bannerY + 31, GAME_W * 0.7, 1);
        ctx.globalAlpha = clamp(alpha, 0, 1);
        // Text
        const popScale = sa.timer > 2 ? 1 + (2.5 - sa.timer) * 2 : 1;
        drawText(sa.text, GAME_W / 2, bannerY + 5, {
            font: `bold ${Math.floor(14 * popScale)}px monospace`, fill: '#fff', align: 'center', outlineWidth: 4
        });
        // XP bonus subtext
        const xpBonus = Math.round((G.killStreakXpMult - 1) * 100);
        if (xpBonus > 0) {
            drawText(`+${xpBonus}% XP`, GAME_W / 2, bannerY + 20, {
                font: 'bold 9px monospace', fill: sa.color, align: 'center', outlineWidth: 2
            });
        }
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

    // Hero cards — 6 cards (fit within screen)
    const gap = 4;
    const cardW = Math.floor((GAME_W - gap * (HEROES.length + 1)) / HEROES.length);
    const cardH = 195;
    const totalW = HEROES.length * (cardW + gap) - gap;
    const startX = Math.max(gap, GAME_W / 2 - totalW / 2);
    const startY = 30;

    for (let i = 0; i < HEROES.length; i++) {
        const h = HEROES[i];
        const cx = startX + i * (cardW + gap);
        const cy = startY;
        const isHover = G._heroHover === i;
        const elColor = ELEMENTS[h.element] ? ELEMENTS[h.element].color : '#888';

        // Card bg with subtle element gradient
        ctx.fillStyle = isHover ? 'rgba(30,25,50,0.95)' : 'rgba(12,10,20,0.9)';
        ctx.fillRect(cx, cy, cardW, cardH);

        // Element glow border
        ctx.strokeStyle = elColor;
        ctx.lineWidth = isHover ? 3 : 1;
        ctx.strokeRect(cx, cy, cardW, cardH);

        // Clip to card bounds to prevent text overflow
        ctx.save();
        ctx.beginPath();
        ctx.rect(cx, cy, cardW, cardH);
        ctx.clip();

        // Hero pixel art preview — render actual hero sprite
        const previewY = cy + 6;
        const heroSpriteDef = HERO_SPRITES[h.id];
        if (heroSpriteDef) {
            // Draw the hero sprite centered in the card preview area
            const spriteX = cx + cardW / 2;
            const spriteY = previewY + 20;
            drawSprite(spriteX, spriteY, heroSpriteDef.idle[0], heroSpriteDef.colors, false, null);
        } else {
            // Fallback colored rectangle
            ctx.fillStyle = h.colors.body;
            ctx.fillRect(cx + cardW / 2 - 8, previewY, 16, 20);
            ctx.fillStyle = h.colors.accent;
            ctx.fillRect(cx + cardW / 2 - 6, previewY + 2, 12, 5);
            ctx.fillStyle = h.colors.hair;
            ctx.fillRect(cx + cardW / 2 - 6, previewY, 12, 3);
        }

        // Element symbol
        const elSym = ELEMENTS[h.element] ? ELEMENTS[h.element].symbol : '?';
        drawText(elSym, cx + cardW - 6, cy + 4, { font: 'bold 12px monospace', fill: elColor, align: 'right' });

        // Name
        drawText(h.name, cx + cardW / 2, cy + 32, { font: 'bold 9px monospace', fill: '#fff', align: 'center', outlineWidth: 2 });
        // Title
        drawText(h.title, cx + cardW / 2, cy + 44, { font: '7px monospace', fill: '#aaa', align: 'center', outline: false });

        // Class ID
        drawText(h.id.toUpperCase(), cx + cardW / 2, cy + 56, { font: 'bold 7px monospace', fill: elColor, align: 'center' });

        // Weapon info
        const weaponY = cy + 68;
        drawText(`${h.weaponIcon || '⚔'} ${h.weaponName || 'Weapon'}`, cx + cardW / 2, weaponY, {
            font: 'bold 7px monospace', fill: '#ffaa44', align: 'center', outline: false
        });

        // Stats
        const statsY = cy + 82;
        drawText(`HP: ${h.hp}`, cx + 4, statsY, { font: '7px monospace', fill: '#44dd44', outline: false });
        drawText(`SPD: ${h.speed}`, cx + 4, statsY + 10, { font: '7px monospace', fill: '#44bbff', outline: false });
        drawText(`MP: ${h.mp}`, cx + 4, statsY + 20, { font: '7px monospace', fill: '#4488ff', outline: false });

        // Passive
        drawText('PASSIVE:', cx + 4, statsY + 34, { font: 'bold 6px monospace', fill: '#ffd700', outline: false });
        drawText(h.passive.name, cx + 4, statsY + 43, { font: '6px monospace', fill: '#ddd', outline: false });

        // Tactical
        const tac = h.tactical;
        drawText(`[E] ${tac.icon} ${tac.name}`, cx + 4, statsY + 56, { font: 'bold 6px monospace', fill: '#44ff44', outline: false });
        drawText(`${tac.mpCost} MP`, cx + 4, statsY + 65, { font: '6px monospace', fill: '#4488ff', outline: false });

        // Ultimate
        const ult = h.ultimate;
        drawText(`[Q] ${ult.icon} ${ult.name}`, cx + 4, statsY + 78, { font: 'bold 6px monospace', fill: '#ffd700', outline: false });
        drawText('Musou gauge', cx + 4, statsY + 87, { font: '6px monospace', fill: '#ccaa22', outline: false });

        // Restore clipping
        ctx.restore();

        // Element bar at bottom (outside clip for clean border)
        ctx.fillStyle = elColor; ctx.globalAlpha = 0.3;
        ctx.fillRect(cx + 1, cy + cardH - 14, cardW - 2, 13);
        ctx.globalAlpha = 1;
        drawText(ELEMENTS[h.element] ? ELEMENTS[h.element].name : h.element, cx + cardW / 2, cy + cardH - 13, {
            font: 'bold 8px monospace', fill: '#fff', align: 'center', outline: false
        });
    }

    // --- Aspect Selector Row (S001-UI) ---
    if (typeof HERO_ASPECTS !== 'undefined') {
        const aspY = startY + cardH + 4;
        const aspBtnW = Math.floor(cardW / 3);
        const aspH = 18;
        const lang = G.lang || 'vi';

        for (let i = 0; i < HEROES.length; i++) {
            const h = HEROES[i];
            const cx = startX + i * (cardW + gap);
            const aspects = HERO_ASPECTS[h.id] || [];
            const selectedId = (AspectState.selectedAspect && AspectState.selectedAspect[h.id]) || '';

            for (let ai = 0; ai < aspects.length; ai++) {
                const aspect = aspects[ai];
                const ax = cx + ai * aspBtnW;
                const isSelected = aspect.id === selectedId;
                const isUnlocked = AspectState.unlockedAspects[h.id] &&
                    AspectState.unlockedAspects[h.id].includes(aspect.id);

                // Button bg
                ctx.fillStyle = isSelected ? 'rgba(50,40,10,0.95)' : 'rgba(10,8,18,0.85)';
                ctx.fillRect(ax, aspY, aspBtnW - 1, aspH);
                ctx.strokeStyle = isSelected ? '#ffd700' : isUnlocked ? aspect.color : '#333';
                ctx.lineWidth = isSelected ? 2 : 1;
                ctx.strokeRect(ax, aspY, aspBtnW - 1, aspH);

                if (isUnlocked) {
                    // Show icon + short name
                    drawText(aspect.icon, ax + aspBtnW / 2, aspY + 1, { font: '8px monospace', fill: isSelected ? '#ffd700' : aspect.color, align: 'center', outline: false });
                    const shortName = (aspect.name[lang] || aspect.name.en).substring(0, 4);
                    drawText(shortName, ax + aspBtnW / 2, aspY + 10, { font: '5px monospace', fill: isSelected ? '#fff' : '#888', align: 'center', outline: false });
                } else {
                    drawText('🔒', ax + aspBtnW / 2, aspY + 3, { font: '7px monospace', fill: '#333', align: 'center', outline: false });
                }
            }
        }
    }

    // Instructions
    drawText('Click a hero to begin', GAME_W / 2, GAME_H - 18, { font: '9px monospace', fill: '#666', align: 'center', outline: false });

    // --- Difficulty Tier Selector (K004) ---
    if (typeof DIFFICULTY_TIERS !== 'undefined') {
        const dtY = GAME_H - 36;
        const dtBtnW = 50, dtGap = 4;
        const dtTotalW = DIFFICULTY_TIERS.length * (dtBtnW + dtGap) - dtGap;
        const dtStartX = GAME_W / 2 - dtTotalW / 2;

        drawText('DIFFICULTY', GAME_W / 2, dtY - 12, { font: 'bold 7px monospace', fill: '#888', align: 'center', outline: false });

        for (let i = 0; i < DIFFICULTY_TIERS.length; i++) {
            const tier = DIFFICULTY_TIERS[i];
            const tx = dtStartX + i * (dtBtnW + dtGap);
            const isSelected = G.difficulty === i;
            const isLocked = !G.difficultyUnlocked[i];
            const lang = G.lang || 'vi';

            ctx.fillStyle = isLocked ? 'rgba(20,15,15,0.8)' : isSelected ? 'rgba(30,25,50,0.95)' : 'rgba(15,12,20,0.85)';
            ctx.fillRect(tx, dtY, dtBtnW, 20);
            ctx.strokeStyle = isLocked ? '#333' : isSelected ? tier.color : '#555';
            ctx.lineWidth = isSelected ? 2 : 1;
            ctx.strokeRect(tx, dtY, dtBtnW, 20);

            if (isLocked) {
                drawText('🔒', tx + dtBtnW / 2, dtY + 3, { font: '8px monospace', fill: '#555', align: 'center', outline: false });
                drawText(`Fl.${tier.unlockFloor}`, tx + dtBtnW / 2, dtY + 12, { font: '6px monospace', fill: '#444', align: 'center', outline: false });
            } else {
                drawText(`${tier.icon} ${tier.name[lang]}`, tx + dtBtnW / 2, dtY + 2, { font: 'bold 7px monospace', fill: isSelected ? tier.color : '#aaa', align: 'center', outline: false });
                drawText(`×${tier.hpMult}`, tx + dtBtnW / 2, dtY + 12, { font: '6px monospace', fill: isSelected ? '#fff' : '#777', align: 'center', outline: false });
            }
        }
    }
}

// --- Handle Hero Select Click ---
function handleHeroSelectClick(mx, my) {
    // --- S001-UI: Aspect Click ---
    if (typeof HERO_ASPECTS !== 'undefined') {
        const gap = 4;
        const cardW = Math.floor((GAME_W - gap * (HEROES.length + 1)) / HEROES.length);
        const cardH = 195;
        const totalW = HEROES.length * (cardW + gap) - gap;
        const startX = Math.max(gap, GAME_W / 2 - totalW / 2);
        const startY = 30;
        const aspY = startY + cardH + 4;
        const aspBtnW = Math.floor(cardW / 3);
        const aspH = 18;

        for (let i = 0; i < HEROES.length; i++) {
            const h = HEROES[i];
            const cx = startX + i * (cardW + gap);
            const aspects = HERO_ASPECTS[h.id] || [];

            for (let ai = 0; ai < aspects.length; ai++) {
                const aspect = aspects[ai];
                const ax = cx + ai * aspBtnW;

                if (mx >= ax && mx <= ax + aspBtnW && my >= aspY && my <= aspY + aspH) {
                    const isUnlocked = AspectState.unlockedAspects[h.id] &&
                        AspectState.unlockedAspects[h.id].includes(aspect.id);
                    if (isUnlocked) {
                        selectAspect(h.id, aspect.id);
                        SFX.menuClick();
                    } else {
                        triggerFlash('#ff0000', 0.15);
                    }
                    return;
                }
            }
        }
    }

    // --- K004: Difficulty Tier Click ---
    if (typeof DIFFICULTY_TIERS !== 'undefined') {
        const dtY = GAME_H - 36;
        const dtBtnW = 50, dtGap = 4;
        const dtTotalW = DIFFICULTY_TIERS.length * (dtBtnW + dtGap) - dtGap;
        const dtStartX = GAME_W / 2 - dtTotalW / 2;
        for (let i = 0; i < DIFFICULTY_TIERS.length; i++) {
            const tx = dtStartX + i * (dtBtnW + dtGap);
            if (mx >= tx && mx <= tx + dtBtnW && my >= dtY && my <= dtY + 20) {
                if (G.difficultyUnlocked[i]) {
                    G.difficulty = i;
                    SFX.menuClick();
                    saveGameSettings();
                } else {
                    triggerFlash('#ff0000', 0.15);
                }
                return;
            }
        }
    }

    // --- Hero Card Click ---
    const cardW = 88, cardH = 195, gap = 4;
    const totalW = HEROES.length * (cardW + gap) - gap;
    const startX = GAME_W / 2 - totalW / 2;
    const startY = 30;

    for (let i = 0; i < HEROES.length; i++) {
        const cx = startX + i * (cardW + gap);
        if (mx >= cx && mx <= cx + cardW && my >= startY && my <= startY + cardH) {
            G.selectedHero = HEROES[i].id;
            SFX.menuClick();
            if (typeof transitionTo === 'function') transitionTo('BONDING');
            else G.state = 'BONDING';
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

    switch (tac.id) {
        case 'ground_slam': // Berserker — FIRE ERUPTION: Lava shockwave + ground fissures + ember rain
            SFX.groundSlam();
            shake(5, 0.25);
            hitStop(0.04);
            if (typeof triggerFlash === 'function') triggerFlash('#ff2200', 0.1);
            if (typeof triggerChromatic === 'function') triggerChromatic(2.5);
            // Double-layer expanding shockwave
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 5, maxRadius: tac.range * 1.1, speed: 220,
                color: '#ff4400', alpha: 0.9, lineWidth: 4, timer: 0.6
            });
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 3, maxRadius: tac.range * 0.7, speed: 180,
                color: '#ffd700', alpha: 0.6, lineWidth: 2, timer: 0.5
            });
            // 8 radiating ground fissures
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.2;
                G.skillEffects.push({
                    type: 'crack', x: P.x, y: P.y, angle: angle,
                    length: 0, maxLength: tac.range * 0.8, speed: 180,
                    color: '#ff6600', alpha: 0.8, timer: 0.6
                });
            }
            // Rising ember rain (20 embers)
            for (let i = 0; i < 20; i++) {
                const a = Math.random() * Math.PI * 2;
                const r = Math.random() * tac.range * 0.6;
                G.skillEffects.push({
                    type: 'ember',
                    x: P.x + Math.cos(a) * r, y: P.y + Math.sin(a) * r,
                    vx: (Math.random() - 0.5) * 30,
                    vy: -(30 + Math.random() * 60),
                    color: ['#ff2200', '#ff6600', '#ff8800', '#ffd700'][i % 4],
                    alpha: 0.9, timer: 0.5 + Math.random() * 0.5,
                    size: 1.5 + Math.random() * 2.5
                });
            }
            // Fire ground aura
            G.skillEffects.push({
                type: 'fire_aura', x: P.x, y: P.y,
                radius: tac.range * 0.5, color: '#ff4400', alpha: 0.35, timer: 0.4
            });
            spawnParticles(P.x, P.y, '#ff4400', 20, 70);
            spawnParticles(P.x, P.y, '#ffd700', 10, 50);
            G.enemies.forEach(e => {
                if (dist(P, e) < tac.range) {
                    damageEnemy(e, tac.dmg, P.element);
                    e.stunTimer = (e.stunTimer || 0) + tac.stunDur;
                    e.speed *= 0;
                    G.skillEffects.push({
                        type: 'impact_flash', x: e.x, y: e.y,
                        radius: 10, color: '#ff4400', alpha: 0.7, timer: 0.1
                    });
                }
            });
            break;

        case 'wind_burst': // Strategist — GALE FORCE: Multi-layer wind + leaf tornado
            SFX.windBurst();
            shake(3, 0.18);
            if (typeof triggerChromatic === 'function') triggerChromatic(1.5);
            // Primary wide cone blast
            G.skillEffects.push({
                type: 'wind_cone', x: P.x, y: P.y,
                facing: P.facing, angle: Math.PI / 2.5,
                radius: 8, maxRadius: tac.range * 1.1, speed: 280,
                color: '#44ff44', alpha: 0.5, timer: 0.45
            });
            // Secondary inner cone — narrow + intense
            G.skillEffects.push({
                type: 'wind_cone', x: P.x, y: P.y,
                facing: P.facing, angle: Math.PI / 5,
                radius: 5, maxRadius: tac.range * 0.8, speed: 320,
                color: '#88ffaa', alpha: 0.35, timer: 0.35
            });
            // Swirling leaf tornado (12 leaves)
            for (let i = 0; i < 12; i++) {
                const a = (P.facing > 0 ? -Math.PI / 4 : Math.PI + Math.PI / 4) + Math.random() * Math.PI / 2;
                G.skillEffects.push({
                    type: 'leaf', x: P.x + P.facing * 10, y: P.y,
                    vx: Math.cos(a) * (90 + Math.random() * 70),
                    vy: Math.sin(a) * (60 + Math.random() * 50) + (Math.random() - 0.5) * 40,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 12,
                    color: ['#44ff44', '#88ff44', '#66dd33', '#aaffaa'][i % 4],
                    alpha: 0.85, timer: 0.5 + Math.random() * 0.4,
                    size: 2.5 + Math.random() * 2.5
                });
            }
            spawnParticles(P.x + P.facing * 15, P.y, '#44ff44', 15, 60);
            spawnParticles(P.x + P.facing * 15, P.y, '#88ff88', 8, 40);
            G.enemies.forEach(e => {
                if (dist(P, e) < tac.range) {
                    damageEnemy(e, tac.dmg, P.element);
                    const dx = e.x - P.x, dy = e.y - P.y;
                    const d = Math.hypot(dx, dy) || 1;
                    e.x += (dx / d) * tac.knockback;
                    e.y += (dy / d) * tac.knockback;
                }
            });
            break;

        case 'shadow_strike': // Assassin — VOID SLASH: Triple afterimage + lightning web + impact burst
            SFX.shadowStrike();
            let nearest = null, minD = tac.teleRange;
            G.enemies.forEach(e => {
                const d = dist(P, e);
                if (d < minD) { minD = d; nearest = e; }
            });
            if (nearest) {
                const startX = P.x, startY = P.y;
                // Triple fading afterimages at start
                for (let i = 0; i < 3; i++) {
                    G.skillEffects.push({
                        type: 'afterimage', x: startX + i * P.facing * 5, y: startY,
                        w: P.w, h: P.h, color: '#8866ff',
                        alpha: 0.7 - i * 0.2, timer: 0.4 + i * 0.1
                    });
                }
                P.x = nearest.x; P.y = nearest.y - 10;
                damageEnemy(nearest, tac.dmg, P.element);
                // Dual lightning trails (zigzag)
                G.skillEffects.push({
                    type: 'lightning_trail', x1: startX, y1: startY,
                    x2: P.x, y2: P.y,
                    color: '#ccaaff', alpha: 0.9, timer: 0.4,
                    segments: 10 + Math.floor(Math.random() * 4)
                });
                G.skillEffects.push({
                    type: 'lightning_trail', x1: startX + 3, y1: startY - 3,
                    x2: P.x + 3, y2: P.y - 3,
                    color: '#aa88ff', alpha: 0.5, timer: 0.3,
                    segments: 6 + Math.floor(Math.random() * 3)
                });
                // Impact burst — multi-layered
                G.skillEffects.push({
                    type: 'impact_flash', x: P.x, y: P.y,
                    radius: 18, color: '#aa88ff', alpha: 0.9, timer: 0.18
                });
                G.skillEffects.push({
                    type: 'shockwave', x: P.x, y: P.y,
                    radius: 3, maxRadius: 25, speed: 200,
                    color: '#ccaaff', alpha: 0.5, lineWidth: 2, timer: 0.25
                });
                // Slash arcs at landing
                for (let i = 0; i < 3; i++) {
                    G.skillEffects.push({
                        type: 'slash_arc', x: P.x, y: P.y,
                        radius: 10 + i * 4, startAngle: Math.random() * Math.PI * 2,
                        color: '#ccccff', alpha: 0.7 - i * 0.2, timer: 0.2 + i * 0.05
                    });
                }
                spawnParticles(P.x, P.y, '#aaaaff', 15, 45);
                spawnParticles(startX, startY, '#8866ff', 8, 30);
                shake(3, 0.12);
                hitStop(0.06);
            }
            break;

        case 'shield_wall': // Vanguard — IRON BASTION: Radiant dome + orbiting sparks + ground pulse
            SFX.shieldWall();
            P.shieldWall = tac.blockDur;
            P.invincible = tac.blockDur;
            if (typeof triggerFlash === 'function') triggerFlash('#ffd700', 0.08);
            shake(2, 0.1);
            // Persistent golden dome — thicker, brighter
            G.skillEffects.push({
                type: 'golden_dome', x: P.x, y: P.y,
                radius: 25, color: '#ffd700', alpha: 0.45,
                timer: tac.blockDur, followPlayer: true
            });
            // Expanding activation ring
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 5, maxRadius: 35, speed: 150,
                color: '#ffcc00', alpha: 0.6, lineWidth: 2, timer: 0.35
            });
            // 8 orbiting sparkles (faster, brighter)
            for (let i = 0; i < 8; i++) {
                const a = (Math.PI * 2 / 8) * i;
                G.skillEffects.push({
                    type: 'sparkle', x: P.x + Math.cos(a) * 22, y: P.y + Math.sin(a) * 22,
                    angle: a, orbRadius: 22, speed: 3 + Math.random() * 2,
                    color: i % 2 === 0 ? '#ffe066' : '#ffd700',
                    alpha: 0.9, timer: tac.blockDur, followPlayer: true
                });
            }
            // Ground glow ring
            G.skillEffects.push({
                type: 'fire_aura', x: P.x, y: P.y,
                radius: 15, color: '#ffd700', alpha: 0.2,
                timer: tac.blockDur, followPlayer: true
            });
            spawnParticles(P.x, P.y, '#ddaa44', 12, 35);
            spawnParticles(P.x, P.y, '#ffe066', 6, 25);
            break;

        case 'life_drain': // Mystic — SOUL SIPHON: Arcane drain beams + pull vortex + heal cascade
            SFX.lifeDrain();
            if (typeof triggerChromatic === 'function') triggerChromatic(1.5);
            let healed = 0;
            let drainCount = 0;
            G.enemies.forEach(e => {
                if (dist(P, e) < tac.range) {
                    const drainDmg = Math.min(e.hp, 12);
                    damageEnemy(e, drainDmg, P.element);
                    healed += drainDmg;
                    drainCount++;
                    // Thick energy beam from enemy to player
                    G.skillEffects.push({
                        type: 'drain_beam', x1: e.x, y1: e.y,
                        x2: P.x, y2: P.y,
                        color: '#44ddff', alpha: 0.8, timer: 0.5,
                        width: 3, followTarget: true
                    });
                    // Secondary dim beam offset
                    G.skillEffects.push({
                        type: 'drain_beam', x1: e.x + 2, y1: e.y - 2,
                        x2: P.x, y2: P.y,
                        color: '#88eeff', alpha: 0.3, timer: 0.4,
                        width: 1, followTarget: true
                    });
                    // Hit spark on drained enemy
                    G.skillEffects.push({
                        type: 'impact_flash', x: e.x, y: e.y,
                        radius: 8, color: '#44ddff', alpha: 0.6, timer: 0.1
                    });
                }
            });
            P.hp = clamp(P.hp + Math.min(healed, tac.healAmt), 0, P.maxHp);
            if (healed > 0) {
                // Healing pulse cascade (layered)
                G.skillEffects.push({
                    type: 'heal_pulse', x: P.x, y: P.y,
                    radius: 5, maxRadius: 20, color: '#44ff44', alpha: 0.6,
                    timer: 0.35, followPlayer: true
                });
                G.skillEffects.push({
                    type: 'heal_pulse', x: P.x, y: P.y,
                    radius: 3, maxRadius: 14, color: '#88ffaa', alpha: 0.4,
                    timer: 0.25, followPlayer: true
                });
                // Green heal sparkles
                for (let i = 0; i < Math.min(drainCount, 6); i++) {
                    const a = Math.random() * Math.PI * 2;
                    G.skillEffects.push({
                        type: 'sparkle', x: P.x + Math.cos(a) * 10, y: P.y + Math.sin(a) * 10,
                        angle: a, orbRadius: 10, speed: 2,
                        color: '#44ff44', alpha: 0.7, timer: 0.3
                    });
                }
            }
            // Vortex pull VFX around player
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: tac.range * 0.6, maxRadius: 5, speed: -200,
                color: '#44ddff', alpha: 0.3, lineWidth: 1.5, timer: 0.3
            });
            spawnParticles(P.x, P.y, '#44ddff', 12, 35);
            spawnDmgNum(P.x, P.y - 20, Math.min(healed, tac.healAmt), '#44ff44', false);
            break;

        case 'arrow_rain': // Ranger — ARROW RAIN: Shuriken barrage raining from above
            SFX.fireRain();
            if (typeof triggerFlash === 'function') triggerFlash('#88ff22', 0.06);
            shake(2, 0.15);
            {
                const targetX = P.x + P.facing * 60;
                const targetY = P.y;
                const count = tac.count || 12;
                // Target area marker
                G.skillEffects.push({
                    type: 'fire_aura', x: targetX, y: targetY,
                    radius: tac.range || 60, color: '#88ff22', alpha: 0.15, timer: 0.8
                });
                G.skillEffects.push({
                    type: 'shockwave', x: targetX, y: targetY,
                    radius: 5, maxRadius: tac.range || 60, speed: 120,
                    color: '#aacc44', alpha: 0.4, lineWidth: 1.5, timer: 0.4
                });
                // Rain down shuriken
                for (let i = 0; i < count; i++) {
                    const delay = i * 0.06;
                    const ox = (Math.random() - 0.5) * (tac.range || 60) * 2;
                    const oy = (Math.random() - 0.5) * (tac.range || 60) * 2;
                    setTimeout(() => {
                        if (G.state !== 'PLAYING') return;
                        G.bullets.push({
                            x: targetX + ox, y: targetY + oy - 80,
                            vx: (Math.random() - 0.5) * 20, vy: 280 + Math.random() * 60,
                            dmg: tac.dmg * (1 + P.level * 0.15), el: P.element,
                            color: '#88ff22', life: 1, type: 'thrown_star', r: 3,
                            pierce: 0, spin: 0, spinSpeed: 14, weaponId: 'arrow_rain'
                        });
                        // Impact spark on spawn
                        spawnParticles(targetX + ox, targetY + oy, '#88ff22', 2, 15);
                    }, delay * 1000);
                }
                // Leaf shower VFX
                for (let i = 0; i < 6; i++) {
                    G.skillEffects.push({
                        type: 'leaf', x: targetX + (Math.random() - 0.5) * 60, y: targetY - 50,
                        vx: (Math.random() - 0.5) * 30,
                        vy: 40 + Math.random() * 30,
                        rotation: Math.random() * Math.PI * 2,
                        rotSpeed: (Math.random() - 0.5) * 8,
                        color: i % 2 === 0 ? '#88ff22' : '#66cc00',
                        alpha: 0.4, timer: 0.6, size: 2 + Math.random()
                    });
                }
            }
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

    // Phase G: WAR CRY — Morale to max + buff all allies
    G.morale = 100;
    for (const ally of G.allies) {
        if (ally.hp > 0) {
            ally._warCryBuff = 6; // 6 seconds of enhanced combat
            spawnParticles(ally.x, ally.y, '#ffd700', 8, 40);
        }
    }

    switch (hero.ultimate.id) {
        case 'rage_mode': // Berserker — DYNASTY FURY: Devastating fire eruption + persistent blaze
            SFX.rageMode();
            P.rageModeTimer = hero.ultimate.duration;
            // Persistent fire aura — larger, brighter
            G.skillEffects.push({
                type: 'fire_aura', x: P.x, y: P.y,
                radius: 28, color: '#ff4400', alpha: 0.4,
                timer: hero.ultimate.duration, followPlayer: true
            });
            // Inner golden aura
            G.skillEffects.push({
                type: 'fire_aura', x: P.x, y: P.y,
                radius: 14, color: '#ffd700', alpha: 0.25,
                timer: hero.ultimate.duration, followPlayer: true
            });
            // 4 subtle speed lines radiating outward
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI * 2 / 4) * i;
                G.skillEffects.push({
                    type: 'speed_line', x: P.x, y: P.y, angle: angle,
                    length: 0, maxLength: 15, speed: 300,
                    color: i % 2 === 0 ? '#ff6600' : '#ffd700', alpha: 0.3, timer: 0.12
                });
            }
            // Triple-layer fire eruption
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 5, maxRadius: 70, speed: 140,
                color: '#ff2200', alpha: 0.7, lineWidth: 5, timer: 0.6
            });
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 3, maxRadius: 50, speed: 100,
                color: '#ff6600', alpha: 0.5, lineWidth: 3, timer: 0.5
            });
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 2, maxRadius: 30, speed: 80,
                color: '#ffd700', alpha: 0.4, lineWidth: 2, timer: 0.4
            });
            // 25 rising embers
            for (let i = 0; i < 25; i++) {
                const a = Math.random() * Math.PI * 2;
                const r = Math.random() * 40;
                G.skillEffects.push({
                    type: 'ember',
                    x: P.x + Math.cos(a) * r, y: P.y + Math.sin(a) * r,
                    vx: (Math.random() - 0.5) * 40,
                    vy: -(25 + Math.random() * 70),
                    color: ['#ff2200', '#ff4400', '#ff8800', '#ffd700'][i % 4],
                    alpha: 0.9, timer: 0.6 + Math.random() * 0.6,
                    size: 2 + Math.random() * 3
                });
            }
            spawnParticles(P.x, P.y, '#ff4400', 25, 70);
            spawnParticles(P.x, P.y, '#ffd700', 15, 50);
            break;

        case 'eight_trigrams': // Strategist — HEAVEN’S MANDATE: Grand yin-yang + elemental storm
            SFX.eightTrigrams();
            // Large yin-yang ground symbol
            G.skillEffects.push({
                type: 'yinyang_symbol', x: P.x, y: P.y,
                radius: 40, rotation: 0, rotSpeed: 4,
                alpha: 0.7, timer: 1.8
            });
            // Spiraling golden trigram circle (brighter, faster)
            G.skillEffects.push({
                type: 'trigram_circle', x: P.x, y: P.y,
                radius: 50, rotation: 0, rotSpeed: 5,
                color: '#ffd700', alpha: 0.8, timer: 1.5, boltCount: 8
            });
            // Expanding energy ring
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 5, maxRadius: 55, speed: 100,
                color: '#88ff44', alpha: 0.4, lineWidth: 2, timer: 0.5
            });
            // 12 elemental bolts (more, bigger, faster)
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 / 12) * i;
                G.bullets.push({
                    x: P.x, y: P.y,
                    vx: Math.cos(angle) * 140,
                    vy: Math.sin(angle) * 140,
                    dmg: hero.ultimate.dmg, el: EL_KEYS[i % 5],
                    color: ELEMENTS[EL_KEYS[i % 5]].light,
                    life: 3.5, r: 6, pierce: 4, type: 'bullet'
                });
            }
            // Swirling leaves around the symbol
            for (let i = 0; i < 8; i++) {
                const a = (Math.PI * 2 / 8) * i;
                G.skillEffects.push({
                    type: 'leaf', x: P.x + Math.cos(a) * 30, y: P.y + Math.sin(a) * 30,
                    vx: Math.cos(a + Math.PI / 2) * 60,
                    vy: Math.sin(a + Math.PI / 2) * 60,
                    rotation: Math.random() * Math.PI * 2, rotSpeed: 6,
                    color: i % 2 === 0 ? '#44ff44' : '#ffd700',
                    alpha: 0.7, timer: 0.8, size: 3
                });
            }
            spawnParticles(P.x, P.y, '#44ff44', 15, 50);
            spawnParticles(P.x, P.y, '#ffd700', 10, 40);
            break;

        case 'blade_storm': // Assassin — THOUSAND CUTS: Phantom blur + rapid multi-slash
            SFX.bladeStorm();
            // Player blur effect — stronger
            G.skillEffects.push({
                type: 'player_blur', x: P.x, y: P.y,
                alpha: 0.6, timer: 1.8, followPlayer: true
            });
            // Initial burst shockwave
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 3, maxRadius: 40, speed: 250,
                color: '#ccaaff', alpha: 0.4, lineWidth: 2, timer: 0.3
            });
            const nearby = G.enemies.filter(e => dist(P, e) < hero.ultimate.range).slice(0, hero.ultimate.hits);
            nearby.forEach((e, i) => {
                setTimeout(() => {
                    if (e.hp > 0) {
                        damageEnemy(e, hero.ultimate.dmg, P.element);
                        // Triple slash arcs at each hit (staggered angles)
                        for (let j = 0; j < 3; j++) {
                            G.skillEffects.push({
                                type: 'slash_arc', x: e.x, y: e.y,
                                radius: 10 + j * 5, startAngle: Math.random() * Math.PI * 2,
                                color: j === 0 ? '#ffffff' : '#ccccff',
                                alpha: 0.85 - j * 0.2, timer: 0.2 + j * 0.05
                            });
                        }
                        // Double dash lines (main + ghost)
                        G.skillEffects.push({
                            type: 'dash_line', x1: P.x, y1: P.y,
                            x2: e.x, y2: e.y,
                            color: '#aaccff', alpha: 0.6, timer: 0.18, width: 2
                        });
                        G.skillEffects.push({
                            type: 'dash_line', x1: P.x + 2, y1: P.y - 2,
                            x2: e.x + 2, y2: e.y - 2,
                            color: '#ccaaff', alpha: 0.3, timer: 0.12, width: 1
                        });
                        // Impact flash per hit
                        G.skillEffects.push({
                            type: 'impact_flash', x: e.x, y: e.y,
                            radius: 10, color: '#ccccff', alpha: 0.7, timer: 0.1
                        });
                        spawnParticles(e.x, e.y, '#ccccff', 8, 35);
                    }
                }, i * 40);
            });
            P.invincible = Math.max(P.invincible, 1.8);
            break;

        case 'changban_charge': // Vanguard — IMMORTAL CHARGE: Earth-shattering rush + seismic impact
            SFX.changbanCharge();
            P.invincible = Math.max(P.invincible, 2.5);
            P.dodgeDx = P.facing * hero.ultimate.chargeSpeed;
            P.dodgeDy = 0;
            P.dodgeTimer = 0.8;
            // Dust trail during charge — brighter
            G.skillEffects.push({
                type: 'dust_trail', x: P.x, y: P.y,
                facing: P.facing, timer: 0.8, followPlayer: true,
                color: '#ddaa44', alpha: 0.6
            });
            // Brief speed lines during charge
            for (let i = 0; i < 2; i++) {
                G.skillEffects.push({
                    type: 'speed_line', x: P.x, y: P.y,
                    angle: (P.facing > 0 ? Math.PI : 0) + (Math.random() - 0.5) * 0.5,
                    length: 0, maxLength: 12, speed: 350,
                    color: '#ddaa44', alpha: 0.3, timer: 0.1
                });
            }
            // Mid-charge shockwave
            setTimeout(() => {
                G.skillEffects.push({
                    type: 'shockwave', x: P.x, y: P.y,
                    radius: 3, maxRadius: 25, speed: 150,
                    color: '#ddaa44', alpha: 0.4, lineWidth: 2, timer: 0.25
                });
            }, 400);
            // AoE damage at endpoint after delay
            setTimeout(() => {
                G.enemies.forEach(e => {
                    if (dist(P, e) < hero.ultimate.range) {
                        damageEnemy(e, hero.ultimate.dmg, P.element);
                        const dx = e.x - P.x, dy = e.y - P.y;
                        const d = Math.hypot(dx, dy) || 1;
                        e.x += (dx / d) * 50;
                        e.y += (dy / d) * 50;
                        // Impact per enemy
                        G.skillEffects.push({
                            type: 'impact_flash', x: e.x, y: e.y,
                            radius: 8, color: '#ddaa44', alpha: 0.6, timer: 0.1
                        });
                    }
                });
                shake(6, 0.35);
                hitStop(0.06);
                if (typeof triggerFlash === 'function') triggerFlash('#ddaa44', 0.1);
                // Massive impact crater
                G.skillEffects.push({
                    type: 'impact_crater', x: P.x, y: P.y,
                    radius: 40, color: '#ddaa44', alpha: 0.6, timer: 1.2
                });
                // Double shockwave
                G.skillEffects.push({
                    type: 'shockwave', x: P.x, y: P.y,
                    radius: 5, maxRadius: hero.ultimate.range * 1.2, speed: 200,
                    color: '#ddaa44', alpha: 0.8, lineWidth: 4, timer: 0.5
                });
                G.skillEffects.push({
                    type: 'shockwave', x: P.x, y: P.y,
                    radius: 3, maxRadius: hero.ultimate.range * 0.7, speed: 150,
                    color: '#ffcc44', alpha: 0.5, lineWidth: 2, timer: 0.4
                });
                // 6 ground cracks
                for (let i = 0; i < 6; i++) {
                    G.skillEffects.push({
                        type: 'crack', x: P.x, y: P.y,
                        angle: (Math.PI * 2 / 6) * i + Math.random() * 0.3,
                        length: 0, maxLength: hero.ultimate.range * 0.6, speed: 150,
                        color: '#ddaa44', alpha: 0.6, timer: 0.5
                    });
                }
                spawnParticles(P.x, P.y, '#ddaa44', 25, 70);
                spawnParticles(P.x, P.y, '#ffcc44', 12, 45);
            }, 800);
            break;

        case 'phoenix_summon': // Mystic — SACRED PHOENIX: Inferno pillar + dual wings + ember spiral
            SFX.phoenixSummon();
            // Wide fire eruption pillar
            G.skillEffects.push({
                type: 'fire_pillar', x: P.x, y: P.y,
                width: 28, height: 0, maxHeight: 100, speed: 240,
                color: '#ff4400', alpha: 0.7, timer: 1.2
            });
            // Dual phoenix wing spread — bigger, brighter
            G.skillEffects.push({
                type: 'phoenix_wings', x: P.x, y: P.y - 25,
                spread: 0, maxSpread: 45, speed: 100,
                color: '#ff6600', alpha: 0.6, timer: 1.8
            });
            // Inner golden wings
            G.skillEffects.push({
                type: 'phoenix_wings', x: P.x, y: P.y - 20,
                spread: 0, maxSpread: 30, speed: 80,
                color: '#ffd700', alpha: 0.3, timer: 1.5
            });
            // 20 rising embers in spiral pattern
            for (let i = 0; i < 20; i++) {
                const spiralAngle = (Math.PI * 2 / 20) * i;
                G.skillEffects.push({
                    type: 'ember',
                    x: P.x + Math.cos(spiralAngle) * (5 + i),
                    y: P.y + Math.sin(spiralAngle) * (5 + i * 0.5),
                    vy: -(35 + Math.random() * 70),
                    vx: Math.cos(spiralAngle) * 15 + (Math.random() - 0.5) * 15,
                    color: ['#ffd700', '#ff8800', '#ff4400', '#ff2200'][i % 4],
                    alpha: 0.9, timer: 0.7 + Math.random() * 0.6,
                    size: 2 + Math.random() * 3
                });
            }
            // Ground fire ring
            G.skillEffects.push({
                type: 'fire_aura', x: P.x, y: P.y,
                radius: 30, color: '#ff4400', alpha: 0.3, timer: 1.0
            });
            // Shockwave on activation
            G.skillEffects.push({
                type: 'shockwave', x: P.x, y: P.y,
                radius: 5, maxRadius: 60, speed: 130,
                color: '#ff6600', alpha: 0.5, lineWidth: 3, timer: 0.5
            });
            G.sacredBeast = {
                type: 'phoenix', x: P.x, y: P.y - 30,
                angle: 0, affinity: 50,
                atkCd: 0, timer: hero.ultimate.duration,
                dmg: hero.ultimate.dmg
            };
            spawnParticles(P.x, P.y, '#ff4400', 20, 60);
            spawnParticles(P.x, P.y, '#ffd700', 15, 50);
            spawnParticles(P.x, P.y, '#ff8800', 10, 40);
            break;

        case 'shuriken_storm': // Ranger — SHURIKEN STORM: Whirlwind of homing shuriken
            SFX.ultimateActivate();
            if (typeof triggerFlash === 'function') triggerFlash('#88ff22', 0.15);
            if (typeof triggerChromatic === 'function') triggerChromatic(3);
            shake(4, 0.3);
            {
                const ult = hero.ultimate;
                const count = ult.count || 20;
                const duration = ult.duration || 4;
                // Wind cyclone VFX
                G.skillEffects.push({
                    type: 'shockwave', x: P.x, y: P.y,
                    radius: 5, maxRadius: 80, speed: 80,
                    color: '#88ff22', alpha: 0.4, lineWidth: 3, timer: duration
                });
                G.skillEffects.push({
                    type: 'fire_aura', x: P.x, y: P.y,
                    radius: 60, color: '#88ff22', alpha: 0.1, timer: duration, followPlayer: true
                });
                // Spawn homing shuriken over time
                for (let i = 0; i < count; i++) {
                    const delay = (duration / count) * i;
                    setTimeout(() => {
                        if (G.state !== 'PLAYING') return;
                        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
                        G.bullets.push({
                            x: P.x + Math.cos(angle) * 15, y: P.y + Math.sin(angle) * 15,
                            vx: Math.cos(angle) * 250, vy: Math.sin(angle) * 250,
                            dmg: ult.dmg * (1 + P.level * 0.12), el: P.element,
                            color: '#88ff22', life: 2.5, type: 'thrown_star', r: 4,
                            pierce: 2, spin: 0, spinSpeed: 15 + Math.random() * 8,
                            homing: true, homingTarget: null, homingStr: 4,
                            weaponId: 'shuriken_storm'
                        });
                        // Green spark per shuriken
                        spawnParticles(P.x + Math.cos(angle) * 15, P.y + Math.sin(angle) * 15, '#88ff22', 2, 15);
                    }, delay * 1000);
                }
                // Leaf burst
                for (let i = 0; i < 10; i++) {
                    G.skillEffects.push({
                        type: 'leaf', x: P.x, y: P.y,
                        vx: (Math.random() - 0.5) * 80,
                        vy: (Math.random() - 0.5) * 80,
                        rotation: Math.random() * Math.PI * 2,
                        rotSpeed: (Math.random() - 0.5) * 12,
                        color: i % 3 === 0 ? '#88ff22' : (i % 3 === 1 ? '#aacc44' : '#66cc00'),
                        alpha: 0.5, timer: 0.5 + Math.random() * 0.5, size: 2 + Math.random() * 2
                    });
                }
                spawnParticles(P.x, P.y, '#88ff22', 20, 60);
                spawnParticles(P.x, P.y, '#aacc44', 12, 40);
            }
            break;
    }
}

// --- AI Companion Update ---
function updateAllies(dt) {
    // Phase G: Calculate ally aura buffs
    G.allyAura = { dmgReduction: 0, atkSpd: 0, critBonus: 0 };
    let tankCount = 0, meleeCount = 0, rangedCount = 0;
    for (const ally of G.allies) {
        if (ally.hp <= 0) continue;
        if (ally.behavior === 'tank') tankCount++;
        else if (ally.behavior === 'melee') meleeCount++;
        else if (ally.behavior === 'ranged') rangedCount++;
    }
    // Diminishing returns: first ally = full, second = 50%
    if (tankCount > 0) G.allyAura.dmgReduction = 0.10 + (tankCount > 1 ? 0.05 : 0);
    if (meleeCount > 0) G.allyAura.atkSpd = 0.15 + (meleeCount > 1 ? 0.075 : 0);
    if (rangedCount > 0) G.allyAura.critBonus = 0.10 + (rangedCount > 1 ? 0.05 : 0);

    // Phase G: Morale decay — lose 1 morale every 5 seconds
    G.moraleDecayTimer = (G.moraleDecayTimer || 0) + dt;
    if (G.moraleDecayTimer >= 5) {
        G.moraleDecayTimer -= 5;
        G.morale = clamp((G.morale || 0) - 1, 0, 100);
    }

    // Phase H: Brotherhood cooldown tick
    if (G.brotherhoodCooldown > 0) {
        G.brotherhoodCooldown -= dt;
    }

    for (let i = G.allies.length - 1; i >= 0; i--) {
        const ally = G.allies[i];

        // Temp allies (necro undead) expire
        if (ally._tempTimer !== undefined) {
            ally._tempTimer -= dt;
            if (ally._tempTimer <= 0) {
                // Death poof
                spawnParticles(ally.x, ally.y, ally.color, 8, 30);
                G.allies.splice(i, 1);
                // Phase G: Morale loss on ally death
                G.morale = clamp((G.morale || 0) - 10, 0, 100);
                continue;
            }
        }

        // Phase G: War Cry buff tick-down
        if (ally._warCryBuff > 0) ally._warCryBuff -= dt;

        // Attack flash timer
        if (ally._atkFlash > 0) ally._atkFlash -= dt;

        if (ally.hp <= 0) {
            // Death effect on first frame of death
            if (!ally._deathPlayed) {
                ally._deathPlayed = true;
                spawnDeathExplosion(ally.x, ally.y, ally.color, '#ffaa44', 6);
                spawnParticles(ally.x, ally.y, ally.color, 10, 40);
                shake(1, 0.08);
                // Phase G: Morale loss on ally death
                G.morale = clamp((G.morale || 0) - 10, 0, 100);
            }
            ally.respawnTimer -= dt;
            if (ally.respawnTimer <= 0) {
                ally.hp = ally.maxHp;
                ally.x = P.x + rng(-30, 30);
                ally.y = P.y + rng(-30, 30);
                ally._deathPlayed = false;
                // Respawn burst
                spawnParticles(ally.x, ally.y, '#ffd700', 6, 25);
            }
            continue;
        }

        // Phase G: War Cry buff — enhanced speed/damage
        const warCryActive = ally._warCryBuff > 0;
        const allySpeedMult = warCryActive ? 1.2 : 1;
        const allyDmgMult = warCryActive ? 1.3 : 1;

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
                if (d > ally.range) {
                    ally.x += (dx / d) * ally.speed * allySpeedMult * dt;
                    ally.y += (dy / d) * ally.speed * allySpeedMult * dt;
                    // Footstep trail
                    if (Math.random() < 0.15) {
                        spawnParticles(ally.x, ally.y + 5, '#88776644', 1, 6);
                    }
                }
            } else if (ally.behavior === 'ranged') {
                if (d < 50) {
                    ally.x -= (dx / d) * ally.speed * allySpeedMult * dt;
                    ally.y -= (dy / d) * ally.speed * allySpeedMult * dt;
                } else if (d > 100) {
                    ally.x += (dx / d) * ally.speed * allySpeedMult * dt * 0.5;
                    ally.y += (dy / d) * ally.speed * allySpeedMult * dt * 0.5;
                }
            }

            // Attack
            ally.atkCd -= dt;
            if (ally.atkCd <= 0 && d < (ally.behavior === 'ranged' ? 120 : ally.range + 15)) {
                ally.atkCd = ally.atkRate;
                ally._atkFlash = 0.15; // Flash on attack
                const finalDmg = ally.dmg * allyDmgMult;
                if (ally.behavior === 'ranged') {
                    G.bullets.push({
                        x: ally.x, y: ally.y,
                        vx: (dx / d) * 100, vy: (dy / d) * 100,
                        dmg: finalDmg, el: P.element, life: 2, r: 3
                    });
                    spawnParticles(ally.x, ally.y, ally.color, 2, 12);
                } else {
                    damageEnemy(target, finalDmg, P.element);
                    spawnParticles(target.x, target.y, ally.color, 4, 25);
                    // Ally damage number
                    spawnDmgNum(target.x + rng(-3, 3), target.y - 10, Math.ceil(finalDmg), ally.color, false);
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
    }
}

// --- Draw Allies ---
function drawAllies() {
    G.allies.forEach(ally => {
        if (ally.hp <= 0) return;
        const sx = ally.x - G.camX + G.shakeX;
        const sy = ally.y - G.camY + G.shakeY;
        if (sx < -20 || sx > GAME_W + 20 || sy < -20 || sy > GAME_H + 20) return;

        // Glow aura
        ctx.globalAlpha = 0.15 + Math.sin(G.time * 3) * 0.08;
        ctx.fillStyle = ally.color;
        ctx.beginPath(); ctx.arc(sx, sy, 12, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        // Attack flash
        if (ally._atkFlash > 0) {
            ctx.globalAlpha = ally._atkFlash * 6;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(sx, sy, 9, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Body
        ctx.fillStyle = ally.color;
        ctx.fillRect(sx - 5, sy - 6, 10, 12);
        // Head
        ctx.fillStyle = '#ddc';
        ctx.fillRect(sx - 3, sy - 9, 6, 4);
        // Weapon indicator (colored by behavior)
        ctx.fillStyle = ally.behavior === 'ranged' ? '#4488ff' : '#ff8844';
        ctx.fillRect(sx + (ally.behavior === 'ranged' ? 5 : -7), sy - 3, 3, 6);

        // HP bar (gradient)
        const hpPct = ally.hp / ally.maxHp;
        ctx.fillStyle = '#222'; ctx.fillRect(sx - 8, sy - 13, 16, 3);
        const hpColor = hpPct > 0.6 ? '#44dd44' : hpPct > 0.3 ? '#ddaa44' : '#dd4444';
        ctx.fillStyle = hpColor; ctx.fillRect(sx - 8, sy - 13, 16 * hpPct, 3);
        ctx.strokeStyle = '#444'; ctx.lineWidth = 0.5; ctx.strokeRect(sx - 8, sy - 13, 16, 3);

        // Temp timer indicator (for necro undead)
        if (ally._tempTimer !== undefined) {
            const tPct = ally._tempTimer / 8;
            ctx.fillStyle = '#8844aa66'; ctx.fillRect(sx - 8, sy - 16, 16 * tPct, 2);
        }

        // Name
        drawText(ally.name, sx, sy + 9, { font: '6px monospace', fill: ally.color, align: 'center', outline: false });

        // Phase G: Ally Aura Ring (behavior type)
        const auraColors = { tank: '#4488ff', melee: '#ff6644', ranged: '#aa66ff' };
        const auraColor = auraColors[ally.behavior] || '#888888';
        ctx.strokeStyle = auraColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.25 + Math.sin(G.time * 4) * 0.15;
        ctx.beginPath();
        ctx.arc(sx, sy, 14 + Math.sin(G.time * 3) * 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Phase G: War Cry golden glow
        if (ally._warCryBuff > 0) {
            ctx.globalAlpha = 0.2 + Math.sin(G.time * 8) * 0.1;
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(sx, sy, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            // Golden sparkle particles
            if (Math.random() < 0.3) {
                spawnParticles(ally.x + rng(-6, 6), ally.y + rng(-6, 6), '#ffd700', 1, 10);
            }
        }
    });
}

// --- Sacred Beast Update (Data-Driven for all 4 beasts) ---
function updateSacredBeast(dt) {
    const beast = G.sacredBeast;
    if (!beast) return;

    beast.timer -= dt;
    if (beast.timer <= 0) { G.sacredBeast = null; return; }

    // Look up beast definition
    const def = (typeof SACRED_BEASTS !== 'undefined') ? SACRED_BEASTS[beast.type] : null;
    const behavior = def ? (def.behavior || 'orbit_shoot') : 'orbit_shoot';
    const colors = def ? def.colors : { body: '#ff4400', accent: '#ffd700', glow: '#ff8800' };
    const orbitR = def ? def.orbitRadius : 35;
    const orbitSpd = def ? def.orbitSpeed : 2.5;

    // Orbit player (all beasts orbit)
    beast.angle += orbitSpd * dt;
    beast.x = P.x + Math.cos(beast.angle) * orbitR;
    beast.y = P.y + Math.sin(beast.angle) * orbitR - 10;

    beast.atkCd -= dt;

    switch (behavior) {
        case 'orbit_shoot': // Phoenix — shoot fire bolts at nearest enemy
            if (beast.atkCd <= 0) {
                let nearest = null, minD = def ? def.attackRange : 120;
                G.enemies.forEach(e => {
                    if (e.dead) return;
                    const d = dist(beast, e);
                    if (d < minD) { minD = d; nearest = e; }
                });
                if (nearest) {
                    beast.atkCd = def ? def.attackRate : 1.8;
                    const dx = nearest.x - beast.x, dy = nearest.y - beast.y;
                    const d = Math.hypot(dx, dy) || 1;
                    G.bullets.push({
                        x: beast.x, y: beast.y,
                        vx: (dx / d) * (def ? def.boltSpeed : 130),
                        vy: (dy / d) * (def ? def.boltSpeed : 130),
                        dmg: beast.dmg || 12, el: def ? def.element : 'FIRE', life: 2, r: 4
                    });
                    spawnParticles(beast.x, beast.y, colors.body, 3, 20);
                }
            }
            break;

        case 'charge': // Azure Dragon — charge through enemies in a line
            if (beast.atkCd <= 0) {
                let target = null, minD = def.attackRange;
                G.enemies.forEach(e => {
                    if (e.dead) return;
                    const d = dist(beast, e);
                    if (d < minD) { minD = d; target = e; }
                });
                if (target) {
                    beast.atkCd = def.attackRate;
                    // Deal damage to all enemies in a line from beast to target
                    const dx = target.x - beast.x, dy = target.y - beast.y;
                    const lineLen = Math.hypot(dx, dy) || 1;
                    G.enemies.forEach(e => {
                        if (e.dead) return;
                        // Point-to-line distance check
                        const ex = e.x - beast.x, ey = e.y - beast.y;
                        const proj = Math.max(0, Math.min(lineLen, (ex * dx + ey * dy) / lineLen));
                        const closestX = (dx / lineLen) * proj, closestY = (dy / lineLen) * proj;
                        const distToLine = Math.hypot(ex - closestX, ey - closestY);
                        if (distToLine < (def.chargeWidth || 20)) {
                            e.hp -= beast.dmg;
                            e.flash = 0.15;
                            e.knockX += (dx / lineLen) * 8;
                            e.knockY += (dy / lineLen) * 8;
                            if (e.hp <= 0 && !e.dead) { if (typeof killEnemy === 'function') killEnemy(e); }
                        }
                    });
                    // Heal player (heal trail)
                    const healAmt = def.healTrail || 1;
                    P.hp = Math.min(P.hp + healAmt, P.maxHp);
                    if (Math.random() < 0.5) spawnDmgNum(P.x, P.y - 15, '+' + healAmt, '#44ff44', false);
                    // Charge VFX — line of particles
                    for (let i = 0; i < 8; i++) {
                        const t = i / 8;
                        spawnParticles(
                            beast.x + dx * t, beast.y + dy * t,
                            colors.accent, 1, 15
                        );
                    }
                    if (typeof SFX !== 'undefined' && SFX.dodge) SFX.dodge();
                }
            }
            break;

        case 'lunge': // White Tiger — lunge at strongest enemy, execute low HP
            if (beast.atkCd <= 0) {
                // Find strongest or nearest elite
                let target = null, maxHp = 0;
                G.enemies.forEach(e => {
                    if (e.dead) return;
                    const d = dist(beast, e);
                    if (d < def.attackRange) {
                        if (e.isElite || e.hp > maxHp) { maxHp = e.hp; target = e; }
                    }
                });
                if (!target) { // Fallback: nearest any
                    let minD = def.attackRange;
                    G.enemies.forEach(e => {
                        if (e.dead) return;
                        const d = dist(beast, e);
                        if (d < minD) { minD = d; target = e; }
                    });
                }
                if (target) {
                    beast.atkCd = def.attackRate;
                    const dmg = def.lungeDmg || 25;
                    target.hp -= dmg;
                    target.flash = 0.2;
                    // Execute check
                    const execThresh = def.executeThreshold || 0.10;
                    if (target.hp > 0 && target.hp <= target.maxHp * execThresh) {
                        target.hp = 0; // Execute!
                        spawnDmgNum(target.x, target.y - 10, '💀 EXECUTE', '#ffffff', true);
                    }
                    if (target.hp <= 0 && !target.dead) { if (typeof killEnemy === 'function') killEnemy(target); }
                    // Lunge VFX — tiger dash trail
                    const dx = target.x - beast.x, dy = target.y - beast.y;
                    for (let i = 0; i < 5; i++) {
                        spawnParticles(
                            beast.x + dx * (i / 5), beast.y + dy * (i / 5),
                            colors.accent, 2, 15
                        );
                    }
                    spawnParticles(target.x, target.y, colors.body, 5, 25);
                    if (typeof SFX !== 'undefined' && SFX.hit) SFX.hit();
                }
            }
            break;

        case 'shield': // Black Tortoise — orbits as shield, grants DR
            // Apply damage reduction (stored on beast, consumed by damage system)
            beast.shieldDR = def.dmgReduction || 0.15;
            // Shoot slow ice bolts
            if (beast.atkCd <= 0) {
                let nearest = null, minD = def.attackRange;
                G.enemies.forEach(e => {
                    if (e.dead) return;
                    const d = dist(beast, e);
                    if (d < minD) { minD = d; nearest = e; }
                });
                if (nearest) {
                    beast.atkCd = def.attackRate;
                    const dx = nearest.x - beast.x, dy = nearest.y - beast.y;
                    const d = Math.hypot(dx, dy) || 1;
                    G.bullets.push({
                        x: beast.x, y: beast.y,
                        vx: (dx / d) * def.boltSpeed, vy: (dy / d) * def.boltSpeed,
                        dmg: beast.dmg || 8, el: 'WATER', life: 2.5, r: 3,
                        slow: 0.3 // Slow on hit
                    });
                    spawnParticles(beast.x, beast.y, colors.accent, 2, 15);
                }
            }
            break;
    }

    // Trail particles (all beasts)
    if (Math.random() < 0.3) {
        spawnParticles(beast.x, beast.y, colors.glow, 1, 10);
    }
}

// --- Draw Sacred Beast (Data-Driven) ---
function drawSacredBeast() {
    const beast = G.sacredBeast;
    if (!beast) return;

    const sx = beast.x - G.camX + G.shakeX;
    const sy = beast.y - G.camY + G.shakeY;
    if (sx < -20 || sx > GAME_W + 20 || sy < -20 || sy > GAME_H + 20) return;

    const def = (typeof SACRED_BEASTS !== 'undefined') ? SACRED_BEASTS[beast.type] : null;
    const colors = def ? def.colors : { body: '#ff4400', accent: '#ffd700', glow: '#ff8800' };
    const beastType = beast.type || 'phoenix';

    // Outer glow (pulsing, per-beast color)
    ctx.globalAlpha = 0.2 + Math.sin(G.time * 5) * 0.1;
    ctx.fillStyle = colors.body;
    ctx.beginPath(); ctx.arc(sx, sy, 16, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.35 + Math.sin(G.time * 4) * 0.15;
    ctx.fillStyle = colors.glow;
    ctx.beginPath(); ctx.arc(sx, sy, 11, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    switch (beastType) {
        case 'phoenix':
            // Phoenix body (red-gold bird shape)
            ctx.fillStyle = colors.body;
            ctx.fillRect(sx - 5, sy - 4, 10, 8);
            ctx.fillStyle = colors.accent;
            ctx.fillRect(sx - 3, sy - 6, 6, 4);
            ctx.fillStyle = '#fff';
            ctx.fillRect(sx + 1, sy - 5, 1, 1);
            // Wings
            ctx.fillStyle = colors.glow;
            const wingFlap = Math.sin(G.time * 10) * 3;
            ctx.beginPath(); ctx.moveTo(sx - 5, sy); ctx.lineTo(sx - 12, sy - 3 + wingFlap); ctx.lineTo(sx - 8, sy + 2 + wingFlap * 0.5); ctx.fill();
            ctx.beginPath(); ctx.moveTo(sx + 5, sy); ctx.lineTo(sx + 12, sy - 3 - wingFlap); ctx.lineTo(sx + 8, sy + 2 - wingFlap * 0.5); ctx.fill();
            ctx.fillStyle = colors.accent;
            ctx.fillRect(sx - 13, sy - 4 + wingFlap, 3, 2);
            ctx.fillRect(sx + 10, sy - 4 - wingFlap, 3, 2);
            // Tail
            ctx.fillStyle = colors.glow;
            ctx.fillRect(sx - 2, sy + 4, 4, 4);
            ctx.fillStyle = colors.accent;
            ctx.fillRect(sx - 1, sy + 7, 2, 3);
            break;

        case 'azure_dragon':
            // Dragon — sinuous serpentine body with flowing tail
            const dragonWave = Math.sin(G.time * 6) * 4;
            // Body segments (snake-like in an S curve)
            ctx.fillStyle = colors.body;
            for (let i = 0; i < 6; i++) {
                const segOff = Math.sin(G.time * 6 + i * 0.8) * 3;
                ctx.fillRect(sx - 3 + i * 2 - 6, sy - 2 + segOff, 4, 5);
            }
            // Head (larger)
            ctx.fillStyle = colors.accent;
            ctx.fillRect(sx + 4, sy - 4 + dragonWave * 0.5, 6, 7);
            // Horns
            ctx.fillStyle = colors.body;
            ctx.fillRect(sx + 5, sy - 7 + dragonWave * 0.5, 2, 3);
            ctx.fillRect(sx + 8, sy - 7 + dragonWave * 0.5, 2, 3);
            // Eyes
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx + 6, sy - 2 + dragonWave * 0.5, 1, 1);
            ctx.fillRect(sx + 8, sy - 2 + dragonWave * 0.5, 1, 1);
            // Whiskers
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx + 10, sy + dragonWave * 0.5);
            ctx.lineTo(sx + 15, sy - 3 + dragonWave * 0.3);
            ctx.moveTo(sx + 10, sy + 2 + dragonWave * 0.5);
            ctx.lineTo(sx + 15, sy + 5 + dragonWave * 0.3);
            ctx.stroke();
            break;

        case 'white_tiger':
            // Tiger — prowling cat silhouette with animated legs
            const prowl = Math.sin(G.time * 8) * 2;
            // Body
            ctx.fillStyle = colors.body;
            ctx.fillRect(sx - 6, sy - 3, 12, 7);
            // Head
            ctx.fillStyle = colors.accent;
            ctx.fillRect(sx + 5, sy - 5, 6, 6);
            // Ears
            ctx.fillRect(sx + 5, sy - 7, 2, 3);
            ctx.fillRect(sx + 9, sy - 7, 2, 3);
            // Eyes (fierce red)
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(sx + 7, sy - 4, 1, 1);
            ctx.fillRect(sx + 9, sy - 4, 1, 1);
            // Stripes (3 dark stripes on body)
            ctx.fillStyle = '#666666';
            ctx.fillRect(sx - 3, sy - 2, 1, 5);
            ctx.fillRect(sx, sy - 2, 1, 5);
            ctx.fillRect(sx + 3, sy - 2, 1, 5);
            // Legs (animated)
            ctx.fillStyle = colors.body;
            ctx.fillRect(sx - 5, sy + 4, 2, 3 + prowl);
            ctx.fillRect(sx - 1, sy + 4, 2, 3 - prowl);
            ctx.fillRect(sx + 3, sy + 4, 2, 3 + prowl);
            // Tail
            ctx.fillRect(sx - 7, sy - 2, 3, 2);
            ctx.fillRect(sx - 9, sy - 4, 2, 3);
            break;

        case 'black_tortoise':
            // Tortoise — hexagonal shell with water ripple
            const shellPulse = Math.sin(G.time * 3) * 0.5;
            // Shell (hexagon-ish)
            ctx.fillStyle = colors.body;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i - Math.PI / 6;
                const r = 8 + shellPulse;
                const px = sx + Math.cos(a) * r;
                const py = sy + Math.sin(a) * r;
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath(); ctx.fill();
            // Shell line pattern
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx - 4, sy - 2); ctx.lineTo(sx + 4, sy - 2);
            ctx.moveTo(sx - 5, sy + 2); ctx.lineTo(sx + 5, sy + 2);
            ctx.moveTo(sx, sy - 8 - shellPulse); ctx.lineTo(sx, sy + 8 + shellPulse);
            ctx.stroke();
            // Head (poking out right)
            ctx.fillStyle = colors.accent;
            ctx.fillRect(sx + 8, sy - 2, 4, 4);
            // Eyes
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx + 10, sy - 1, 1, 1);
            // Legs (4 small)
            ctx.fillStyle = colors.body;
            ctx.fillRect(sx - 6, sy + 5, 2, 3);
            ctx.fillRect(sx + 4, sy + 5, 2, 3);
            ctx.fillRect(sx - 6, sy - 6, 2, 3);
            ctx.fillRect(sx + 4, sy - 6, 2, 3);
            // Water ripple effect
            ctx.globalAlpha = 0.15 + Math.sin(G.time * 4) * 0.1;
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 1;
            const ripR = 14 + Math.sin(G.time * 3) * 3;
            ctx.beginPath(); ctx.arc(sx, sy, ripR, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1;
            break;
    }

    // Trail particles (per-beast color)
    if (Math.random() < 0.4) {
        const side = Math.random() < 0.5 ? -1 : 1;
        spawnParticles(
            beast.x + side * 10 + rng(-2, 2),
            beast.y + rng(-2, 2),
            Math.random() < 0.5 ? colors.body : colors.accent, 1, 8
        );
    }

    // Timer display with background
    const timeLeft = Math.ceil(beast.timer);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(sx - 10, sy + 12, 20, 9);
    drawText(timeLeft + 's', sx, sy + 13, { font: 'bold 7px monospace', fill: colors.accent, align: 'center' });
}

// Extend drawHUD to include new elements
const _origDrawHUD = typeof drawHUD_orig === 'undefined' ? null : drawHUD_orig;

// Override drawGame to add musou bar, skill icons, and kill counter after existing HUD
const _origDrawGame = typeof drawGame === 'function' ? drawGame : null;

// ═══════════════════════════════════════════════════════════════
// K001: Room System HUD — Door Choices, Shop, Room Indicator
// ═══════════════════════════════════════════════════════════════

function drawRoomIndicator() {
    if (!G.roomsPerFloor) return;
    const x = GAME_W / 2, y = 14;
    const rt = ROOM_TYPES[G.roomType] || ROOM_TYPES.COMBAT;
    // Room progress pips
    const pipW = 10, pipGap = 3;
    const totalPipW = G.roomsPerFloor * (pipW + pipGap) - pipGap;
    const pipStartX = x - totalPipW / 2;

    for (let r = 1; r <= G.roomsPerFloor; r++) {
        const px = pipStartX + (r - 1) * (pipW + pipGap);
        ctx.fillStyle = r < G.room ? '#888888' : r === G.room ? rt.color : '#333333';
        ctx.globalAlpha = r === G.room ? 1.0 : 0.6;
        ctx.fillRect(px, y - 3, pipW, 6);
        if (r === G.room) {
            // Current room glow
            ctx.strokeStyle = rt.color;
            ctx.lineWidth = 1;
            ctx.strokeRect(px - 1, y - 4, pipW + 2, 8);
        }
    }
    ctx.globalAlpha = 1;

    drawText(rt.icon + ' ' + (rt.name[G.lang || 'vi']) + ' ' + G.room + '/' + G.roomsPerFloor,
        x, y + 10, { font: 'bold 8px monospace', fill: rt.color, align: 'center', outlineWidth: 2 });
}

// ============================================================
// L003: Victory Screen
// ============================================================
function drawVictoryScreen() {
    // Dark overlay with gold tint
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    const cx = GAME_W / 2;
    const t = G.time;

    // Gold border frame
    ctx.save();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.strokeRect(40, 30, GAME_W - 80, GAME_H - 60);
    ctx.restore();

    // Inner frame
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 36, GAME_W - 92, GAME_H - 72);

    // === Title ===
    const titleGlow = Math.sin(t * 3) * 0.3 + 0.7;
    ctx.save();
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 20 * titleGlow;

    // "RUN COMPLETE" with gold gradient
    drawText('⭐ RUN COMPLETE ⭐', cx, 65, {
        font: 'bold 22px monospace', fill: '#ffd700', align: 'center', outlineWidth: 3
    });
    ctx.restore();

    // Subtitle — hero name (HEROES is an array indexed by number, find by class)
    let heroName = G.selectedHero || 'WARRIOR';
    if (typeof HEROES !== 'undefined') {
        for (let i = 0; i < HEROES.length; i++) {
            if (HEROES[i] && HEROES[i].id === G.selectedHero) {
                heroName = HEROES[i].name;
                break;
            }
        }
    }
    drawText('— ' + heroName + ' —', cx, 88, {
        font: 'bold 10px monospace', fill: '#ffcc44', align: 'center', outlineWidth: 2
    });

    // === Run Time ===
    const mins = Math.floor(G.runTimer / 60);
    const secs = Math.floor(G.runTimer % 60);
    const timeStr = mins + ':' + (secs < 10 ? '0' : '') + secs;

    drawText('TIME: ' + timeStr, cx, 115, {
        font: 'bold 14px monospace', fill: '#ffffff', align: 'center', outlineWidth: 2
    });

    // === Stats Grid ===
    const statY = 145;
    const col1 = cx - 120;
    const col2 = cx + 20;
    const rowH = 22;

    const stats = [
        ['Tầng', (G.floor || 1) + ''],
        ['Phòng', (G.room || 1) + '/' + (G.roomsPerFloor || 6)],
        ['Kẻ Thù', (G.totalKills || G.score || 0) + ''],
        ['Wu Xing Combo', (G.comboCount || 0) + ''],
        ['Max Combo', (G.maxCombo || G.combo || 0) + ''],
        ['Blessings', (G.blessings ? G.blessings.length : 0) + ''],
        ['Gold', (G.gold || 0) + 'G'],
        ['Difficulty', (typeof DIFFICULTY_TIERS !== 'undefined' && DIFFICULTY_TIERS[G.difficulty])
            ? (DIFFICULTY_TIERS[G.difficulty].name[G.lang || 'vi'] || DIFFICULTY_TIERS[G.difficulty].name.en || DIFFICULTY_TIERS[G.difficulty].name) : 'Normal']
    ];

    for (let i = 0; i < stats.length; i++) {
        const col = i % 2 === 0 ? col1 : col2;
        const row = Math.floor(i / 2);
        const y = statY + row * rowH;

        // Label
        drawText(stats[i][0] + ':', col, y, {
            font: '9px monospace', fill: '#aaaaaa', align: 'left', outline: false
        });
        // Value
        drawText(stats[i][1], col + 100, y, {
            font: 'bold 10px monospace', fill: '#ffd700', align: 'left', outline: false
        });
    }

    // === Divider ===
    const divY = statY + Math.ceil(stats.length / 2) * rowH + 5;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, divY);
    ctx.lineTo(GAME_W - 80, divY);
    ctx.stroke();

    // === Element Affinity ===
    if (P && P.element) {
        const elDef = ELEMENTS[P.element] || ELEMENTS.METAL;
        drawText('元素: ' + (elDef.symbol || elDef.kanji || '') + ' ' + P.element, cx, divY + 18, {
            font: 'bold 10px monospace', fill: elDef.color, align: 'center', outlineWidth: 2
        });
    }

    // === Call to action ===
    const blink = Math.sin(t * 4) > 0;
    if (blink) {
        drawText('Press SPACE to continue (Endless Mode)', cx, GAME_H - 60, {
            font: '9px monospace', fill: '#ffd700', align: 'center', outlineWidth: 2
        });
    }
    drawText('Press ESC to return to menu', cx, GAME_H - 42, {
        font: '8px monospace', fill: '#888888', align: 'center', outline: false
    });

    // === Animated gold particles (decorative) ===
    ctx.save();
    for (let i = 0; i < 12; i++) {
        const px = 60 + Math.sin(t * 0.5 + i * 0.8) * (GAME_W / 2 - 60);
        const py = 40 + Math.cos(t * 0.3 + i * 1.1) * (GAME_H / 2 - 40);
        const size = 1 + Math.sin(t * 2 + i) * 0.5;
        ctx.globalAlpha = 0.3 + Math.sin(t * 2 + i * 0.7) * 0.2;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

// ============================================================
// L002: Minimap Radar
// ============================================================
function drawMinimap() {
    if (!G.showMinimap || G.state !== 'PLAYING') return;

    const MAP_SIZE = 76;
    const MAP_PAD = 6;
    const MAP_X = GAME_W - MAP_SIZE - MAP_PAD;
    const MAP_Y = 100; // Below floor/score/morale HUD elements
    const MAP_ALPHA = 0.55;

    ctx.save();
    ctx.globalAlpha = MAP_ALPHA;

    // Background circle
    ctx.beginPath();
    ctx.fillStyle = '#0a0a1a';
    ctx.strokeStyle = '#335588';
    ctx.lineWidth = 1.5;
    const cx = MAP_X + MAP_SIZE / 2;
    const cy = MAP_Y + MAP_SIZE / 2;
    const radius = MAP_SIZE / 2;
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Clip to circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
    ctx.clip();

    // Scale factor: arena → minimap
    const scaleX = MAP_SIZE / G.arenaW;
    const scaleY = MAP_SIZE / G.arenaH;
    const scale = Math.min(scaleX, scaleY);

    // Arena boundary (faint border)
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#446688';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(
        cx - (G.arenaW * scale) / 2,
        cy - (G.arenaH * scale) / 2,
        G.arenaW * scale,
        G.arenaH * scale
    );

    ctx.globalAlpha = MAP_ALPHA;

    // Helper: world pos → minimap pos (relative to player center)
    function toMap(wx, wy) {
        const relX = (wx - P.x) * scale;
        const relY = (wy - P.y) * scale;
        return { mx: cx + relX, my: cy + relY };
    }

    // Pickups (green=heal, yellow=gold, blue=xp, magenta=chest)
    for (const p of G.pickups) {
        const { mx, my } = toMap(p.x, p.y);
        if (Math.hypot(mx - cx, my - cy) > radius) continue;
        const pickColor = p.type === 'heal' ? '#44dd44' :
            p.type === 'gold' ? '#ffdd44' :
                p.type === 'xp' ? '#6688ff' : '#dd44dd';
        ctx.fillStyle = pickColor;
        ctx.fillRect(mx - 1, my - 1, 2, 2);
    }

    // Enemies (red, scaled by type)
    for (const e of G.enemies) {
        if (e.dead) continue;
        const { mx, my } = toMap(e.x, e.y);
        if (Math.hypot(mx - cx, my - cy) > radius) continue;

        const dotSize = e.type === 'finalboss' ? 6 :
            e.type === 'boss' ? 4 :
                e.type === 'officer' ? 2.5 :
                    e.type === 'elite' ? 2 : 1.2;
        const dotColor = e.type === 'finalboss' ? '#ffd700' :
            e.type === 'boss' ? '#ff2222' :
                e.type === 'officer' ? '#ff6644' :
                    e.type === 'elite' ? '#ff8844' : '#cc4444';

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(mx, my, dotSize, 0, Math.PI * 2);
        ctx.fill();
    }

    // Portal (cyan pulsing)
    if (G.portalActive && G.portal) {
        const { mx, my } = toMap(G.portal.x, G.portal.y);
        if (Math.hypot(mx - cx, my - cy) <= radius) {
            const pulse = Math.sin(G.time * 4) * 0.3 + 0.7;
            ctx.globalAlpha = MAP_ALPHA * pulse;
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(mx, my, 3, 0, Math.PI * 2);
            ctx.fill();

            // Portal ring
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(mx, my, 5 + Math.sin(G.time * 3) * 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = MAP_ALPHA;
        }
    }

    // Player dot (white, always center)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Player direction indicator
    const facing = P.facing || 1;
    const vx = P.vx || 0;
    const vy = P.vy || 0;
    if (Math.abs(vx) > 1 || Math.abs(vy) > 1) {
        const angle = Math.atan2(vy, vx);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 6, cy + Math.sin(angle) * 6);
        ctx.stroke();
    }

    // Compass ring (subtle)
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = '#668899';
    ctx.lineWidth = 0.5;
    // Cross-hairs
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    ctx.restore();

    // Label (outside clip)
    ctx.globalAlpha = 0.4;
    drawText('[M]', MAP_X + MAP_SIZE, MAP_Y + MAP_SIZE + 4,
        { font: '6px monospace', fill: '#668899', align: 'right', outline: false });
    ctx.globalAlpha = 1;
}

function drawDoorChoices() {
    if (G.roomState !== 'DOOR_CHOICE' || !G.doorChoices) return;
    const doors = G.doorChoices;

    // Darken background
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Title
    drawText('⛩ ' + (G.lang === 'en' ? 'CHOOSE YOUR PATH' : 'CHỌN CON ĐƯỜNG') + ' ⛩',
        GAME_W / 2, GAME_H / 2 - 80, { font: 'bold 14px monospace', fill: '#ffd700', align: 'center', outlineWidth: 3 });

    const doorW = 80, doorH = 100, gap = 20;
    const totalW = doors.length * doorW + (doors.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - doorH / 2;

    for (let i = 0; i < doors.length; i++) {
        const d = doors[i];
        const x = startX + i * (doorW + gap);
        const rt = ROOM_TYPES[d.type] || ROOM_TYPES.COMBAT;

        // Door frame
        const grad = ctx.createLinearGradient(x, startY, x, startY + doorH);
        grad.addColorStop(0, rt.color + '44');
        grad.addColorStop(1, '#111111');
        ctx.fillStyle = grad;
        ctx.fillRect(x, startY, doorW, doorH);

        // Border
        ctx.strokeStyle = rt.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, startY, doorW, doorH);

        // Door arch
        ctx.beginPath();
        ctx.arc(x + doorW / 2, startY + 15, doorW / 2 - 4, Math.PI, 0, false);
        ctx.strokeStyle = rt.color + '88';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Icon
        drawText(rt.icon, x + doorW / 2, startY + 35, { font: '18px serif', fill: '#ffffff', align: 'center' });
        // Name
        drawText(rt.name[G.lang || 'vi'], x + doorW / 2, startY + 58, { font: 'bold 9px monospace', fill: rt.color, align: 'center', outlineWidth: 2 });
        // Reward preview
        const rewardIcons = { xp: '⭐', weapon: '🗡️', gold: '💰', hp: '💚', item: '🎁', blessing: '✨', boss: '💀' };
        drawText(rewardIcons[d.reward] || '?', x + doorW / 2, startY + 78, { font: '14px serif', fill: '#ffffff', align: 'center' });
    }
}

function drawShopScreen() {
    if (G.state !== 'SHOP' || !G.shopItems) return;
    const items = G.shopItems;

    // Darken
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Title
    drawText('🛒 ' + (G.lang === 'en' ? 'SHOP' : 'CỬA HÀNG') + ' 🛒',
        GAME_W / 2, GAME_H / 2 - 65, { font: 'bold 14px monospace', fill: '#ffdd44', align: 'center', outlineWidth: 3 });

    // Gold display
    drawText('💰 ' + G.score, GAME_W / 2, GAME_H / 2 - 48, { font: 'bold 10px monospace', fill: '#ffd700', align: 'center', outlineWidth: 2 });

    const boxW = 120, boxH = 70, gap = 12;
    const totalW = items.length * boxW + (items.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 + 10;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const x = startX + i * (boxW + gap);
        const canAfford = G.score >= item.cost;

        // Card bg
        ctx.fillStyle = canAfford ? '#1a2a1a' : '#2a1a1a';
        ctx.fillRect(x, startY, boxW, boxH);
        ctx.strokeStyle = canAfford ? '#44dd44' : '#664444';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, startY, boxW, boxH);

        // Icon + name
        drawText(item.icon, x + boxW / 2, startY + 16, { font: '16px serif', fill: '#ffffff', align: 'center' });
        const name = typeof item.name === 'object' ? item.name[G.lang || 'vi'] : item.name;
        drawText(name, x + boxW / 2, startY + 34, { font: 'bold 8px monospace', fill: '#ffffff', align: 'center', outlineWidth: 2 });

        // Cost
        drawText('💰 ' + item.cost, x + boxW / 2, startY + 52, { font: 'bold 9px monospace', fill: canAfford ? '#ffd700' : '#ff4444', align: 'center', outlineWidth: 2 });
    }

    // Skip button
    const skipW = 100, skipH = 24;
    const skipX = GAME_W / 2 - skipW / 2, skipY = startY + boxH + 20;
    ctx.fillStyle = '#333333';
    ctx.fillRect(skipX, skipY, skipW, skipH);
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    ctx.strokeRect(skipX, skipY, skipW, skipH);
    drawText(G.lang === 'en' ? 'Skip ▶' : 'Bỏ qua ▶', GAME_W / 2, skipY + 15, { font: 'bold 9px monospace', fill: '#aaaaaa', align: 'center', outlineWidth: 2 });
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// P001: Purge Shrine — Remove an active blessing
// ═══════════════════════════════════════════════════════════════

function drawPurgeShrineScreen() {
    if (G.state !== 'PURGE_SHRINE') return;
    const blessings = (typeof BlessingState !== 'undefined') ? BlessingState.active : [];

    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(20, 0, 30, 0.85)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Title
    const titleY = 25;
    const title = G.lang === 'en' ? '⛩️ PURGE SHRINE ⛩️' : '⛩️ ĐỀN THANH TẨY ⛩️';
    const subtitle = G.lang === 'en' ? 'Select a blessing to REMOVE' : 'Chọn một phước lành để XÓA BỎ';
    drawText(title, GAME_W / 2, titleY, { font: 'bold 14px monospace', fill: '#aa44ff', align: 'center' });
    drawText(subtitle, GAME_W / 2, titleY + 16, { font: '9px monospace', fill: '#cc88ff', align: 'center' });

    // Store button areas for click handling
    G._purgeSlots = [];

    if (blessings.length === 0) {
        const noTxt = G.lang === 'en' ? 'No blessings to purge' : 'Không có phước lành để thanh tẩy';
        drawText(noTxt, GAME_W / 2, GAME_H / 2, { font: '10px monospace', fill: '#888', align: 'center' });
    } else {
        // Grid layout
        const cols = Math.min(3, blessings.length);
        const cardW = 90, cardH = 55, gap = 8;
        const totalW = cols * (cardW + gap) - gap;
        const startX = (GAME_W - totalW) / 2;
        const startY = titleY + 35;

        blessings.forEach((b, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cardW + gap);
            const y = startY + row * (cardH + gap);

            // Card background with purge-hover highlight
            const elementColors = { WOOD: '#228833', FIRE: '#cc4422', EARTH: '#aa8833', METAL: '#888899', WATER: '#2266aa' };
            const elColor = elementColors[b.deity] || '#555555';

            ctx.fillStyle = 'rgba(30, 10, 40, 0.9)';
            ctx.fillRect(x, y, cardW, cardH);

            // Border — element colored
            ctx.strokeStyle = elColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cardW, cardH);

            // Rarity indicator
            const rarityColors = { common: '#aaa', rare: '#44f', epic: '#c4f', cursed: '#f22' };
            ctx.fillStyle = rarityColors[b.rarity] || '#888';
            ctx.fillRect(x + 2, y + 2, cardW - 4, 3);

            // Icon
            drawText(b.icon || '✨', x + 12, y + 16, { font: '14px monospace', fill: '#fff', align: 'center' });

            // Name
            const name = b.name ? (b.name[G.lang || 'vi'] || b.name.vi || b.id) : b.id;
            drawText(name, x + 45, y + 14, { font: 'bold 7px monospace', fill: '#fff', align: 'center' });

            // Element + Level
            const lvTxt = 'Lv.' + (b.level || 1) + ' | ' + b.deity;
            drawText(lvTxt, x + 45, y + 26, { font: '6px monospace', fill: elColor, align: 'center' });

            // Description
            const desc = b.desc ? (b.desc[G.lang || 'vi'] || b.desc.vi || '') : '';
            if (desc) {
                drawText(desc.substring(0, 22), x + 45, y + 38, { font: '5px monospace', fill: '#aaa', align: 'center' });
            }

            // "❌" indicator
            drawText('❌', x + cardW - 10, y + 8, { font: '7px monospace', fill: '#ff4444', align: 'center' });

            // Store clickable area
            G._purgeSlots.push({ x, y, w: cardW, h: cardH, index: i });
        });
    }

    // Skip button
    const skipW = 100, skipH = 22;
    const skipX = (GAME_W - skipW) / 2;
    const skipY = GAME_H - 40;

    ctx.fillStyle = 'rgba(40, 20, 60, 0.9)';
    ctx.fillRect(skipX, skipY, skipW, skipH);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(skipX, skipY, skipW, skipH);

    const skipTxt = G.lang === 'en' ? '▷ Skip' : '▷ Bỏ qua';
    drawText(skipTxt, GAME_W / 2, skipY + 7, { font: 'bold 9px monospace', fill: '#888', align: 'center' });

    G._purgeSkipBtn = { x: skipX, y: skipY, w: skipW, h: skipH };
}

function handlePurgeShrineClick(mx, my) {
    if (G.state !== 'PURGE_SHRINE') return;

    // Check skip button
    if (G._purgeSkipBtn) {
        const s = G._purgeSkipBtn;
        if (mx >= s.x && mx <= s.x + s.w && my >= s.y && my <= s.y + s.h) {
            SFX.menuClick();
            G.state = 'PLAYING';
            G.roomState = 'DOOR_CHOICE';
            generateDoorChoices();
            return;
        }
    }

    // Check blessing slots
    if (G._purgeSlots) {
        for (const slot of G._purgeSlots) {
            if (mx >= slot.x && mx <= slot.x + slot.w && my >= slot.y && my <= slot.y + slot.h) {
                const blessing = BlessingState.active[slot.index];
                if (!blessing) return;

                // Remove the blessing
                const removed = BlessingState.active.splice(slot.index, 1)[0];

                // Recalculate element affinity
                if (removed.deity && BlessingState.affinity[removed.deity] > 0) {
                    BlessingState.affinity[removed.deity]--;
                }

                // Recalculate set bonuses and archetypes
                if (typeof checkSetBonuses === 'function') checkSetBonuses();
                if (typeof checkDuoBlessings === 'function') checkDuoBlessings();
                if (typeof checkArchetypes === 'function') checkArchetypes();

                // Purge VFX — purple dissolve particles
                spawnParticles(GAME_W / 2, GAME_H / 2, '#aa44ff', 25, 80);
                spawnParticles(GAME_W / 2, GAME_H / 2, '#cc88ff', 15, 60);
                if (typeof SFX !== 'undefined' && SFX.ultimateActivate) SFX.ultimateActivate();

                // Announce
                const purgedName = removed.name ? (removed.name[G.lang || 'vi'] || removed.name.vi || removed.id) : removed.id;
                const annText = G.lang === 'en' ? '⛩️ Purged: ' + purgedName : '⛩️ Đã thanh tẩy: ' + purgedName;
                G.floorAnnounce = { text: annText, timer: 2.0 };

                // Return to playing
                G.state = 'PLAYING';
                G.roomState = 'DOOR_CHOICE';
                generateDoorChoices();
                return;
            }
        }
    }
}

// K002: Wu Xing Blessing HUD — Choose & Display Active Blessings
// ═══════════════════════════════════════════════════════════════

function drawBlessingChoiceScreen() {
    if (G.state !== 'BLESSING_CHOICE' || !G.blessingChoices) return;
    const choices = G.blessingChoices;

    // Darken
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Title with elemental shimmer
    drawText('✨ ' + (G.lang === 'en' ? 'DIVINE BLESSING' : 'PHƯỚC LÀNH THẦN LINH') + ' ✨',
        GAME_W / 2, GAME_H / 2 - 75, { font: 'bold 14px monospace', fill: '#ffd700', align: 'center', outlineWidth: 3 });
    drawText(G.lang === 'en' ? 'Choose one blessing from the Five Elements' : 'Chọn một phước lành từ Ngũ Hành',
        GAME_W / 2, GAME_H / 2 - 58, { font: '8px monospace', fill: '#ccaa66', align: 'center', outlineWidth: 2 });

    const boxW = 130, boxH = 90, gap = 12;
    const totalW = choices.length * boxW + (choices.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 + 5;

    for (let i = 0; i < choices.length; i++) {
        const b = choices[i];
        const deity = WU_XING_DEITIES[b.deity];
        const x = startX + i * (boxW + gap);

        // Card background with element gradient
        const grad = ctx.createLinearGradient(x, startY, x, startY + boxH);
        grad.addColorStop(0, deity.color + '33');
        grad.addColorStop(0.6, '#111111');
        grad.addColorStop(1, deity.color + '22');
        ctx.fillStyle = grad;
        ctx.fillRect(x, startY, boxW, boxH);

        // Rarity border color
        const rarityColors = { common: '#aaaaaa', rare: '#4488ff', epic: '#cc44ff', cursed: '#ff2222' };
        ctx.strokeStyle = rarityColors[b.rarity] || '#aaaaaa';
        ctx.lineWidth = b.rarity === 'epic' ? 2.5 : b.rarity === 'rare' ? 2 : 1.5;
        ctx.strokeRect(x, startY, boxW, boxH);

        // Deity icon
        drawText(deity.icon, x + boxW / 2, startY + 18, { font: '16px serif', fill: deity.light, align: 'center' });

        // Deity name
        drawText(deity.name[G.lang || 'vi'], x + boxW / 2, startY + 34, { font: 'bold 7px monospace', fill: deity.color, align: 'center', outlineWidth: 2 });

        // Blessing name
        const bName = typeof b.name === 'object' ? b.name[G.lang || 'vi'] : b.name;
        drawText(bName, x + boxW / 2, startY + 48, { font: 'bold 8px monospace', fill: '#ffffff', align: 'center', outlineWidth: 2 });

        // Blessing desc (truncated)
        const bDesc = typeof b.desc === 'object' ? b.desc[G.lang || 'vi'] : b.desc;
        const shortDesc = bDesc.length > 25 ? bDesc.substring(0, 24) + '…' : bDesc;
        drawText(shortDesc, x + boxW / 2, startY + 62, { font: '6px monospace', fill: '#cccccc', align: 'center', outlineWidth: 1 });

        // Rarity tag
        const rarityLabels = { common: 'Thường', rare: 'Hiếm', epic: 'Sử Thi', cursed: '⚠ Nguyền Rủa' };
        const rarityLabelsEn = { common: 'Common', rare: 'Rare', epic: 'Epic', cursed: '⚠ CURSED' };
        const rLabel = G.lang === 'en' ? (rarityLabelsEn[b.rarity] || 'Common') : (rarityLabels[b.rarity] || 'Thường');
        drawText('[' + rLabel + ']', x + boxW / 2, startY + 78, { font: 'bold 7px monospace', fill: rarityColors[b.rarity] || '#aaa', align: 'center', outlineWidth: 2 });
    }
}

// N006: Stage Clear Blessing Screen
function drawBlessingSelectScreen() {
    if (G.state !== 'BLESSING_SELECT' || !G.blessingChoices) return;
    const choices = G.blessingChoices;

    // Darken background more for emphasis
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Dynamic Title
    const titleScale = 1 + Math.sin(G.time * 4) * 0.05;
    const titleColor = '#ffd700';

    const titleEn = 'STAGE CLEARED!';
    const titleVi = 'HOÀN THÀNH TẦNG!';
    drawText('🏆 ' + (G.lang === 'en' ? titleEn : titleVi) + ' 🏆',
        GAME_W / 2, GAME_H / 2 - 85, { font: `bold ${Math.floor(20 * titleScale)}px monospace`, fill: titleColor, align: 'center', outlineWidth: 4 });

    drawText(G.lang === 'en' ? 'The Heavens Grant You a Blessing' : 'Trời Ban Cho Bạn Phước Lành',
        GAME_W / 2, GAME_H / 2 - 62, { font: 'bold 10px monospace', fill: '#ccaa66', align: 'center', outlineWidth: 2 });

    const boxW = 130, boxH = 90, gap = 12;
    const totalW = choices.length * boxW + (choices.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 + 10;

    for (let i = 0; i < choices.length; i++) {
        const b = choices[i];
        const deity = WU_XING_DEITIES[b.deity];
        const x = startX + i * (boxW + gap);

        // Card background with element gradient
        const grad = ctx.createLinearGradient(x, startY, x, startY + boxH);
        grad.addColorStop(0, deity.color + '44');
        grad.addColorStop(0.6, '#111111');
        grad.addColorStop(1, deity.color + '22');
        ctx.fillStyle = grad;
        ctx.fillRect(x, startY, boxW, boxH);

        // Rarity border color
        const rarityColors = { common: '#aaaaaa', rare: '#4488ff', epic: '#cc44ff', cursed: '#ff2222' };
        ctx.strokeStyle = rarityColors[b.rarity] || '#aaaaaa';
        ctx.lineWidth = b.rarity === 'epic' ? 2.5 : b.rarity === 'rare' ? 2 : 1.5;
        ctx.strokeRect(x, startY, boxW, boxH);

        // Deity icon
        drawText(deity.icon, x + boxW / 2, startY + 18, { font: '16px serif', fill: deity.light, align: 'center' });

        // Deity name
        drawText(deity.name[G.lang || 'vi'], x + boxW / 2, startY + 34, { font: 'bold 7px monospace', fill: deity.color, align: 'center', outlineWidth: 2 });

        // Blessing name
        const bName = typeof b.name === 'object' ? b.name[G.lang || 'vi'] : b.name;
        drawText(bName, x + boxW / 2, startY + 48, { font: 'bold 8px monospace', fill: '#ffffff', align: 'center', outlineWidth: 2 });

        // Blessing desc (truncated)
        const bDesc = (b.desc && typeof b.desc === 'object') ? b.desc[G.lang || 'vi'] : (b.desc || '');
        const descStr = String(bDesc);
        const shortDesc = descStr.length > 25 ? descStr.substring(0, 24) + '…' : descStr;
        drawText(shortDesc, x + boxW / 2, startY + 62, { font: '6px monospace', fill: '#cccccc', align: 'center', outlineWidth: 1 });

        // Rarity tag
        const rarityLabels = { common: 'Thường', rare: 'Hiếm', epic: 'Sử Thi', cursed: '⚠ Nguyền Rủa' };
        const rarityLabelsEn = { common: 'Common', rare: 'Rare', epic: 'Epic', cursed: '⚠ CURSED' };
        const rLabel = G.lang === 'en' ? (rarityLabelsEn[b.rarity] || 'Common') : (rarityLabels[b.rarity] || 'Thường');
        drawText('[' + rLabel + ']', x + boxW / 2, startY + 78, { font: 'bold 7px monospace', fill: rarityColors[b.rarity] || '#aaa', align: 'center', outlineWidth: 2 });
    }
}

function drawActiveBlessings() {
    if (!BlessingState || !BlessingState.active || BlessingState.active.length === 0) return;
    const blessings = BlessingState.active;
    // Draw small icons in top-right
    const startX = GAME_W - 12, startY = 60;
    const size = 14, gap = 2;

    for (let i = 0; i < blessings.length && i < 8; i++) {
        const b = blessings[i];
        const deity = WU_XING_DEITIES[b.deity];
        const y = startY + i * (size + gap);

        // Background pill
        ctx.fillStyle = deity.color + '55';
        ctx.fillRect(startX - size, y - size / 2, size, size);
        ctx.strokeStyle = deity.color;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(startX - size, y - size / 2, size, size);

        // Icon
        drawText(deity.icon, startX - size / 2, y + 2, { font: '8px serif', fill: '#ffffff', align: 'center' });
    }

    // Show count if > 8
    if (blessings.length > 8) {
        drawText('+' + (blessings.length - 8), startX - size / 2, startY + 8 * (size + gap) + 4, { font: 'bold 7px monospace', fill: '#ffd700', align: 'center', outlineWidth: 1 });
    }
}

function drawRoomTransition() {
    if (!G.roomTransition || G.roomTransition <= 0) return;
    const alpha = Math.min(G.roomTransition * 2, 1);
    ctx.fillStyle = 'rgba(0,0,0,' + alpha + ')';
    ctx.fillRect(0, 0, GAME_W, GAME_H);
}

// ============================================================
// S003: HEIRLOOM RELIC CHOICE SCREEN
// ============================================================
function drawRelicChoiceScreen() {
    if (G.state !== 'RELIC_CHOICE' || !G.relicChoices) return;
    const choices = G.relicChoices;

    // Dark overlay with golden shimmer
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Title
    drawText('🏺 ' + (G.lang === 'en' ? 'HEIRLOOM RELIC' : 'BẢO VẬT GIA TRUYỀN') + ' 🏺',
        GAME_W / 2, GAME_H / 2 - 85, { font: 'bold 14px monospace', fill: '#ffd700', align: 'center', outlineWidth: 3 });
    drawText(G.lang === 'en' ? 'Choose one powerful relic (one per run)' : 'Chọn một bảo vật mạnh mẽ (một mỗi lần chơi)',
        GAME_W / 2, GAME_H / 2 - 68, { font: '8px monospace', fill: '#ccaa66', align: 'center', outlineWidth: 2 });

    const boxW = 135, boxH = 105, gap = 14;
    const totalW = choices.length * boxW + (choices.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 - 5;

    for (let i = 0; i < choices.length; i++) {
        const r = choices[i];
        const x = startX + i * (boxW + gap);

        // Card background with relic color gradient
        const grad = ctx.createLinearGradient(x, startY, x, startY + boxH);
        grad.addColorStop(0, (r.color || '#ffd700') + '33');
        grad.addColorStop(0.5, '#0a0a0a');
        grad.addColorStop(1, (r.color || '#ffd700') + '22');
        ctx.fillStyle = grad;
        ctx.fillRect(x, startY, boxW, boxH);

        // Golden legendary border
        ctx.strokeStyle = r.color || '#ffd700';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x, startY, boxW, boxH);
        // Inner glow
        ctx.strokeStyle = (r.color || '#ffd700') + '44';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, startY + 2, boxW - 4, boxH - 4);

        // Relic icon (large)
        drawText(r.icon || '🏺', x + boxW / 2, startY + 20, { font: '20px serif', fill: r.color || '#ffd700', align: 'center' });

        // Relic name
        const rName = typeof r.name === 'object' ? r.name[G.lang || 'vi'] : r.name;
        drawText(rName, x + boxW / 2, startY + 42, { font: 'bold 8px monospace', fill: '#ffffff', align: 'center', outlineWidth: 2 });

        // Relic description (two lines)
        const rDesc = typeof r.desc === 'object' ? r.desc[G.lang || 'vi'] : r.desc;
        if (rDesc.length > 28) {
            const mid = rDesc.lastIndexOf(' ', 28);
            const line1 = rDesc.substring(0, mid > 0 ? mid : 28);
            const line2 = rDesc.substring(mid > 0 ? mid + 1 : 28);
            drawText(line1, x + boxW / 2, startY + 58, { font: '6px monospace', fill: '#cccccc', align: 'center', outlineWidth: 1 });
            drawText(line2.length > 30 ? line2.substring(0, 29) + '…' : line2, x + boxW / 2, startY + 68, { font: '6px monospace', fill: '#cccccc', align: 'center', outlineWidth: 1 });
        } else {
            drawText(rDesc, x + boxW / 2, startY + 60, { font: '6px monospace', fill: '#cccccc', align: 'center', outlineWidth: 1 });
        }

        // Rarity tag
        drawText('[LEGENDARY]', x + boxW / 2, startY + 85, { font: 'bold 7px monospace', fill: '#ffd700', align: 'center', outlineWidth: 2 });

        // Number key hint
        drawText('[' + (i + 1) + ']', x + boxW / 2, startY + 96, { font: '7px monospace', fill: '#888', align: 'center', outlineWidth: 1 });
    }

    // Instructions
    drawText(G.lang === 'en' ? 'Click to select or press 1/2/3' : 'Click để chọn hoặc nhấn 1/2/3',
        GAME_W / 2, GAME_H - 12, { font: '7px monospace', fill: '#666', align: 'center' });
}

function handleRelicChoiceClick(mx, my) {
    if (G.state !== 'RELIC_CHOICE' || !G.relicChoices) return;
    const choices = G.relicChoices;

    const boxW = 135, boxH = 105, gap = 14;
    const totalW = choices.length * boxW + (choices.length - 1) * gap;
    const startX = (GAME_W - totalW) / 2;
    const startY = GAME_H / 2 - boxH / 2 - 5;

    for (let i = 0; i < choices.length; i++) {
        const x = startX + i * (boxW + gap);
        if (mx >= x && mx <= x + boxW && my >= startY && my <= startY + boxH) {
            // Selected this relic!
            if (typeof equipRelic === 'function') {
                equipRelic(choices[i].id);
            }
            G.relicChoices = null;
            G.state = 'VICTORY';
            G.victoryTimer = 5;
            if (typeof SFX !== 'undefined' && SFX.menuClick) SFX.menuClick();
            return;
        }
    }
}

// Keyboard support for relic choice (1/2/3 keys)
window.addEventListener('keydown', function (e) {
    if (G.state !== 'RELIC_CHOICE' || !G.relicChoices) return;
    const idx = parseInt(e.key) - 1;
    if (idx >= 0 && idx < G.relicChoices.length) {
        if (typeof equipRelic === 'function') {
            equipRelic(G.relicChoices[idx].id);
        }
        G.relicChoices = null;
        G.state = 'VICTORY';
        G.victoryTimer = 5;
        if (typeof SFX !== 'undefined' && SFX.menuClick) SFX.menuClick();
    }
});
