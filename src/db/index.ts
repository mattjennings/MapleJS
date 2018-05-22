import * as mongoose from 'mongoose'
import * as autoIncrement from 'mongoose-auto-increment'
import * as path from 'path'
const requireContext = require('require-context')
const serverConfig = require('@config/server')

mongoose.connect(serverConfig.databaseConnectionString)
autoIncrement.initialize(mongoose.connection)

const requireModels = requireContext(path.resolve(__dirname, '..', 'models'), true, /\.ts$/)
requireModels.keys().forEach(requireModels)

export default mongoose
