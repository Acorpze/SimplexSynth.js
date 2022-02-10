const wav = require('node-wav');
const simplexNoise = require('simplex-noise');
const fs = require('fs');




const _args = process.argv;
console.log(_args);


let sampleArray = [];




// File stuff
function writeWav() { // We convert sampleArray to wav
  let channels = [[], []]; // Left and right channels because yes

  // Divide data over 2 channels
  for (let i = 0; i < sampleArray.length; i++) {
    if (i % 2 === 0) { // Spread over 2 channels
      channels[0][channels[0].length] = sampleArray[i];
    } else {
      channels[1][channels[1].length] = sampleArray[i];
    }
  }

  // Write wav file
  let buffer = wav.encode(
    channels,
    {
      sampleRate: 32000, // Default is 16000
      numat: true,
      bitDepth: 32,
      floatPoint: true
    });

  fs.writeFile('./generated.wav', buffer, (err) => { if (err) return console.log(err); });
}




// Math and crap
function lerp(a, b, c) {
  return a + (b - a) * c;
};

let simplex = new simplexNoise(12345);
function noise(x, y = 0) {
  return simplex.noise2D(x, y);
};

function sin(phase, freq = .1) {
  return Math.sin(phase * freq);
};







// Generator classes
class sineGenerator {
  constructor(waves = 50, amp = .1, freq = .5) {
    this.waves = waves; // Amount of sines to generate
    this.amp = amp;
    this.freq = freq;

  }

  generate(phase = 1) {
    let sample = 0;
    for (let i = 0; i < this.waves; i++) {

      let ampnoise = sin(
        (i * phase) + noise(i)
      );

      sample += ampnoise;
    }
    return sample;
  }
};



// Quick effects
function normalize() {
  let highest = 0;
  for (let i = 0; i < sampleArray.length; i++) {
    if (Math.abs(sampleArray[i]) > highest) { highest = Math.abs(sampleArray[i]); }
  }
  for (let i = 0; i < sampleArray.length; i++) {
    sampleArray[i] /= highest;
  }
}


function reverb(iters = 3) {
  for (let i = 0; i < iters; i++) {
    for (let x = 1; x < sampleArray.length; x++) {
      if (sampleArray[x - 1] !== 'undefined') {
        sampleArray[x] = lerp(sampleArray[x - 1], sampleArray[x], .02);
      }
    }
  }
}





// Generaton functions
function genQuick() {
  const gen = new sineGenerator(
    123,
    456
  );

  for (let i = 0; i < 32000 * 10; i++) {
    sampleArray[i] = gen.generate(i);
  }

  reverb();
  normalize();

  writeWav();
}






// Command line buttsauce

switch (_args[2]) {
  case '0':
    genQuick();
    break;

  default: // For the lazy
    genQuick();
    break;
}