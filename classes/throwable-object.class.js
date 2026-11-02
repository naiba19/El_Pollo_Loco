class ThrowableObject extends MovableObject {

    /**
     * Creates a thrown bottle at the given position and launches it.
     * @param {number} x - The horizontal start position.
     * @param {number} y - The vertical start position.
     * @param {boolean} otherDirection - True when the bottle is thrown to the left.
     */
    constructor(x, y, otherDirection) {
        super().loadImage("images/6_salsa_bottle/salsa_bottle.png");
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.throw();
    }

    /**
     * Launches the bottle forward with an upward arc and gravity.
     * @returns {void}
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += this.otherDirection ? -10 : 10;
        }, 25);
    }
}