const crypto = require('crypto')
const net = require('net')
const {
  socket: mapleSocket,
  PacketWriter,
  PacketReader
} = require('../util/maplenet')

class MapleServer {
  constructor(packetHandler, options) {
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

  createTcpServer() {
    const mapleServer = this
    return net.createServer(function(socket) {
      console.log('Got connection!')

      socket.clientSequence = new Uint8Array(crypto.randomBytes(4))
      socket.serverSequence = new Uint8Array(crypto.randomBytes(4))
      socket.ponged = true
      socket.header = true
      socket.nextBlockLen = 4
      socket.buffer = new Buffer(0)

      socket.client = {
        server: mapleServer,
        socket: socket
      }

      socket.client.server.connectedClients.push(socket)

      socket.client.sendPacket = function(packet) {
        let buffer = new Buffer(4)
        const socket = this.socket
        mapleSocket.generateHeader(
          buffer,
          socket.serverSequence,
          packet.writtenData,
          -(mapleServer.version + 1)
        )
        socket.write(buffer)

        buffer = packet.getBufferCopy()
        mapleSocket.encryptData(buffer, socket.serverSequence)

        socket.serverSequence = mapleSocket.morphSequence(socket.serverSequence)

        socket.write(buffer)
      }

      socket.client.disconnect = function(reason) {
        if (arguments.length !== 0) {
          console.log('Disconnecting client. Reason: ' + reason)
        } else {
          console.log('Disconnecting client.')
        }
        const socket = this.socket

        socket.end()
        socket.destroy()
      }

      socket.on('data', async function(receivedData) {
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
            socket.clientSequence = mapleSocket.morphSequence(
              socket.clientSequence
            )

            const reader = new PacketReader(block)
            const opCode = reader.readUInt16()
            const handler = mapleServer.packetHandler.getHandler(opCode)

            if (handler) {
              try {
                await handler(socket.client, reader)
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

      socket.on('close', function() {
        console.log('Connection closed.')
        socket.client.server.connectedClients.pop(this)
      })

      socket.on('error', function(error) {
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

  startPinger() {
    if (!this.pingerId) return

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

  close() {
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

module.exports = MapleServer
