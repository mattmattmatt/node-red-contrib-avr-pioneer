const PioneerAvrConfig = require('./src/PioneerAvrConfig').default;

module.exports = RED => {
    RED.nodes.registerType('pioneer-avr-config', PioneerAvrConfig(RED));
};
