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
    endbossBar = new EndbossBar();
    throwableObjects = [];
    collectedBottles = 0;
    collectedCoins = 0;
    lastThrowTime = 0;
    throwCooldown = 500;
    gameOver = false;
    gameOverImage = null;

    /**
     * Creates the game world, starts rendering and the game loop.
     * @param {HTMLCanvasElement} canvas - The canvas element to render on.
     * @param {Keyboard} keyboard - The shared keyboard state.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Links the world to the character and the endboss so they can read game state.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    /**
     * Starts the recurring game-logic loops (collisions, game over, jump-kills).
     * @returns {void}
     */
    run() {
        setInterval(() => {
            if (!this.gameOver) {
                this.runGameLogicChecks();
            }
        }, 200);
        setInterval(() => {
            if (!this.gameOver) {
                this.checkJumpKills();
            }
        }, 1000 / 60);
    }

    /**
     * Runs the recurring collision, collection and game-over checks.
     * @returns {void}
     */
    runGameLogicChecks() {
        this.checkCollisions();
        this.checkThrowableObjects();
        this.checkThrowableObjectsCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkGameOver();
    }

    /**
     * Defeats non-boss enemies the character lands on from above and bounces the character.
     * @returns {void}
     */
    checkJumpKills() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead() || enemy instanceof Endboss) {
                return;
            }
            if (this.character.isFallingOn(enemy)) {
                enemy.hit(20);
                audioManager.play('chickenDead');
                this.character.jump();
            }
        });
    }

    /**
     * Throws a bottle when the throw key is pressed, a bottle is available and the cooldown passed.
     * @returns {void}
     */
    checkThrowableObjects() {
        let now = new Date().getTime();
        if (this.keyboard.D && this.collectedBottles > 0 && now - this.lastThrowTime > this.throwCooldown) {
            this.lastThrowTime = now;
            this.collectedBottles--;
            this.bottleBar.setPercentage(this.collectedBottles * 20);
            let otherDirection = this.character.otherDirection;
            let bottleX = otherDirection ? this.character.x - 50 : this.character.x + 100;
            let bottle = new ThrowableObject(bottleX, this.character.y + 100, otherDirection);
            this.throwableObjects.push(bottle);
            this.character.recordActivity();
            audioManager.play('bottleThrow');
        }
    }

    /**
     * Applies damage to the character when colliding with a live enemy (not a jump-kill).
     * @returns {void}
     */
    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead() || !this.character.isColliding(enemy)) {
                return;
            }
            if (!(enemy instanceof Endboss) && this.character.isFallingOn(enemy)) {
                return;
            }
            this.character.hit();
            audioManager.play('damage');
            this.statusBar.setPercentage(this.character.energy);
        });
    }

    /**
     * Damages the first live enemy hit by a thrown bottle and removes spent bottles.
     * @returns {void}
     */
    checkThrowableObjectsCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            let hitEnemy = this.level.enemies.find(enemy => !enemy.isDead() && bottle.isColliding(enemy));
            if (hitEnemy) {
                this.handleBottleHit(hitEnemy);
                this.throwableObjects.splice(bottleIndex, 1);
            } else if (bottle.y > 400) {
                audioManager.play('bottleBreak');
                this.throwableObjects.splice(bottleIndex, 1);
            }
        });
    }

    /**
     * Applies bottle damage and plays the matching break and hurt/death sounds once.
     * @param {MovableObject} enemy - The enemy the bottle hit.
     * @returns {void}
     */
    handleBottleHit(enemy) {
        audioManager.play('bottleBreak');
        enemy.hit(20);
        if (enemy instanceof Endboss) {
            this.endbossBar.setPercentage(enemy.energy);
        }
        if (enemy.isDead()) {
            audioManager.play('chickenDead');
        } else {
            audioManager.play('chickenHurt');
        }
    }

    /**
     * Collects coins the character touches and updates the coin status bar.
     * @returns {void}
     */
    checkCoinCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.collectedCoins++;
                this.coinBar.setPercentage(this.collectedCoins * 20);
                audioManager.play('coin');
            }
        });
    }

    /**
     * Collects bottles the character touches and updates the bottle status bar.
     * @returns {void}
     */
    checkBottleCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.collectedBottles++;
                this.bottleBar.setPercentage(this.collectedBottles * 20);
                audioManager.play('bottleCollect');
            }
        });
    }

    /**
     * Sets the game-over state and picks the win or loss endscreen image.
     * @returns {void}
     */
    checkGameOver() {
        if (this.gameOver) {
            return;
        }
        if (this.character.isDead()) {
            this.endGame("images/9_intro_outro_screens/game_over/you lost.png", 'gameLose');
        }
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.endGame("images/You won, you lost/You won A.png", 'gameWin');
        }
    }

    /**
     * Ends the game once: sets the endscreen image, stops loops and plays the end sound.
     * @param {string} imageSrc - The win or loss image path.
     * @param {string} soundName - The win or loss sound key.
     * @returns {void}
     */
    endGame(imageSrc, soundName) {
        this.gameOver = true;
        this.gameOverImage = new Image();
        this.gameOverImage.src = imageSrc;
        audioManager.stopAllLoops();
        audioManager.play(soundName);
    }

    /**
     * Resets the world to a fresh level so the game can be restarted without a reload.
     * @returns {void}
     */
    restart() {
        document.getElementById('restart').style.display = 'none';
        document.getElementById('home').style.display = 'none';
        this.gameOver = false;
        this.gameOverImage = null;
        this.resetCharacter();
        this.resetProgress();
        this.level = createLevel1();
        this.setWorld();
    }

    /**
     * Restores the character's position, energy and animation state.
     * @returns {void}
     */
    resetCharacter() {
        this.character.energy = 100;
        this.character.x = 120;
        this.character.y = 80;
        this.character.speedY = 0;
        this.character.currentImage = 0;
        this.character.deathAnimationStarted = false;
        this.character.otherDirection = false;
        this.character.lastHit = 0;
        this.character.lastMoveTime = new Date().getTime();
        this.character.isRunningSoundPlaying = false;
        this.character.isSnoreSoundPlaying = false;
    }

    /**
     * Resets collected items, status bars, thrown bottles and the camera.
     * @returns {void}
     */
    resetProgress() {
        this.collectedBottles = 0;
        this.collectedCoins = 0;
        this.throwableObjects = [];
        this.statusBar.setPercentage(100);
        this.bottleBar.setPercentage(0);
        this.coinBar.setPercentage(0);
        this.endbossBar.setPercentage(100);
        this.camera_x = 0;
    }

    /**
     * Renders one frame: background, status bars, gameplay objects and endscreen.
     * @returns {void}
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackgroundLayer();
        this.drawStatusBars();
        this.drawGameplayLayer();
        this.drawEndscreen();
        this.scheduleNextFrame();
    }

    /**
     * Draws the scrolling background scenery and clouds behind everything else.
     * @returns {void}
     */
    drawBackgroundLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws the fixed status bars (health, bottles, coins) on top of the world.
     * @returns {void}
     */
    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        if (this.isEndbossVisible()) {
            this.addToMap(this.endbossBar);
        }
    }

    /**
     * Checks whether the endboss is currently visible on the screen.
     * @returns {boolean} True when any part of the endboss is within the viewport.
     */
    isEndbossVisible() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (!endboss || endboss.isDead()) {
            return false;
        }
        let screenLeft = -this.camera_x;
        let screenRight = screenLeft + this.canvas.width;
        return endboss.x + endboss.width > screenLeft && endboss.x < screenRight;
    }

    /**
     * Draws the character, enemies and collectibles in front of the clouds.
     * @returns {void}
     */
    drawGameplayLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.drawSleepEffect();
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws a floating "Zzz" effect above the character while he is sleeping.
     * @returns {void}
     */
    drawSleepEffect() {
        if (!this.character.isSleeping()) {
            return;
        }
        let c = this.character;
        let x = c.otherDirection ? c.x + 20 : c.x + c.width - 20;
        let y = c.y + 30;
        this.ctx.save();
        this.ctx.font = "700 22px Poppins, Arial, sans-serif";
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        this.ctx.strokeStyle = "rgba(122, 59, 18, 0.8)";
        this.ctx.lineWidth = 3;
        this.ctx.strokeText("Z", x, y);
        this.ctx.fillText("Z", x, y);
        this.ctx.font = "700 16px Poppins, Arial, sans-serif";
        this.ctx.strokeText("z", x + 14, y - 14);
        this.ctx.fillText("z", x + 14, y - 14);
        this.ctx.font = "700 12px Poppins, Arial, sans-serif";
        this.ctx.strokeText("z", x + 26, y - 26);
        this.ctx.fillText("z", x + 26, y - 26);
        this.ctx.restore();
    }

    /**
     * Draws the win/loss image and reveals the restart and home buttons.
     * @returns {void}
     */
    drawEndscreen() {
        if (this.gameOver && this.gameOverImage) {
            this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            document.getElementById('restart').style.display = 'inline-block';
            document.getElementById('home').style.display = 'inline-block';
        }
    }

    /**
     * Requests the next animation frame to keep the render loop running.
     * @returns {void}
     */
    scheduleNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Draws a list of objects to the canvas.
     * @param {DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a single object, flipping it horizontally when it faces left.
     * @param {DrawableObject} mo - The object to draw.
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Mirrors the canvas context so the object is drawn facing left.
     * @param {DrawableObject} mo - The object to flip.
     * @returns {void}
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas context after drawing a flipped object.
     * @param {DrawableObject} mo - The object to restore.
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
