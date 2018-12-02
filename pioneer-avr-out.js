const PioneerAvrOut = require('./src/PioneerAvrOut').default;

module.exports = RED => {
    RED.nodes.registerType('pioneer-avr-out', PioneerAvrOut(RED));
};
