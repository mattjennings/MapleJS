import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, Ref, instanceMethod } from 'typegoose'
import { Item } from './Item'

export class Pet extends Item implements Item {
  @prop() public type: number = 3
  @prop() public name: string
  @prop() public closeness: number
  @prop() public fullness: number
  @prop() public level: number
}

export default new Pet().getModelForClass(Pet, {
  schemaOptions: { collection: 'items', discriminatorKey: '_type' }
})
