const SOUND_STORAGE_KEY = 'elPolloLocoSound';
let soundOn = localStorage.getItem(SOUND_STORAGE_KEY) !== 'off';

function toggleSound() {
    soundOn = !soundOn;
    localStorage.setItem(SOUND_STORAGE_KEY, soundOn ? 'on' : 'off');
    updateSoundButton();
}

function updateSoundButton() {
    let btn = document.getElementById('sound-btn');
    if (!btn) {
        return;
    }
    btn.innerHTML = soundOn ? '&#128266;' : '&#128263;';
    btn.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off');
    btn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
}

function isSoundOn() {
    return soundOn;
}

document.addEventListener('DOMContentLoaded', updateSoundButton);
