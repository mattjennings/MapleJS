import * as mongoose from 'mongoose'
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose'

class Account extends Typegoose {
  @prop() public name?: string

  @prop() public password: string

  @prop({ default: null })
  public salt: string

  @prop() public female: boolean

  @prop() public creationDate: Date

  @prop() public banReason: number

  @prop() public banResetDate: Date

  @prop() public muteReason: number

  @prop() public muteResetDate: Date

  @prop() public isAdmin: boolean

  @prop() public loggedIn: boolean
}

// accountSchema.methods.getCharacters = function(pWorldId) {
//   return Character.find({ account: this, worldId: pWorldId })
// }

export default new Account().getModelForClass(Account)
