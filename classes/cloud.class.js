class Cloud extends MovableObject {
    y = 50;
    height = 250;
    width = 500;

    /**
     * Creates a cloud at a random horizontal position and starts its drift.
     */
    constructor() {
        super().loadImage("images/5_background/layers/4_clouds/1.png");

        this.x = Math.random() * 500;

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
     * Moves the cloud slowly to the left.
     * @returns {void}
     */
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}