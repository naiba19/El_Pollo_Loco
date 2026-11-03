class EndbossBar extends DrawableObject {

    IMAGES = [
        'images/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'images/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'images/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'images/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'images/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'images/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    percentage = 100;

    /**
     * Creates the endboss health bar at full health, positioned at the top right.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 480;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
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
            let matches = i === 0 ? this.percentage == 100 : this.percentage > thresholds[i];
            if (matches) {
                return 5 - i;
            }
        }
        return 0;
    }
}
