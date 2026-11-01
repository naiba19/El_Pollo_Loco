class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Starts the gravity loop that pulls the object toward the ground.
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
            this.updateVerticalPosition();
        }, 1000 / 25);
    }

    /**
     * Updates the vertical position and speed for one gravity step.
     * @returns {void}
     */
    updateVerticalPosition() {
        this.prevFeetY = this.y + this.height;
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.landOnGround();
        }
    }

    /**
     * Stops the object at ground level once it falls past it.
     * @returns {void}
     */
    landOnGround() {
        if (!(this instanceof ThrowableObject) && this.y > 180) {
            this.y = 180;
            this.speedY = 0;
        }
    }

    /**
     * Checks whether the object is currently above the ground.
     * @returns {boolean} True when the object is in the air.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Checks whether this object's collision box overlaps another object's box.
     * @param {DrawableObject} mo - The other object to test against.
     * @returns {boolean} True when the offset-adjusted boxes overlap.
     */
    isColliding(mo) {
        let a = this.getCollisionBox();
        let b = mo.getCollisionBox();
        return a.right > b.left &&
            a.bottom > b.top &&
            a.left < b.right &&
            a.top < b.bottom;
    }

    /**
     * Checks whether the object is falling onto another object from above.
     * @param {DrawableObject} mo - The object being landed on.
     * @returns {boolean} True when the feet cross the target's top while falling.
     */
    isFallingOn(mo) {
        if (this.speedY >= 0) {
            return false;
        }
        let horizontalOverlap = this.x + this.width > mo.x && this.x < mo.x + mo.width;
        if (!horizontalOverlap) {
            return false;
        }
        let feetY = this.y + this.height;
        let prevFeet = this.prevFeetY !== undefined ? this.prevFeetY : feetY;
        let enemyTop = mo.y;
        return prevFeet <= enemyTop + mo.height * 0.6 && feetY >= enemyTop;
    }

    /**
     * Reduces energy by the given damage and records the hit time.
     * @param {number} [damage=5] - The amount of energy to subtract.
     * @returns {void}
     */
    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object was hit within the last 1.5 seconds.
     * @returns {boolean} True while the hurt animation should play.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1.5;
    }

    /**
     * Checks whether the object has no energy left.
     * @returns {boolean} True when energy is zero.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Advances to the next frame of a looping animation.
     * @param {string[]} images - The animation frame paths.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Plays an animation once and holds on its last frame.
     * @param {string[]} images - The animation frame paths.
     * @returns {void}
     */
    playAnimationOnce(images) {
        if (this.currentImage >= images.length) {
            this.img = this.imageCache[images[images.length - 1]];
            return;
        }
        let path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right by its speed.
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its speed.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Launches the object upward to start a jump.
     * @returns {void}
     */
    jump() {
        this.speedY = 30;
    }
}
