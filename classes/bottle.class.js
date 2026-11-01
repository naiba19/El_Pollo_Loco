class Bottle extends DrawableObject {

    /**
     * Creates a collectible bottle at the given position.
     * @param {number} x - The horizontal position.
     * @param {number} y - The vertical position.
     */
    constructor(x, y) {
        super().loadImage("images/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 70;
    }
}
