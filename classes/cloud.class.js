class Cloud extends MovableObject {
    height = 250;
    width = 500;

    /**
     * Creates a cloud at the given position with a random drift speed and starts its drift.
     * @param {number} x - The horizontal start position.
     * @param {number} [y=50] - The vertical position.
     */
    constructor(x, y = 50) {
        super().loadImage("images/5_background/layers/4_clouds/1.png");
        this.x = x;
        this.y = y;
        this.speed = 0.1 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Starts the cloud's horizontal drift.
     * @returns {void}
     */
    animate() {
        this.moveLeft();
    }

    /**
     * Moves the cloud slowly to the left, looping back to the right when it leaves the level.
     * @returns {void}
     */
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
            if (this.x + this.width < -719) {
                this.x = 719 * 3;
            }
        }, 1000 / 60);
    }
}