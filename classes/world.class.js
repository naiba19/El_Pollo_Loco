class World {
    character = new Character();
    level = level1;
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
        this.renderer = new WorldRenderer(canvas);
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
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /**
     * Starts the recurring game-logic loops (collisions, game over, jump-kills).
     * @returns {void}
     */
    run() {
        this.startLoop(() => this.runGameLogicChecks(), 200);
        this.startLoop(() => this.checkJumpKills(), 1000 / 60);
    }

    /**
     * Runs a check repeatedly while the game is not over.
     * @param {Function} check - The check to run on each tick.
     * @param {number} interval - The tick interval in milliseconds.
     * @returns {void}
     */
    startLoop(check, interval) {
        setInterval(() => {
            if (!this.gameOver) {
                check();
            }
        }, interval);
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
        if (this.canThrowBottle(now)) {
            this.throwBottle(now);
        }
    }

    /**
     * Checks whether a bottle can be thrown at the given time.
     * @param {number} now - The current timestamp in milliseconds.
     * @returns {boolean} True when the throw key is held, a bottle is available and the cooldown passed.
     */
    canThrowBottle(now) {
        return this.keyboard.D && this.collectedBottles > 0 && now - this.lastThrowTime > this.throwCooldown;
    }

    /**
     * Throws a bottle in the character's facing direction and updates the bottle bar.
     * @param {number} now - The current timestamp in milliseconds.
     * @returns {void}
     */
    throwBottle(now) {
        this.lastThrowTime = now;
        this.collectedBottles--;
        this.bottleBar.setPercentage(this.collectedBottles * 20);
        let otherDirection = this.character.otherDirection;
        let bottleX = otherDirection ? this.character.x - 50 : this.character.x + 100;
        this.throwableObjects.push(new ThrowableObject(bottleX, this.character.y + 100, otherDirection));
        this.character.recordActivity();
        audioManager.play('bottleThrow');
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
        this.checkCollectibles(this.level.coins, 'collectedCoins', this.coinBar, 'coin');
    }

    /**
     * Collects bottles the character touches and updates the bottle status bar.
     * @returns {void}
     */
    checkBottleCollisions() {
        this.checkCollectibles(this.level.bottles, 'collectedBottles', this.bottleBar, 'bottleCollect');
    }

    /**
     * Collects touched items of one kind, counts them, updates the bar and plays a sound.
     * @param {DrawableObject[]} items - The collectible items to check.
     * @param {string} counterKey - The world field counting the collected items.
     * @param {StatusBarBase} bar - The status bar to update.
     * @param {string} soundName - The collection sound key.
     * @returns {void}
     */
    checkCollectibles(items, counterKey, bar, soundName) {
        items.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                items.splice(index, 1);
                this[counterKey]++;
                bar.setPercentage(this[counterKey] * 20);
                audioManager.play(soundName);
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
        let endboss = this.getEndboss();
        if (endboss && endboss.isDead()) {
            this.endGame("images/You won, you lost/You won A.png", 'gameWin');
        }
    }

    /**
     * Returns the endboss of the current level.
     * @returns {Endboss|undefined} The endboss, or undefined when the level has none.
     */
    getEndboss() {
        return this.level.enemies.find(e => e instanceof Endboss);
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
        audioManager.playLoop('music');
    }

    /**
     * Restores the character's position, energy and animation state.
     * @returns {void}
     */
    resetCharacter() {
        Object.assign(this.character, {
            energy: 100,
            x: 120,
            y: 80,
            speedY: 0,
            currentImage: 0,
            deathAnimationStarted: false,
            otherDirection: false,
            lastHit: 0,
            lastMoveTime: new Date().getTime(),
            isRunningSoundPlaying: false,
            isSnoreSoundPlaying: false
        });
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
     * Renders one frame and schedules the next animation frame.
     * @returns {void}
     */
    draw() {
        this.renderer.render(this);
        requestAnimationFrame(() => this.draw());
    }
}
