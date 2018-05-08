const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
  name: String,
  password: String,
  salt: { type: String, default: null },
  female: Boolean,
  creationDate: Date,
  banReason: Number,
  banResetDate: Date,
  muteReason: Number,
  muteResetDate: Date,
  isAdmin: Boolean,
  loggedIn: Boolean
})

// accountSchema.methods.getCharacters = function(pWorldId) {
//   return Character.find({ account: this, worldId: pWorldId })
// }

module.exports = mongoose.model('Account', accountSchema)
