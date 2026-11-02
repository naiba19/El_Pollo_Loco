/**
 * Centralized audio manager for El Pollo Loco.
 * Registers all sounds, gates playback behind the sound preference,
 * and separates background music, looping effects and one-shot effects.
 */
class AudioManager {
    /**
     * Creates the audio manager and registers all game sounds.
     */
    constructor() {
        this.sounds = {
            music: { path: 'audio/backgroundMusic.mp3', loop: true, volume: 0.35 },
            gameStart: { path: 'audio/game/gameStart.mp3', loop: false, volume: 0.6 },
            gameWin: { path: 'audio/game/gameWin.wav', loop: false, volume: 0.6 },
            gameLose: { path: 'audio/game/gameLose.wav', loop: false, volume: 0.6 },
            run: { path: 'audio/character/characterRun.mp3', loop: true, volume: 0.4 },
            jump: { path: 'audio/character/characterJump.wav', loop: false, volume: 0.5 },
            damage: { path: 'audio/character/characterDamage.mp3', loop: false, volume: 0.6 },
            dead: { path: 'audio/character/characterDead.wav', loop: false, volume: 0.6 },
            snore: { path: 'audio/character/characterSnoring.mp3', loop: true, volume: 0.4 },
            chickenDead: { path: 'audio/chicken/chickenDead.mp3', loop: false, volume: 0.6 },
            chickenHurt: { path: 'audio/chicken/chickenHurt.mp3', loop: false, volume: 0.6 },
            endbossApproach: { path: 'audio/endboss/endbossApproach.wav', loop: false, volume: 0.7 },
            coin: { path: 'audio/collectibles/collectSound.wav', loop: false, volume: 0.5 },
            bottleCollect: { path: 'audio/collectibles/bottleCollectSound.wav', loop: false, volume: 0.5 },
            bottleThrow: { path: 'audio/throwable/bottleThrow.mp3', loop: false, volume: 0.5 },
            bottleBreak: { path: 'audio/throwable/bottleBreak.mp3', loop: false, volume: 0.6 }
        };
        this.audioElements = {};
        this.activeLoops = new Set();
    }

    /**
     * Lazily creates and caches the Audio element for a sound.
     * @param {string} name - The sound key.
     * @returns {HTMLAudioElement|null} The audio element, or null if unknown.
     */
    getAudio(name) {
        let def = this.sounds[name];
        if (!def) {
            return null;
        }
        if (!this.audioElements[name]) {
            let audio = new Audio(def.path);
            audio.loop = def.loop;
            audio.volume = def.volume;
            audio.preload = 'auto';
            this.audioElements[name] = audio;
        }
        return this.audioElements[name];
    }

    /**
     * Plays a one-shot sound effect once, cloning so rapid repeats do not cut off.
     * @param {string} name - The sound key.
     * @returns {void}
     */
    play(name) {
        if (!isSoundOn()) {
            return;
        }
        let audio = this.getAudio(name);
        if (!audio) {
            return;
        }
        let instance = audio.cloneNode();
        instance.volume = audio.volume;
        instance.muted = false;
        instance.play().catch(() => {});
    }

    /**
     * Starts a looping sound (music, running, snoring) if not already playing.
     * @param {string} name - The sound key.
     * @returns {void}
     */
    playLoop(name) {
        if (!isSoundOn()) {
            return;
        }
        let audio = this.getAudio(name);
        if (!audio || this.activeLoops.has(name)) {
            return;
        }
        audio.muted = false;
        audio.currentTime = 0;
        audio.play().catch(() => {});
        this.activeLoops.add(name);
    }

    /**
     * Stops a looping sound.
     * @param {string} name - The sound key.
     * @returns {void}
     */
    stopLoop(name) {
        let audio = this.audioElements[name];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        this.activeLoops.delete(name);
    }

    /**
     * Stops all looping sounds (music and looping effects).
     * @returns {void}
     */
    stopAllLoops() {
        this.activeLoops.forEach(name => {
            let audio = this.audioElements[name];
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
        this.activeLoops.clear();
    }

    /**
     * Mutes or unmutes every registered sound and silences loops when muted.
     * @returns {void}
     */
    applyMute() {
        let muted = !isSoundOn();
        Object.values(this.audioElements).forEach(audio => {
            audio.muted = muted;
        });
        if (muted) {
            this.stopAllLoops();
        }
    }
}

const audioManager = new AudioManager();
