import * as crypto from 'crypto'
import * as net from 'net'
import { findIndex } from 'lodash'
import { mapleCrypto, PacketWriter, PacketReader, PacketHandlerManager, PacketHandler } from '@util/maplenet'
import MapleClient from './MapleClient'
import { getOpcodeName, ReceiveOpcode } from '@packets'

declare module 'net' {
  interface Socket {
    clientSequence: Uint8Array
    serverSequence: Uint8Array
    ponged: boolean
    header: boolean
    nextBlockLen: number
    buffer: Buffer
  }
}

export interface MapleServerOptions {
  name: string
  ip: string
  port: number
  version: number
  subversion: string
  locale: number
}

export default class MapleServer {
  public name: string
  public port: number
  public ip: string
  public version: number
  public subversion: string
  public locale: number
  public packetHandlerManager: PacketHandlerManager

  public connectedClients: MapleClient[]
  public tcpServer: any
  public pingerId: NodeJS.Timer

  constructor(packetHandlerManager: PacketHandlerManager, options: MapleServerOptions) {
    this.name = options.name
    this.port = options.port
    this.ip = options.ip
    this.version = options.version
    this.subversion = options.subversion
    this.locale = options.locale
    this.packetHandlerManager = packetHandlerManager

    this.connectedClients = []

    this.tcpServer = this.createTcpServer()

    packetHandlerManager.setHandler(
      new PacketHandler(0x0018, client => {
        client.socket.ponged = true
      })
    )

    this.tcpServer.listen(this.port, this.ip)
    console.log(`${this.name} listening on  ${this.ip}:${this.port}`)
  }

  public createTcpServer() {
    return net.createServer(socket => {
      socket.clientSequence = new Uint8Array(crypto.randomBytes(4))
      socket.serverSequence = new Uint8Array(crypto.randomBytes(4))
      socket.ponged = true
      socket.header = true
      socket.nextBlockLen = 4
      socket.buffer = new Buffer(0)

      const client = new MapleClient(this, socket)
      this.connectedClients.push(client)

      console.log('Got connection!')
      console.log('Connected clients: ' + this.connectedClients.length)

      socket.on('data', async receivedData => {
        socket.pause()
        socket.buffer = Buffer.concat([socket.buffer, receivedData])

        while (socket.nextBlockLen <= socket.buffer.length) {
          const data = socket.buffer

          const block = new Buffer(socket.nextBlockLen)
          data.copy(block, 0, 0, block.length)
          socket.buffer = new Buffer(data.length - block.length)
          data.copy(socket.buffer, 0, block.length)

          if (socket.header) {
            socket.nextBlockLen = mapleCrypto.getLengthFromHeader(block)
          } else {
            socket.nextBlockLen = 4

            mapleCrypto.decryptData(block, socket.clientSequence)
            socket.clientSequence = mapleCrypto.morphSequence(socket.clientSequence)

            const reader = new PacketReader(block)
            const opCode = reader.readUInt16()
            await this.packetHandlerManager.runHandler(opCode, client, reader)
          }

          socket.header = !socket.header
        }

        socket.resume()
      })

      socket.on('close', () => {
        console.log('Connection closed.')
        const index = findIndex(this.connectedClients, { socket })
        if (index > -1) {
          const client = this.connectedClients.splice(index, 1)
        }
        console.log('Connected clients remaining: ' + this.connectedClients.length)
      })

      socket.on('error', error => {
        console.error('Socket error', error)
      })

      // Send handshake
      const packet = new PacketWriter()
      packet.writeUInt16(2 + 2 + this.subversion.length + 4 + 4 + 1)
      packet.writeUInt16(this.version)
      packet.writeString(this.subversion)
      packet.writeBytes(socket.clientSequence)
      packet.writeBytes(socket.serverSequence)
      packet.writeUInt8(this.locale)

      socket.write(packet.getBufferCopy())
    })
  }

  public startPinger() {
    if (!this.pingerId) {
      return
    }

    this.pingerId = setInterval(function() {
      const clientsCopy = this.connectedClients.slice()
      const packet = new PacketWriter(0x0011)

      for (let i = 0; i < clientsCopy.length; i++) {
        try {
          const client = clientsCopy[i].client
          if (client.ponged === false) {
            client.disconnect('Ping timeout') // Exterminate.
            continue
          }
          client.ponged = false
          client.sendPacket(packet)
        } catch (ex) {
          console.log(ex)
        }
      }
    }, 15000)
  }

  public close() {
    if (this.pingerId) {
      clearInterval(this.pingerId)
      this.pingerId = null
    }
    if (this.tcpServer) {
      this.tcpServer.close()
      this.tcpServer = null

      this.connectedClients.forEach(client => {
        client.disconnect('Server is closing.')
      })
    }
  }
}
