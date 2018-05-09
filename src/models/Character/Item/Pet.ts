import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, Ref, instanceMethod } from 'typegoose'
import { ItemSchema } from './Item'

export class PetSchema extends ItemSchema implements ItemSchema {
  @prop() public type: number = 3
  @prop() public name: string
  @prop() public closeness: number
  @prop() public fullness: number
  @prop() public level: number
}

export default new PetSchema().getModelForClass(PetSchema)
