const { EventEmitter } = require('events');

class MirrorEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }
}

const eventBus = new MirrorEventBus();
module.exports = eventBus;
