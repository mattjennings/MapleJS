class PacketHandler {
  constructor() {
    this.handlers = {}
  }

  getHandler(opCode) {
    return this.handlers[opCode] || null
  }

  setHandler(opCode, callback) {
    this.handlers[opCode] = callback
    console.log(
      `Registered handler for 0x${opCode.toString(
        16
      )}. Total loaded: ${this.getHandlerCount()}`
    )
  }

  getHandlerCount() {
    return Object.keys(this.handlers).length
  }
}

module.exports = PacketHandler
