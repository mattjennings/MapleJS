import { find } from 'lodash'

const serverConfig = require('@config/server')

export const getWorldInfoById = (id: number) => {
  const world = find(serverConfig.worlds, { id })

  if (world) {
    return world as any
  } else {
    return null
  }
}

export const ipStringToBytes = (ip: string) => {
  const ipParts = ip.split('.')
  return [parseInt(ipParts[0], 10), parseInt(ipParts[1], 10), parseInt(ipParts[2], 10), parseInt(ipParts[3], 10)]
}
