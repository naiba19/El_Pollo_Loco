class CoinBar extends StatusBarBase {

    /**
     * Creates the coin status bar, starting empty.
     */
    constructor() {
        super([
            'images/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
            'images/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
            'images/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
            'images/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
            'images/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
            'images/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
        ], 40, 100, 0, /* inclusiveThresholds */ true);
    }
}
