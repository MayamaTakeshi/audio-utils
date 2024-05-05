
const gen_silence = (audioFormat, signed, size) => {
  var silence = null

  if(audioFormat == 6) {
    if(signed) {
      silence = Buffer.alloc(size, 0x55) // ALAW silence value signed
    } else {
      silence = Buffer.alloc(size, 0xD5) // ALAW silence value unsigned
    }
  } else if(audioFormat == 7) {
    silence = Buffer.alloc(size, 0xFF) // MULAW silence value
  } else {
    // assume L16
    silence = Buffer.alloc(size, 0)
  }
  return silence
}


// Original C code for linear2ulaw by:
//** Craig Reese: IDA/Supercomputing Research Center
//** Joe Campbell: Department of Defense
//** 29 September 1989
// http://www.speech.cs.cmu.edu/comp.speech/Section2/Q2.7.html

const exp_lut = [0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,
                 4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
                 5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
                 5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
                 6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
                 6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
                 6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
                 6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
                 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
                 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
                 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
                 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
                 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
                 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
                 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
                 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]

const BIAS = 0x84   /* define the add-in bias for 16 bit samples */
const CLIP = 32635

const linear2ulaw = (sample) => {
    var sign, exponent, mantissa
    var ulawbyte

    /* Get the sample into sign-magnitude. */
    sign = (sample >> 8) & 0x80;        /* set aside the sign */
    if (sign != 0) sample = -sample;        /* get magnitude */
    if (sample > CLIP) sample = CLIP;        /* clip the magnitude */

    /* Convert from 16 bit linear to ulaw. */
    sample = sample + BIAS;
    exponent = exp_lut[(sample >> 7) & 0xFF];
    mantissa = (sample >> (exponent + 3)) & 0x0F;
    ulawbyte = ~(sign | (exponent << 4) | mantissa);

/*
//#ifdef ZEROTRAP
*/
    if (ulawbyte == 0) ulawbyte = 0x02;    // optional CCITT trap
/*
//#endif
*/

    return ulawbyte
}


const ulaw2linear = (ulawbyte) => {
  var exp_lut = [0,132,396,924,1980,4092,8316,16764]
  var sign, exponent, mantissa, sample

  ulawbyte = ~ulawbyte
  sign = (ulawbyte & 0x80)
  exponent = (ulawbyte >> 4) & 0x07
  mantissa = ulawbyte & 0x0F
  sample = exp_lut[exponent] + (mantissa << (exponent + 3))
  if (sign != 0) sample = -sample

  return(sample)
}


module.exports = {
  gen_silence,
  linear2ulaw,
  ulaw2linear,
}
