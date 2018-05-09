import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, Ref } from 'typegoose'

export class StatsSchema extends Typegoose {
  @prop() public level: number
  @prop() public job: number
  @prop() public str: number
  @prop() public dex: number
  @prop() public int: number
  @prop() public luk: number
  @prop() public hp: number
  @prop() public mp: number
  @prop() public ap: number
  @prop() public sp: number
  @prop({ min: 1 })
  public maxHp: number
  @prop({ min: 1 })
  public maxMp: number
  @prop() public exp: number
  @prop() public fame: number
}

export default new StatsSchema().getModelForClass(StatsSchema)
