import * as mongoose from 'mongoose'
import { prop, instanceMethod, Typegoose, ModelType, InstanceType } from 'typegoose'
import Character from './Character'

export class Account extends Typegoose {
  @prop() public name?: string
  @prop() public password: string
  @prop({ default: null })
  public salt: string
  @prop() public pic: string
  @prop() public female: boolean
  @prop() public creationDate: Date
  @prop() public banReason: number
  @prop() public banResetDate: Date
  @prop() public muteReason: number
  @prop() public muteResetDate: Date
  @prop() public isAdmin: boolean
  @prop() public loggedIn: boolean

  @instanceMethod
  public getCharacters(this: InstanceType<Account>, worldId: number) {
    return Character.find({ account: this._id, worldId })
  }
}

export default new Account().getModelForClass(Account)
