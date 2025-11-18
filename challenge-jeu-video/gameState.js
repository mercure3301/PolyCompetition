let gameState = 'start';
let score = 0;
let level = 1;
let xp = 0;
let xpToNextLevel = 100;
let bullets = 100;
let maxBullets = 1000;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 40,
    height: 40,
    speed: 5,
    damage: 10,
    health: 200,
    maxHealth: 200,
    invincible: false,
    invincibleTime: 0
};

let playerBullets = [];
let enemies = [];
let enemyBullets = [];
let pickups = [];
let particles = [];
let stars = [];

for (let i = 0; i < 100; i++) {
    stars.push({
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        size: random(0.5, 2),
        speed: random(0.5, 2)
    });
}

let gameStartTime = performance.now();
let lastEnemySpawn = 0;
let lastBossSpawn = 0;
let lastPickupSpawn = 0;
let lastHealthPickupSpawn = 0;
let nextBossSpawnTime = performance.now() + 20000;
let bossActive = false;
let boss = null;
let nextPickupDelay = 0;
let nextHealthPickupDelay = 0;

