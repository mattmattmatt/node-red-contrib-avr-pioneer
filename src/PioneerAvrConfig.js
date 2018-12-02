import { Socket } from 'net';

const RECONNETION_INTERVAL_SECS = 5000;

export default function PioneerAvrConfig(RED) {
    console.log('-------> HI FROM WITHIN THE MODULE');
    return function(config) {
        const { hostname, port } = config;
        const node = this;
        const host = `${hostname}:${port}`;
        let reconnectionTimeout;
        const clientNodes = [];
        const states = {
            connected: { fill: 'green', shape: 'dot', text: 'Connected' },
            error: error => ({
                fill: 'red',
                shape: 'ring',
                text: `Connection error: ${error}`,
            }),
            connecting: { fill: 'yellow', shape: 'ring', text: 'Connecting...' },
        };
        let currentState;

        node.registerClientNode = function(n) {
            clientNodes.push(n);
            n.status(currentState);
        };

        node.deregisterClientNode = function(n) {
            clientNodes.splice(clientNodes.findIndex(cn => cn.id === n.id), 1);
        };

        const setNodeStatus = state => {
            clientNodes.forEach(clientNode => {
                clientNode.status(state);
            });
            currentState = state;
        };

        const onConnected = () => {
            node.log(`Connected to ${host}`);
            clearTimeout(reconnectionTimeout);

            setNodeStatus(states.connected);
        };

        const onDisconnected = () => {
            node.log(`Disconnected from ${host}`);
        };

        const onError = error => {
            console.error(`Error at ${host}`, error);
            clearTimeout(reconnectionTimeout);
            reconnectionTimeout = setTimeout(startConnection, RECONNETION_INTERVAL_SECS);

            setNodeStatus(states.error(error.code || 'unknown'));
        };

        const startConnection = () => {
            node.log(`Connecting to Pioneer ${host}`);
            node.client = new Socket();
            node.client.connect(
                port,
                hostname
            );
            node.client.on('connect', onConnected);
            node.client.on('error', onError);
            node.client.on('disconnect', onDisconnected);

            setNodeStatus(states.connecting);
        };

        (function init() {
            RED.nodes.createNode(node, config);

            node.hostname = hostname;
            node.port = port;

            if (hostname && port) {
                startConnection();

                node.on('close', () => {
                    node.log('Closing connection');
                    clearTimeout(reconnectionTimeout);
                    node.client.exit();
                });
            }
        })();
    };
}
