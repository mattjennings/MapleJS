import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, Ref, instanceMethod } from 'typegoose'
import { Item } from './Item'
import { PacketWriter } from '@util/maplenet'

export class Equip extends Item implements Item {
  @prop() public type: number = 1
  @prop() public slots: number
  @prop() public scrolls: number
  @prop() public incStr: number
  @prop() public incDex: number
  @prop() public incInt: number
  @prop() public incLuk: number
  @prop() public incMaxHP: number
  @prop() public incMaxMP: number
  @prop() public incWeaponAttack: number
  @prop() public incWeaponDefense: number
  @prop() public incMagicAttack: number
  @prop() public incMagicDefense: number
  @prop() public incAccuracy: number
  @prop() public incAvoid: number
  @prop() public incHands: number
  @prop() public incJump: number
  @prop() public incSpeed: number
  @prop() public name: string
  @prop() public flags: number
  @prop() public itemLevel: number
  @prop() public itemExp: number
  @prop() public hammers: number

  @instanceMethod
  public writeItemPacketData(this: InstanceType<Item>, writer: PacketWriter) {
    const type = 1
    writer.writeUInt8(type)
    writer.writeUInt32(this.itemId)

    if (this.cashId) {
      writer.writeUInt8(1)
      writer.writeUInt64(this.cashId)
    } else {
      writer.writeUInt8(0)
    }
    writer.writeDate(this.expires)

    const item = this as InstanceType<Equip>
    writer.writeUInt8(item.slots)
    writer.writeUInt8(item.scrolls)
    writer.writeUInt16(item.incStr)
    writer.writeUInt16(item.incDex)
    writer.writeUInt16(item.incInt)
    writer.writeUInt16(item.incLuk)
    writer.writeUInt16(item.incMaxHP)
    writer.writeUInt16(item.incMaxMP)
    writer.writeUInt16(item.incWeaponAttack)
    writer.writeUInt16(item.incMagicAttack)
    writer.writeUInt16(item.incWeaponDefense)
    writer.writeUInt16(item.incMagicDefense)
    writer.writeUInt16(item.incAccuracy)
    writer.writeUInt16(item.incAvoid)
    writer.writeUInt16(item.incHands)
    writer.writeUInt16(item.incSpeed)
    writer.writeUInt16(item.incJump)
    writer.writeString(item.name)
    writer.writeUInt16(item.flags)

    if (item.cashId) {
      writer.writeHexString('91174826F700')
      writer.writeUInt32(0)
    } else {
      writer.writeUInt8(0)
      writer.writeUInt8(0)
      writer.writeUInt16(0)
      writer.writeUInt16(0)
      writer.writeUInt32(item.hammers)
      writer.writeUInt64(-1)
    }

    writer.writeHexString('0040E0FD3B374F01')
    writer.writeUInt32(-1)
  }
}

export default new Equip().getModelForClass(Equip, {
  schemaOptions: { collection: 'items', discriminatorKey: '_type' },
  existingMongoose: mongoose
})
