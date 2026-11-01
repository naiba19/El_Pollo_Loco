class BackgroundObject extends MovableObject {
 

    width = 720;
    height = 480;
    /**
     * Creates a background layer image anchored to the bottom of the canvas.
     * @param {string} imagePath - The background image path.
     * @param {number} x - The horizontal position.
     * @param {number} y - The vertical position (unused, kept for compatibility).
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
