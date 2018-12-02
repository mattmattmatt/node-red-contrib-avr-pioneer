import { isJson, parse, random } from './utils';

const MSG_INTERVAL_MS = 180;

const channelToInput = {
    CD: '01',
    TUNER: '02',
    DVD: '04',
    TV: '05',
    'SAT/CBL': '06',
    SAT: '06',
    CABLE: '06',
    VIDEO: '10',
    'DVR/BDR': '15',
    DVR: '15',
    BDR: '15',
    'IPOD/USB': '17',
    USB: '17',
    IPOD: '17',
    BD: '25',
    ADAPTER: '33',
    NETRADIO: '38',
    'MEDIA SERVER': '44',
    MEDIA: '44',
    FAVORITE: '45',
    GAME: '49',
};

const inputToChannel = {
    '01': 'CD',
    '02': 'TUNER',
    '04': 'DVD',
    '05': 'TV',
    '06': 'SAT/CBL',
    '10': 'VIDEO',
    '15': 'DVR/BDR',
    '17': 'IPOD/USB',
    '25': 'BD',
    '33': 'ADAPTER',
    '38': 'NETRADIO',
    '44': 'MEDIA SERVER',
    '45': 'FAVORITE',
    '49': 'GAME',
};

export default function PioneerAvrOut(RED) {
    return function(config) {
        const node = this;
        const queue = [];
        let isBusy = false;
        const avrState = {
            volume: null,
            muted: null,
            on: null,
            channel: null,
        };

        const updateFullState = () => {
            onInput({ payload: '?V' });
            onInput({ payload: '?P' });
            onInput({ payload: '?M' });
            onInput({ payload: '?F' });
        };

        const onData = d => {
            const data = d
                .toString()
                .replace('\n', '')
                .replace('\r', '');
            node.log(`Data from avr: ${data}`);

            if (data.startsWith('PWR')) {
                avrState.on = parse(data[3]) === 0;
            }

            if (data.startsWith('VOL')) {
                avrState.volume = Math.round(
                    parse(data.substring(3, 6)) * node.serverConfig.volumeMultiplier
                );
            }

            if (data.startsWith('MUT')) {
                avrState.muted = parse(data[3]) === 0;
            }

            if (data.startsWith('FN')) {
                avrState.channel = inputToChannel[data.substring(2, 4)];
            }

            if (data !== 'R') {
                node.log(`AVR state ${JSON.stringify(avrState)}`);
            }
        };

        const sendData = data => {
            node.log(`Sending to AVR ${data}`);
            node.serverConfig.client.write(`${data}\n\r`);
        };

        const sendNext = () => {
            if (isBusy || !queue.length) {
                return;
            }

            isBusy = true;
            let msg = queue.shift();

            if (isJson(msg)) {
                msg = JSON.parse(msg);
            }

            if (typeof msg === 'object') {
                if (
                    typeof msg.volume !== 'undefined' &&
                    (msg.volume < avrState.volume - 1 || msg.volume > avrState.volume + 1)
                ) {
                    // send the same message again in case there's more to do than just one VU or VD
                    queue.unshift(msg);
                    if (msg.volume < avrState.volume) {
                        sendData(`VD`);
                    } else {
                        sendData(`VU`);
                    }
                } else {
                    if (
                        typeof msg.channel !== 'undefined' &&
                        msg.channel.toUpperCase() !== avrState.channel
                    ) {
                        queue.unshift(`${channelToInput[msg.channel.toUpperCase()]}FN`);
                    }

                    if (typeof msg.muted !== 'undefined' && msg.muted !== avrState.muted) {
                        queue.unshift(`M${msg.muted ? 'O' : 'F'}`);
                    }

                    if (typeof msg.on !== 'undefined' && msg.on !== avrState.on) {
                        // send a second message to create enough time for receiver to turn on
                        queue.unshift(`?P`);
                        queue.unshift(`P${msg.on ? 'O' : 'F'}`);
                    }
                }
            } else {
                sendData(msg);
            }

            setTimeout(() => {
                isBusy = false;
                sendNext();
            }, MSG_INTERVAL_MS);
        };

        const onInput = msg => {
            node.log(`Node input: ${JSON.stringify(msg.payload)}`);
            queue.push(msg.payload);
            sendNext();
        };

        (function init() {
            RED.nodes.createNode(node, config);
            node.serverConfig = RED.nodes.getNode(config.server);

            if (!node.serverConfig || !node.serverConfig.hostname) {
                node.status({ fill: 'red', shape: 'ring', text: 'Hostname not set' });
                return;
            }

            node.serverConfig.registerClientNode(node);

            node.on('input', onInput);

            node.on('close', function() {
                if (node.serverConfig) {
                    node.serverConfig.client.off('data', onData);
                    node.serverConfig.deregisterClientNode(node);
                }
            });

            node.serverConfig.client.on('data', onData);

            setTimeout(updateFullState, random(10, 500));
        })();
    };
}
