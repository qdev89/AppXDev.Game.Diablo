// ============================================================
// DYNASTY BRUHHH DUNGEON - Sound System (Web Audio API)
// ============================================================

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let audioEnabled = false;

function initAudio() {
    if (audioCtx) return;
    try {
        audioCtx = new AudioCtx();
        audioEnabled = true;
    } catch (e) { audioEnabled = false; }
}

// Initialize on first user interaction
document.addEventListener('click', () => initAudio(), { once: true });
document.addEventListener('touchstart', () => initAudio(), { once: true });

// --- Oscillator-based SFX (no assets needed) ---
function playNote(freq, dur = 0.1, type = 'square', vol = 0.15, delay = 0) {
    if (!audioEnabled || !audioCtx) return;
    try {
        const t = audioCtx.currentTime + delay;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.05);
    } catch (e) { }
}

function playNoise(dur = 0.08, vol = 0.1) {
    if (!audioEnabled || !audioCtx) return;
    try {
        const bufferSize = audioCtx.sampleRate * dur;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        const gain = audioCtx.createGain();
        src.buffer = buffer;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        src.connect(gain);
        gain.connect(audioCtx.destination);
        src.start();
    } catch (e) { }
}

// --- Game Sound Effects ---
const SFX = {
    hit() { playNote(220, 0.06, 'sawtooth', 0.12); playNoise(0.04, 0.08); },
    kill() { playNote(440, 0.08, 'square', 0.1); playNote(660, 0.1, 'square', 0.08, 0.05); },
    playerHit() { playNote(110, 0.15, 'sawtooth', 0.15); playNoise(0.1, 0.1); },
    xpPickup() { playNote(880, 0.05, 'sine', 0.08); playNote(1100, 0.05, 'sine', 0.06, 0.04); },
    goldPickup() { playNote(1200, 0.06, 'triangle', 0.1); playNote(1500, 0.06, 'triangle', 0.08, 0.05); },
    hpPickup() { playNote(440, 0.1, 'sine', 0.1); playNote(550, 0.1, 'sine', 0.08, 0.08); playNote(660, 0.12, 'sine', 0.06, 0.16); },
    levelUp() {
        playNote(523, 0.12, 'triangle', 0.15);
        playNote(659, 0.12, 'triangle', 0.12, 0.1);
        playNote(784, 0.12, 'triangle', 0.1, 0.2);
        playNote(1047, 0.2, 'triangle', 0.15, 0.3);
    },
    weaponFire() { playNote(330, 0.04, 'square', 0.06); },
    portalOpen() {
        playNote(330, 0.2, 'sine', 0.1);
        playNote(440, 0.2, 'sine', 0.08, 0.15);
        playNote(550, 0.3, 'sine', 0.1, 0.3);
    },
    menuClick() { playNote(800, 0.05, 'square', 0.08); },
    gameOver() {
        playNote(330, 0.3, 'sawtooth', 0.12);
        playNote(220, 0.3, 'sawtooth', 0.1, 0.25);
        playNote(165, 0.5, 'sawtooth', 0.08, 0.5);
    },
    combo10() { playNote(660, 0.06, 'triangle', 0.1); playNote(880, 0.08, 'triangle', 0.08, 0.04); },
    combo50() { playNote(880, 0.08, 'triangle', 0.12); playNote(1100, 0.1, 'sine', 0.1, 0.05); playNote(1320, 0.12, 'sine', 0.08, 0.1); },
    revive() {
        playNote(220, 0.15, 'sine', 0.1);
        playNote(330, 0.15, 'sine', 0.1, 0.1);
        playNote(440, 0.15, 'sine', 0.1, 0.2);
        playNote(660, 0.3, 'triangle', 0.15, 0.3);
    },
    bossSpawn() {
        // War horn: deep resonant brass tones
        playNoise(0.3, 0.18);
        playNote(55, 0.6, 'sawtooth', 0.18);
        playNote(73, 0.5, 'sawtooth', 0.14, 0.15);
        playNote(110, 0.5, 'sawtooth', 0.15, 0.3);
        playNote(82, 0.5, 'sawtooth', 0.12, 0.5);
        playNoise(0.15, 0.08);
    },
    coin() { playNote(1200, 0.06, 'triangle', 0.12); playNote(1600, 0.08, 'triangle', 0.1, 0.04); playNote(2000, 0.06, 'sine', 0.06, 0.08); },

    // --- Skill SFX ---
    groundSlam() { playNoise(0.15, 0.18); playNote(80, 0.3, 'sawtooth', 0.2); playNote(60, 0.2, 'sawtooth', 0.15, 0.1); },
    windBurst() { playNoise(0.08, 0.12); playNote(400, 0.15, 'sine', 0.1); playNote(600, 0.1, 'sine', 0.08, 0.05); playNote(800, 0.08, 'sine', 0.05, 0.1); },
    shadowStrike() { playNote(1600, 0.03, 'sawtooth', 0.15); playNote(200, 0.08, 'sawtooth', 0.12, 0.03); playNoise(0.05, 0.1); },
    shieldWall() { playNote(300, 0.2, 'triangle', 0.12); playNote(400, 0.15, 'triangle', 0.1, 0.1); playNote(500, 0.3, 'sine', 0.08, 0.2); },
    lifeDrain() { playNote(220, 0.2, 'sine', 0.1); playNote(330, 0.15, 'sine', 0.08, 0.1); playNote(440, 0.2, 'sine', 0.1, 0.2); },
    rageMode() { playNoise(0.2, 0.2); playNote(110, 0.4, 'sawtooth', 0.2); playNote(165, 0.3, 'sawtooth', 0.15, 0.15); playNote(220, 0.5, 'sawtooth', 0.18, 0.3); },
    eightTrigrams() { playNote(523, 0.1, 'sine', 0.12); playNote(659, 0.1, 'sine', 0.1, 0.08); playNote(784, 0.1, 'sine', 0.08, 0.16); playNote(1047, 0.3, 'triangle', 0.15, 0.24); },
    bladeStorm() { for (let i = 0; i < 5; i++) playNote(800 + i * 200, 0.04, 'sawtooth', 0.1 - i * 0.015, i * 0.06); playNoise(0.15, 0.12); },
    changbanCharge() { playNote(110, 0.5, 'sawtooth', 0.2); playNoise(0.3, 0.15); playNote(82, 0.4, 'sawtooth', 0.15, 0.2); },
    phoenixSummon() { playNote(440, 0.2, 'sine', 0.15); playNote(660, 0.2, 'triangle', 0.12, 0.15); playNote(880, 0.3, 'sine', 0.15, 0.3); playNote(1100, 0.4, 'triangle', 0.12, 0.45); },
    hitHeavy() { playNote(150, 0.12, 'sawtooth', 0.18); playNoise(0.08, 0.14); playNote(80, 0.15, 'square', 0.1, 0.04); },
    fireRain() { playNoise(0.1, 0.1); playNote(600, 0.08, 'sine', 0.08); playNote(500, 0.08, 'sine', 0.06, 0.06); playNote(400, 0.1, 'sine', 0.05, 0.12); },
    ultimateActivate() { playNoise(0.15, 0.15); playNote(220, 0.2, 'sawtooth', 0.15); playNote(440, 0.2, 'triangle', 0.12, 0.1); playNote(880, 0.3, 'sine', 0.15, 0.2); },
};

// ============================================================
// PROCEDURAL BACKGROUND MUSIC SYSTEM
// ============================================================
const BGM = {
    currentMood: null,       // 'menu', 'combat', 'boss', null
    masterGain: null,
    _timer: null,
    _nodes: [],
    volume: 0.12,            // master BGM volume (lower than SFX)

    init() {
        if (!audioCtx || this.masterGain) return;
        this.masterGain = audioCtx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(audioCtx.destination);
    },

    setVolume(v) {
        this.volume = v;
        if (this.masterGain) this.masterGain.gain.value = v;
    },

    stop() {
        if (this._timer) { clearInterval(this._timer); this._timer = null; }
        for (const n of this._nodes) { try { n.stop(); } catch (e) { } }
        this._nodes = [];
        this.currentMood = null;
    },

    play(mood) {
        if (!audioCtx || !audioEnabled) return;
        if (mood === this.currentMood) return;
        this.init();
        this.stop();
        this.currentMood = mood;
        if (mood === 'menu') this._playMenu();
        else if (mood === 'combat') this._playCombat();
        else if (mood === 'boss') this._playBoss();
    },

    // --- MENU: Ethereal ambient pad with slow arpeggios ---
    _playMenu() {
        const self = this;
        // Ambient drone pad
        const droneFreqs = [110, 165, 220]; // A2, E3, A3
        droneFreqs.forEach(f => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            g.gain.value = 0.04;
            osc.connect(g);
            g.connect(self.masterGain);
            osc.start();
            self._nodes.push(osc);
            // Slow volume pulsation
            const lfo = audioCtx.createOscillator();
            const lfoG = audioCtx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = 0.15 + Math.random() * 0.1;
            lfoG.gain.value = 0.015;
            lfo.connect(lfoG);
            lfoG.connect(g.gain);
            lfo.start();
            self._nodes.push(lfo);
        });

        // Pentatonic arpeggio (ancient Chinese scale feel)
        const scale = [220, 247, 293, 330, 392, 440, 494, 587]; // A minor pentatonic-ish
        let noteIdx = 0;
        self._timer = setInterval(() => {
            if (!audioEnabled || !audioCtx || self.currentMood !== 'menu') return;
            const freq = scale[noteIdx % scale.length];
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(0.035, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
            osc.connect(g);
            g.connect(self.masterGain);
            osc.start(t);
            osc.stop(t + 2);
            noteIdx++;
        }, 2200);
    },

    // --- COMBAT: War drum pattern + tension strings ---
    _playCombat() {
        const self = this;

        // Bass drone
        const bass = audioCtx.createOscillator();
        const bg = audioCtx.createGain();
        bass.type = 'sawtooth';
        bass.frequency.value = 55; // A1
        bg.gain.value = 0.025;
        bass.connect(bg);
        bg.connect(self.masterGain);
        bass.start();
        self._nodes.push(bass);

        // War drum pattern (procedural percussion)
        let beat = 0;
        const bpm = 140;
        const beatMs = 60000 / bpm;
        const pattern = [1, 0, 0.6, 0, 0.8, 0, 0.5, 0.3]; // kick accents

        self._timer = setInterval(() => {
            if (!audioEnabled || !audioCtx || self.currentMood !== 'combat') return;
            const accent = pattern[beat % pattern.length];
            if (accent > 0) {
                // Kick drum
                const t = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(80 * accent, t);
                osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);
                g.gain.setValueAtTime(0.06 * accent, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
                osc.connect(g);
                g.connect(self.masterGain);
                osc.start(t);
                osc.stop(t + 0.2);

                // Hi-hat noise on off-beats
                if (beat % 2 === 1) {
                    const sz = audioCtx.sampleRate * 0.04;
                    const buf = audioCtx.createBuffer(1, sz, audioCtx.sampleRate);
                    const d = buf.getChannelData(0);
                    for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
                    const src = audioCtx.createBufferSource();
                    const ng = audioCtx.createGain();
                    src.buffer = buf;
                    ng.gain.setValueAtTime(0.03, t);
                    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
                    src.connect(ng);
                    ng.connect(self.masterGain);
                    src.start(t);
                }
            }

            // Tension chord stabs every 8 beats
            if (beat % 8 === 0) {
                const t = audioCtx.currentTime;
                [110, 131, 165].forEach((f, i) => {
                    const osc = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.value = f;
                    g.gain.setValueAtTime(0.025, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
                    osc.connect(g);
                    g.connect(self.masterGain);
                    osc.start(t);
                    osc.stop(t + 0.7);
                });
            }
            beat++;
        }, beatMs);
    },

    // --- BOSS: Intense double-time drums + dissonant chords ---
    _playBoss() {
        const self = this;

        // Deep rumble
        const rumble = audioCtx.createOscillator();
        const rg = audioCtx.createGain();
        rumble.type = 'sawtooth';
        rumble.frequency.value = 41; // E1 — ominous
        rg.gain.value = 0.03;
        rumble.connect(rg);
        rg.connect(self.masterGain);
        rumble.start();
        self._nodes.push(rumble);

        // Fast aggressive pattern
        let beat = 0;
        const bpm = 180;
        const beatMs = 60000 / bpm;
        const pattern = [1, 0.7, 0.4, 0.8, 1, 0.5, 0.7, 0.9];

        self._timer = setInterval(() => {
            if (!audioEnabled || !audioCtx || self.currentMood !== 'boss') return;
            const accent = pattern[beat % pattern.length];
            const t = audioCtx.currentTime;

            // Heavy kick
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(100 * accent, t);
            osc.frequency.exponentialRampToValueAtTime(25, t + 0.1);
            g.gain.setValueAtTime(0.08 * accent, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            osc.connect(g);
            g.connect(self.masterGain);
            osc.start(t);
            osc.stop(t + 0.15);

            // Harsh noise stab
            if (beat % 4 === 0) {
                const sz = audioCtx.sampleRate * 0.06;
                const buf = audioCtx.createBuffer(1, sz, audioCtx.sampleRate);
                const d = buf.getChannelData(0);
                for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1);
                const src = audioCtx.createBufferSource();
                const ng = audioCtx.createGain();
                src.buffer = buf;
                ng.gain.setValueAtTime(0.05, t);
                ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
                src.connect(ng);
                ng.connect(self.masterGain);
                src.start(t);
            }

            // Dissonant power chord every 4 beats
            if (beat % 4 === 2) {
                [82, 110, 124].forEach(f => {
                    const o = audioCtx.createOscillator();
                    const og = audioCtx.createGain();
                    o.type = 'sawtooth';
                    o.frequency.value = f;
                    og.gain.setValueAtTime(0.03, t);
                    og.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
                    o.connect(og);
                    og.connect(self.masterGain);
                    o.start(t);
                    o.stop(t + 0.5);
                });
            }
            beat++;
        }, beatMs);
    }
};

// --- BGM integration: auto-switch based on game state ---
function updateBGM() {
    if (!audioEnabled || !audioCtx) return;
    const state = G.state;
    if (state === 'MENU' || state === 'HERO_SELECT' || state === 'BONDING') {
        BGM.play('menu');
    } else if (state === 'PLAYING') {
        // Check if boss is active
        const hasBoss = G.enemies && G.enemies.some(e => e.isBoss || e.isMiniBoss);
        BGM.play(hasBoss ? 'boss' : 'combat');
    } else if (state === 'GAME_OVER') {
        BGM.stop();
    }
}

// Hook initAudio to also init BGM on first interaction
function initAudioOnInteraction() {
    initAudio();
    if (audioCtx) BGM.init();
}
