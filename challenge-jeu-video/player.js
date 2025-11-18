function updatePlayer() {
    if (player.invincible) {
        player.invincibleTime--;
        if (player.invincibleTime <= 0) {
            player.invincible = false;
        }
    }

    if (keys['a'] || keys['arrowleft']) {
        player.x = Math.max(0, player.x - player.speed);
    }
    if (keys['d'] || keys['arrowright']) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }
    if (keys['w'] || keys['arrowup']) {
        player.y = Math.max(0, player.y - player.speed);
    }
    if (keys['s'] || keys['arrowdown']) {
        player.y = Math.min(canvas.height - player.height, player.y + player.speed);
    }

    if ((keys[' '] || mousePressed) && bullets > 0) {
        if (player.shootCooldown === undefined || player.shootCooldown <= 0) {
            playerBullets.push(new Bullet(
                player.x + player.width / 2 - 2,
                player.y,
                0,
                -8,
                player.damage
            ));
            bullets--;
            player.shootCooldown = 10;
        }
    }

    if (player.shootCooldown > 0) {
        player.shootCooldown--;
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    
    if (player.invincible && Math.floor(player.invincibleTime / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }
    
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ff00';
    
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(0, -player.height / 2);
    ctx.lineTo(-player.width / 2, player.height / 2);
    ctx.lineTo(0, player.height / 2 - 5);
    ctx.lineTo(player.width / 2, player.height / 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#00cc00';
    ctx.beginPath();
    ctx.moveTo(-player.width / 2, player.height / 2 - 10);
    ctx.lineTo(-player.width / 2 - 5, player.height / 2);
    ctx.lineTo(-player.width / 2, player.height / 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(player.width / 2, player.height / 2 - 10);
    ctx.lineTo(player.width / 2 + 5, player.height / 2);
    ctx.lineTo(player.width / 2, player.height / 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -5, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
    
    const barWidth = 60;
    const barHeight = 10;
    const barX = player.x + (player.width - barWidth) / 2;
    const barY = player.y - 18;
    const healthPercent = Math.max(0, player.health / player.maxHealth);
    
    ctx.fillStyle = '#330000';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}




