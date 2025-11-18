function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('xp').textContent = xp;
    document.getElementById('xpMax').textContent = xpToNextLevel;
    document.getElementById('bullets').textContent = bullets;
    document.getElementById('health').textContent = Math.max(0, Math.floor(player.health));
    document.getElementById('maxHealth').textContent = player.maxHealth;
    
    const bulletsElement = document.getElementById('bullets');
    if (bullets < 10) {
        bulletsElement.style.color = '#ff0000';
    } else if (bullets < 20) {
        bulletsElement.style.color = '#ffaa00';
    } else {
        bulletsElement.style.color = '#00ff00';
    }
    
    const healthElement = document.getElementById('health');
    const healthPercent = player.health / player.maxHealth;
    if (healthPercent > 0.5) {
        healthElement.style.color = '#00ff00';
    } else if (healthPercent > 0.25) {
        healthElement.style.color = '#ffaa00';
    } else {
        healthElement.style.color = '#ff0000';
    }
}

function gameOver() {
    gameState = 'gameover';
    if (typeof musicManager !== 'undefined') {
        musicManager.stop();
    }
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

function restartGame() {
    gameState = 'playing';
    const now = performance.now();
    gameStartTime = now;
    nextBossSpawnTime = now + 20000;
    if (typeof musicManager !== 'undefined') {
        musicManager.resetAndStart();
    }
    score = 0;
    level = 1;
    xp = 0;
    xpToNextLevel = 100;
    bullets = 50;
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
    player.damage = 10;
    player.health = player.maxHealth;
    player.invincible = false;
    player.invincibleTime = 0;
    playerBullets = [];
    enemies = [];
    enemyBullets = [];
    pickups = [];
    boss = null;
    bossActive = false;
    lastEnemySpawn = now;
    lastBossSpawn = 0;
    lastPickupSpawn = now;
    lastHealthPickupSpawn = now;
    nextPickupDelay = 0;
    nextHealthPickupDelay = 0;
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            size: random(0.5, 2),
            speed: random(0.5, 2)
        });
    }
    document.getElementById('gameOverScreen').classList.add('hidden');
}

function startGame() {
    gameState = 'playing';
    const now = performance.now();
    gameStartTime = now;
    nextBossSpawnTime = now + 20000;
    if (typeof musicManager !== 'undefined') {
        musicManager.resetAndStart();
    }
    lastEnemySpawn = now;
    lastBossSpawn = 0;
    lastPickupSpawn = now;
    lastHealthPickupSpawn = now;
    document.getElementById('startScreen').classList.add('hidden');
}

