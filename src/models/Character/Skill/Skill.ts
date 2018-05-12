import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType, Ref, instanceMethod } from 'typegoose'
import { PacketWriter } from '@util/maplenet'
import { Character } from '@models/Character'

export class Skill extends Typegoose {
  @prop({ ref: Character, refType: 'number', index: true })
  public characterId: number

  @prop({ index: true })
  public skillId: number

  @prop() public points: number
  @prop() public expires: Date
  @prop() public maxLevel: number
}

// not sure if we indexed properly with typegoose
// skillSchema.index({ characterId: 1, skillId: 1}, { unique: true });

export default new Skill().getModelForClass(Skill, {
  existingMongoose: mongoose
})
