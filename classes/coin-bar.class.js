class CoinBar extends DrawableObject {

    IMAGES = [
        'images/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'images/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'images/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'images/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'images/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'images/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    percentage = 0;

    /**
     * Creates the coin status bar, starting empty.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
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
            if (this.percentage >= thresholds[i]) {
                return 5 - i;
            }
        }
        return 0;
    }
}
