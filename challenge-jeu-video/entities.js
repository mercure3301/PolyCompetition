class Bullet {
    constructor(x, y, vx, vy, damage, color = '#00ff00') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 4;
        this.height = 10;
        this.damage = damage;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 1, this.y + 2, this.width - 2, this.height - 4);
        ctx.shadowBlur = 0;
    }

    isOffScreen() {
        return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
    }
}

class EnemyType1 {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = random(this.width, canvas.width - this.width);
        this.y = -this.height;
        this.speed = 1.2 + level * 0.15;
        this.health = 20 + level * 5;
        this.maxHealth = this.health;
        this.score = 10;
        this.xp = 5;
        this.shootCooldown = 0;
        this.type = 1;
        this.angle = 0;
    }

    update() {
        this.y += this.speed;
        this.shootCooldown--;
        this.angle += 0.05;

        if (this.shootCooldown <= 0 && Math.random() < 0.01) {
            enemyBullets.push(new Bullet(
                this.x + this.width / 2,
                this.y + this.height,
                0,
                3,
                5,
                '#ff4444'
            ));
            this.shootCooldown = 120;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = '#ff6600';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, 0);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(-this.width / 2, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#330000';
        ctx.fillRect(this.x, this.y - 8, this.width, 4);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y - 8, this.width * healthPercent, 4);
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

class EnemyType2 {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = random(this.width, canvas.width - this.width);
        this.y = -this.height;
        this.speed = 0.8 + level * 0.1; // Ralenti
        this.health = 50 + level * 10;
        this.maxHealth = this.health;
        this.score = 25;
        this.xp = 10;
        this.shootCooldown = 0;
        this.type = 2;
        this.angle = 0;
    }

    update() {
        this.y += this.speed;
        this.shootCooldown--;
        this.angle += 0.02;

        if (this.shootCooldown <= 0 && Math.random() < 0.015) {
            enemyBullets.push(new Bullet(
                this.x + this.width / 2,
                this.y + this.height,
                0,
                2.5,
                8,
                '#ff00ff'
            ));
            this.shootCooldown = 80;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = '#9900ff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#9900ff';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const radius = this.width / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#cc66ff';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#330033';
        ctx.fillRect(this.x, this.y - 8, this.width, 4);
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(this.x, this.y - 8, this.width * healthPercent, 4);
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

class EnemyType3 {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = random(this.width, canvas.width - this.width);
        this.y = -this.height;
        this.speed = 1 + level * 0.12;
        this.health = 35 + level * 7;
        this.maxHealth = this.health;
        this.score = 20;
        this.xp = 12;
        this.shootCooldown = 0;
        this.type = 3;
        this.rotation = 0;
    }

    update() {
        this.y += this.speed;
        this.shootCooldown--;
        this.rotation += 0.04;

        if (this.shootCooldown <= 0) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const bulletSpeed = 2.8 + Math.min(2, level * 0.08);
            const damage = 6 + Math.floor(level * 0.5);

            enemyBullets.push(new Bullet(centerX, centerY, 0, bulletSpeed, damage, '#33ddff'));
            enemyBullets.push(new Bullet(centerX, centerY, 0, -bulletSpeed, damage, '#33ddff'));
            enemyBullets.push(new Bullet(centerX, centerY, bulletSpeed, 0, damage, '#33ddff'));
            enemyBullets.push(new Bullet(centerX, centerY, -bulletSpeed, 0, damage, '#33ddff'));

            this.shootCooldown = Math.max(60, 160 - level * 6);
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        ctx.shadowBlur = 12;
        ctx.shadowColor = '#33ddff';

        ctx.fillStyle = '#0066ff';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.fillStyle = '#33ddff';
        ctx.fillRect(-5, -this.height / 2, 10, this.height);
        ctx.fillRect(-this.width / 2, -5, this.width, 10);

        ctx.shadowBlur = 0;
        ctx.restore();

        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#001133';
        ctx.fillRect(this.x, this.y - 8, this.width, 4);
        ctx.fillStyle = '#33ddff';
        ctx.fillRect(this.x, this.y - 8, this.width * healthPercent, 4);
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

class Boss {
    constructor() {
        this.width = 80;
        this.height = 80;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = 50;
        this.health = 200 + level * 50;
        this.maxHealth = this.health;
        this.speed = 1;
        this.direction = 1;
        this.shootCooldown = 0;
        this.score = 100;
        this.xp = 50;
        this.angle = 0;
        this.pulse = 0;
    }

    update() {
        this.x += this.speed * this.direction;
        if (this.x <= 0 || this.x >= canvas.width - this.width) {
            this.direction *= -1;
        }

        this.shootCooldown--;
        this.angle += 0.03;
        this.pulse += 0.15;

        if (this.shootCooldown <= 0) {
            enemyBullets.push(new Bullet(
                this.x + this.width / 2,
                this.y + this.height,
                0,
                3,
                10,
                '#ff0000'
            ));
            enemyBullets.push(new Bullet(
                this.x + this.width / 2,
                this.y + this.height,
                -1,
                3,
                10,
                '#ff0000'
            ));
            enemyBullets.push(new Bullet(
                this.x + this.width / 2,
                this.y + this.height,
                1,
                3,
                10,
                '#ff0000'
            ));
            this.shootCooldown = 60;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        
        const size = this.width / 2 + Math.sin(this.pulse) * 5;
        
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff0000';
        
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const radius = i % 2 === 0 ? size : size * 0.6;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ff6666';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        const barWidth = canvas.width - 600;
        const barHeight = 25;
        
        const barX = (canvas.width - barWidth) / 2; 
        const barY = 10;
        
        ctx.fillStyle = '#330000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS', canvas.width / 2, barY + 20);
        
        ctx.textAlign = 'left';
        
    }
}

class Pickup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 2;
        this.amount = 10;
        this.type = 'bullet';
        this.angle = 0;
        this.pulse = 0;
    }

    update() {
        this.y += this.speed;
        this.angle += 0.1;
        this.pulse += 0.2;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        
        const size = this.width / 2 + Math.sin(this.pulse) * 3;
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00ffff';
        
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const radius = i % 2 === 0 ? size : size * 0.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

class HeartPickup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.width = 28;
        this.height = 28;
        this.amount = 30;
        this.type = 'heart';
        this.rotation = 0;
        this.pulse = Math.random() * Math.PI * 2;
        this.floatPhase = Math.random() * Math.PI * 2;
        this.floatRange = 6;
        this.spawnedAt = performance.now();
        this.lifetime = 6000;
    }

    update() {
        this.rotation += 0.03;
        this.pulse += 0.18;
        this.floatPhase += 0.05;
        this.y = this.baseY + Math.sin(this.floatPhase) * this.floatRange;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        const size = this.width / 2 + Math.sin(this.pulse) * 3;
        
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#ff2244';
        
        ctx.fillStyle = '#ff2244';
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(0, -size * 0.3, -size * 0.7, -size * 0.3, -size * 0.7, 0);
        ctx.bezierCurveTo(-size * 0.7, size * 0.4, 0, size * 0.8, 0, size * 1.1);
        ctx.bezierCurveTo(0, size * 0.8, size * 0.7, size * 0.4, size * 0.7, 0);
        ctx.bezierCurveTo(size * 0.7, -size * 0.3, 0, -size * 0.3, 0, size * 0.3);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ff6680';
        ctx.beginPath();
        ctx.arc(0, size * 0.25, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    isOffScreen() {
        return performance.now() - this.spawnedAt > this.lifetime;
    }
}

