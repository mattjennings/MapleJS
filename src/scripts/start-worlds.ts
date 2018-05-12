import WorldServer from '../servers/WorldServer'
import * as child_process from 'child_process'
import { forEach } from 'lodash'
import { WorldServerOptions } from '@servers/WorldServer'

const serverConfig = require('@config/server')
const { worlds } = serverConfig
const instances = []
if (!worlds) {
  throw Error('No worlds found in config/server.json')
}

const spawnInstance = (options: WorldServerOptions) => {
  const instance = child_process.spawn(
    'ts-node',
    [
      '-r',
      'tsconfig-paths/register',
      'spawn-world.ts',
      '--name',
      options.name,
      '--ip',
      options.ip,
      '--port',
      options.port.toString(),
      '--version',
      options.version.toString(),
      '--subversion',
      options.subversion,
      '--locale',
      options.locale.toString()
    ],
    {
      cwd: __dirname,
      detached: true
    }
  )

  instance.stdout.setEncoding('utf8')
  instance.stdout.on('data', (data: string) => {
    const lines = data.split('\n')
    lines.forEach(line => {
      if (line === '') {
        return
      }
      console.log('[' + options.name + '] ' + line)
    })
  })

  instance.stderr.setEncoding('utf8')
  instance.stderr.on('data', (data: string) => {
    const lines = data.split('\n')

    lines.forEach(pLine => {
      if (pLine === '') {
        return
      }
      console.log('[' + options.name + '][ERROR] ' + pLine)
    })
  })

  instance.on('close', code => {
    console.log('[' + options.name + '][EXIT] code ' + code)
  })

  return instance
}

forEach(worlds, (world, key) => {
  ;[...Array(world.channels)].forEach((v, channelNumber) => {
    instances.push(
      spawnInstance({
        name: `world-${key}-channel-${channelNumber + 1}`,
        ip: world.ip || '127.0.0.1',
        port: world.portStart + channelNumber,
        worldId: world.id,
        channelId: channelNumber + 1,
        version: serverConfig.version || 83,
        subversion: serverConfig.subversion || '1',
        locale: serverConfig.locale || 8
      })
    )
  })
})

process.on('SIGINT', () => {
  console.log('Shutting down worlds...')
  instances.forEach(instance => instance.kill('SIGINT'))
  console.log('Worlds are shut down')
  process.exit()
})
