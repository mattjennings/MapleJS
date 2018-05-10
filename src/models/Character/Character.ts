import * as mongoose from 'mongoose'
import { ObjectID } from 'mongodb'
import { prop, Typegoose, ModelType, InstanceType, Ref, instanceMethod } from 'typegoose'
import { Account } from '@models/Account'
import { Inventory } from './Inventory'
import { Stats } from './Stats'
import { PacketWriter } from '@util/maplenet'
import { getDocumentId } from '@util/mongoose'
import ItemModel, { Item } from './Item'

export class Character extends Typegoose {
  @prop({ ref: Account })
  public account: Ref<Account>
  @prop() public name: string
  @prop() public worldId: number
  @prop() public female: boolean
  @prop() public skin: number
  @prop() public eyes: number
  @prop() public hair: number

  @prop() public mapId: number
  @prop() public mapPos: number

  @prop() public stats: Stats
  @prop() public inventory: Inventory

  @instanceMethod
  public async getInventory(this: InstanceType<Character>, inventoryIndex: number) {
    return ItemModel.find({
      character: this._id,
      inventory: inventoryIndex
    })
  }

  @instanceMethod
  public async getItem(this: InstanceType<Character>, inventoryIndex: number, slot: number) {
    return ItemModel.findOne({
      character: this._id,
      inventory: inventoryIndex,
      slot
    })
  }

  @instanceMethod
  public async setItem(this: InstanceType<Character>, item: InstanceType<Item>) {
    const tmp = await this.getItem(item.inventory, item.slot)
    if (tmp) {
      tmp.remove()
    }
    item.character = this
    return item.save()
  }

  // Packet methods
  @instanceMethod
  public async addAvatar(this: InstanceType<Character>, writer: PacketWriter) {
    let index

    // Prepare slots...
    const slots = []
    slots[0] = {}
    slots[1] = {}
    let cashWeapon = 0

    const inventory = await this.getInventory(1)
    for (index in inventory) {
      const item = inventory[index]
      if (item.slot >= 0 || item.slot < -200) {
        continue
      }
      if (item.slot === -111) {
        cashWeapon = item.itemId
      }

      const slot = Math.abs(item.slot % 100)
      if (slots[0][slot]) {
        slots[1][slot] = item.itemId
      } else {
        slots[0][slot] = item.itemId
      }
    }

    // Write info
    writer.writeUInt8(this.female)
    writer.writeUInt8(this.skin)
    writer.writeUInt32(this.eyes)

    writer.writeUInt8(0)
    writer.writeUInt32(this.hair)

    for (index in slots[0]) {
      writer.writeUInt8(index)
      writer.writeUInt32(slots[0][index])
    }

    writer.writeUInt8(-1)

    for (index in slots[1]) {
      writer.writeUInt8(index)
      writer.writeUInt32(slots[1][index])
    }

    writer.writeUInt8(-1)

    writer.writeUInt32(cashWeapon)

    // Pet IDs
    writer.writeUInt32(0)
    writer.writeUInt32(0)
    writer.writeUInt32(0)
  }

  @instanceMethod
  public addStats(this: InstanceType<Character>, writer: PacketWriter) {
    const docId = getDocumentId(this)
    writer.writeUInt32(docId)
    writer.writeString(this.name, 13)
    writer.writeUInt8(this.female)
    writer.writeUInt8(this.skin)
    writer.writeUInt32(this.eyes)
    writer.writeUInt32(this.hair)

    writer.writeUInt64(0)
    writer.writeUInt64(0)
    writer.writeUInt64(0)

    writer.writeUInt8(this.stats.level)
    writer.writeUInt16(this.stats.job)
    writer.writeUInt16(this.stats.str)
    writer.writeUInt16(this.stats.dex)
    writer.writeUInt16(this.stats.int)
    writer.writeUInt16(this.stats.luk)
    writer.writeUInt16(this.stats.hp)
    writer.writeUInt16(this.stats.maxHp)
    writer.writeUInt16(this.stats.mp)
    writer.writeUInt16(this.stats.maxMp)
    writer.writeUInt16(this.stats.ap) // Byte if evan?
    writer.writeUInt16(this.stats.sp)
    writer.writeUInt32(this.stats.exp)
    writer.writeUInt16(this.stats.fame)
    writer.writeUInt32(0) // Gachapon EXP

    writer.writeUInt32(this.mapId)
    writer.writeUInt8(this.mapPos)

    writer.writeUInt32(0) // Unk
  }
}

export default new Character().getModelForClass(Character)
