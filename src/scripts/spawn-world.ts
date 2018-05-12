import WorldServer from '../servers/WorldServer'
const argv = require('minimist')(process.argv.slice(2))

if (!argv.name) {
  throw Error('Please provide a name for the server. ex: --name Scania')
}

if (!argv.ip) {
  throw Error('Please provide an ip for the server. ex: --ip 127.0.0.1')
}

if (!argv.port) {
  throw Error('Please provide an port for the server. ex: --port 8500')
}

if (!argv.version) {
  throw Error('Please provide a version for the server. ex: --version 83')
}

if (!argv.subversion) {
  throw Error('Please provide a subversion for the server. ex: --version 1')
}

if (!argv.locale) {
  throw Error('Please provide a locale for the server. ex: --locale 8')
}

const server = new WorldServer({
  name: argv.name.toString(),
  ip: argv.ip.toString(),
  port: parseInt(argv.port, 10),
  version: parseInt(argv.version, 10),
  subversion: argv.subversion.toString(),
  locale: parseInt(argv.locale, 10),
  worldId: parseInt(argv.worldId, 10),
  channelId: parseInt(argv.channelId, 10)
})

process.on('SIGINT', () => {
  console.log(`Shutting down ${server.name}`)
  server.close()
  process.exit()
})
