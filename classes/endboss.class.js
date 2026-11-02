class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    energy = 100;
    offset = { top: 60, left: 30, right: 30, bottom: 20 };

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

    /**
     * Creates the endboss, loads its sprites and starts its behavior loops.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 2100;
        this.speed = 0.5;
        this.alertRange = 400;
        this.attackRange = 220;
        this.animate();
    }

    /**
     * Starts the movement and animation loops for the endboss.
     * @returns {void}
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Runs the loop that walks the endboss toward the character when in range.
     * @returns {void}
     */
    startMovementLoop() {
        this.moveInterval = setInterval(() => {
            if (this.isDead() || this.isHurt()) {
                return;
            }
            if (this.getDistanceToCharacter() < this.alertRange) {
                this.playApproachSoundOnce();
                this.moveLeft();
            }
        }, 1000 / 60);
    }

    /**
     * Plays the endboss approach sound the first time the character comes into range.
     * @returns {void}
     */
    playApproachSoundOnce() {
        if (!this.approachSoundPlayed) {
            this.approachSoundPlayed = true;
            audioManager.play('endbossApproach');
        }
    }

    /**
     * Runs the loop that picks the endboss sprite set based on its state.
     * @returns {void}
     */
    startAnimationLoop() {
        this.animationInterval = setInterval(() => {
            this.updateAnimation();
        }, 200);
    }

    /**
     * Selects and plays the animation matching the endboss's current state.
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.getDistanceToCharacter() < this.attackRange) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Plays the death animation once, starting from the first frame.
     * @returns {void}
     */
    playDeathAnimation() {
        if (!this.deathAnimationStarted) {
            this.currentImage = 0;
            this.deathAnimationStarted = true;
        }
        this.playAnimationOnce(this.IMAGES_DEAD);
    }

    /**
     * Computes the horizontal distance to the character.
     * @returns {number} The distance in pixels, or a large value when no world is linked.
     */
    getDistanceToCharacter() {
        return this.world ? Math.abs(this.world.character.x - this.x) : 9999;
    }
}