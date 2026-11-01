/**
 * Toggles fullscreen mode on the game container.
 * @returns {void}
 */
function fullscreen() {
    let container = document.getElementById('canvas-container');
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        exitFullscreen();
    } else {
        enterFullscreen(container);
    }
}

/**
 * Requests fullscreen mode for the given element, with vendor fallbacks.
 * @param {HTMLElement} element - The element to show in fullscreen.
 * @returns {void}
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode, with vendor fallbacks.
 * @returns {void}
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
