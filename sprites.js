// ============================================================
// DYNASTY BRUHHH DUNGEON - Procedural Pixel Art Sprites
// ============================================================
// All sprites defined as 2D color arrays. '.' = transparent.
// Draw function renders each pixel as a fillRect.

const SPRITE_SCALE = 1; // Each sprite pixel = 1 game pixel

// --- Color Palette ---
const PAL = {
    // Skin tones
    skin: '#e8c170', skinShadow: '#b8894a', skinLight: '#ffe0a0',
    // Hair/Dark
    hair: '#4a3728', hairDark: '#2a1f16',
    // Eyes
    eyeW: '#ffffff', eyeP: '#222222',
    // Armor base
    armorShu: '#cc3333', armorWei: '#3366bb', armorWu: '#33aa33',
    // Metal
    metal: '#8899aa', metalLight: '#bbccdd', metalDark: '#556677',
    // Leather
    leather: '#6b4423', leatherDark: '#4a2f15',
    // Enemy colors  
    skeleton: '#ccccbb', skeletonDark: '#999988',
    demon: '#aa2222', demonDark: '#771111', demonGlow: '#ff4444',
    shadow: '#443366', shadowDark: '#221144',
    beast: '#886633', beastDark: '#664422',
    // Effects
    gold: '#ffdd00', goldLight: '#ffee66',
    blood: '#881111',
};

// Helper: parse sprite string into 2D array
function parseSpriteStr(str, colorMap) {
    return str.trim().split('\n').map(row =>
        row.trim().split('').map(ch => colorMap[ch] || null)
    );
}

// --- PLAYER SPRITES ---
const PLAYER_COLORS = {
    '.': null, ' ': null,
    'H': PAL.hair, 'h': PAL.hairDark,
    'S': PAL.skin, 's': PAL.skinShadow, 'L': PAL.skinLight,
    'E': PAL.eyeW, 'P': PAL.eyeP,
    'A': null, 'a': null, // Armor - set dynamically per element
    'M': PAL.metal, 'm': PAL.metalDark,
    'B': PAL.leather, 'b': PAL.leatherDark,
};

const PLAYER_FRAMES = {
    idle: [
        // Frame 0 - Standing (12w x 16h)
        `....HHHH....
...HHhHHH..
...HSSHH...
...SEEBS...
...SPPSB...
....SSSS...
..AAAAAA..
..AAmMAA..
..A.AA.A..
..AAAAAA..
...BBBB...
...B..B...
...B..B...
...b..b...
...MM.MM..
...MM.MM..`,
        // Frame 1 - Idle breathe
        `....HHHH....
...HHhHHH..
...HSSHH...
...SEEBS...
...SPPSB...
....SSSS...
..AAAAAA..
..AAmMAA..
..A.AA.A..
..AAAAAA..
...BBBB...
...B..B...
...B..B...
...b..b...
..MM..MM..
..MM..MM..`,
    ],
    walk: [
        // Frame 0 - Left leg forward
        `....HHHH....
...HHhHHH..
...HSSHH...
...SEEBS...
...SPPSB...
....SSSS...
..AAAAAA..
..AAmMAA..
..A.AA.A..
..AAAAAA..
...BBBB...
...B..B...
..B....B..
..b....b..
..MM..MM..
.MM....MM.`,
        // Frame 1 - Right leg forward
        `....HHHH....
...HHhHHH..
...HSSHH...
...SEEBS...
...SPPSB...
....SSSS...
..AAAAAA..
..AAmMAA..
..A.AA.A..
..AAAAAA..
...BBBB...
...B..B...
....BB....
....bb....
...MMMM...
...MMMM...`,
        // Frame 2 - Neutral
        `....HHHH....
...HHhHHH..
...HSSHH...
...SEEBS...
...SPPSB...
....SSSS...
..AAAAAA..
..AAmMAA..
..A.AA.A..
..AAAAAA..
...BBBB...
...B..B...
...B..B...
...b..b...
...MM.MM..
...MM.MM..`,
        // Frame 3 - Right leg forward (mirror of 0)
        `....HHHH....
...HHhHHH..
...HSSHH...
...SEEBS...
...SPPSB...
....SSSS...
..AAAAAA..
..AAmMAA..
..A.AA.A..
..AAAAAA..
...BBBB...
...B..B...
....BB....
....bb....
..MM..MM..
.MM....MM.`,
    ],
    attack: [
        // Frame 0 - Wind up
        `....HHHH....
...HHhHHH..
...HSSHH...
...SEEBS...
...SPPSB...
....SSSS...
.AAAAAAAM.
.AAmMAAMM.
.A.AA.AMM.
..AAAAAA..
...BBBB...
...B..B...
..B....B..
..b....b..
..MM..MM..
..MM..MM..`,
        // Frame 1 - Swinging
        `....HHHH....
...HHhHHH..
...HSSHH...
...SEEBS...
...SPPSB...
....SSSS...
..AAAAAAMMM
..AAmMAAAAM
..A.AA.A..M
..AAAAAA...
...BBBB....
...B..B....
...B..B....
...b..b....
...MM.MM...
...MM.MM...`,
    ],
};

// --- ENEMY SPRITES ---
const ENEMY_SPRITES = {
    grunt: {
        colors: {
            '.': null, ' ': null,
            'B': '#667788', 'b': '#445566', // Body
            'E': '#ff3333', 'e': '#cc0000', // Eyes
            'S': PAL.skeleton, 's': PAL.skeletonDark,
            'M': PAL.metal, 'm': PAL.metalDark,
            'H': '#556677',
        },
        frames: [
            // 10x12 grunt warrior
            `...MMMM...
..MBBBBM..
..BSSSBB..
..BEEBSB..
..BSSSBB..
...BBBB...
..MBBBBM..
..MBmmBM..
...BBBB...
...B..B...
...B..B...
...b..b...`,
            `...MMMM...
..MBBBBM..
..BSSSBB..
..BEEBSB..
..BSSSBB..
...BBBB...
..MBBBBM..
..MBmmBM..
...BBBB...
..B....B..
..b....b..
...b..b...`,
        ]
    },
    fast: {
        colors: {
            '.': null, ' ': null,
            'B': '#553388', 'b': '#331166', // Purple body
            'E': '#ffff00', 'e': '#cccc00',
            'C': '#7744aa', 'c': '#442277', // Cape
            'D': '#221144',
        },
        frames: [
            // 8x10 fast assassin
            `..CCCC..
.CBBBBC.
.BEEEBB.
.BBBBBB.
..BBBB..
.CCBBCC.
.C.BB.C.
..BBBB..
..B..B..
..b..b..`,
            `..CCCC..
.CBBBBC.
.BEEEBB.
.BBBBBB.
..BBBB..
.CCBBCC.
.C.BB.C.
...BB...
..B..B..
.b....b.`,
        ]
    },
    tank: {
        colors: {
            '.': null, ' ': null,
            'A': '#778899', 'a': '#556677', // Heavy armor
            'B': '#667788', 'b': '#445566',
            'E': '#ff3333',
            'G': '#aabbcc', 'g': '#8899aa', // Gold trim
            'S': '#334455', // Shield
        },
        frames: [
            // 14x14 heavy warrior
            `....GGGGGG....
...GAAAAAAG...
..GAABBAAG...
..GA.EE.AG...
..GAABBAAG...
...GAAAAG....
..SAAAAAAA...
.SSAAGAAAA..
.SSAAGAAAS..
..SAAAAAS...
...AAAA.....
...A..A.....
...A..A.....
...a..a.....`,
            `....GGGGGG....
...GAAAAAAG...
..GAABBAAG...
..GA.EE.AG...
..GAABBAAG...
...GAAAAG....
..SAAAAAAA...
.SSAAGAAAA..
.SSAAGAAAS..
..SAAAAAS...
...AAAA.....
..A....A....
..a....a....
...a..a.....`,
        ]
    },
    elite: {
        colors: {
            '.': null, ' ': null,
            'G': '#ffdd00', 'g': '#ccaa00', // Gold
            'A': '#cc3333', 'a': '#991111', // Red armor
            'B': '#882222', 'b': '#661111',
            'E': '#ffffff',
            'C': '#ff4444', 'c': '#cc2222', // Cape
            'M': PAL.metal,
        },
        frames: [
            // 14x16 elite general
            `....GgGgG.....
.....GGG......
...GAAAAAG....
..GAABBAAG...
..GA.EE.AG...
..GAABBAAG...
...GAAAAAG...
.CCAAAAAAC..
.CCAAGAAAC..
.CCAAGAAAC..
..CAAAAAAC..
...AABBAA...
...A....A...
...A....A...
...a....a...
...MM..MM...`,
            `....GgGgG.....
.....GGG......
...GAAAAAG....
..GAABBAAG...
..GA.EE.AG...
..GAABBAAG...
...GAAAAAG...
.CCAAAAAA.C.
.CCAAGAAA.C.
.CCAAGAAA.C.
..CAAAAAA.C.
...AABBAA...
..A......A..
..a......a..
...a....a...
...MM..MM...`,
        ]
    },
    boss: {
        colors: {
            '.': null, ' ': null,
            'R': '#cc2222', 'r': '#991111', // Red body
            'D': '#ff4444', 'd': '#cc3333', // Demon glow
            'B': '#661111', 'b': '#440000',
            'E': '#ffff00', 'e': '#ffcc00', // Yellow eyes
            'H': '#ff6666', 'h': '#cc4444', // Horns
            'G': '#ffdd00', // Gold
            'W': '#ffffff',
        },
        frames: [
            // 22x24 demon lord boss
            `......H....H......
.....HH....HH.....
....HHH....HHH....
...HRRRRRRRRRRH...
..HRRRRRRRRRRRH..
..RRRREEEERRRR..
..RRRRWWWWRRRR..
..RRRREEEERRRR..
...RRRRRRRRRR...
....RRRRRRRR....
..DDRRRRRRRRDD..
.DDDRRGGRRRDDDD.
.DDDRRGGRRRDDD..
.DDDRRRRRRRDDDD.
..DDRRRRRRRDD...
...DRRRRRRD.....
....RRRRR......
....RR.RR......
...RR...RR.....
..RR.....RR....
..rr.....rr....
..BB.....BB....
..BB.....BB....
..bb.....bb....`,
            `......H....H......
.....HH....HH.....
....HHH....HHH....
...HRRRRRRRRRRH...
..HRRRRRRRRRRRH..
..RRRREEEERRRR..
..RRRRWWWWRRRR..
..RRRREEEERRRR..
...RRRRRRRRRR...
....RRRRRRRR....
.DDDRRRRRRRRDDDD
.DDDRRGGRRRDDD..
.DDDRRGGRRRDDDD.
..DDRRRRRRRDD...
..DDRRRRRRRDDD..
...DRRRRRRD.....
....RRRRRR.....
...RR...RR.....
...RR...RR.....
..RR.....RR....
..rr.....rr....
..BB.....BB....
..BB.....BB....
..bb.....bb....`,
        ]
    }
};

// --- PICKUP SPRITES ---
const PICKUP_SPRITES = {
    xp: {
        colors: { '.': null, 'G': '#44ff44', 'g': '#22cc22', 'L': '#88ff88' },
        frame: `..L..
.GGG.
GGGGG
.GGG.
..g..`
    },
    gold: {
        colors: { '.': null, 'G': '#ffdd00', 'g': '#ccaa00', 'L': '#ffee66' },
        frame: `.LLL.
GGGGG
GGLGG
GGGGG
.ggg.`
    },
    hp: {
        colors: { '.': null, 'R': '#ff3333', 'r': '#cc1111', 'W': '#ffffff' },
        frame: `..R..
.RRR.
RRWRR
.RRR.
..r..`
    }
};

// --- SPRITE RENDERING ---
function parseSprite(str, colorMap) {
    const lines = str.trim().split('\n');
    const frames = [];
    for (const line of lines) {
        const row = [];
        for (const ch of line) {
            row.push(colorMap[ch] || null);
        }
        frames.push(row);
    }
    return frames;
}

// Draw a sprite from string definition
function drawSprite(x, y, spriteStr, colorMap, flipX, tint) {
    const lines = spriteStr.trim().split('\n');
    const h = lines.length;
    const w = lines.reduce((max, l) => Math.max(max, l.length), 0);
    const ox = Math.round(x - w / 2);
    const oy = Math.round(y - h);

    for (let row = 0; row < h; row++) {
        const line = lines[row];
        for (let col = 0; col < line.length; col++) {
            const ch = line[col];
            const color = colorMap[ch];
            if (!color) continue;

            const px = flipX ? ox + (w - 1 - col) : ox + col;
            const py = oy + row;

            if (tint) {
                ctx.fillStyle = tint;
            } else {
                ctx.fillStyle = color;
            }
            ctx.fillRect(px, py, 1, 1);
        }
    }
}

// Draw player with element-colored armor
function drawPlayerSprite(x, y, element, frame, flipX, tint) {
    const el = ELEMENTS[element];
    const armorMain = el.color;
    const armorDark = el.light; // use light for shading, slight contrast

    // Build color map with dynamic armor
    const colors = { ...PLAYER_COLORS, 'A': armorMain, 'a': armorDark };

    // Select animation frame
    let anim, frameIdx;
    if (P.damageFlash > 0) {
        tint = '#ffffff';
    }

    const isMoving = Math.abs(P.vx) > 5 || Math.abs(P.vy) > 5;
    if (isMoving) {
        anim = PLAYER_FRAMES.walk;
        frameIdx = Math.floor(G.time * 8) % anim.length;
    } else {
        anim = PLAYER_FRAMES.idle;
        frameIdx = Math.floor(G.time * 2) % anim.length;
    }

    drawSprite(x, y, anim[frameIdx], colors, flipX, tint);
}

// Draw enemy sprite
function drawEnemySprite(ex, ey, enemy, tint) {
    const def = ENEMY_SPRITES[enemy.type];
    if (!def) {
        // Fallback for unknown types - draw colored rect
        ctx.fillStyle = tint || enemy.color;
        ctx.fillRect(ex - enemy.r, ey - enemy.r, enemy.r * 2, enemy.r * 2);
        return;
    }

    const frameIdx = Math.floor(G.time * 4) % def.frames.length;
    const flipX = enemy.vx < 0;
    drawSprite(ex, ey, def.frames[frameIdx], def.colors, flipX, tint);
}

// Draw pickup sprite
function drawPickupSprite(x, y, type) {
    const def = PICKUP_SPRITES[type];
    if (!def) return;

    const bounce = Math.sin(G.time * 5 + x * 0.1) * 2;
    drawSprite(x, y + bounce, def.frame, def.colors, false, null);
}

// --- ANIMATION HELPERS ---
function getPlayerAnimFrame() {
    const isMoving = Math.abs(P.vx) > 5 || Math.abs(P.vy) > 5;
    if (isMoving) {
        return { anim: 'walk', frame: Math.floor(G.time * 8) % PLAYER_FRAMES.walk.length };
    }
    return { anim: 'idle', frame: Math.floor(G.time * 2) % PLAYER_FRAMES.idle.length };
}
