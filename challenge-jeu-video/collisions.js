function checkCollisions() {
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        const bullet = playerBullets[i];
        
        if (boss && bossActive) {
            if (bullet.x < boss.x + boss.width &&
                bullet.x + bullet.width > boss.x &&
                bullet.y < boss.y + boss.height &&
                bullet.y + bullet.height > boss.y) {
                boss.health -= bullet.damage;
                playerBullets.splice(i, 1);
                
                if (boss.health <= 0) {
                    score += boss.score;
                    addXP(boss.xp);
                    boss = null;
                    bossActive = false;
                    nextBossSpawnTime = performance.now() + 20000;
                    if (typeof musicManager !== 'undefined') {
                        musicManager.transitionToNextTrack();
                    }
                }
                continue;
            }
        }

        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemy.health -= bullet.damage;
                playerBullets.splice(i, 1);
                
                if (enemy.health <= 0) {
                    score += enemy.score;
                    addXP(enemy.xp);
                    if (Math.random() < 0.5) {
                        pickups.push(new Pickup(enemy.x + enemy.width / 2, enemy.y + enemy.height));
                    }
                    enemies.splice(j, 1);
                }
                break;
            }
        }
    }

    if (!player.invincible) {
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            const bullet = enemyBullets[i];
            if (bullet.x < player.x + player.width &&
                bullet.x + bullet.width > player.x &&
                bullet.y < player.y + player.height &&
                bullet.y + bullet.height > player.y) {
                enemyBullets.splice(i, 1);
                player.health -= bullet.damage;
                player.invincible = true;
                player.invincibleTime = 120;
                if (player.health <= 0) {
                    gameOver();
                    return;
                }
            }
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (enemy.x < player.x + player.width &&
                enemy.x + enemy.width > player.x &&
                enemy.y < player.y + player.height &&
                enemy.y + enemy.height > player.y) {
                player.health -= 20;
                player.invincible = true;
                player.invincibleTime = 120;
                if (player.health <= 0) {
                    gameOver();
                    return;
                }
            }
        }

        if (boss && bossActive) {
            if (boss.x < player.x + player.width &&
                boss.x + boss.width > player.x &&
                boss.y < player.y + player.height &&
                boss.y + boss.height > player.y) {
                player.health -= 30;
                player.invincible = true;
                player.invincibleTime = 120;
                if (player.health <= 0) {
                    gameOver();
                    return;
                }
            }
        }
    }

    for (let i = pickups.length - 1; i >= 0; i--) {
        const pickup = pickups[i];
        if (pickup.x < player.x + player.width &&
            pickup.x + pickup.width > player.x &&
            pickup.y < player.y + player.height &&
            pickup.y + pickup.height > player.y) {
            if (pickup.type === 'bullet') {
                bullets = Math.min(maxBullets, bullets + pickup.amount);
            } else if (pickup.type === 'health' || pickup.type === 'heart') {
                player.health = Math.min(player.maxHealth, player.health + pickup.amount);
            }
            pickups.splice(i, 1);
        }
    }
}

