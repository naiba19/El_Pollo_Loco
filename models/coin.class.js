class Coin extends DrawableObject {

    IMAGES = [
        "images/8_coin/coin_1.png",
        "images/8_coin/coin_2.png"
    ];

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES);
        this.loadImage(this.IMAGES[0]);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.animate();
    }

    animate() {
        setInterval(() => {
            let i = this.currentImage % this.IMAGES.length;
            this.img = this.imageCache[this.IMAGES[i]];
            this.currentImage++;
        }, 300);
    }
}
