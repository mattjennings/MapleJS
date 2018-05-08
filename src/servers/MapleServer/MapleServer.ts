import * as crypto from 'crypto'
import * as net from 'net'
import { mapleSocket, PacketWriter, PacketReader, PacketHandler } from '../../util/maplenet'
import Client from './Client'

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

class MapleServer {
  public name: string
  public port: number
  public version: number
  public subversion: string
  public locale: number
  public packetHandler: PacketHandler

  public connectedClients: any[]
  public tcpServer: any
  public pingerId: NodeJS.Timer

  constructor(packetHandler: PacketHandler, options) {
    this.name = options.name
    this.port = options.port
    this.version = options.version
    this.subversion = options.subversion
    this.locale = options.locale
    this.packetHandler = packetHandler

    this.connectedClients = []

    this.tcpServer = this.createTcpServer()

    console.log('Starting pinger')

    packetHandler.setHandler(0x0018, socket => {
      socket.socket.ponged = true
    })

    this.tcpServer.listen(this.port)
    console.log('Waiting for people on port ' + this.port + '...')
  }

  public createTcpServer() {
    const mapleServer = this
    return net.createServer(socket => {
      console.log('Got connection!')

      socket.clientSequence = new Uint8Array(crypto.randomBytes(4))
      socket.serverSequence = new Uint8Array(crypto.randomBytes(4))
      socket.ponged = true
      socket.header = true
      socket.nextBlockLen = 4
      socket.buffer = new Buffer(0)

      const client = new Client(mapleServer, socket)
      this.connectedClients.push(socket)

      socket.on('data', async receivedData => {
        socket.pause()
        const temp = socket.buffer
        socket.buffer = Buffer.concat([temp, receivedData])

        while (socket.nextBlockLen <= socket.buffer.length) {
          const data = socket.buffer

          const block = new Buffer(socket.nextBlockLen)
          data.copy(block, 0, 0, block.length)
          socket.buffer = new Buffer(data.length - block.length)
          data.copy(socket.buffer, 0, block.length)

          if (socket.header) {
            socket.nextBlockLen = mapleSocket.getLengthFromHeader(block)
          } else {
            socket.nextBlockLen = 4

            mapleSocket.decryptData(block, socket.clientSequence)
            socket.clientSequence = mapleSocket.morphSequence(socket.clientSequence)

            const reader = new PacketReader(block)
            const opCode = reader.readUInt16()
            const handler = mapleServer.packetHandler.getHandler(opCode)

            if (handler) {
              try {
                await handler(client, reader)
              } catch (exception) {
                console.error(exception, exception.stack)
              }
            } else {
              console.warn('handler not found for 0x' + opCode.toString(16))
            }
          }

          socket.header = !socket.header
        }

        socket.resume()
      })

      socket.on('close', () => {
        console.log('Connection closed.')
        const index = mapleServer.connectedClients.indexOf(socket)
        mapleServer.connectedClients.splice(index, 1)
        console.log('Connected clients remaining: ' + mapleServer.connectedClients.length)
      })

      socket.on('error', error => {
        console.log('Error?')
        console.log(error)
      })

      // Send handshake
      const packet = new PacketWriter()
      packet.writeUInt16(2 + 2 + mapleServer.subversion.length + 4 + 4 + 1)
      packet.writeUInt16(mapleServer.version)
      packet.writeString(mapleServer.subversion)
      packet.writeBytes(socket.clientSequence)
      packet.writeBytes(socket.serverSequence)
      packet.writeUInt8(mapleServer.locale)

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

      const clientsCopy = this.connectedClients.slice()
      for (let i = 0; i < clientsCopy.length; i++) {
        try {
          clientsCopy[i].client.disconnect('Server is closing.')
        } catch (ex) {
          console.log(ex)
        }
      }
    }
  }
}

export default MapleServer
