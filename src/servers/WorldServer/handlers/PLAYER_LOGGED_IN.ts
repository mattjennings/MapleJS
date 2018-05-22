import { PacketWriter, PacketHandler } from '@util/maplenet'
import AccountModel from '@models/Account'
import CharacterModel from '@models/Character'
import SkillModel from '@models/Character/Skill/Skill'
import MapManager from '@packets/Map/MapManager'
import MovableLife from '@packets/MovableLife'
import { ReceiveOpcode, SendOpcode } from '@packets'
import { Item } from '@models/Character/Item'
import { InstanceType } from 'typegoose'

const Int64 = require('int64-native')

/*
diamondo packet lengths

Before stats: 31
After stats: 124
Before inventory: 126
After inventory: 155
Before skills: 155
After skills: 159
*/
export default new PacketHandler(ReceiveOpcode.PLAYER_LOGGED_IN, async (client, reader) => {
  if (client.character) {
    client.disconnect('Trying to load while already loaded.')
    return
  }

  const characterId = reader.readUInt32()
  const character = await CharacterModel.findOne({ _id: characterId, worldId: client.server.worldId })

  if (!character) {
    client.disconnect('Character not found!')
    return
  }

  client.character = character
  client.account = await AccountModel.findOne({
    _id: character.account
  })

  if (!client.account) {
    client.disconnect('Account not found!')
    return
  }

  character.mapId = 100000000

  // Kick back user if needed
  let map = MapManager.getMap(character.mapId)
  if (map.forcedReturn !== 999999999) {
    character.mapId = map.forcedReturn
    map = MapManager.getMap(character.mapId)
  }
  character.mapPos = character.mapPos || 0

  client.location = new MovableLife()

  const spawnpoint = map.getPortalById(character.mapPos)

  if (spawnpoint) {
    client.location.x = spawnpoint.x
    client.location.y = spawnpoint.y
  }

  client.portalCount = 1
  client.lastTickCount = -1

  // Send data to player

  const packet = new PacketWriter(SendOpcode.WARP_TO_MAP)
  packet.writeUInt32(client.server.channelId)
  packet.writeUInt8(client.portalCount) // Portal count
  packet.writeUInt8(1)
  packet.writeUInt16(0)

  // RNGs
  packet.writeUInt32(123123312)
  packet.writeUInt32(234232)
  packet.writeUInt32(123123132)

  packet.writeBytes([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
  packet.writeUInt8(0)

  character.addStats(packet)

  packet.writeUInt8(20) // Buddylist size
  packet.writeUInt8(0) // Blessing of the Fairy name

  let item: InstanceType<Item>
  let j
  let i

  {
    // Inventory
    packet.writeUInt32(character.inventory.mesos)
    for (i = 0; i < 5; i++) {
      packet.writeUInt8(character.inventory.maxSlots[i])
    }

    packet.writeUInt64(new Int64('0x14F373BFDE04000'))

    const equips = await character.getInventory(1)

    // Regular
    for (j = 0; j < equips.length; j++) {
      item = equips[j]
      if (!(item.slot > -100 && item.slot <= 0)) {
        continue
      }

      packet.writeUInt16(Math.abs(item.slot))

      item.writeItemPacketData(packet)
    }
    packet.writeUInt16(0)

    // Cash
    for (j = 0; j < equips.length; j++) {
      item = equips[j]
      if (!(item.slot > -200 && item.slot <= -100)) {
        continue
      }

      packet.writeUInt16(Math.abs(item.slot))
      item.writeItemPacketData(packet)
    }
    packet.writeUInt16(0)

    // Equip Inventory
    for (j = 0; j < equips.length; j++) {
      item = equips[j]
      if (item.slot <= 0) {
        continue
      }

      packet.writeUInt16(Math.abs(item.slot))
      item.writeItemPacketData(packet)
    }
    packet.writeUInt16(0)

    // Evan
    for (j = 0; j < equips.length; j++) {
      item = equips[j]
      if (!(item.slot >= 1000 && item.slot < 1004)) {
        continue
      }

      packet.writeUInt16(Math.abs(item.slot))
      item.writeItemPacketData(packet)
    }
    packet.writeUInt16(0)

    for (i = 2; i <= 5; i++) {
      // For each inventory...
      const inventory = await character.getInventory(i)
      for (j = 0; j < inventory.length; j++) {
        item = inventory[j]
        packet.writeUInt8(item.slot)
        item.writeItemPacketData(packet)
      }
      packet.writeUInt8(0)
    }
  }

  {
    // Skills
    const skills = await SkillModel.find({ characterId: character })
    packet.writeUInt16(skills.length) // Unlocked
    for (i = 0; i < skills.length; i++) {
      const skill = skills[i]
      packet.writeUInt32(skill.skillId)
      packet.writeUInt32(skill.points)

      if (skill.expires === null) {
        const NoExpiration = new Int64('0x217E646BB058000')
        packet.writeUInt64(NoExpiration)
      } else {
        packet.writeDate(skill.expires)
      }

      if (Math.floor(skill.skillId / 10000) % 10 === 2) {
        packet.writeUInt32(skill.maxLevel)
      }
    }

    packet.writeUInt16(0) // Cooldowns
  }

  {
    // Quests
    packet.writeUInt16(0) // Running
    packet.writeUInt16(0) // Finished
  }

  packet.writeUInt16(0) // Crush Rings
  packet.writeUInt16(0) // Friend Rings
  packet.writeUInt16(0) // Marriage Rings
  packet.writeUInt16(0)

  {
    // Teleport Rocks
    for (i = 0; i < 5; i++) {
      packet.writeUInt32(999999999)
    }

    for (i = 0; i < 10; i++) {
      packet.writeUInt32(999999999)
    }
  }

  {
    // Monsterbook
    packet.writeUInt32(0) // Cover
    packet.writeUInt8(0) // 'readmode'
    packet.writeUInt16(0) // cards
  }

  packet.writeUInt16(0)
  packet.writeUInt16(0)
  packet.writeUInt16(0)

  packet.writeDate(new Date()) // Current time

  // diamondo has length of 252?
  client.sendPacket(packet)

  map.addClient(client)
})
