const sequenceShiftingKey = new Uint8Array([
  0xec,
  0x3f,
  0x77,
  0xa4,
  0x45,
  0xd0,
  0x71,
  0xbf,
  0xb7,
  0x98,
  0x20,
  0xfc,
  0x4b,
  0xe9,
  0xb3,
  0xe1,
  0x5c,
  0x22,
  0xf7,
  0x0c,
  0x44,
  0x1b,
  0x81,
  0xbd,
  0x63,
  0x8d,
  0xd4,
  0xc3,
  0xf2,
  0x10,
  0x19,
  0xe0,
  0xfb,
  0xa1,
  0x6e,
  0x66,
  0xea,
  0xae,
  0xd6,
  0xce,
  0x06,
  0x18,
  0x4e,
  0xeb,
  0x78,
  0x95,
  0xdb,
  0xba,
  0xb6,
  0x42,
  0x7a,
  0x2a,
  0x83,
  0x0b,
  0x54,
  0x67,
  0x6d,
  0xe8,
  0x65,
  0xe7,
  0x2f,
  0x07,
  0xf3,
  0xaa,
  0x27,
  0x7b,
  0x85,
  0xb0,
  0x26,
  0xfd,
  0x8b,
  0xa9,
  0xfa,
  0xbe,
  0xa8,
  0xd7,
  0xcb,
  0xcc,
  0x92,
  0xda,
  0xf9,
  0x93,
  0x60,
  0x2d,
  0xdd,
  0xd2,
  0xa2,
  0x9b,
  0x39,
  0x5f,
  0x82,
  0x21,
  0x4c,
  0x69,
  0xf8,
  0x31,
  0x87,
  0xee,
  0x8e,
  0xad,
  0x8c,
  0x6a,
  0xbc,
  0xb5,
  0x6b,
  0x59,
  0x13,
  0xf1,
  0x04,
  0x00,
  0xf6,
  0x5a,
  0x35,
  0x79,
  0x48,
  0x8f,
  0x15,
  0xcd,
  0x97,
  0x57,
  0x12,
  0x3e,
  0x37,
  0xff,
  0x9d,
  0x4f,
  0x51,
  0xf5,
  0xa3,
  0x70,
  0xbb,
  0x14,
  0x75,
  0xc2,
  0xb8,
  0x72,
  0xc0,
  0xed,
  0x7d,
  0x68,
  0xc9,
  0x2e,
  0x0d,
  0x62,
  0x46,
  0x17,
  0x11,
  0x4d,
  0x6c,
  0xc4,
  0x7e,
  0x53,
  0xc1,
  0x25,
  0xc7,
  0x9a,
  0x1c,
  0x88,
  0x58,
  0x2c,
  0x89,
  0xdc,
  0x02,
  0x64,
  0x40,
  0x01,
  0x5d,
  0x38,
  0xa5,
  0xe2,
  0xaf,
  0x55,
  0xd5,
  0xef,
  0x1a,
  0x7c,
  0xa7,
  0x5b,
  0xa6,
  0x6f,
  0x86,
  0x9f,
  0x73,
  0xe6,
  0x0a,
  0xde,
  0x2b,
  0x99,
  0x4a,
  0x47,
  0x9c,
  0xdf,
  0x09,
  0x76,
  0x9e,
  0x30,
  0x0e,
  0xe4,
  0xb2,
  0x94,
  0xa0,
  0x3b,
  0x34,
  0x1d,
  0x28,
  0x0f,
  0x36,
  0xe3,
  0x23,
  0xb4,
  0x03,
  0xd8,
  0x90,
  0xc8,
  0x3c,
  0xfe,
  0x5e,
  0x32,
  0x24,
  0x50,
  0x1f,
  0x3a,
  0x43,
  0x8a,
  0x96,
  0x41,
  0x74,
  0xac,
  0x52,
  0x33,
  0xf0,
  0xd9,
  0x29,
  0x80,
  0xb1,
  0x16,
  0xd3,
  0xab,
  0x91,
  0xb9,
  0x84,
  0x7f,
  0x61,
  0x1e,
  0xcf,
  0xc5,
  0xd1,
  0x56,
  0x3d,
  0xca,
  0xf4,
  0x05,
  0xc6,
  0xe5,
  0x08,
  0x49
])

// OLD AES KEY!!!
const aesKey = new Buffer([
  0x13,
  0x00,
  0x00,
  0x00,
  0x08,
  0x00,
  0x00,
  0x00,
  0x06,
  0x00,
  0x00,
  0x00,
  0xb4,
  0x00,
  0x00,
  0x00,
  0x1b,
  0x00,
  0x00,
  0x00,
  0x0f,
  0x00,
  0x00,
  0x00,
  0x33,
  0x00,
  0x00,
  0x00,
  0x52,
  0x00,
  0x00,
  0x00
])

const aes = require('crypto').createCipheriv('aes-256-ecb', aesKey, '')

function rollLeft(value, shift) {
  const overflow = ((value >>> 0) << (shift % 8)) >>> 0
  const ret = ((overflow & 0xff) | (overflow >>> 8)) & 0xff
  return ret
}

function rollRight(value, shift) {
  const overflow = ((value >>> 0) << 8) >>> (shift % 8)
  const ret = ((overflow & 0xff) | (overflow >>> 8)) & 0xff
  return ret
}

export function decryptData(data, sequence) {
  this.transformAES(data, sequence)

  this.decryptMapleCrypto(data)
}

export function encryptData(data, sequence) {
  this.encryptMapleCrypto(data)

  this.transformAES(data, sequence)
}

export function getLengthFromHeader(data) {
  const length = data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24)
  return ((length >>> 16) ^ (length & 0xffff)) & 0xffff
}

export function generateHeader(data, sequence, length, version) {
  let a = sequence[2] | (sequence[3] << 8)
  a ^= version
  const b = a ^ length

  data[0] = a & 0xff
  data[1] = (a >>> 8) & 0xff
  data[2] = b & 0xff
  data[3] = (b >>> 8) & 0xff
}

export function morphSequence(currentSequence) {
  const newSequence = new Uint8Array([0xf2, 0x53, 0x50, 0xc6])

  for (let i = 0; i < 4; i++) {
    const input = currentSequence[i]
    const tableInput = sequenceShiftingKey[input]
    newSequence[0] += sequenceShiftingKey[newSequence[1]] - input
    newSequence[1] -= newSequence[2] ^ tableInput
    newSequence[2] ^= sequenceShiftingKey[newSequence[3]] + input
    newSequence[3] -= newSequence[0] - tableInput

    let val =
      (newSequence[0] |
        ((newSequence[1] & 0xff) << 8) |
        ((newSequence[2] & 0xff) << 16) |
        ((newSequence[3] & 0xff) << 24)) >>>
      0
    let val2 = val >>> 0x1d
    val = (val << 0x03) >>> 0
    val2 |= val
    newSequence[0] = val2 & 0xff
    newSequence[1] = (val2 >> 8) & 0xff
    newSequence[2] = (val2 >> 16) & 0xff
    newSequence[3] = (val2 >> 24) & 0xff
  }

  return newSequence
}

export function encryptMapleCrypto(data) {
  const length = data.length
  let j
  let a, c
  for (let i = 0; i < 3; i++) {
    a = 0
    for (j = length; j > 0; j--) {
      c = data[length - j]
      c = rollLeft(c, 3)
      c += j
      c &= 0xff // Addition
      c ^= a
      a = c
      c = rollRight(a, j)
      c ^= 0xff
      c += 0x48
      c &= 0xff // Addition
      data[length - j] = c
    }
    a = 0
    for (j = length; j > 0; j--) {
      c = data[j - 1]
      c = rollLeft(c, 4)
      c += j
      c &= 0xff // Addition
      c ^= a
      a = c
      c ^= 0x13
      c = rollRight(c, 3)
      data[j - 1] = c
    }
  }
}

export function decryptMapleCrypto(data) {
  const length = data.length
  let j
  let a, b, c
  for (let i = 0; i < 3; i++) {
    a = 0
    b = 0
    for (j = length; j > 0; j--) {
      c = data[j - 1]
      c = rollLeft(c, 3)
      c ^= 0x13
      a = c
      c ^= b
      c -= j
      c &= 0xff // Addition
      c = rollRight(c, 4)
      b = a
      data[j - 1] = c
    }
    a = 0
    b = 0
    for (j = length; j > 0; j--) {
      c = data[length - j]
      c -= 0x48
      c &= 0xff // Addition
      c ^= 0xff
      c = rollLeft(c, j)
      a = c
      c ^= b
      c -= j
      c &= 0xff // Addition
      c = rollRight(c, 3)
      b = a
      data[length - j] = c
    }
  }
}

export function transformAES(data, sequence) {
  const length = data.length
  const sequenceCopy = new Buffer([
    sequence[0],
    sequence[1],
    sequence[2],
    sequence[3],
    sequence[0],
    sequence[1],
    sequence[2],
    sequence[3],
    sequence[0],
    sequence[1],
    sequence[2],
    sequence[3],
    sequence[0],
    sequence[1],
    sequence[2],
    sequence[3]
  ])

  for (let i = 0; i < length; ) {
    const block = Math.min(length - i, i === 0 ? 1456 : 1460)

    let xorKey = sequenceCopy.slice()

    for (let j = 0; j < block; j++) {
      if (j % 16 === 0) {
        xorKey = aes.update(xorKey)
      }

      data[i + j] ^= xorKey[j % 16]
    }

    i += block
  }
}
