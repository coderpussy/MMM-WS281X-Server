# MMM-WS281X-Server

This module is designed to use the [RPI-WS2812-Server](https://github.com/tom-2015/rpi-ws2812-server) (TCP socket) project from [Tom](https://github.com/tom-2015). RPI-WS2812-Server uses rpi_ws281x PWM driver code from [jgarff](https://github.com/jgarff/rpi_ws281x).
Goal was to use ws2812 LED strips on Magic Mirror without the need of root user in NodeJS. Problem is direct memory access which can only be done by a user with privileged rights.

[![Platform](https://img.shields.io/badge/platform-MagicMirror-informational)](https://MagicMirror.builders)

## Development Status

This module works so far. ;-) There is still a lot of room for improvement and the source code could be better. Code improvements of this project are very welcome.

## Screenshot

No screenshot can be displayed, because this project is executed in the background. It is possible that the connected LEDs are triggered at system start, system messages or camera movement. There is also an API endpoint to load sequence files or set individual colors manually.

## Requirements

Currently this module is able to control 'ws281x' stripes. Neopixels or any other WS2812 stripe should work fine. You will need to 
connect your LED strip to a power source and the data wire will need to be connected to one of the GPIO pins on the RPI board.

The RPi board can only power so many individual LEDs. In my experience, anything more than about 12 LEDs will require attaching
the LED strip to a power supply rather than the 5V and ground pins on the Pi.

## Dependencies

Needs to be installed (local or remote):
- [RPI-WS2812-Server](#ws2812server)
- WS2811, WS2812, SK6812, SK9822 LED Strips

This module supports the face recognition module by Thierry Nischelwitzer.
- [MMM-Face-Reco-DNN](https://github.com/nischi/MMM-Face-Reco-DNN)

## Installation

### Installing the <a name="ws2812server"></a>RPI-WS2812-Server

First, you will need to install the RPI-WS2812-Server. Please follow the installation instructions on the project maintainer's page.

- https://github.com/tom-2015/rpi-ws2812-server

Part of the installation instructions includes a section on installing as a service. **You need to do this in order for this module to work.** 
In case of trouble setting up the system service after make command please change the makefile.
Just put a # in line 58 in front of the command. Reason is that directly after compiling the server a system service is not created or 
running. But the makefile instead await a running service. To finish that step successfully you have to work around like I described.

```sh
# systemctl stop ws2812svr.service
```



### Installing the module

```sh
cd ~/MagicMirror/modules
git clone https://github.com/coderpussy/MMM-WS281X-Server.git
cd MMM-WS281X-Server
npm install
```

### Add the module to MM

Open the file `~/MagicMirror/config/config.js` and add the following to your modules section:

```js
{
    module: 'MMM-WS281X-Server',
    config: {
        hostname: '192.168.0.10',
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
        alt_spi_pin: 10
    }
}
```

## Module Configuration Options

If RPI-WS2812-Server is running and listening on TCP socket everything should work out of the box after installing this module and set up IP of server.
In case of different types of LED strips chip and manually assign effects to strips from API Endpoint you have to set the config parameters like described on RPI-WS2812-Server project page.

Take a look in this module effects folder to get some ideas how to adjust effects or create new ones by editing the text files.
It is a kind of ledscript language designed by the RPI-WS2812-Server project leader.

Config | Description
--- | ---
`hostname` | IP address of running ws2812 server instance. Could be same or remote machine<br />**Default value:** `127.0.0.1`
`port` | Port where server instance is running<br />**Default value:** `9999`
`ledOnStart` | Want to have an effect on mirror start<br />**Default value:** `false`
`ledOnStartEffect` | Saved *.txt file<br />**Default value:** `start`
`showAlert` | Show LED effect on system alert<br />**Default value:** `false`
`showAlertEffect` | Saved *.txt file<br />**Default value:** `alert`
`useMMMFaceRecoDNN` | Set to true if module is used for LED effect<br />**Default value:** `false`
`userLoginEffect` | Saved *.txt file<br />**Default value:** `login`
`userLogoutEffect` | Saved *.txt file<br />**Default value:** `logout`
`listenNotifications` | Array of notification mappings to animation files. See below.
`channel` | LED configuration taken from Server project<br />**Default value:** `1`
`led_count` | How many LEDs are involved<br />**Default value:** `24`
`led_type` | What type of LED is used. Take a look at server project<br />**Default value:** `0`
`invert` | Invert colors at initialization<br />**Default value:** `0`
`global_brightness` | Set global brightness<br />**Default value:** `255`
`gpionum` | Set GPIO or<br />**Default value:** `18`
`spi` | If you want use SK9822 LED strips<br />**Default value:** `false`
`spi_dev` | SPI device<br />**Default value:** `/dev/spidev0.0`
`spi_speed` | SPI speed in Mhz<br />**Default value:** `20`
`alt_spi_pin` | Alternative SPI pin<br />**Default value:** `10`


## Custom Notification Triggers
The module can be configured to respond to notifications from other modules with the `listenNotifications` config value.
By passing in an array of notification-to-animation mappings, the module will respond to the notification by running the file.
For example:
```
module: 'MMM-WS281X-Server',
	config: {
        listenNotifications: [
            {notification: 'USER_PRESENCE', text: 'login'},
            {notification: 'WEATHER_UPDATED', text: 'fade'},
            {notification: 'NEWS_FEED_UPDATE', text: 'slow_yellow'}
        ]
```
The `notification` value is the name of the triggering notification and the `text` value is the name of the effect file without 
the '.txt' extension. In the above example, 'slow_yellow' is a custom effect file.

## Face Recognition Triggers
The alerts broadcast by the [MMM-Face-Reco-DNN](https://github.com/nischi/MMM-Face-Reco-DNN) module are built-in and controlled by the `useMMMFaceRecoDNN` configuration parameter.

## API Endpoint
This module exposes an API that will let you activate the LEDs from outside the Magic Mirror. It's a very handy way to test your 
custom effects or integrate your household digital assistants (Alexa, Google Home, Apple Overlord, etc.). Just open a new tab and 
put the URL into your address bar.

Some examples of API commands:

```
http://yourmagicmirror:port/WS281X-Server/animation?name=fade
http://yourmagicmirror:port/WS281X-Server/resetled
http://yourmagicmirror:port/WS281X-Server/set?color=blue
http://yourmagicmirror:port/WS281X-Server/set?hex=fff
http://yourmagicmirror:port/WS281X-Server/set?hex=ffffff
http://yourmagicmirror:port/WS281X-Server/set?hex=ffffffff
http://yourmagicmirror:port/WS281X-Server/set?r=25&g=200&b=200
http://yourmagicmirror:port/WS281X-Server/set?wheel=20
```
Note: You will have to replace 'yourmagicmirror:port' with the URL of your mirror and the port (usually 8080).

### CURL Example

```sh
curl -X GET "http://yourmagicmirror/WS281X-Server/animation?name=gradient"
```

### Credits

Big hugs and thx to:

- [Tom](https://github.com/tom-2015) for the awesome [RPI-WS2812-Server](https://github.com/tom-2015/rpi-ws2812-server) project.
- [jgarff](https://github.com/jgarff/rpi_ws281x) for the base rpi_ws281x PWM driver code
- [Thierry Nischelwitzer](https://github.com/nischi) for the awesome [MMM-Face-Reco-DNN](https://github.com/nischi/MMM-Face-Reco-DNN) module
- [Paul-Vincent Roll](https://github.com/paviro) for the idea and code parts from his [MMM-Stripes](https://github.com/paviro/MMM-Stripes) module
- [Brian Hepler](https://github.com/BrianHepler) for the custom notification integration and custom effect files.
- all guys i have forgotten but used some code fragments from them