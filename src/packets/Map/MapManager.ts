import nxFiles, { NxManager } from '@nxFiles'

export default class MapManager extends NxManager {
  private maps: { [key: string]: any } = {}

  public getMapNodePath(mapId) {
    mapId = parseInt(mapId, 10)
    const category = Math.floor(mapId / 100000000)
    const maname = this.addPadding('left', mapId, 9) + '.img'
    return nxFiles.map.GetPath('Map/Map' + category + '/' + maname)
  }

  public getMap(mapId) {
    mapId = parseInt(mapId, 10)
    if (this.maps.hasOwnProperty(mapId)) {
      return this.maps[mapId]
    }

    const map = this.getMapNodePath(mapId)
    if (map === null) {
      this.maps[mapId] = null
    } else {
      this.maps[mapId] = new Map(map)
    }

    return this.maps[mapId]
  }

  public getMapCount() {
    return Object.keys(this.maps).length
  }

  public findStringNXMapNode(mapId) {
    let node = null

    nxFiles.string.getPath('Map.img').forEach(categoryNode => {
      categoryNode.forEach(mapNode => {
        if (mapId === mapNode.GetName()) {
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
}
