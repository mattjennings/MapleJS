import { RechargeableSchema } from '@models/Character/Item/Rechargeable'
import { PacketWriter } from '@util/maplenet'
import { InstanceType, Ref, Typegoose, instanceMethod, prop } from 'typegoose'
import { CharacterSchema } from '../Character'

export class ItemSchema extends Typegoose {
  @prop({ ref: CharacterSchema })
  public character: Ref<CharacterSchema>

  @prop() public type: number
  @prop() public itemId: number
  @prop() public inventory: number
  @prop() public slot: number
  @prop() public cashId: number
  @prop() public expires: Date

  @instanceMethod
  public writeItemPacketData(this: InstanceType<ItemSchema>, writer: PacketWriter) {
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
  }
}

export default new ItemSchema().getModelForClass(ItemSchema)
