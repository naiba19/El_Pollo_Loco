const SOUND_STORAGE_KEY = 'elPolloLocoSound';
let soundOn = localStorage.getItem(SOUND_STORAGE_KEY) !== 'off';

/**
 * Toggles the sound preference, saves it to localStorage and updates the button.
 * @returns {void}
 */
function toggleSound() {
    soundOn = !soundOn;
    localStorage.setItem(SOUND_STORAGE_KEY, soundOn ? 'on' : 'off');
    updateSoundButton();
}

/**
 * Updates the sound button icon and accessibility state to match the preference.
 * @returns {void}
 */
function updateSoundButton() {
    let btn = document.getElementById('sound-btn');
    if (!btn) {
        return;
    }
    btn.innerHTML = soundOn ? '&#128266;' : '&#128263;';
    btn.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off');
    btn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
}

/**
 * Returns whether sound is currently enabled.
 * @returns {boolean} True when sound is on.
 */
function isSoundOn() {
    return soundOn;
}

document.addEventListener('DOMContentLoaded', updateSoundButton);
