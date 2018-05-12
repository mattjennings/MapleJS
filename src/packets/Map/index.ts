
// todo: this
// find place for NX helper methods
export default class Map {
  constructor(nxNode) {
    this.id = parseInt(nxNode.GetName(), 10)
    this.clients = []

    const infoBlock = nxNode.Child('info')

    const stringNXNode = findStringNXMapNode(this.id)
    this.fieldName = getOrDefault_NXData(stringNXNode.Child('mapName'), '')
    this.fieldStreetName = getOrDefault_NXData(
      stringNXNode.Child('streetName'),
      ''
    )

    this.fieldType = getOrDefault_NXData(infoBlock.Child('fieldType'), 0)
    this.returnMap = getOrDefault_NXData(infoBlock.Child('returnMap'), 999999999)
    this.forcedReturn = getOrDefault_NXData(
      infoBlock.Child('forcedReturn'),
      999999999
    )
    this.mobRate = getOrDefault_NXData(infoBlock.Child('mobRate'), 0)
    this.onFirstUserEnter = getOrDefault_NXData(
      infoBlock.Child('onFirstUserEnter'),
      ''
    )
    this.onUserEnter = getOrDefault_NXData(infoBlock.Child('onUserEnter'), '')
    this.lvLimit = getOrDefault_NXData(infoBlock.Child('lvLimit'), 0)
    this.lvForceMove = getOrDefault_NXData(infoBlock.Child('lvLimit'), 10000)
    this.dropsExpire = getOrDefault_NXData(infoBlock.Child('everlast'), 0) === 0

    let realNode = nxNode
    while (realNode.Child('info').Child('link')) {
      realNode = getMapNodePath(
        realNode
          .Child('info')
          .Child('link')
          .getData()
      )
    }

    const portals = {}
    ;(realNode.Child('portal') || []).ForEach(function(portalNode) {
      const id = parseInt(portalNode.GetName(), 10)
      portals[id] = {
        id: id,
        name: getOrDefault_NXData(portalNode.Child('pn'), ''),
        type: getOrDefault_NXData(portalNode.Child('pt'), ''),
        toMap: getOrDefault_NXData(portalNode.Child('tm'), ''),
        toName: getOrDefault_NXData(portalNode.Child('tn'), ''),
        script: getOrDefault_NXData(portalNode.Child('script'), ''),
        x: getOrDefault_NXData(portalNode.Child('x'), 0),
        y: getOrDefault_NXData(portalNode.Child('y'), 0)
      }
    })

    this.portals = portals

    this.playableMapArea = new PlayableMapArea(nxNode)

    this.bounds = this.playableMapArea.bounds
    this.center = {
      x: this.bounds.right - this.bounds.left,
      y: this.bounds.bottom - this.bounds.top
    }

    this.lifePool = new LifePool(this, nxNode)

    console.log('Loaded map: ' + this.id)
  }

  public broadcastPacket(packet, skipClient) {
    this.clients.forEach(function(client) {
      if (client === skipClient) { return }
      client.sendPacket(packet)
    })
  },

  addClient(client) {
    this.clients.push(client)

    // Broadcast the user entering
    this.broadcastPacket(packets.map.getEnterMapPacket(client), client)

    // Show other characters for player
    this.clients.forEach(function(loopClient) {
      loopClient.sendPacket(packets.map.getEnterMapPacket(client))
    })
  },

  removeClient(client) {
    this.clients.pop(client)

    this.broadcastPacket(packets.map.getLeaveMapPacket(client), client)
  },

  getPortalById(id) {
    id = parseInt(id, 10)
    if (this.portals.hasOwnProperty(id)) { return this.portals[id] }
    return null
  },

  getPortalByName(name) {
    for (const index in this.portals) {
      if (this.portals[index].name === name) { return this.portals[index] }
    }
    return null
  }
}
