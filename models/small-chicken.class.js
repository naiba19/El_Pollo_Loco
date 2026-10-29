class SmallChicken extends MovableObject {

    height = 40;
    width = 50;
    y = 375;
    energy = 20;
    IMAGES_WALKING = [
        "images/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "images/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "images/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];
    IMAGE_DEAD = "images/3_enemies_chicken/chicken_small/2_dead/dead.png";

    constructor() {
        super().loadImage("images/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);

        this.x = 600 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.35;

        this.animate();
    }

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
