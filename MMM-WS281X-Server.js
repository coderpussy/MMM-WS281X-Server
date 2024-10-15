Module.register('MMM-WS281X-Server',{

    defaults: {
        hostname: '127.0.0.1',
        port: 9999,
        ledOnStart: false,
        ledOnStartEffect: 'start',
        showAlert: false,
        showAlertEffect: 'alert',
        useMMMFaceRecoDNN: false,
        userLoginEffect: 'login',
        userLogoutEffect: 'logout',
        channel: 1,
        led_count: 24,
        led_type: 0,
        invert: 0,
        global_brightness: 255,
        gpionum: 18,
        spi: false,
        spi_dev: '/dev/spidev0.0',
        spi_speed: 20,
        alt_spi_pin: 10,
        listenNotifications: []
    },

    start: function() {
        Log.info('[' + this.name + '] Starting');
        this.sendSocketNotification('init', this.config);
    },

    notificationReceived: function(notification, payload) {
        switch(notification) {
            case 'SHOW_ALERT':
                // LED effect on alerts shown in the UI:
                if (this.config.showAlert) {
                    this.sendSocketNotification('alert', this.config);
                }
            break;

            case 'USERS_LOGIN':
                // LED effect support for MMMFaceRecoDNN Module:
                if (this.config.useMMMFaceRecoDNN) {
                    this.sendSocketNotification('login', this.config);
                }
            break;

            case 'USERS_LOGOUT':
            case 'USERS_LOGOUT_MODULES':
                // LED effect support for MMMFaceRecoDNN Module:
                if (this.config.useMMMFaceRecoDNN) {
                    this.sendSocketNotification('logout', this.config);
                }
            break;
        } // end switch

        for (const notif of this.config.listenNotifications) {
            notifName = notif.notification;
            if (notification === notifName) {
                text = notif.text;
                this.sendSocketNotification('command', text);
            }
        }

    }
});
