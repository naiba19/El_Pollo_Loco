class StatusBar extends StatusBarBase {

    /**
     * Creates the health status bar at full health.
     */
    constructor() {
        super([
            'images/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
            'images/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
            'images/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
            'images/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
            'images/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
            'images/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
        ], 40, 0, 100, /* inclusiveThresholds */ false);
    }
}