let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
}

function startGame() {
    if (world) {
        return;
    }
    if (!canvas) {
        init();
    }
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    world = new World(canvas, keyboard);
}

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

function initTouchControls() {
    bindTouchButton('btn-left', 'LEFT');
    bindTouchButton('btn-right', 'RIGHT');
    bindTouchButton('btn-jump', 'SPACE');
    bindTouchButton('btn-throw', 'D');
}

document.addEventListener('DOMContentLoaded', initTouchControls);

function openInstructions() {
    document.getElementById('instructions-overlay').classList.add('open');
}

function closeInstructions() {
    document.getElementById('instructions-overlay').classList.remove('open');
}


window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowRight") {
        keyboard.RIGHT = true;
    }
    if (e.key == "ArrowLeft") {
        keyboard.LEFT = true;
    }
    if (e.key == "ArrowUp") {
        keyboard.UP = true;
    }
    if (e.key == "ArrowDown") {
        keyboard.DOWN = true;
    }
    if (e.key == " ") {
        keyboard.SPACE = true;
    }
    if (e.key == "d" || e.key == "D") {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key == "ArrowRight") {
        keyboard.RIGHT = false;
    }
    if (e.key == "ArrowLeft") {
        keyboard.LEFT = false;
    }
    if (e.key == "ArrowUp") {
        keyboard.UP = false;
    }
    if (e.key == "ArrowDown") {
        keyboard.DOWN = false;
    }
    if (e.key == " ") {
        keyboard.SPACE = false;
    }
    if (e.key == "d" || e.key == "D") {
        keyboard.D = false;
    }
});


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