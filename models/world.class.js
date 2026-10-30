class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    bottleBar = new BottleBar();
    coinBar = new CoinBar();
    throwableObjects = [];
    collectedBottles = 0;
    collectedCoins = 0;
    lastThrowTime = 0;
    throwCooldown = 500;
    gameOver = false;
    gameOverImage = null;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
            }
        });
    }

    run() {
        setInterval(() => {
            if (!this.gameOver) {
                this.checkCollisions();
                this.checkThrowableObjects();
                this.checkThrowableObjectsCollisions();
                this.checkCoinCollisions();
                this.checkBottleCollisions();
                this.checkGameOver();
            }
        }, 200);
        setInterval(() => {
            if (!this.gameOver) {
                this.checkJumpKills();
            }
        }, 1000 / 60);
    }

    checkJumpKills() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead() || enemy instanceof Endboss) {
                return;
            }
            if (this.character.isFallingOn(enemy)) {
                enemy.hit(20);
                this.character.jump();
            }
        });
    }

    checkThrowableObjects() {
        let now = new Date().getTime();
        if (this.keyboard.D && this.collectedBottles > 0 && now - this.lastThrowTime > this.throwCooldown) {
            this.lastThrowTime = now;
            this.collectedBottles--;
            this.bottleBar.setPercentage(this.collectedBottles * 20);
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead() || !this.character.isColliding(enemy)) {
                return;
            }
            if (!(enemy instanceof Endboss) && this.character.isFallingOn(enemy)) {
                return;
            }
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        });
    }

    checkThrowableObjectsCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            let hitEnemy = this.level.enemies.find(enemy => !enemy.isDead() && bottle.isColliding(enemy));
            if (hitEnemy) {
                hitEnemy.hit(20);
                this.throwableObjects.splice(bottleIndex, 1);
            } else if (bottle.y > 400) {
                this.throwableObjects.splice(bottleIndex, 1);
            }
        });
    }

    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.collectedCoins++;
                this.coinBar.setPercentage(this.collectedCoins * 20);
            }
        });
    }

    checkBottleCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.collectedBottles++;
                this.bottleBar.setPercentage(this.collectedBottles * 20);
            }
        });
    }

    checkGameOver() {
        if (this.character.isDead()) {
            this.gameOver = true;
            this.gameOverImage = new Image();
            this.gameOverImage.src = "images/9_intro_outro_screens/game_over/you lost.png";
        }
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.gameOver = true;
            this.gameOverImage = new Image();
            this.gameOverImage.src = "images/You won, you lost/You won A.png";
        }
    }

    restart() {
        document.getElementById('restart').style.display = 'none';
        this.gameOver = false;
        this.gameOverImage = null;
        this.character.energy = 100;
        this.character.x = 120;
        this.character.y = 80;
        this.character.speedY = 0;
        this.character.currentImage = 0;
        this.character.deathAnimationStarted = false;
        this.character.otherDirection = false;
        this.character.lastHit = 0;
        this.collectedBottles = 0;
        this.collectedCoins = 0;
        this.throwableObjects = [];
        this.statusBar.setPercentage(100);
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);
        this.camera_x = 0;
        this.level = createLevel1();
        this.setWorld();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        if (this.gameOver && this.gameOverImage) {
            this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            document.getElementById('restart').style.display = 'inline-block';
        }

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
