'use string';
/*
 * Way 1

const enigma = require('./enigma');

console.log(enigma.hello('Ashish'));
console.log(enigma.greet('Ashish'));
*/

/*
 Way 2
const Enigma = require('./enigma');
const eng = new Enigma();
console.log(eng.hello('Ashish'));
console.log(eng.greet('Ashish'));
*/

const Enigma = require('./enigma');
const eng = new Enigma('this is key');

let encodeString = eng.encode('Dont panic');
let decodeString = eng.decode(encodeString);

console.log('Encoded: ', encodeString);
console.log('Decode: ', decodeString);

let qr = eng.qrgen('http:google.com', 'google.png');
qr ? console.log('Qr code generated') : console.log('Error');

