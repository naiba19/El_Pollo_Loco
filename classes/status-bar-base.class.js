class StatusBarBase extends DrawableObject {

    IMAGES = [];
    percentage = 0;
    inclusiveThresholds = false;

    /**
     * Creates a status bar with the given images, position and initial fill.
     * @param {string[]} images - The six bar images for 0, 20, 40, 60, 80 and 100 percent.
     * @param {number} x - The horizontal position on the canvas.
     * @param {number} y - The vertical position on the canvas.
     * @param {number} percentage - The initial fill percentage (0-100).
     * @param {boolean} inclusiveThresholds - True to switch images at exact 20-step values, false to switch only above them.
     */
    constructor(images, x, y, percentage, inclusiveThresholds) {
        super();
        this.IMAGES = images;
        this.inclusiveThresholds = inclusiveThresholds;
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(percentage);
    }

    /**
     * Updates the bar to reflect the given percentage.
     * @param {number} percentage - The new fill percentage (0-100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current percentage to the matching status bar image index.
     * @returns {number} The image index for the current percentage.
     */
    resolveImageIndex() {
        let thresholds = [100, 80, 60, 40, 20];
        for (let i = 0; i < thresholds.length; i++) {
            if (this.reachesThreshold(thresholds[i], i)) {
                return 5 - i;
            }
        }
        return 0;
    }

    /**
     * Checks the percentage against a threshold using this bar's comparison mode.
     * @param {number} threshold - The threshold to compare with.
     * @param {number} i - The threshold index (0 is the full bar).
     * @returns {boolean} True when the percentage reaches the threshold.
     */
    reachesThreshold(threshold, i) {
        if (this.inclusiveThresholds) {
            return this.percentage >= threshold;
        }
        return i === 0 ? this.percentage == 100 : this.percentage > threshold;
    }
}
