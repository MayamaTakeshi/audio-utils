
const gen_silence = (format, size) => {
  var silence = null

  if(format.audioFormat == 6) {
    if(format.signed) {
      silence = Buffer.alloc(size, 0x55) // ALAW silence value signed
    } else {
      silence = Buffer.alloc(size, 0xD5) // ALAW silence value unsigned
    }
  } else if(format.audioFormat == 7) {
    silence = Buffer.alloc(size, 0xFF) // MULAW silence value
  } else {
    // assume L16
    silence = Buffer.alloc(size, 0)
  }
  return silence
}

module.exports = {
  gen_silence,
}
