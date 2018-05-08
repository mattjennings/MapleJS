class PacketHandler {
  private handlers = {}

  public getHandler(opCode) {
    return this.handlers[opCode] || null
  }

  public setHandler(opCode, callback) {
    this.handlers[opCode] = callback
    console.log(`Registered handler for 0x${opCode.toString(16)}. Total loaded: ${this.getHandlerCount()}`)
  }

  public getHandlerCount() {
    return Object.keys(this.handlers).length
  }
}

export default PacketHandler
