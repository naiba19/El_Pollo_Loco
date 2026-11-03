class WorldRenderer {

    /**
     * Creates the renderer for the given canvas.
     * @param {HTMLCanvasElement} canvas - The canvas element to render on.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    /**
     * Renders one frame: background, status bars, gameplay objects and endscreen.
     * @param {World} world - The world state to render.
     * @returns {void}
     */
    render(world) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackgroundLayer(world);
        this.drawStatusBars(world);
        this.drawGameplayLayer(world);
        this.drawEndscreen(world);
    }

    /**
     * Draws the scrolling background scenery and clouds behind everything else.
     * @param {World} world - The world state to render.
     * @returns {void}
     */
    drawBackgroundLayer(world) {
        this.ctx.translate(world.camera_x, 0);
        this.addObjectsToMap(world.level.backgroundObjects);
        this.addObjectsToMap(world.level.clouds);
        this.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Draws the fixed status bars (health, bottles, coins) on top of the world.
     * @param {World} world - The world state to render.
     * @returns {void}
     */
    drawStatusBars(world) {
        this.addObjectsToMap([world.statusBar, world.bottleBar, world.coinBar]);
        if (this.isEndbossVisible(world)) {
            this.addToMap(world.endbossBar);
        }
    }

    /**
     * Checks whether the endboss is currently visible on the screen.
     * @param {World} world - The world state to check.
     * @returns {boolean} True when any part of the endboss is within the viewport.
     */
    isEndbossVisible(world) {
        let endboss = world.getEndboss();
        if (!endboss || endboss.isDead()) {
            return false;
        }
        let screenLeft = -world.camera_x;
        let screenRight = screenLeft + this.canvas.width;
        return endboss.x + endboss.width > screenLeft && endboss.x < screenRight;
    }

    /**
     * Draws the character, enemies and collectibles in front of the clouds.
     * @param {World} world - The world state to render.
     * @returns {void}
     */
    drawGameplayLayer(world) {
        this.ctx.translate(world.camera_x, 0);
        this.addToMap(world.character);
        this.drawSleepEffect(world.character);
        this.addObjectsToMap(world.level.enemies);
        this.addObjectsToMap(world.level.coins);
        this.addObjectsToMap(world.level.bottles);
        this.addObjectsToMap(world.throwableObjects);
        this.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Draws a floating "Zzz" effect above the character while he is sleeping.
     * @param {Character} character - The character to draw the effect for.
     * @returns {void}
     */
    drawSleepEffect(character) {
        if (!character.isSleeping()) {
            return;
        }
        let x = character.otherDirection ? character.x + 20 : character.x + character.width - 20;
        let y = character.y + 30;
        this.ctx.save();
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        this.ctx.strokeStyle = "rgba(122, 59, 18, 0.8)";
        this.ctx.lineWidth = 3;
        [["700 22px", "Z", 0, 0], ["700 16px", "z", 14, -14], ["700 12px", "z", 26, -26]].forEach(([font, text, dx, dy]) => {
            this.ctx.font = `${font} Poppins, Arial, sans-serif`;
            this.ctx.strokeText(text, x + dx, y + dy);
            this.ctx.fillText(text, x + dx, y + dy);
        });
        this.ctx.restore();
    }

    /**
     * Draws the win/loss image and reveals the restart and home buttons.
     * @param {World} world - The world state to render.
     * @returns {void}
     */
    drawEndscreen(world) {
        if (world.gameOver && world.gameOverImage) {
            this.ctx.drawImage(world.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
            document.getElementById('restart').style.display = 'inline-block';
            document.getElementById('home').style.display = 'inline-block';
        }
    }

    /**
     * Draws a list of objects to the canvas.
     * @param {DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
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
        mo.x *= -1;
    }

    /**
     * Restores the canvas context after drawing a flipped object.
     * @param {DrawableObject} mo - The object to restore.
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x *= -1;
        this.ctx.restore();
    }
}
