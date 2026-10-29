function createLevel1() {
    return new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new SmallChicken(),
        new SmallChicken(),
        new SmallChicken(),
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
        new Bottle(350, 350),
        new Bottle(600, 350),
        new Bottle(850, 350),
        new Bottle(1100, 350),
        new Bottle(1350, 350),
        new Bottle(1600, 350),
        new Bottle(1850, 350),
        new Bottle(2100, 350),
    ]
    );
}

const level1 = createLevel1();