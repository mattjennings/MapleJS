class PacketReader {
  private buffer: Buffer
  private offset: number

  constructor(data) {
    this.buffer = new Buffer(data.length)
    data.copy(this.buffer)

    this.offset = 0
  }

  public readInt8() {
    const ret = this.buffer.readInt8(this.offset)
    this.offset += 1
    return ret
  }

  public readInt16() {
    const ret = this.buffer.readInt16LE(this.offset)
    this.offset += 2
    return ret
  }

  public readInt32() {
    const ret = this.buffer.readInt32LE(this.offset)
    this.offset += 4
    return ret
  }

  public readUInt8() {
    const ret = this.buffer.readUInt8(this.offset)
    this.offset += 1
    return ret
  }

  public readUInt16() {
    const ret = this.buffer.readUInt16LE(this.offset)
    this.offset += 2
    return ret
  }

  public readUInt32() {
    const ret = this.buffer.readUInt32LE(this.offset)
    this.offset += 4
    return ret
  }

  public readFloat32() {
    const ret = this.buffer.readFloatLE(this.offset)
    this.offset += 4
    return ret
  }

  public readFloat64() {
    const ret = this.buffer.readDoubleLE(this.offset)
    this.offset += 8
    return ret
  }

  public readString(pLength?) {
    pLength = pLength || this.readUInt16()
    let ret = ''
    for (; pLength > 0; pLength--) {
      const byte = this.readUInt8()
      if (byte === 0) {
        break
      }
      ret += String.fromCharCode(byte)
    }
    this.offset += pLength
    return ret
  }

  public skip(pAmount) {
    this.offset += pAmount
  }
}

export default PacketReader
