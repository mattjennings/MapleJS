import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, Ref, instanceMethod } from 'typegoose'
import { Item } from './Item'
import { PacketWriter } from '@util/maplenet'

export class Rechargeable extends Item implements Item {
  @prop() public type: number = 2
  @prop() public name: string
  @prop() public amount: number
  @prop() public flags: number
  @prop() public uniqueId: number

  @instanceMethod
  public writeItemPacketData(this: InstanceType<Item>, writer: PacketWriter) {
    const type = 2

    writer.writeUInt8(type)
    writer.writeUInt32(this.itemId)

    if (this.cashId) {
      writer.writeUInt8(true)
      writer.writeUInt64(this.cashId)
    } else {
      writer.writeUInt8(false)
    }
    writer.writeDate(this.expires)

    const item = this as InstanceType<Rechargeable>
    writer.writeUInt16(item.amount)
    writer.writeString(item.name)
    writer.writeUInt16(item.flags)

    // Todo: fix this; add rechargeable check
  }
}

export default new Rechargeable().getModelForClass(Rechargeable)
