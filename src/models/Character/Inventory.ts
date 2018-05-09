import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, Ref } from 'typegoose'

export class InventorySchema extends Typegoose {
  @prop() public mesos: number
  @prop() public maxSlots: number[]
}

export default new InventorySchema().getModelForClass(InventorySchema)
