/* global require */

/* Magic Mirror
 * Module: MMM-WS281X-Server
 *
 * By Maja Aurora Pieper https://github.com/coderpussy
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const net = require('net');
const fs = require("fs");
const bodyParser = require('body-parser');
const Log = require("logger");

module.exports = NodeHelper.create({
    
    start: function () {
        console.log('[WS281X-Server] Starting node_helper');
        // Start API Endpoints
        this.webServer()
    },
    
    // This functions sets the color of the whole LED strip
    setStrip: function (color,reset=false) {
        var initstring = this.getInit();
        var ledstring = 'brightness ' + this.config.channel + ',' + this.config.global_brightness + ';fill ' + this.config.channel + ',' + this.rgbToHex(color) + ';render;';

        if (reset) {
            ledstring += 'kill_thread;reset;';
        }
        this.setLED(initstring+ledstring)
    },

    // Returns a string to set up the server and initialize the LED string
    getInit: function () {
        var initstring = 'setup ' + this.config.channel + ',' + this.config.led_count + ',' + this.config.led_type + ',' + this.config.invert + ',' + this.config.global_brightness + ',';
        if(!this.config.spi) {
            initstring += this.config.gpionum + ';init;';
        } else {
            initstring += this.config.spi_dev + ',' + this.config.spi_speed + ',' + this.config.alt_spi_pin + ';init;';
        }
        return initstring;
    },

    // This function initialises the leds string
    loadLED: function (file) {
        // Load file to render
        this.loadRenderFile(file);
        // Render loaded ledstring
        this.renderLED()
    },

    // This function sets the color or animation string
    setLED: function (ledstring) {
        // Set sequence to render
        this.ledString = ledstring;
        // Render loaded ledstring
        this.renderLED()
    },
    
    // Function for setting LED's to black -> OFF
    resetLED: function () {
        var color = 'rgba(0,0,0,0)';
        var reset = true;
        
        this.setStrip(color,reset)
    },
    
    // Readfile to string relative to execution path
    loadRenderFile: function (filename) {
        this.ledString = this.getInit();
        if (fs.existsSync(__dirname + '/custom/' + filename + ".txt")){
            console.debug("Located file /custom/" + filename + ".txt");
            this.ledString += fs.readFileSync(__dirname + '/custom/' + filename + '.txt', 'utf8');
        } else {
            this.ledString += fs.readFileSync(__dirname + '/effects/' + filename + '.txt', 'utf8');
            console.debug("Looking for file " + filename);
        }
    },

    // This function renders the current pixels on the connected ws281x-server process
    renderLED: function () {
        // Render string for ledstring
        console.debug(String(this.ledString));
        console.debug("Connect to: " + this.config.hostname + ", " + this.config.port);

        // Start socket connection
        var client = new net.Socket();
        client.connect({
            port: this.config.port,
            host: this.config.hostname
        });

        client.setEncoding('utf8');

        // writing data to server
        client.write(String(this.ledString));

        client.on('connect',function(){
            console.log('Client: connection established with ws281x server');
            console.debug('---------client details -----------------');

            var address = client.address();
            var port = address.port;
            var family = address.family;
            var ipaddr = address.address;
            
            console.debug('Client is listening at port: ' + port);
            console.debug('Client IP: ' + ipaddr);
            console.debug('Client is IP4/IP6: ' + family);
        });

        client.on('data',function(data){
            console.log('Data from server: ' + data);
        });

        client.on('drain',function(){
            console.log('write buffer is empty now .. u can resume the writable stream');
            client.resume();
        });

        client.on('error',function(error){
            console.log('Error: ' + error);
        });

        client.on('timeout',function(){
            console.log('Socket timed out!');
            client.end('Timed out!');
            // can call client.destroy() here too.
        });

        client.on('end',function(data){
            console.log('Socket ended from other end!');
            console.log('End data: ' + data);
        });

        client.on('close',function(error){
            var bread = client.bytesRead;
            var bwrite = client.bytesWritten;
            console.log('Bytes read: ' + bread);
            console.log('Bytes written: ' + bwrite);
            console.log('Socket closed!');
            if(error){
                console.log('Socket was closed coz of transmission error!');
            }
        });

        setTimeout(function(){
            // client.end('Bye bye server');
            client.end();
        },3000);
    },

    colorNames: function (name) {
        var namevalues = ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen'].map(v => v.toLowerCase());
        var hexvalues = ['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32'];

        findname = namevalues.indexOf(name.toLowerCase());

        if (findname != -1) {
            return hexvalues[findname];
        } else return false;
    },

    rgbToHex: function (red, green, blue, alpha) {
        const isPercent = (red + (alpha || '')).toString().includes('%');

        if (typeof red === 'string') {
            [red, green, blue, alpha] = red.match(/(0?\.?\d{1,3})%?\b/g).map(Number);
        } else if (alpha !== undefined) {
            alpha = parseFloat(alpha);
        }

        if (typeof red !== 'number' ||
            typeof green !== 'number' ||
            typeof blue !== 'number' ||
            red > 255 ||
            green > 255 ||
            blue > 255
        ) {
            throw new TypeError('Expected three numbers below 256');
        }

        if (typeof alpha === 'number') {
            if (!isPercent && alpha >= 0 && alpha <= 1) {
                alpha = Math.round(255 * alpha);
            } else if (isPercent && alpha >= 0 && alpha <= 100) {
                alpha = Math.round(255 * alpha / 100);
            } else {
                throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
            }

            alpha = (alpha | 1 << 8).toString(16).slice(1);
        } else {
            alpha = '';
        }

        //return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alpha;
        return alpha + ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);
    },

    hexToRgb: function (hex) {
        var bigint, r, g, b, a;
        //Remove # character
        var re = '/^#?/';
        var aRgb = hex.replace(re, '');
        
        if (aRgb.length == 3) {
            bigint = parseInt(aRgb, 16);
            r = (bigint >> 4) & 255;
            g = (bigint >> 2) & 255;
            b = bigint & 255;
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        if (aRgb.length == 6) {
            bigint = parseInt(aRgb, 16);
            r = (bigint >> 16) & 255;
            g = (bigint >> 8) & 255;
            b = bigint & 255;
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        if (aRgb.length == 8) {
            bigint = parseInt(aRgb, 16);
            a = ((bigint >> 24) & 255) / 255;
            r = (bigint >> 16) & 255;
            g = (bigint >> 8) & 255;
            b = bigint & 255;
            return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(1) + ")";
        }
    },
    
    /* 
    Colorwheel function copied from https://github.com/pmdroid/LPD8806-node/blob/master/lib/LPD8806.js
    Pascal M - MIT License 2014
    */
    colorwheel: function (wheelpos) {
        if (wheelpos < 0){
            wheelpos = 0;
        }
        if (wheelpos > 384){
            wheelpos = 384;
        }
        if (wheelpos < 128){
            r = 127 - wheelpos % 128;
            g = wheelpos % 128;
            b = 0;
        } else if (wheelpos < 256){
            g = 127 - wheelpos % 128;
            b = wheelpos % 128;
            r = 0;
        } else {
            b = 127 - wheelpos % 128;
            r = wheelpos % 128;
            g = 0;
        }
        return "rgb(" + r + "," + g + "," + b + ")";
    },

    // Messages from the UI
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'init') {
            this.config = payload;
            Log.debug("Config: " + this.config);

            if(this.config.ledOnStart) {
                try {
                    console.info('[WS281X-Server] Loading LED\'s on start...');
                    this.loadLED(this.config.ledOnStartEffect);
                } catch (err) {
                    console.error('[WS281X-Server] Unable to load LED\'s on start!', err.message);
                }
            }
        } else if (notification === 'alert') {
            this.loadLED(this.config.showAlertEffect);
        } else if (notification === 'login') {
            this.loadLED(this.config.userLoginEffect);
        } else if (notification === 'logout') {
            this.loadLED(this.config.userLogoutEffect);
        }
    },
    
    // API Endpoints
    webServer: function () {
        
        var notLoadedResponse = {code: 500, status: 'Make sure you provide a parameter.'}
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: true }));
        
        this.expressApp.get('/WS281X-Server', (req, res) => {
            res.status(202).send({code: 202, status: 'Module successfully loaded.', endpoints: ["/WS281X-Server/animation", "/WS281X-Server/set"]});
        });
        
        this.expressApp.get('/WS281X-Server/set', (req, res) => {
            if (!req.query){
                res.status(500).send(notLoadedResponse);
            } else {
                if(req.query.channel) this.config.channel = req.query.channel;
                if(req.query.led_count) this.config.led_count = req.query.led_count;
                if(req.query.led_type) this.config.led_type = req.query.led_type;
                if(req.query.invert) this.config.invert = req.query.invert;
                if(req.query.global_brightness) this.config.global_brightness = req.query.global_brightness;
                if(req.query.gpionum) this.config.gpionum = req.query.gpionum;
                if(req.query.spi) this.config.spi = req.query.spi;
                if(req.query.spi_dev) this.config.spi_dev = req.query.spi_dev;
                if(req.query.spi_speed) this.config.spi_speed = req.query.spi_speed;
                if(req.query.alt_spi_pin) this.config.alt_spi_pin = req.query.alt_spi_pin;

                var reset = false;

                if (req.query.r && req.query.g && req.query.b){
                    var color = 'rgb(' + req.query.r + ',' + req.query.g + ',' + req.query.b + ')';
                } else if (req.query.color){
                    var hexcolor = this.colorNames(req.query.color);
                    var color = this.hexToRgb(hexcolor);
                } else if (req.query.hex){
                    var color = this.hexToRgb(req.query.hex);
                } else if (req.query.wheel){
                    var color = this.colorwheel(Number(req.query.wheel));
                }
                if (color){
                    this.setStrip(color,reset);
                    res.status(501).send({code: 200, color: color, status: 'Color has been updated.'});
                } else {
                    res.status(501).send({code: 501, status: 'Please supply a color value.'});
                }
            }
        });

        this.expressApp.get('/WS281X-Server/animation', (req, res) => {
            if (!req.query){
                res.status(500).send(notLoadedResponse);
            } else {
                if (typeof req.query.name !== 'undefined'){
                    this.loadLED(req.query.name);
                    res.status(200).send({code: 200, file: req.query.name+'.txt', status: 'Animation file loaded and rendered.'});
                } else {
                    res.status(501).send({code: 501, status: 'Please supply an file name.'});
                }
            }
        });

        this.expressApp.get('/WS281X-Server/resetled', (req, res) => {
            this.resetLED();
            res.status(202).send({code: 202, status: 'Requested LED reset.'});
        });
    }
});
