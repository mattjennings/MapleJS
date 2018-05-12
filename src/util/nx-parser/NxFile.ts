import * as fs from 'fs'
const Int64 = require('int64-native')
import NxNode from './NxNode'

export default class NxFile {
  public filename: string
  public buffer: any
  public header: any
  public fileHandle: number
  public mainNode: NxNode

  constructor(fileName: string) {
    this.filename = fileName
    const starttime = process.hrtime()

    this.fileHandle = fs.openSync(this.filename, 'rs')

    this.buffer = this.readFilePartially(0, 4 + (4 + 8) * 4)

    if (this.buffer[0] !== 0x50 || this.buffer[1] !== 0x4b || this.buffer[2] !== 0x47 || this.buffer[3] !== 0x34) {
      throw new Error('Unsupported Format.')
    }

    let offset = 4
    this.header = {}
    this.header.node_count = this.buffer.readUInt32LE(offset)
    offset += 4
    this.header.node_offset = this.getInt64(offset)
    offset += 8

    this.header.string_count = this.buffer.readUInt32LE(offset)
    offset += 4
    this.header.string_offset = this.getInt64(offset)
    offset += 8

    this.header.bitmap_count = this.buffer.readUInt32LE(offset)
    offset += 4
    this.header.bitmap_offset = this.getInt64(offset)
    offset += 8

    this.header.audio_count = this.buffer.readUInt32LE(offset)
    offset += 4
    this.header.audio_offset = this.getInt64(offset)
    offset += 8

    this.mainNode = new NxNode(this, 0)
  }

  public close() {
    fs.closeSync(this.fileHandle)
  }

  public readFilePartially(pStart, pLength) {
    if (pStart instanceof Int64) {
      pStart = pStart.toNumber()
    }
    if (pLength instanceof Int64) {
      pLength = pLength.toNumber()
    }

    const buf = new Buffer(pLength)
    buf.fill(0)
    if (pLength === 0) {
      return buf
    }
    fs.readSync(this.fileHandle, buf, 0, pLength, pStart)
    return buf
  }

  public getOffset(pFrom, pIndex) {
    return this.getInt64(pFrom + pIndex * 8)
  }

  public getInt64(pFrom) {
    const buffer = this.readFilePartially(pFrom, 8)
    return new Int64(buffer.readUInt32LE(4), buffer.readUInt32LE(0)).toNumber()
  }

  public string_count() {
    return this.header.string_count
  }
  public bitmap_count() {
    return this.header.bitmap_count
  }
  public audio_count() {
    return this.header.audio_count
  }
  public node_count() {
    return this.header.node_count
  }
  public get_string(pIndex) {
    const offset = this.getOffset(this.header.string_offset, pIndex)
    let buffer = this.readFilePartially(offset, 2)
    const length = buffer.readUInt16LE(0)

    buffer = this.readFilePartially(offset + 2, length)

    return buffer.toString()
  }

  public getNodeName(pIndex) {
    const nodeOffset = this.header.node_offset + pIndex * 20
    const buffer = this.readFilePartially(nodeOffset, 4)
    return this.get_string(buffer.readUInt32LE(0))
  }

  // node object functions
  public getName() {
    return this.filename
  }

  public child(pName) {
    return this.mainNode.child(pName)
  }

  public childById(pId) {
    return this.mainNode.childById(pId)
  }

  public forEach(pCallback) {
    return this.mainNode.forEach(pCallback)
  }

  public getPath(pPath) {
    return this.mainNode.getPath(pPath)
  }
}
