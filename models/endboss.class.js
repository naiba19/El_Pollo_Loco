class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    energy = 100;

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

    IMAGES_HURT = [
        "images/4_enemie_boss_chicken/4_hurt/G21.png",
        "images/4_enemie_boss_chicken/4_hurt/G22.png",
        "images/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    IMAGES_DEAD = [
        "images/4_enemie_boss_chicken/5_dead/G24.png",
        "images/4_enemie_boss_chicken/5_dead/G25.png",
        "images/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    IMAGES_ATTACK = [
        "images/4_enemie_boss_chicken/3_attack/G13.png",
        "images/4_enemie_boss_chicken/3_attack/G14.png",
        "images/4_enemie_boss_chicken/3_attack/G15.png",
        "images/4_enemie_boss_chicken/3_attack/G16.png",
        "images/4_enemie_boss_chicken/3_attack/G17.png",
        "images/4_enemie_boss_chicken/3_attack/G18.png",
        "images/4_enemie_boss_chicken/3_attack/G19.png",
        "images/4_enemie_boss_chicken/3_attack/G20.png"
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 2100;
        this.speed = 0.5;
        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead() && !this.isHurt()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}