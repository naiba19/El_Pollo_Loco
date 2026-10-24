class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;

    IMAGES_WALKING = [
        "images/4_enemie_boss_chicken/1_walk/G1.png",
        "images/4_enemie_boss_chicken/1_walk/G2.png",
        "images/4_enemie_boss_chicken/1_walk/G3.png",
        "images/4_enemie_boss_chicken/1_walk/G4.png",
        "images/4_enemie_boss_chicken/1_walk/G5.png",
        "images/4_enemie_boss_chicken/1_walk/G6.png",
        "images/4_enemie_boss_chicken/1_walk/G7.png",
        "images/4_enemie_boss_chicken/1_walk/G8.png",
        "images/4_enemie_boss_chicken/1_walk/G9.png",
        "images/4_enemie_boss_chicken/1_walk/G10.png",
        "images/4_enemie_boss_chicken/1_walk/G11.png",
        "images/4_enemie_boss_chicken/1_walk/G12.png",
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 500;
        this.animate();
    }

    animate() {

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}