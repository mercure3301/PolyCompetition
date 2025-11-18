const keys = {};
let mousePressed = false;

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('mousedown', () => {
    mousePressed = true;
});

canvas.addEventListener('mouseup', () => {
    mousePressed = false;
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);

function drawStars() {
    ctx.fillStyle = '#ffffff';
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = random(0, canvas.width);
        }
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function gameLoop() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000011');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();

    if (gameState === 'playing') {
        updatePlayer();
        spawnEnemies();
        spawnRandomPickups();
        spawnRandomHealthPickups();

        for (let bullet of playerBullets) {
            bullet.update();
        }
        for (let bullet of enemyBullets) {
            bullet.update();
        }

        for (let enemy of enemies) {
            enemy.update();
        }

        if (boss && bossActive) {
            boss.update();
        }

        for (let pickup of pickups) {
            pickup.update();
        }

        playerBullets = playerBullets.filter(b => !b.isOffScreen());
        enemyBullets = enemyBullets.filter(b => !b.isOffScreen());
        enemies = enemies.filter(e => !e.isOffScreen());
        pickups = pickups.filter(p => !p.isOffScreen());

        checkCollisions();

        drawPlayer();

        for (let bullet of playerBullets) {
            bullet.draw();
        }
        for (let bullet of enemyBullets) {
            bullet.draw();
        }
        for (let enemy of enemies) {
            enemy.draw();
        }
        if (boss && bossActive) {
            boss.draw();
        }
        for (let pickup of pickups) {
            pickup.draw();
        }

        updateUI();

        if (bullets <= 0 && playerBullets.length === 0) {
            gameOver();
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
