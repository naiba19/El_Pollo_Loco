class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    offset = { top: 0, left: 0, right: 0, bottom: 0 };

    /**
     * Loads a single image and sets it as the current sprite.
     * @param {string} path - The image file path.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current sprite at the object's position and size.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads an array of image paths into the image cache.
     * @param {string[]} arr - Array of image paths to load into the image cache.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Computes the collision box by shrinking the sprite bounds by its offset.
     * @returns {{left: number, right: number, top: number, bottom: number}} The collision box.
     */
    getCollisionBox() {
        let offset = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        return {
            left: this.x + offset.left,
            right: this.x + this.width - offset.right,
            top: this.y + offset.top,
            bottom: this.y + this.height - offset.bottom
        };
    }
}