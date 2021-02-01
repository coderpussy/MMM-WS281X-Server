# MMM-WS281X-Server

This module is designed to use the [RPI-WS2812-Server](https://github.com/jgarff/rpi_ws281x) (TCP socket) project from [Tom](https://github.com/tom-2015). RPI-WS2812-Server uses rpi_ws281x PWM driver code from [jgarff](https://github.com/jgarff/rpi_ws281x).
Goal was to use ws2812 LED strips on Magic Mirror without the need of root user in NodeJS. Problem is direct memory access which can only be done by a user with privileged rights.

[![Platform](https://img.shields.io/badge/platform-MagicMirror-informational)](https://MagicMirror.builders)

## Development Status

This module works so far. ;-) There is still a lot of room for improvement and the source code could be better. Code improvements of this project are very welcome.

## Screenshot

No screenshot can be displayed, because this project is executed in the background. It is possible that the connected LEDs are triggered at system start, system messages or camera movement. There is also an API endpoint to load sequence files or set individual colors manually.

## Requirements

Currently this module is able to control 'ws281x' stripes. Neopixels or any other WS2812 stripe should work fine.

## Dependencies

Needs to be installed (local or remote):
- [RPI-WS2812-Server](#ws2812server)
- WS2811, WS2812, SK6812, SK9822 LED Strips

If the face recognition module by Thierry Nischelwitzer is additionally used:
- [MMM-Face-Reco-DNN](#facerecodnn)

## Installation

### <a name="ws2812server"></a>RPI-WS2812-Server

Please follow the installation instructions on the project maintainer's page.

- https://github.com/tom-2015/rpi-ws2812-server

Also note the section for a system service installation. In case of trouble setting up the system service please change the makefile.
Just put a # in line 58 in front of the command.

```sh
# systemctl stop ws2812svr.service
```

### <a name="facerecodnn"></a>MMM-Face-Reco-DNN

- https://github.com/nischi/MMM-Face-Reco-DNN

### Cloning the module

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
        ledOnStart: true,
        ledOnStartEffect: 'start',
        showAlert: false,
        showAlertEffect: 'alert',
        useMMMFaceRecoDNN: false,
        userLoginEffect: 'login',
        userLogoutEffect: 'logout',
        piLightsSequence: false,
        piLightsSequenceEffect: 'pilights',
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

If server instance is running and listening on TCP socket everything should work out of the box.
In case of different types of LED strips chip and manually assign effects to strips from API Endpoint you have to set the parameters described on ws2812 servers project page.

Take a look in this modules effects folder to adjust effects or create new ones by editing the text files.
It is a kind of ledscript language designed by the WS2812-Server project leader.

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
`piLightsSequence` | Use piLights mm module (dev. state)<br />**Default value:** `false`
`piLightsSequenceEffect` | Saved *.txt file<br />**Default value:** `pilights`
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


## Trigger from another module

Currently supports messages send for [MMM-PiLights](https://github.com/jc21/MMM-PiLights) and notifications shown in the default alert module.
Additional the MMM-Face-Reco-DNN module can be used for LED effect running by camera movement recognition.

## API Endpoint

Possible combinations of API commands

```
http://yourmagicmirror/WS281X-Server/animation?name=fade
http://yourmagicmirror/WS281X-Server/resetled
http://yourmagicmirror/WS281X-Server/set?color=blue
http://yourmagicmirror/WS281X-Server/set?hex=fff
http://yourmagicmirror/WS281X-Server/set?hex=ffffff
http://yourmagicmirror/WS281X-Server/set?hex=ffffffff
http://yourmagicmirror/WS281X-Server/set?r=25&g=200&b=200
http://yourmagicmirror/WS281X-Server/set?wheel=20
```

### CURL Example

```sh
curl -X GET "http://yourmagicmirror/WS281X-Server/animation?name=gradient"
```

### Color names used in API endpoint

'AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen'

### And theire reprensentative hex values

'f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32'