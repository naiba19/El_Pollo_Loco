class BottleBar extends StatusBarBase {

    /**
     * Creates the bottle status bar, starting empty.
     */
    constructor() {
        super([
            'images/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
            'images/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
            'images/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
            'images/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
            'images/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
            'images/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
        ], 40, 50, 0, /* inclusiveThresholds */ true);
    }
}
