import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, Ref } from 'typegoose'

export class Inventory extends Typegoose {
  @prop() public mesos: number
  @prop() public maxSlots: number[]
}

export default new Inventory().getModelForClass(Inventory)
