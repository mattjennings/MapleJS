export default class BitSet32 {
  private bits: Uint32Array

  constructor(bits: number) {
    this.bits = new Uint32Array(bits / 32)
  }

  public get(bit) {
    const element = (bit / 32) >>> 0
    const subBit = 1 << (((bit % 32) >>> 0) - 1)

    return (this.bits[element] & subBit) !== 0
  }

  public set(bit) {
    const element = (bit / 32) >>> 0
    const subBit = 1 << (((bit % 32) >>> 0) - 1)

    this.bits[element] |= subBit
  }

  public unset(bit) {
    const element = (bit / 32) >>> 0
    const subBit = 1 << (((bit % 32) >>> 0) - 1)

    this.bits[element] &= ~subBit
  }

  public toBuffer() {
    const buffer = new Buffer(this.bits.length * 4)
    buffer.fill(0)

    for (let i = 0; i < 4; i++) {
      buffer.writeUInt32LE(this.bits[i], i * 4)
    }

    return buffer
  }
}
