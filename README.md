[![npm version](https://img.shields.io/npm/v/node-red-contrib-avr-pioneer.svg)](https://www.npmjs.com/package/node-red-contrib-avr-pioneer)
[![Travis build status](https://img.shields.io/travis/mattmattmatt/node-red-contrib-avr-pioneer/master.svg)](https://travis-ci.org/mattmattmatt/node-red-contrib-avr-pioneer)
[![GitHub last commit](https://img.shields.io/github/last-commit/mattmattmatt/node-red-contrib-avr-pioneer.svg)](https://github.com/mattmattmatt/node-red-contrib-avr-pioneer)
[![npm downloads](https://img.shields.io/npm/dt/node-red-contrib-avr-pioneer.svg)](https://www.npmjs.com/package/node-red-contrib-avr-pioneer)

[![nodeavr-pioneer](https://img.shields.io/badge/Node--RED-avr--pioneer-ee0077.svg)](https://flows.nodered.org/node/node-red-contrib-avr-pioneer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# node-red-contrib-avr-pioneer

[Node-RED](http://nodered.org) nodes to control Pioneer audio/video receivers from your smart home. Tested with the Pioneer VSX-824.


## Install

Run the following command in your Node-RED user directory – typically `~/.node-red`:

```bash
npm i node-red-contrib-avr-pioneer -S
```

## Usage

Provides two palette nodes – one to send control commands to a Pioneer AVR, and one to receive messages when receiver's state changes.

![](https://github.com/mattmattmatt/node-red-contrib-avr-pioneer/blob/master/tooling/nodes.png?raw=true)


### Output node

Sets the state of the receiver.

`msg.payload` must be an object containing the new state's properties of the Pioneer receiver.

| Property | Details |
| :---| :---|
| `on`   | Sets the `on` state where the value is `true` or `false` |
| `muted`   | Sets the `muted` state where the value is `true` or `false` |
| `volume`   | Sets the volume from `0` to `74`, or whatever your receiver's maximum is |
| `channel` | Sets the active input channel, must be one of `CD`, `TUNER`, `DVD`, `TV`, `SAT/CBL`, `VIDEO`, `DVR/BDR`, `IPOD/USB`, `BD`, `ADAPTER`, `NETRADIO`, `MEDIA SERVER`, `FAVORITE`, `GAME` |

#### Example payloads

```JSON
{
    "on": true
}
```
```JSON
{
    "on": true,
    "channel": "CD",
    "volume": 111
}
```
```JSON
{
    "muted": true
}
```

<!--
### Input node

Returns the current state of the selected Yeelight device.

`msg.payload` is an object containing the current state of the selected Yeelight device.

The node will listen to changes of the connected Yeelight and send a message whenever a change is detected. The `payload` property of the message will be set to the new state of the Yeelight.

Additionally, a fresh state can be requested from the connected Yeelight by sending a message to the node. The `payload` property of the message will be overwritten with the state of the Yeelight. All other properties of the `msg` are preserved.

#### Example payload
```JSON
{
    "state": {
        "on": false,
        "bri": 255,
        "colormode": "rgb",
        "hex": "#ff1500",
        "hue": 913,
        "sat": 255
    },
    "name": "Closet",
    "raw": {
        "name": "Closet",
        "power": "off",
        "bright": "100",
        "rgb": "16717056",
        "ct": "4244",
        "hue": "0",
        "sat": "100",
        "color_mode": "1",
        "delayoff": "0",
        "flowing": "0",
        "flow_params": "0,1,10000,1,16711680,69,33000,1,16711882,34,39000,1,16744704,17,34000,1,16711680,61",
        "music_on": "0"
    }
}
```

The `raw` property of `msg.payload` contains the raw state information retrieved from the Yeelight for advanced usage.  
Note that value scales are not compatible with _node-red-contrib-node-hue_, and that `hue` value and `rgb` value will not match since only the correct color per `color_mode` is returned by the lamp. -->


### Configuration node

Configures a Pioneer connection to one receiver in the local network.

#### Options

| Property | Details |
| :--- | :--- |
| Hostname | An IP address or other hostname that points to a Pioneer receiver in the network |
| Port number | Port number the Pioneer receiver is accessible over, default being `8102` |

## Support
If something is not working as expected, if you think there is a feature missing, or if you think this node could be improved in other ways, [please create an issue](https://github.com/mattmattmatt/node-red-contrib-avr-pioneer/issues) on GitHub.

### Links

 - Find [node-red-contrib-avr-pioneer in the Node-RED flow library](https://flows.nodered.org/node/node-red-contrib-avr-pioneer)
 - Find  [node-red-contrib-avr-pioneer on npm](https://www.npmjs.com/package/node-red-contrib-avr-pioneer)
 - Find [node-red-contrib-avr-pioneer on GitHub](https://github.com/mattmattmatt/node-red-contrib-avr-pioneer)

### Hello bear
![](https://www.reactiongifs.com/r/hello-bear.gif)
