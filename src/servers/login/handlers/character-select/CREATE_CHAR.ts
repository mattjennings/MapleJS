import { PacketWriter, PacketHandler } from '@util/maplenet'
import nxFiles from '@nxFiles'
import CharacterModel, { Character } from '@models/Character'
import Equip from '@models/Character/Item/Equip'
import Rechargeable from '@models/Character/Item/Rechargeable'
import { findDocumentByCutoffId } from '@util/mongoose'
import { getWorldInfoById, ipStringToBytes } from '@util/helpers'
import { InstanceType } from 'typegoose'
import { ReceiveOpcode } from '@packets'

export default new PacketHandler(ReceiveOpcode.CREATE_CHAR, async (client, reader) => {
  if (!client.account || !client.state) {
    client.disconnect()
    return
  }

  const name = reader.readString()
  if (name.length < 4 || name.length > 12) {
    client.disconnect('Name not inside length boundaries. Name: ' + name)
    return
  }

  const type = reader.readUInt32()
  let startJob = 0
  let startMap = 0
  if (type === 0) {
    // Cygnus: Noblesse
    startJob = 1000
    startMap = 130030000
  } else if (type === 2) {
    // Aran: Legend
    startJob = 2000
    startMap = 914000000
  }

  const eyes = reader.readUInt32()
  const hair = reader.readUInt32()
  const hairColor = reader.readUInt32()
  const skin = reader.readUInt32()
  const top = reader.readUInt32()
  const bottom = reader.readUInt32()
  const shoes = reader.readUInt32()
  const weapon = reader.readUInt32()
  const female = reader.readUInt8() === 1

  function ItemError(pWhat) {
    client.disconnect('[Character Creation] Invalid ' + pWhat)
  }

  // Check items
  if (!checkItemValidity(startJob, female, 0, eyes)) {
    return ItemError('eyes')
  }
  if (!checkItemValidity(startJob, female, 1, hair)) {
    return ItemError('hair')
  }
  if (!checkItemValidity(startJob, female, 2, hairColor)) {
    return ItemError('hairColor')
  }
  if (!checkItemValidity(startJob, female, 3, skin)) {
    return ItemError('skin')
  }
  if (!checkItemValidity(startJob, female, 4, top)) {
    return ItemError('top')
  }
  if (!checkItemValidity(startJob, female, 5, bottom)) {
    return ItemError('bottom')
  }
  if (!checkItemValidity(startJob, female, 6, shoes)) {
    return ItemError('shoes')
  }
  if (!checkItemValidity(startJob, female, 7, weapon)) {
    return ItemError('weapon')
  }

  const character = new CharacterModel({
    account: client.account._id,
    worldId: client.state.worldId,
    name,
    eyes,
    hair: hair + hairColor,
    skin,
    female,

    mapId: startMap,
    mapPos: 0,

    stats: {
      level: 1,
      job: startJob,
      str: 12,
      dex: 5,
      luk: 4,
      int: 4,
      hp: 50,
      mhp: 50,
      mp: 100,
      mmp: 100
    },

    inventory: {
      mesos: 0,
      maxSlots: [96, 96, 96, 96, 96]
    }
  })

  await character.save()

  // Create items
  if (top !== 0) {
    await createItem(character, top, -5, 1)
  }
  if (bottom !== 0) {
    await createItem(character, bottom, -6, 1)
  }
  if (shoes !== 0) {
    await createItem(character, shoes, -7, 1)
  }
  if (weapon !== 0) {
    await createItem(character, weapon, -11, 1)
  }
  await createItem(character, 4161001, 1, 2)

  const packet = new PacketWriter(0x000e)
  packet.writeUInt8(0)

  await character.addStats(packet)
  await character.addAvatar(packet)
  packet.writeUInt8(0) // ?
  packet.writeUInt8(0) // No rankings

  client.sendPacket(packet)
})

async function createItem(character: InstanceType<Character>, pItemId, pSlot, pInventory) {
  let item
  if (pInventory === 1) {
    item = new Equip()
  } else {
    item = new Rechargeable()
    item.amount = 1
  }
  item.character = character._id
  item.inventory = pInventory
  item.slot = pSlot
  item.itemId = pItemId
  await item.save()
}
function checkItemValidity(job, female, element, objectId) {
  let infoName = ''
  switch (job) {
    case 0:
      infoName = 'Info/Char'
      break // Adventurer
    case 1000:
      infoName = 'PremiumChar'
      break // Cygnus
    case 2000:
      infoName = 'OrientChar'
      break // Aran
  }

  infoName += female ? 'Female' : 'Male'

  infoName += '/' + element

  let valid = false

  nxFiles.etc.getPath('MakeCharInfo.img/' + infoName).forEach(function(node) {
    if (objectId === node.getData()) {
      valid = true
      return false
    }
  })

  return valid
}
