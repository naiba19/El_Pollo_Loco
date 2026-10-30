class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.prevFeetY = this.y + this.height;
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (!(this instanceof ThrowableObject) && this.y > 180) {
                    this.y = 180;
                    this.speedY = 0;
                }
            } else {
                this.prevFeetY = this.y + this.height;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
    if (this instanceof ThrowableObject) {
        return true; 
    } else {
        return this.y < 180;
    }
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }

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
        // swept check: feet were above the enemy top last frame and are at/below it now
        return prevFeet <= enemyTop + mo.height * 0.6 && feetY >= enemyTop;
    }

    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // Time since last hit in milliseconds
    timePassed = timePassed / 1000; // Convert milliseconds to seconds
    return timePassed < 1.5;
}

isDead() {
    return this.energy == 0;
}


playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
}

playAnimationOnce(images) {
    if (this.currentImage >= images.length) {
        this.img = this.imageCache[images[images.length - 1]];
        return;
    }
    let path = images[this.currentImage];
    this.img = this.imageCache[path];
    this.currentImage++;
}

moveRight() {
    this.x += this.speed;
}

moveLeft() {
    this.x -= this.speed;
}

jump() {
    this.speedY = 30;
}
}
