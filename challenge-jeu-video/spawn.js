function addXP(amount) {
    xp += amount;
    if (xp >= xpToNextLevel) {
        level++;
        xp = 0;
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
        player.damage = 10 + level * 5;
    }
}

function spawnEnemies() {
    const now = performance.now();
    const elapsedSeconds = Math.max(0, (now - gameStartTime) / 1000);
    const spawnAcceleration = 1 + elapsedSeconds / 30 + level * 0.05;
    const enemySpawnDelay = Math.max(250, 1500 / spawnAcceleration);
    const baseCap = 6;
    const timeBonus = Math.floor(elapsedSeconds / 8);
    const levelBonus = Math.floor(level / 2);
    const maxSimultaneousEnemies = Math.min(baseCap + timeBonus + levelBonus, 50);

    if (enemies.length < maxSimultaneousEnemies && now - lastEnemySpawn > enemySpawnDelay) {
        const roll = Math.random();
        if (roll < 0.5) {
            enemies.push(new EnemyType1());
        } else if (roll < 0.85) {
            enemies.push(new EnemyType2());
        } else {
            enemies.push(new EnemyType3());
        }
        lastEnemySpawn = now;
    }

    if (!bossActive) {
        if (nextBossSpawnTime === null) {
            nextBossSpawnTime = now + 20000;
        }
        if (nextBossSpawnTime !== null && now >= nextBossSpawnTime) {
            boss = new Boss();
            bossActive = true;
            lastBossSpawn = now;
            nextBossSpawnTime = null;
        }
    }
}

function spawnRandomPickups() {
    const now = performance.now();
    
    if (nextPickupDelay === 0) {
        nextPickupDelay = random(5000, 8000);
    }
    
    if (now - lastPickupSpawn > nextPickupDelay) {
        const spawnX = random(20, canvas.width - 20);
        pickups.push(new Pickup(spawnX, -20));
        lastPickupSpawn = now;
        nextPickupDelay = random(5000, 8000);
    }
}

function spawnRandomHealthPickups() {
    const now = performance.now();
    
    if (nextHealthPickupDelay === 0) {
        nextHealthPickupDelay = random(9000, 14000);
    }
    
    if (now - lastHealthPickupSpawn > nextHealthPickupDelay) {
        const spawnX = random(40, canvas.width - 40);
        const spawnY = random(80, Math.max(120, canvas.height - 160));
        pickups.push(new HeartPickup(spawnX, spawnY));
        lastHealthPickupSpawn = now;
        nextHealthPickupDelay = random(9000, 14000);
    }
}

