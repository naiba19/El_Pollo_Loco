let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Grabs the canvas element. Called once before the game starts.
 * @returns {void}
 */
function init() {
    canvas = document.getElementById("canvas");
}

/**
 * Hides the start screen and creates the game world. Ignored if already running.
 * @returns {void}
 */
function startGame() {
    if (world) {
        return;
    }
    if (!canvas) {
        init();
    }
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    audioManager.play('gameStart');
    audioManager.playLoop('music');
    world = new World(canvas, keyboard);
}

/**
 * Returns to the start screen and discards the current game world.
 * @returns {void}
 */
function goHome() {
    document.getElementById('restart').style.display = 'none';
    document.getElementById('home').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('start').style.display = 'inline-flex';
    audioManager.stopAllLoops();
    world = null;
}

/**
 * Binds a touch button to a keyboard flag using touchstart/touchend/touchcancel.
 * @param {string} buttonId - The id of the touch button element.
 * @param {string} key - The keyboard flag to set while the button is held.
 * @returns {void}
 */
function bindTouchButton(buttonId, key) {
    let btn = document.getElementById(buttonId);
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[key] = true;
    }, { passive: false });
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[key] = false;
    });
    btn.addEventListener('touchcancel', () => {
        keyboard[key] = false;
    });
}

/**
 * Wires up all on-screen touch buttons to their keyboard flags.
 * @returns {void}
 */
function initTouchControls() {
    bindTouchButton('btn-left', 'LEFT');
    bindTouchButton('btn-right', 'RIGHT');
    bindTouchButton('btn-jump', 'SPACE');
    bindTouchButton('btn-throw', 'D');
}

document.addEventListener('DOMContentLoaded', initTouchControls);

/**
 * Opens the instructions dialog.
 * @returns {void}
 */
function openInstructions() {
    document.getElementById('instructions-overlay').classList.add('open');
}

/**
 * Closes the instructions dialog.
 * @returns {void}
 */
function closeInstructions() {
    document.getElementById('instructions-overlay').classList.remove('open');
}


const KEY_MAP = {
    ArrowRight: 'RIGHT',
    ArrowLeft: 'LEFT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    ' ': 'SPACE',
    d: 'D',
    D: 'D'
};

/**
 * Sets or releases the keyboard flag matching the pressed key.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {boolean} isPressed - True on keydown, false on keyup.
 * @returns {void}
 */
function setKey(event, isPressed) {
    let key = KEY_MAP[event.key];
    if (key) {
        keyboard[key] = isPressed;
    }
}

window.addEventListener("keydown", (e) => setKey(e, true));
window.addEventListener("keyup", (e) => setKey(e, false));

/**
 * Adjusts the canvas height to fit short landscape screens.
 * @returns {void}
 */
function checkOrientation() {
    if (window.matchMedia("(orientation: landscape)").matches) {
        if (window.innerHeight < 480) {
            let newHeight = window.innerHeight;
            document.getElementById('canvas').style.height = `${newHeight}px`;
        }
    }
    else {
        document.getElementById('canvas').style.height = `100%`;
    }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);