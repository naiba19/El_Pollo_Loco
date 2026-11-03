/**
 * Builds a fresh level 1 with all enemies, clouds, background and collectibles.
 * @returns {Level} A new level instance.
 */
function createLevel1() {
    return new Level(
    [
        new Chicken({ min: 720, max: 900 }),
        new Chicken({ min: 1000, max: 1180 }),
        new Chicken({ min: 1280, max: 1460 }),
        new Chicken({ min: 1500, max: 1620 }),
        new SmallChicken({ min: 800, max: 980 }),
        new SmallChicken({ min: 1080, max: 1260 }),
        new SmallChicken({ min: 1360, max: 1540 }),
        new SmallChicken({ min: 1560, max: 1640 }),
        new Endboss()
    ],
    [
        new Cloud()
    ],
    [
        new BackgroundObject("images/5_background/layers/air.png", -719),
        new BackgroundObject("images/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("images/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("images/5_background/layers/1_first_layer/2.png", -719),

        new BackgroundObject("images/5_background/layers/air.png", 0),
        new BackgroundObject("images/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("images/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("images/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObject("images/5_background/layers/air.png", 719),
        new BackgroundObject("images/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObject("images/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObject("images/5_background/layers/1_first_layer/2.png", 719),

        new BackgroundObject("images/5_background/layers/air.png", 719 * 2),
        new BackgroundObject("images/5_background/layers/3_third_layer/1.png", 719 * 2),
        new BackgroundObject("images/5_background/layers/2_second_layer/1.png", 719 * 2),
        new BackgroundObject("images/5_background/layers/1_first_layer/1.png", 719 * 2),
        new BackgroundObject("images/5_background/layers/air.png", 719 * 3),
        new BackgroundObject("images/5_background/layers/3_third_layer/2.png", 719 * 3),
        new BackgroundObject("images/5_background/layers/2_second_layer/2.png", 719 * 3),
        new BackgroundObject("images/5_background/layers/1_first_layer/2.png", 719 * 3),
    ],
    [
        new Coin(300, 300),
        new Coin(500, 250),
        new Coin(700, 300),
        new Coin(900, 250),
        new Coin(1100, 300),
        new Coin(1300, 250),
        new Coin(1500, 300),
        new Coin(1700, 250),
        new Coin(1900, 300),
        new Coin(2100, 250),
    ],
    [
        new Bottle(300, 350),
        new Bottle(450, 350),
        new Bottle(600, 350),
        new Bottle(750, 350),
        new Bottle(900, 350),
        new Bottle(1050, 350),
        new Bottle(1200, 350),
        new Bottle(1350, 350),
        new Bottle(1500, 350),
        new Bottle(1650, 350),
        new Bottle(1800, 350),
        new Bottle(1950, 350),
    ]
    );
}

const level1 = createLevel1();