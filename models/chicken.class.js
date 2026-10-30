class Chicken extends MovableObject {

    height = 55;
    width = 70;
    y = 360;
    energy = 20;
    IMAGES_WALKING = [
        "images/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "images/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "images/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];
    IMAGE_DEAD = "images/3_enemies_chicken/chicken_normal/2_dead/dead.png";

    constructor() {
        super().loadImage("images/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);

        this.x = 400 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;

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