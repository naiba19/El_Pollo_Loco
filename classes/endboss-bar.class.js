class EndbossBar extends StatusBarBase {

    /**
     * Creates the endboss health bar at full health, positioned at the top right.
     */
    constructor() {
        super([
            'images/7_statusbars/2_statusbar_endboss/orange/orange0.png',
            'images/7_statusbars/2_statusbar_endboss/orange/orange20.png',
            'images/7_statusbars/2_statusbar_endboss/orange/orange40.png',
            'images/7_statusbars/2_statusbar_endboss/orange/orange60.png',
            'images/7_statusbars/2_statusbar_endboss/orange/orange80.png',
            'images/7_statusbars/2_statusbar_endboss/orange/orange100.png'
        ], 480, 0, 100, /* inclusiveThresholds */ false);
    }
}
