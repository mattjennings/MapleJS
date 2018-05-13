import { NxNode } from '@util/nx-parser'
const Int64 = require('int64-native')

export const getNXData = (node: NxNode, defaultValue: any) => {
  if (node === null || typeof node === 'undefined') {
    return defaultValue
  }
  const data = node.getData()
  if (data instanceof Int64) {
    return data.low32()
  }
  return data
}

export const addPadding = (side: 'left' | 'right', value, length, paddingCharacter: string = '0') => {
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
