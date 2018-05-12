const nx = require('@util/nx-parser')
const path = require('path')

export default {
  character: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'Character.nx')),
  item: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'Item.nx')),
  string: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'String.nx')),
  map: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'Map.nx')),
  mob: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'Mob.nx')),
  npc: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'Npc.nx')),
  skill: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'Skill.nx')),
  reactor: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'Reactor.nx')),
  etc: new nx.file(path.resolve(__dirname, '..', '..', 'nx', 'Etc.nx'))
}

export class NxManager {
  public addPadding(side: 'left' | 'right', value, length, paddingCharacter: string = '0') {
    paddingCharacter = paddingCharacter
    value = value.toString()
    for (let i = value.length; i < length; i++) {
      if (side === 'left') {
        value = paddingCharacter + value
      } else {
        value += paddingCharacter
      }
    }
    return value
  }
}
