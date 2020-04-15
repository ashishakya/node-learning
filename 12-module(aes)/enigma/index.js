'use strict'
const crypto = require('crypto');
const fs = require('fs');
const qr = require('qr-image');
/*
 * Way 1
 exports.hello = (user)=>{
     return 'Hello ' + user;
 };

 exports.greet = user =>{
     return 'Goodmorning ' + user;
 };

 */


/*
* Way 2
module.exports = function () {
    return {
        hello: (user) => {
            return 'Hello ' + user;
        },
        greet: (user) => {
            return 'Good morning ' + user;
        }
    }
}

 */

module.exports = function (key) {
    this.key = key;
    return {
        encode: str => {
            let encoder = crypto.createCipher('aes-256-ctr', this.key);
            return encoder.update(str, 'utf8', 'hex'); // 2nd param = input and 3rd param= output
        },
        decode: str => {
            let decoder = crypto.createDecipher('aes-256-ctr', this.key);
            return decoder.update(str, 'hex', 'utf8');
        },
        qrgen: (data, file) => {
            let dataToEncode = data || null;
            let outImage = file || null;
            if (dataToEncode !== null && outImage !== null) {
                qr.image(dataToEncode, {
                    type:'png',
                    size:20
                }).pipe(fs.createWriteStream(outImage));
                return true;
            }
            return false;

        }
    }
}
