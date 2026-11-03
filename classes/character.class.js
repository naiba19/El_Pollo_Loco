class Character extends MovableObject {

    height = 250;
    y = 80;
    speed = 10;
    offset = { top: 110, left: 25, right: 25, bottom: 10 };
    IMAGES_WALKING = [
        "images/2_character_pepe/2_walk/W-21.png",
        "images/2_character_pepe/2_walk/W-22.png",
        "images/2_character_pepe/2_walk/W-23.png",
        "images/2_character_pepe/2_walk/W-24.png",
        "images/2_character_pepe/2_walk/W-25.png",
        "images/2_character_pepe/2_walk/W-26.png"
    ];

    IMAGES_JUMPING = [
        "images/2_character_pepe/3_jump/J-31.png",
        "images/2_character_pepe/3_jump/J-32.png",
        "images/2_character_pepe/3_jump/J-33.png",
        "images/2_character_pepe/3_jump/J-34.png",
        "images/2_character_pepe/3_jump/J-35.png",
        "images/2_character_pepe/3_jump/J-36.png",
        "images/2_character_pepe/3_jump/J-37.png",
        "images/2_character_pepe/3_jump/J-38.png",
        "images/2_character_pepe/3_jump/J-39.png",
    ];

    IMAGES_DEAD = [
        "images/2_character_pepe/5_dead/D-51.png",
        "images/2_character_pepe/5_dead/D-52.png",
        "images/2_character_pepe/5_dead/D-53.png",
        "images/2_character_pepe/5_dead/D-54.png",
        "images/2_character_pepe/5_dead/D-55.png",
        "images/2_character_pepe/5_dead/D-56.png",
        "images/2_character_pepe/5_dead/D-57.png"
    ];

    IMAGES_HURT = [
        "images/2_character_pepe/4_hurt/H-41.png",
        "images/2_character_pepe/4_hurt/H-42.png",
        "images/2_character_pepe/4_hurt/H-43.png"
    ];

    IMAGES_IDLE = [
        "images/2_character_pepe/1_idle/idle/I-1.png",
        "images/2_character_pepe/1_idle/idle/I-2.png",
        "images/2_character_pepe/1_idle/idle/I-3.png",
        "images/2_character_pepe/1_idle/idle/I-4.png",
        "images/2_character_pepe/1_idle/idle/I-5.png",
        "images/2_character_pepe/1_idle/idle/I-6.png",
        "images/2_character_pepe/1_idle/idle/I-7.png",
        "images/2_character_pepe/1_idle/idle/I-8.png",
        "images/2_character_pepe/1_idle/idle/I-9.png",
        "images/2_character_pepe/1_idle/idle/I-10.png"
    ];

    IMAGES_SLEEP = [
        "images/2_character_pepe/1_idle/long_idle/I-11.png",
        "images/2_character_pepe/1_idle/long_idle/I-12.png",
        "images/2_character_pepe/1_idle/long_idle/I-13.png",
        "images/2_character_pepe/1_idle/long_idle/I-14.png",
        "images/2_character_pepe/1_idle/long_idle/I-15.png",
        "images/2_character_pepe/1_idle/long_idle/I-16.png",
        "images/2_character_pepe/1_idle/long_idle/I-17.png",
        "images/2_character_pepe/1_idle/long_idle/I-18.png",
        "images/2_character_pepe/1_idle/long_idle/I-19.png",
        "images/2_character_pepe/1_idle/long_idle/I-20.png"
    ];

    world;
    lastMoveTime = new Date().getTime();
    isRunningSoundPlaying = false;
    isSnoreSoundPlaying = false;

    /**
     * Creates the playable character, loads its sprites and starts gravity and animation.
     */
    constructor() {
        super().loadImage("images/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts the movement and animation loops for the character.
     * @returns {void}
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Runs the movement loop that reads the keyboard and moves the camera.
     * @returns {void}
     */
    startMovementLoop() {
        setInterval(() => {
            if (this.isDead()) {
                return;
            }
            this.handleMovement();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    /**
     * Moves or jumps the character based on the currently pressed keys.
     * @returns {void}
     */
    handleMovement() {
        let moving = false;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.recordActivity();
            moving = true;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.recordActivity();
            moving = true;
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.recordActivity();
            audioManager.play('jump');
        }
        this.updateRunningSound(moving);
    }

    /**
     * Starts or stops the running loop based on whether the character is moving on the ground.
     * @param {boolean} moving - True while a movement key is held.
     * @returns {void}
     */
    updateRunningSound(moving) {
        if (moving && !this.isAboveGround() && !this.isRunningSoundPlaying) {
            audioManager.playLoop('run');
            this.isRunningSoundPlaying = true;
        } else if ((!moving || this.isAboveGround()) && this.isRunningSoundPlaying) {
            audioManager.stopLoop('run');
            this.isRunningSoundPlaying = false;
        }
    }

    /**
     * Records the current time as the last moment the character was active.
     * @returns {void}
     */
    recordActivity() {
        this.lastMoveTime = new Date().getTime();
    }

    /**
     * Runs the animation loop that picks the correct sprite set each frame.
     * @returns {void}
     */
    startAnimationLoop() {
        setInterval(() => {
            this.updateAnimation();
        }, 50);
    }

    /**
     * Selects and plays the animation matching the character's current state.
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playIdleAnimation();
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
            audioManager.stopAllLoops();
            audioManager.play('dead');
        }
        this.playAnimationOnce(this.IMAGES_DEAD);
    }

    /**
     * Plays the idle animation, switching to the sleep animation after about 6.5 seconds.
     * @returns {void}
     */
    playIdleAnimation() {
        if (this.isSleeping()) {
            this.playAnimation(this.IMAGES_SLEEP);
            this.updateSnoreSound(true);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
            this.updateSnoreSound(false);
        }
    }

    /**
     * Checks whether the character is currently in the sleeping state.
     * @returns {boolean} True while the sleep animation should play.
     */
    isSleeping() {
        if (this.isDead() || this.isHurt() || this.isAboveGround()) {
            return false;
        }
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            return false;
        }
        return (new Date().getTime() - this.lastMoveTime) > 6500;
    }

    /**
     * Starts or stops the snoring loop based on whether the character is sleeping.
     * @param {boolean} sleeping - True while the sleep animation plays.
     * @returns {void}
     */
    updateSnoreSound(sleeping) {
        if (sleeping && !this.isSnoreSoundPlaying) {
            audioManager.playLoop('snore');
            this.isSnoreSoundPlaying = true;
        } else if (!sleeping && this.isSnoreSoundPlaying) {
            audioManager.stopLoop('snore');
            this.isSnoreSoundPlaying = false;
        }
    }
}