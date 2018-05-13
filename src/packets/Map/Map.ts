import { NxNode, NxFile, getNXData, addPadding } from '@util/nx-parser'
import { MapleClient } from '@util/maplenet'
import nxFiles from '@nxFiles'
import * as MapPacketCreator from './MapPacketCreator'
import PlayableMapArea from '@packets/Map/PlayableMapArea'
export interface Portal {
  id: number
  name: string
  type: string
  toMap: string
  toName: string
  script: string
  x: number
  y: number
}

export default class Map {
  public id: number
  public clients: MapleClient[] = []
  public fieldName: string
  public fieldStreetName: string
  public fieldType: number
  public returnMap: number
  public mobRate: number
  public forcedReturn: number
  public onFirstUserEnter: any
  public onUserEnter: any
  public lvLimit: number
  public lvForceMove: number
  public dropsExpire: boolean

  public portals: { [key: string]: Portal } = {}
  public playableMapArea: PlayableMapArea
  public bounds: PlayableMapArea['bounds']
  public center: { x: number; y: number }

  constructor(nxNode: NxNode) {
    this.id = parseInt(nxNode.getName(), 10)
    const infoBlock = nxNode.child('info')

    const stringNXNode = this.findStringNXMapNode(this.id)
    this.fieldName = getNXData(stringNXNode.child('mapName'), '')
    this.fieldStreetName = getNXData(stringNXNode.child('streetName'), '')

    this.fieldType = getNXData(infoBlock.child('fieldType'), 0)
    this.returnMap = getNXData(infoBlock.child('returnMap'), 999999999)
    this.forcedReturn = getNXData(infoBlock.child('forcedReturn'), 999999999)
    this.mobRate = getNXData(infoBlock.child('mobRate'), 0)
    this.onFirstUserEnter = getNXData(infoBlock.child('onFirstUserEnter'), '')
    this.onUserEnter = getNXData(infoBlock.child('onUserEnter'), '')
    this.lvLimit = getNXData(infoBlock.child('lvLimit'), 0)
    this.lvForceMove = getNXData(infoBlock.child('lvLimit'), 10000)
    this.dropsExpire = getNXData(infoBlock.child('everlast'), 0) === 0

    let realNode = nxNode
    while (realNode.child('info').child('link')) {
      realNode = this.getMapNodePath(
        realNode
          .child('info')
          .child('link')
          .getData()
      )
    }

    const portalChild = realNode.child('portal')

    if (portalChild) {
      portalChild.forEach(portalNode => {
        const id = parseInt(portalNode.getName(), 10)
        this.portals[id] = {
          id,
          name: getNXData(portalNode.child('pn'), ''),
          type: getNXData(portalNode.child('pt'), ''),
          toMap: getNXData(portalNode.child('tm'), ''),
          toName: getNXData(portalNode.child('tn'), ''),
          script: getNXData(portalNode.child('script'), ''),
          x: getNXData(portalNode.child('x'), 0),
          y: getNXData(portalNode.child('y'), 0)
        }
      })
    }

    this.playableMapArea = new PlayableMapArea(nxNode)

    this.bounds = this.playableMapArea.bounds
    this.center = {
      x: this.bounds.right - this.bounds.left,
      y: this.bounds.bottom - this.bounds.top
    }

    // this.lifePool = new LifePool(this, nxNode)

    // console.log('Loaded map: ' + this.id)
  }

  public broadcastPacket(packet, skipClient) {
    this.clients.forEach(client => {
      if (client === skipClient) {
        return
      }
      client.sendPacket(packet)
    })
  }

  public addClient(client) {
    this.clients.push(client)

    // Broadcast the user entering
    this.broadcastPacket(MapPacketCreator.getEnterMapPacket(client), client)

    // Show other characters for player
    this.clients.forEach(loopClient => {
      loopClient.sendPacket(MapPacketCreator.getEnterMapPacket(client))
    })
  }

  public removeClient(client) {
    this.clients.splice(client)

    this.broadcastPacket(MapPacketCreator.getLeaveMapPacket(client), client)
  }

  public getPortalById(id) {
    id = parseInt(id, 10)
    if (this.portals.hasOwnProperty(id)) {
      return this.portals[id]
    }
    return null
  }

  public getPortalByName(name) {
    for (const index in this.portals) {
      if (this.portals[index].name === name) {
        return this.portals[index]
      }
    }
    return null
  }

  // private methods
  private findStringNXMapNode(mapId): NxNode {
    let node = null

    nxFiles.string.getPath('Map.img').forEach(categoryNode => {
      categoryNode.forEach(mapNode => {
        const mapNodeName = mapNode.getName()
        if (mapId.toString() === mapNodeName) {
          node = mapNode
          return false
        }
      })
      if (node !== null) {
        return false
      }
    })

    return node
  }

  private getMapNodePath(mapId) {
    mapId = parseInt(mapId, 10)
    const category = Math.floor(mapId / 100000000)
    const maname = addPadding('left', mapId, 9) + '.img'
    return nxFiles.map.getPath('Map/Map' + category + '/' + maname)
  }
}
