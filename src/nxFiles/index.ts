import { NxFile } from '@util/nx-parser'
import * as path from 'path'

export default {
  character: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'Character.nx')),
  item: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'Item.nx')),
  string: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'String.nx')),
  map: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'Map.nx')),
  mob: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'Mob.nx')),
  npc: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'Npc.nx')),
  skill: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'Skill.nx')),
  reactor: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'Reactor.nx')),
  etc: new NxFile(path.resolve(__dirname, '..', '..', 'nx', 'Etc.nx'))
}
