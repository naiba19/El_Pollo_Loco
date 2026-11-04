let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Detects if the device actually supports touch input (not a DevTools simulation).
 * Uses multiple heuristics since DevTools can simulate media queries perfectly.
 * @returns {boolean} True if device has actual touch capability.
 */
function isTouchDevice() {
    // Check 1: navigator.maxTouchPoints (most reliable for actual devices)
    // DevTools in responsive mode often reports 0
    if (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 0) {
        return true;
    }

    // Check 2: ontouchstart (older but still valid)
    if (window.ontouchstart !== undefined) {
        return true;
    }

    // Check 3: Check if touch events were actually fired on interaction
    // (This helps distinguish real touch from DevTools simulation)
    if (window.matchMedia('(pointer: fine)').matches && navigator.maxTouchPoints === 0) {
        return false; // Desktop with fine pointer and no touch points = not a touch device
    }

    // If media queries match but no actual touch capability detected, assume desktop
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        // Additional check: if maxTouchPoints is explicitly 0, it's likely a desktop in responsive mode
        if (navigator.maxTouchPoints === 0) {
            return false;
        }
        return true;
    }

    return false;
}

/**
 * Grabs the canvas element. Called once before the game starts.
 * @returns {void}
 */
function init() {
    canvas = document.getElementById("canvas");
}

/**
 * Shows or hides touch controls based on actual device capabilities.
 * @returns {void}
 */
function updateTouchControlsVisibility() {
    const touchControls = document.getElementById('touch-controls');
    if (!touchControls) return;

    if (isTouchDevice()) {
        touchControls.style.display = '';  // Use CSS default (flex on appropriate media queries)
    } else {
        touchControls.style.display = 'none';  // Hide on non-touch devices
    }
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
    if (world) {
        world.stopped = true;
    }
    document.getElementById('restart').style.display = 'none';
    document.getElementById('home').style.display = 'none';
    updateTouchControlsVisibility();
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

document.addEventListener('DOMContentLoaded', () => {
    initTouchControls();
    updateTouchControlsVisibility();
});

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

/**
 * Opens the Impressum modal overlay and locks background scrolling.
 * @returns {void}
 */
function openImpressum() {
    document.getElementById('impressum-overlay').classList.add('open');
    lockBackgroundScroll();
    window.addEventListener('scroll', lockBackgroundScroll);
}

/**
 * Closes the Impressum modal overlay and releases the scroll lock.
 * @returns {void}
 */
function closeImpressum() {
    document.getElementById('impressum-overlay').classList.remove('open');
    window.removeEventListener('scroll', lockBackgroundScroll);
}

/**
 * Keeps the page scrolled to the top while a modal locks the background.
 * @returns {void}
 */
function lockBackgroundScroll() {
    window.scrollTo(0, 0);
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

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeImpressum();
    }
});

/**
 * Scales the canvas to fit the viewport while preserving its 720:480 aspect ratio.
 * @returns {void}
 */
function checkOrientation() {
    let container = document.getElementById('canvas-container');
    let canvas = document.getElementById('canvas');
    if (!container || !canvas) {
        return;
    }
    canvas.style.width = '';
    canvas.style.height = '';
    let availableWidth = Math.min(container.parentElement.clientWidth, 720);
    let reservedHeight = window.innerHeight - container.getBoundingClientRect().top - getTouchControlsHeight() - 16;
    let scale = Math.min(availableWidth / 720, reservedHeight / 480, 1);
    if (scale > 0 && scale < 1) {
        canvas.style.width = `${Math.floor(720 * scale)}px`;
        canvas.style.height = `${Math.floor(480 * scale)}px`;
    }
}

/**
 * Returns the height of the touch controls bar, or 0 when it is hidden or overlaid.
 * @returns {number} The touch controls height in pixels.
 */
function getTouchControlsHeight() {
    let controls = document.getElementById('touch-controls');
    if (!controls || getComputedStyle(controls).display === 'none') {
        return 0;
    }
    let position = getComputedStyle(controls).position;
    if (position === 'absolute' || position === 'fixed') {
        return 0;
    }
    return controls.offsetHeight + 12;
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);