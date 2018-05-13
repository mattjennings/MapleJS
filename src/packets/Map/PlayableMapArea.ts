import { NxNode, NxFile, getNXData, addPadding } from '@util/nx-parser'

export interface LadderRope {
  x: number
  y1: number
  y2: number
  isLadder: boolean
  page: number
  upperFoothold: boolean
}

// more info on footholds - http://mapleref.wikia.com/wiki/Footholds
export interface Foothold {
  x1: number
  y1: number
  x2: number
  y2: number
  force: number
  next: number
  prev: number
}

export interface FootholdGroup {
  [key: string]: Foothold
}

export interface FootholdLayer {
  [key: string]: FootholdGroup
}

export interface FootholdTree {
  [key: string]: FootholdLayer
}

export interface MapBounds {
  left: number
  top: number
  right: number
  bottom: number
}

export default class PlayableMapArea {
  public ladderRopes: { [key: string]: LadderRope } = {}
  public footholds: FootholdTree = {}

  public bounds: MapBounds = {
    left: 2147483647,
    top: 2147483647,
    right: -2147483648,
    bottom: -2147483648
  }
  constructor(mapData: NxNode) {
    // Load footholds
    const footholdChildren = mapData.child('foothold')
    if (footholdChildren) {
      footholdChildren.forEach(layerNode => {
        const layer: FootholdLayer = {}

        layerNode.forEach(groupNode => {
          const group: FootholdGroup = {}
          groupNode.forEach(elementNode => {
            const foothold: Foothold = {
              x1: getNXData(elementNode.child('x1'), 0),
              y1: getNXData(elementNode.child('y1'), 0),
              x2: getNXData(elementNode.child('x2'), 0),
              y2: getNXData(elementNode.child('y2'), 0),

              force: getNXData(elementNode.child('force'), 0),

              next: getNXData(elementNode.child('next'), 0),
              prev: getNXData(elementNode.child('prev'), 0)
            }

            group[elementNode.getName()] = foothold

            const maxX = foothold.x1 > foothold.x2 ? foothold.x1 : foothold.x2
            const minX = foothold.x1 < foothold.x2 ? foothold.x1 : foothold.x2
            const maxY = foothold.y1 > foothold.y2 ? foothold.y1 : foothold.y2
            const minY = foothold.y1 < foothold.y2 ? foothold.y1 : foothold.y2

            if (this.bounds.left > maxX + 30) {
              this.bounds.left = maxX + 30
            }
            if (this.bounds.right < minX - 30) {
              this.bounds.right = minX - 30
            }
            if (this.bounds.top > maxY + 300) {
              this.bounds.top = maxY + 300
            }
            if (this.bounds.bottom < minY - 300) {
              this.bounds.bottom = minY - 300
            }
          })

          layer[groupNode.getName()] = group
        })
        this.footholds[layerNode.getName()] = layer
      })
    }

    this.bounds.left += 10
    this.bounds.right += 10
    this.bounds.top += 10
    this.bounds.bottom += 10

    // Load ladders and ropes

    const ladderRopes = {}
    const ladderRopeChildren = mapData.child('ladderRope')

    if (ladderRopeChildren) {
      ladderRopeChildren.forEach(ladderRopeNode => {
        const ladderRope = {
          x: getNXData(ladderRopeNode.child('x'), 0),
          y1: getNXData(ladderRopeNode.child('y1'), 0),
          y2: getNXData(ladderRopeNode.child('y2'), 0),

          isLadder: getNXData(ladderRopeNode.child('l'), 0) !== 0,
          page: getNXData(ladderRopeNode.child('page'), 0),
          upperFoothold: getNXData(ladderRopeNode.child('uf'), 0) !== 0
        }

        ladderRopes[ladderRopeNode.getName()] = ladderRope
      })

      this.ladderRopes = ladderRopes
    }
  }
}
