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



// Generator classes
class sineGenerator {
  constructor(ampSeed = 1, detSeed = 2, waves = 50, ampFreq = 1, detFreq = 1) {
    this.ampGen = new simplexNoise(ampSeed);
    this.detGen = new simplexNoise(detSeed);

    this.waves = waves; // Amount of sines to generate

    this.ampFreq = ampFreq;
    this.detFreq = detFreq;

  }

  generate(phase = 1) {
    let sample = 0;
    for (let i = 0; i < this.waves; i++) {
      sample *= Math.sin(
        (this.ampGen.noise2D(i, phase) / this.ampFreq)
        +
        Math.sin(
          this.detGen.noise2D(phase, i) / this.detFreq
        )
      );
    }
    return sample;
  }
};




// Generaton functions
function genQuick() {
  const gen = new sineGenerator(
    123,
    456
  );

  for (let i = 0; i < 32000 * 5; i++) {
    sampleArray[i] = gen.generate(i);
  }

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