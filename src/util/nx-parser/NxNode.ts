const Int64 = require('int64-native')
import NxFile from './NxFile'

export default class NxNode {
  public file: NxFile
  public nameIdMap: any
  public children: NxNode[]
  public name_id: number
  public first_child_id: number
  public child_count: number
  public type: number
  public data: any

  constructor(file: NxFile, index?: number) {
    this.file = file
    this.nameIdMap = {} // name-id map
    this.children = null

    if (index !== undefined) {
      const nodeOffset = file.header.node_offset + index * 20
      const buffer = file.readFilePartially(nodeOffset, 20)
      this.initFromBuffer(buffer, 0)
    }
  }

  public initFromBuffer(pBuffer, pOffset) {
    this.name_id = pBuffer.readUInt32LE(pOffset)
    pOffset += 4
    this.first_child_id = pBuffer.readUInt32LE(pOffset)
    pOffset += 4
    this.child_count = pBuffer.readUInt16LE(pOffset)
    pOffset += 2
    this.type = pBuffer.readUInt16LE(pOffset)
    pOffset += 2

    const buffer = pBuffer.slice(pOffset, pOffset + 8)
    switch (this.type) {
      case 0:
        break
      case 1: // Int64
        this.data = buffer.readInt32LE(0) // new Int64(buffer.readUInt32LE(0), buffer.readUInt32LE(4));
        break
      case 2: // Double
        this.data = buffer.readDoubleLE(0)
        break
      case 3: // StringID
        this.data = buffer.readUInt32LE(0)
        break
      case 4: // VectorInt32
        this.data = [buffer.readUInt32LE(0), buffer.readUInt32LE(4)]
        break
      case 5: // Bitmap
        this.data = [buffer.readUInt32LE(0), buffer.readUInt16LE(4), buffer.readUInt16LE(6)]
        break
      case 6: // Audio
        this.data = [buffer.readUInt32LE(0), buffer.readUInt32LE(4)]
        break
      default:
        throw new Error('Unknown node type.')
    }
  }

  public initializeChildren() {
    if (this.child_count === 0 || this.children !== null) {
      return
    }

    const buffer = this.file.readFilePartially(
      this.file.header.node_offset + this.first_child_id * 20,
      this.child_count * 20
    )

    this.children = []
    for (let i = 0; i < this.child_count; i++) {
      const subn = new NxNode(this.file)
      subn.initFromBuffer(buffer, i * 20)
      const name = this.file.get_string(subn.name_id)

      this.nameIdMap[name] = i
      this.children.push(subn)
    }
  }

  public getName() {
    return this.file.get_string(this.name_id)
  }

  public childById(pId) {
    if (pId < 0 || pId >= this.child_count) {
      return null
    }
    this.initializeChildren() // Lazy Load

    return this.children[pId]
  }

  public child(name): NxNode | null {
    this.initializeChildren() // Lazy Load

    if (this.children !== null && this.nameIdMap.hasOwnProperty(name)) {
      return this.children[this.nameIdMap[name]]
    }
    return null
  }

  public forEach(callback: (node: NxNode) => boolean | void) {
    for (let i = 0; i < this.child_count; i++) {
      const returnCode = callback(this.childById(i))
      if (returnCode === false) {
        break
      }
    }
  }

  public getData() {
    if (this.type === 3) {
      return this.file.get_string(this.data)
    }
    return this.data
  }

  public getPath(pPath) {
    // Searches for the specified path. For example, 'Tips.img/all/0' will go into Tips.img first, then all, then 0
    // Returns null if any of the nodes were not found
    const elements = pPath.split('/')
    let currentNode

    for (let i = 0; i < elements.length; i++) {
      const nextNode = (currentNode || this).child(elements[i])
      if (nextNode === null) {
        return null
      }

      currentNode = nextNode
    }

    return currentNode || this
  }
}
