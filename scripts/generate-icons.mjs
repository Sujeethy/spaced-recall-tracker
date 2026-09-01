import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

// CRC32 table & calculator
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crcTable[n] = c >>> 0
}

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}

function createPng(width, height, drawFn) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  // IHDR
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 6 // color type RGBA
  ihdrData[10] = 0 // compression
  ihdrData[11] = 0 // filter
  ihdrData[12] = 0 // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData)

  // Raw bitmap with scanlines
  const rowBytes = width * 4
  const rawData = Buffer.alloc((rowBytes + 1) * height)

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowBytes + 1)
    rawData[rowOffset] = 0 // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4
      const [r, g, b, a] = drawFn(x, y, width, height)
      rawData[pixelOffset] = r
      rawData[pixelOffset + 1] = g
      rawData[pixelOffset + 2] = b
      rawData[pixelOffset + 3] = a
    }
  }

  const idatChunk = makeChunk('IDAT', zlib.deflateSync(rawData))
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

// Icon Drawer: dark rounded background with glowing indigo/violet brain motif
function drawAppIcon(x, y, w, h) {
  const cx = w / 2
  const cy = h / 2
  const nx = (x - cx) / (w / 2) // -1 to 1
  const ny = (y - cy) / (h / 2) // -1 to 1
  const dist = Math.sqrt(nx * nx + ny * ny)

  // Dark sleek rounded squircle background
  const cornerRadius = 0.82
  const squircle = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4)
  if (squircle > cornerRadius) {
    return [0, 0, 0, 0] // Transparent outside rounded squircle
  }

  // Background gradient: Deep dark zinc with subtle purple glow
  const bgR = Math.floor(10 + 15 * (1 - dist))
  const bgG = Math.floor(10 + 12 * (1 - dist))
  const bgB = Math.floor(18 + 35 * (1 - dist))

  // Brain motif logic in center
  const bx = nx * 1.5
  const by = ny * 1.5 + 0.05
  const brainDist = Math.sqrt(bx * bx + by * by)

  // Two lobes
  const leftLobe = Math.sqrt(Math.pow(bx + 0.32, 2) + Math.pow(by * 1.1, 2))
  const rightLobe = Math.sqrt(Math.pow(bx - 0.32, 2) + Math.pow(by * 1.1, 2))
  const lowerLobe = Math.sqrt(Math.pow(bx, 2) + Math.pow((by - 0.35) * 1.4, 2))

  const inBrain = leftLobe < 0.48 || rightLobe < 0.48 || lowerLobe < 0.42

  // Center vertical split line
  const isSplit = Math.abs(bx) < 0.06 && Math.abs(by) < 0.55

  if (inBrain && !isSplit) {
    // Glowing Indigo -> Purple -> Cyan gradient
    const gradFactor = (ny + 1) / 2
    const r = Math.floor(99 * (1 - gradFactor) + 147 * gradFactor)
    const g = Math.floor(102 * (1 - gradFactor) + 51 * gradFactor)
    const b = Math.floor(241 * (1 - gradFactor) + 234 * gradFactor)
    return [r, g, b, 255]
  }

  // Soft ambient glow around brain
  if (brainDist < 0.75) {
    const glow = (1 - brainDist / 0.75) * 0.45
    return [
      Math.min(255, Math.floor(bgR + 99 * glow)),
      Math.min(255, Math.floor(bgG + 102 * glow)),
      Math.min(255, Math.floor(bgB + 241 * glow)),
      255,
    ]
  }

  return [bgR, bgG, bgB, 255]
}

const publicDir = path.resolve('public')

console.log('Generating PWA icons...')
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, drawAppIcon))
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, drawAppIcon))
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, drawAppIcon))
console.log('Successfully generated pwa-192x192.png, pwa-512x512.png, and apple-touch-icon.png!')
