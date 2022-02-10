const wav = require('node-wav');
const simplexNoise = require('simplex-noise');


const _args = process.argv;
console.log(_args);


let dataArray = [];

// File stuff
function arrayToAudio() { // We convert dataArray to wav
  let channels = [[], []];

  // Divide data over 2 channels
  for (let i = 0; i < dataArray.length; i++) {
    if (i % 2 === 0) { // Spread over 2 channels
      channels[0][channels[0].length] = dataArray[i];
    } else {
      channels[1][channels[1].length] = dataArray[i];
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





const generator = {
  constructor(amp_seed=1, det_seed=2) {
    
  },
};






// Command line buttsauce

switch (_args[2]) {
  case 'def':
    break;

  default: // For the lazy
    
    break;
}