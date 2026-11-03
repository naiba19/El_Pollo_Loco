class SmallChicken extends MovableObject {

    height = 40;
    width = 50;
    y = 375;
    energy = 20;
    offset = { top: 4, left: 4, right: 4, bottom: 4 };
    IMAGES_WALKING = [
        "images/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "images/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "images/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];
    IMAGE_DEAD = "images/3_enemies_chicken/chicken_small/2_dead/dead.png";

    /**
     * Creates a small chicken with a random position and speed.
     * @param {{min: number, max: number}} [spawnRange] - Optional horizontal spawn range.
     */
    constructor(spawnRange) {
        super().loadImage("images/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);

        let min = spawnRange ? spawnRange.min : 720;
        let max = spawnRange ? spawnRange.max : 2100;
        this.x = min + Math.random() * (max - min);
        this.speed = 0.15 + Math.random() * 0.35;

        this.animate();
    }

    /**
     * Starts the movement and animation loops for the small chicken.
     * @returns {void}
     */
    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                this.img = this.imageCache[this.IMAGE_DEAD];
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}
