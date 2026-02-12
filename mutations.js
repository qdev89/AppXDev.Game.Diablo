// ============================================================
// DYNASTY BRUHHH DUNGEON - Wu Xing Mutation System (R001)
// ============================================================
// When gaining a blessing of the NEXT element in the generating
// cycle, existing blessings of the PREVIOUS element MUTATE into
// evolved, more powerful versions. OUR KILLER FEATURE.
// ============================================================

// --- Wu Xing Mutation Recipes ---
// Key: originalBlessingId → object keyed by triggerElement
const WU_XING_MUTATIONS = {
    // ═══ WOOD blessings mutate when FIRE is gained (Wood feeds Fire) ═══
    'wood_heal_on_kill': {
        FIRE: {
            id: 'mut_phoenix_rebirth', deity: 'WOOD', rarity: 'epic', isMutation: true,
            name: { vi: 'Phượng Hoàng Tái Sinh', en: 'Phoenix Rebirth' },
            desc: { vi: 'Hồi 5 HP khi hạ gục + đốt kẻ thù gần', en: 'Heal 5 HP on kill + burn nearby enemies' },
            icon: '🌿🔥', effect: { type: 'heal_on_kill', value: 5, burnAoe: true, burnDps: 4, burnRadius: 50 }
        }
    },
    'wood_thorns': {
        FIRE: {
            id: 'mut_blazing_thorns', deity: 'WOOD', rarity: 'epic', isMutation: true,
            name: { vi: 'Gai Lửa', en: 'Blazing Thorns' },
            desc: { vi: 'Phản 25% sát thương + đốt kẻ tấn công', en: 'Reflect 25% + burn attackers' },
            icon: '🌿🔥', effect: { type: 'thorns', value: 0.25, burnAttackers: true, burnDps: 3, burnDuration: 2 }
        }
    },
    'wood_regen': {
        FIRE: {
            id: 'mut_phoenix_breath', deity: 'WOOD', rarity: 'epic', isMutation: true,
            name: { vi: 'Hơi Thở Phượng', en: 'Phoenix Breath' },
            desc: { vi: 'Hồi 2 HP mỗi 2 giây + aura lửa nhỏ', en: 'Regen 2 HP/2s + small fire aura' },
            icon: '🌿🔥', effect: { type: 'regen', value: 2, interval: 2, fireAura: true, fireAuraDps: 3, fireAuraRadius: 30 }
        }
    },
    'wood_poison': {
        FIRE: {
            id: 'mut_napalm_vine', deity: 'WOOD', rarity: 'epic', isMutation: true,
            name: { vi: 'Dây Leo Napalm', en: 'Napalm Vine' },
            desc: { vi: 'Độc + cháy đồng thời (6 DPS tổng)', en: 'Poison + burn simultaneously (6 DPS total)' },
            icon: '🌿🔥', effect: { type: 'poison', dps: 3, duration: 4, burnDps: 3, burnDuration: 4, dualDot: true }
        }
    },
    'wood_max_hp': {
        FIRE: {
            id: 'mut_immortal_pyre', deity: 'WOOD', rarity: 'epic', isMutation: true,
            name: { vi: 'Giàn Thiêu Bất Tử', en: 'Immortal Pyre' },
            desc: { vi: '+60 HP tối đa, hồi đầy, nổ AoE khi hồi đầy', en: '+60 Max HP, full heal, fire burst on full HP' },
            icon: '🌿🔥', effect: { type: 'max_hp_boost', value: 60, fullHeal: true, fireBurstOnFull: true }
        }
    },

    // ═══ FIRE blessings mutate when EARTH is gained (Fire creates Earth) ═══
    'fire_bonus_dmg': {
        EARTH: {
            id: 'mut_magma_core', deity: 'FIRE', rarity: 'epic', isMutation: true,
            name: { vi: 'Lõi Dung Nham', en: 'Magma Core' },
            desc: { vi: '+30% sát thương + kẻ chết để lại vùng cháy', en: '+30% dmg + enemies leave scorched earth on death' },
            icon: '🔥⛰️', effect: { type: 'dmg_mult', value: 0.30, scorchedOnKill: true }
        }
    },
    'fire_burn': {
        EARTH: {
            id: 'mut_lava_touch', deity: 'FIRE', rarity: 'epic', isMutation: true,
            name: { vi: 'Chạm Dung Nham', en: 'Lava Touch' },
            desc: { vi: 'Cháy 8 DPS + choáng 0.5 giây', en: 'Burn 8 DPS + 0.5s stun on apply' },
            icon: '🔥⛰️', effect: { type: 'burn', dps: 8, duration: 3, stunOnApply: 0.5 }
        }
    },
    'fire_explosion': {
        EARTH: {
            id: 'mut_volcanic_detonation', deity: 'FIRE', rarity: 'epic', isMutation: true,
            name: { vi: 'Nổ Núi Lửa', en: 'Volcanic Detonation' },
            desc: { vi: '25% nổ AoE khi hạ gục + để lại dung nham', en: '25% AoE explosion on kill + leave lava pool' },
            icon: '🔥⛰️', effect: { type: 'explosion_on_kill', chance: 0.25, radius: 80, dmg: 30, lavaPool: true }
        }
    },
    'fire_crit': {
        EARTH: {
            id: 'mut_seismic_strike', deity: 'FIRE', rarity: 'epic', isMutation: true,
            name: { vi: 'Chấn Kích', en: 'Seismic Strike' },
            desc: { vi: '+20% chí mạng + chí mạng gây sóng chấn AoE', en: '+20% crit + crits create shockwave' },
            icon: '🔥⛰️', effect: { type: 'crit_chance', value: 0.20, critShockwave: true, shockwaveRadius: 60, shockwaveDmg: 10 }
        }
    },
    'fire_inferno': {
        EARTH: {
            id: 'mut_molten_fortress', deity: 'FIRE', rarity: 'epic', isMutation: true,
            name: { vi: 'Pháo Đài Nóng Chảy', en: 'Molten Fortress' },
            desc: { vi: 'Aura lửa 12 DPS + giảm 10% sát thương nhận', en: 'Fire aura 12 DPS + -10% dmg taken' },
            icon: '🔥⛰️', effect: { type: 'fire_aura', dps: 12, radius: 60, dmgReduction: 0.10 }
        }
    },

    // ═══ EARTH blessings mutate when METAL is gained (Earth bears Metal) ═══
    'earth_armor': {
        METAL: {
            id: 'mut_ironclad', deity: 'EARTH', rarity: 'epic', isMutation: true,
            name: { vi: 'Thiết Giáp', en: 'Ironclad' },
            desc: { vi: '-20% sát thương + phản 10% thành Metal', en: '-20% dmg + reflect 10% as Metal damage' },
            icon: '⛰️⚔️', effect: { type: 'dmg_reduction', value: 0.20, metalReflect: 0.10 }
        }
    },
    'earth_stun': {
        METAL: {
            id: 'mut_iron_fist', deity: 'EARTH', rarity: 'epic', isMutation: true,
            name: { vi: 'Thiết Quyền', en: 'Iron Fist' },
            desc: { vi: '15% choáng 1.5s + chảy máu khi choáng', en: '15% stun 1.5s + bleed on stunned enemies' },
            icon: '⛰️⚔️', effect: { type: 'stun_chance', chance: 0.15, duration: 1.5, bleedOnStun: true, bleedDps: 5 }
        }
    },
    'earth_shield': {
        METAL: {
            id: 'mut_steel_barrier', deity: 'EARTH', rarity: 'epic', isMutation: true,
            name: { vi: 'Rào Thép', en: 'Steel Barrier' },
            desc: { vi: 'Hấp thụ 2 đòn mỗi 15 giây + phản đòn', en: 'Absorb 2 hits/15s + counter attack' },
            icon: '⛰️⚔️', effect: { type: 'shield', interval: 15, hits: 2, counterDmg: 15 }
        }
    },
    'earth_knockback': {
        METAL: {
            id: 'mut_battering_ram', deity: 'EARTH', rarity: 'epic', isMutation: true,
            name: { vi: 'Phá Thành', en: 'Battering Ram' },
            desc: { vi: '+75% lực đẩy + kẻ thù bị đẩy va chạm gây sát thương', en: '+75% knockback + pushed enemies damage others on collision' },
            icon: '⛰️⚔️', effect: { type: 'knockback_mult', value: 0.75, collisionDmg: true }
        }
    },
    'earth_fortress': {
        METAL: {
            id: 'mut_adamantine_citadel', deity: 'EARTH', rarity: 'epic', isMutation: true,
            name: { vi: 'Thành Kim Cương', en: 'Adamantine Citadel' },
            desc: { vi: '+50 HP, -30% sát thương, phản 5% sát thương Metal', en: '+50 HP, -30% dmg, 5% Metal reflect' },
            icon: '⛰️⚔️', effect: { type: 'fortress', hpBoost: 50, dmgReduction: 0.30, metalReflect: 0.05 }
        }
    },

    // ═══ METAL blessings mutate when WATER is gained (Metal collects Water) ═══
    'metal_speed': {
        WATER: {
            id: 'mut_mercury_blade', deity: 'METAL', rarity: 'epic', isMutation: true,
            name: { vi: 'Kiếm Thủy Ngân', en: 'Mercury Blade' },
            desc: { vi: '+20% tốc độ + tấn công gây chậm 20%', en: '+20% speed + attacks slow enemies 20%' },
            icon: '⚔️🌊', effect: { type: 'speed_mult', value: 0.20, applySlow: 0.20 }
        }
    },
    'metal_pierce': {
        WATER: {
            id: 'mut_riptide_lance', deity: 'METAL', rarity: 'epic', isMutation: true,
            name: { vi: 'Thương Thủy Triều', en: 'Riptide Lance' },
            desc: { vi: 'Xuyên +2 + để lại vệt nước làm chậm', en: 'Pierce +2 + leave water trail that slows' },
            icon: '⚔️🌊', effect: { type: 'pierce', value: 2, waterTrail: true }
        }
    },
    'metal_bleed': {
        WATER: {
            id: 'mut_tidal_bleed', deity: 'METAL', rarity: 'epic', isMutation: true,
            name: { vi: 'Chảy Máu Thủy Triều', en: 'Tidal Hemorrhage' },
            desc: { vi: 'Chảy máu 6 DPS + hút 20% máu chảy', en: 'Bleed 6 DPS + leech 20% of bleed damage' },
            icon: '⚔️🌊', effect: { type: 'bleed', dps: 6, duration: 4, bleedLeech: 0.20 }
        }
    },
    'metal_attack_speed': {
        WATER: {
            id: 'mut_flowing_steel', deity: 'METAL', rarity: 'epic', isMutation: true,
            name: { vi: 'Thép Chảy', en: 'Flowing Steel' },
            desc: { vi: '+30% tốc đánh + mỗi 5 đánh gây sóng AoE', en: '+30% atk speed + every 5th hit creates wave' },
            icon: '⚔️🌊', effect: { type: 'attack_speed', value: 0.30, waveEveryN: 5, waveDmg: 15, waveRadius: 50 }
        }
    },
    'metal_execute': {
        WATER: {
            id: 'mut_drowning_verdict', deity: 'METAL', rarity: 'epic', isMutation: true,
            name: { vi: 'Phán Quyết Chìm Đắm', en: 'Drowning Verdict' },
            desc: { vi: 'Xử tử dưới 20% HP + hồi 10 HP khi xử tử', en: 'Execute <20% HP + heal 10 HP on execute' },
            icon: '⚔️🌊', effect: { type: 'execute_threshold', value: 0.20, executeHeal: 10 }
        }
    },

    // ═══ WATER blessings mutate when WOOD is gained (Water nourishes Wood) ═══
    'water_slow': {
        WOOD: {
            id: 'mut_frozen_garden', deity: 'WATER', rarity: 'epic', isMutation: true,
            name: { vi: 'Vườn Đóng Băng', en: 'Frozen Garden' },
            desc: { vi: 'Chậm 40% + kẻ chậm bị rễ cây ghim (đứng yên 1s)', en: 'Slow 40% + slowed enemies get rooted (immobilize 1s)' },
            icon: '🌊🌿', effect: { type: 'slow', value: 0.40, rootChance: 0.15, rootDuration: 1 }
        }
    },
    'water_lifesteal': {
        WOOD: {
            id: 'mut_natures_embrace', deity: 'WATER', rarity: 'epic', isMutation: true,
            name: { vi: 'Ôm Ấp Thiên Nhiên', en: "Nature's Embrace" },
            desc: { vi: 'Hút 8% máu + hồi thêm 2 HP/hạ gục', en: 'Leech 8% + extra 2 HP on kill' },
            icon: '🌊🌿', effect: { type: 'lifesteal', value: 0.08, bonusHealOnKill: 2 }
        }
    },
    'water_freeze': {
        WOOD: {
            id: 'mut_permafrost_bloom', deity: 'WATER', rarity: 'epic', isMutation: true,
            name: { vi: 'Nở Hoa Băng Giá', en: 'Permafrost Bloom' },
            desc: { vi: '12% đóng băng 3s + kẻ đông cứng rơi HP orb khi chết', en: '12% freeze 3s + frozen enemies drop HP on death' },
            icon: '🌊🌿', effect: { type: 'freeze_chance', chance: 0.12, duration: 3, hpOrbOnFrozenKill: true }
        }
    },
    'water_wave': {
        WOOD: {
            id: 'mut_monsoon_harvest', deity: 'WATER', rarity: 'epic', isMutation: true,
            name: { vi: 'Mùa Gió Mùa', en: 'Monsoon Harvest' },
            desc: { vi: 'Sóng 12s, 100 sát thương + hồi 5 HP mỗi sóng', en: 'Wave every 12s, 100 dmg + heal 5 HP per wave' },
            icon: '🌊🌿', effect: { type: 'tidal_wave', interval: 12, dmg: 100, radius: 140, healOnWave: 5 }
        }
    },
    'water_ice_armor': {
        WOOD: {
            id: 'mut_living_glacier', deity: 'WATER', rarity: 'epic', isMutation: true,
            name: { vi: 'Băng Hà Sống', en: 'Living Glacier' },
            desc: { vi: 'Đông kẻ tấn công 1.5s, -25% dmg, hồi 1 HP khi bị đánh', en: 'Freeze attackers 1.5s, -25% dmg, heal 1 HP when hit' },
            icon: '🌊🌿', effect: { type: 'ice_armor', freezeDuration: 1.5, dmgReduction: 0.25, healOnHit: 1 }
        }
    }
};

// --- Mutation State ---
window.MutationState = {
    mutatedIds: [],     // IDs of blessings that have already mutated
    mutationLog: [],    // Log: [{from, to, element, timestamp}]
    mutationPopup: null // {name, desc, timer} for display
};

function resetMutations() {
    window.MutationState.mutatedIds = [];
    window.MutationState.mutationLog = [];
    window.MutationState.mutationPopup = null;
}

// --- Check and Apply Mutations ---
// Called when a new blessing is added
function checkMutations(newBlessing) {
    const newElement = newBlessing.deity;
    // What element is GENERATED BY (previous in cycle)?
    // GENERATING: WOOD→FIRE, FIRE→EARTH, etc.
    // So if newElement is FIRE, the previous is WOOD
    const generatingPrev = {
        FIRE: 'WOOD', EARTH: 'FIRE', METAL: 'EARTH',
        WATER: 'METAL', WOOD: 'WATER'
    };
    const prevElement = generatingPrev[newElement];
    if (!prevElement) return;

    // Find active blessings of the previous element that haven't mutated yet
    const toMutate = [];
    for (const blessing of window.BlessingState.active) {
        if (blessing.deity !== prevElement) continue;
        if (blessing.isMutation) continue; // Already a mutation
        if (window.MutationState.mutatedIds.includes(blessing.id)) continue;

        const mutationDef = WU_XING_MUTATIONS[blessing.id];
        if (mutationDef && mutationDef[newElement]) {
            toMutate.push({ original: blessing, mutation: mutationDef[newElement] });
        }
    }

    // Apply all mutations
    for (const { original, mutation } of toMutate) {
        // Replace the blessing in the active list
        const idx = window.BlessingState.active.findIndex(b => b.id === original.id);
        if (idx === -1) continue;

        // Deep copy mutation def
        const mutated = JSON.parse(JSON.stringify(mutation));
        // Preserve level if blessing was stacked
        if (original.level) mutated.level = original.level;

        window.BlessingState.active[idx] = mutated;
        window.MutationState.mutatedIds.push(original.id);

        // Log
        window.MutationState.mutationLog.push({
            from: original.id,
            to: mutated.id,
            element: newElement,
            timestamp: G.time
        });

        // VFX
        mutationVFX(mutated);
    }
}

// --- Mutation Visual Effects ---
function mutationVFX(mutatedBlessing) {
    // Flash
    if (typeof triggerFlash === 'function') triggerFlash('#aa44ff', 0.4);
    if (typeof triggerChromatic === 'function') triggerChromatic(2);
    if (typeof shake === 'function') shake(4, 0.25);

    // Particles
    if (typeof spawnParticles === 'function') {
        spawnParticles(P.x, P.y, '#aa44ff', 20, 80);
        spawnParticles(P.x, P.y, '#ffd700', 15, 60);
        spawnParticles(P.x, P.y, '#ffffff', 10, 40);
    }

    // Damage number
    if (typeof spawnDmgNum === 'function') {
        spawnDmgNum(P.x, P.y - 50, '⚡ MUTATION! ⚡', '#ffd700', true);
    }

    // Popup
    window.MutationState.mutationPopup = {
        name: mutatedBlessing.name[G.lang || 'vi'],
        desc: mutatedBlessing.desc[G.lang || 'vi'],
        icon: mutatedBlessing.icon || '⚡',
        timer: 3.5,
        color: '#aa44ff'
    };

    // Sound
    if (typeof SFX !== 'undefined' && SFX.levelUp) SFX.levelUp();
    if (typeof SFX !== 'undefined' && SFX.combo50) SFX.combo50();
}

// --- Update Mutation Popup ---
function updateMutationPopup(dt) {
    if (window.MutationState.mutationPopup) {
        window.MutationState.mutationPopup.timer -= dt;
        if (window.MutationState.mutationPopup.timer <= 0) {
            window.MutationState.mutationPopup = null;
        }
    }
}

// --- Draw Mutation Popup ---
function drawMutationPopup() {
    const mp = window.MutationState.mutationPopup;
    if (!mp) return;

    const alpha = Math.min(mp.timer, 1);
    ctx.save();
    ctx.globalAlpha = alpha;

    // Background
    const bw = 280, bh = 70;
    const bx = (GAME_W - bw) / 2, by = GAME_H * 0.12;

    // Glowing border
    ctx.shadowColor = '#aa44ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(30, 10, 60, 0.92)';
    ctx.fillRect(bx, by, bw, bh);

    // Gold border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Inner glow
    ctx.strokeStyle = 'rgba(170, 68, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

    ctx.shadowBlur = 0;

    // Title
    if (typeof drawText === 'function') {
        drawText('⚡ WU XING MUTATION ⚡', GAME_W / 2, by + 10, {
            font: 'bold 11px monospace', fill: '#ffd700', align: 'center'
        });
        drawText(mp.icon + ' ' + mp.name, GAME_W / 2, by + 28, {
            font: 'bold 10px monospace', fill: '#ffffff', align: 'center'
        });
        drawText(mp.desc, GAME_W / 2, by + 46, {
            font: '8px monospace', fill: '#ccaaff', align: 'center'
        });
    }

    ctx.restore();
}
