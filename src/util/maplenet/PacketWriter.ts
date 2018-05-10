const Int64 = require('int64-native')

const getFiletimeFromDate = function(pDate) {
  if (!(pDate instanceof Date)) {
    return null
  }
  let rawTime = pDate.getTime()
  rawTime += 11644473600000 // Seconds between 1601-01-01 00:00:00 and 1970-01-01 00:00:00
  rawTime *= 10000 // Convert to nanoseconds
  return new Int64(rawTime)
}

function expandIfNeeded(size) {
  if (this.writtenData + size > this.buffer.length) {
    const oldBuffer = this.buffer
    let newSize = this.buffer.length

    while (newSize < this.writtenData + size) {
      newSize *= 2
    }

    this.buffer = new Buffer(~~newSize)
    oldBuffer.copy(this.buffer)
  }
}

class PacketWriter {
  private buffer: Buffer
  private writtenData: number

  constructor(opCode?) {
    this.buffer = new Buffer(32)
    this.writtenData = 0

    if (arguments.length > 0) {
      this.writeUInt16(opCode)
    }
  }

  public writeInt8(value: number) {
    expandIfNeeded.call(this, 1)
    this.buffer.writeInt8(value, this.writtenData, true)
    this.writtenData += 1
    return this
  }

  public writeInt16(value: number) {
    expandIfNeeded.call(this, 2)
    this.buffer.writeInt16LE(value, this.writtenData, true)
    this.writtenData += 2
    return this
  }

  public writeInt32(value: number) {
    expandIfNeeded.call(this, 4)
    this.buffer.writeInt32LE(value, this.writtenData, true)
    this.writtenData += 4
    return this
  }

  public writeUInt8(value: number) {
    expandIfNeeded.call(this, 1)
    this.buffer.writeUInt8(value, this.writtenData, true)
    this.writtenData += 1
    return this
  }

  public writeUInt16(value: number) {
    expandIfNeeded.call(this, 2)
    this.buffer.writeUInt16LE(value, this.writtenData, true)
    this.writtenData += 2
    return this
  }

  public writeUInt32(value: number) {
    expandIfNeeded.call(this, 4)
    this.buffer.writeUInt32LE(value, this.writtenData, true)
    this.writtenData += 4
    return this
  }

  public writeFloat32(value: number) {
    expandIfNeeded.call(this, 4)
    this.buffer.writeFloatLE(value, this.writtenData, true)
    this.writtenData += 4
    return this
  }

  public writeFloat64(value: number) {
    expandIfNeeded.call(this, 8)
    this.buffer.writeDoubleLE(value, this.writtenData, true)
    this.writtenData += 8
    return this
  }

  public writeUInt64(value) {
    if (!(value instanceof Int64)) {
      if (isNaN(value) || value === null) {
        value = 0
      }
      value = new Int64(value)
    }

    this.writeUInt32(value.low32())
    this.writeUInt32(value.high32())
    return this
  }

  public writeDate(value: Date) {
    this.writeUInt64(getFiletimeFromDate(value))
    return this
  }

  public writeString(value: string, length?) {
    if (value === null || typeof value === 'undefined') {
      value = ''
    }
    if (arguments.length === 1) {
      this.writeUInt16(value.length)

      expandIfNeeded.call(this, value.length)
      this.buffer.write(value, this.writtenData, value.length)
      this.writtenData += value.length
    } else {
      expandIfNeeded.call(this, length)

      this.buffer.fill(0, this.writtenData, this.writtenData + length)
      this.buffer.write(value, this.writtenData, value.length)

      this.writtenData += length
    }
    return this
  }

  public writeBytes(value) {
    for (let i = 0; i < value.length; i++) {
      this.writeUInt8(value[i])
    }
    return this
  }

  public writeHexString(value: string) {
    value = value.replace(/[^0-9A-Fa-f]/g, '')
    if (value.length % 2 !== 0) {
      throw new Error('HexString is not a valid length. Text: ' + value)
    }

    for (let i = 0; i < value.length; i += 2) {
      this.writeUInt8(parseInt(value.substr(i, 2), 16))
    }
    return this
  }

  public getBufferCopy() {
    const buffer = new Buffer(this.writtenData)
    this.buffer.copy(buffer)
    return buffer
  }
}

export default PacketWriter
