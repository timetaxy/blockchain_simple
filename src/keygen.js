`use strict`;
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const key = ec.genKeyPair();
const pubKey = key.getPublic("hex");
const privKey = key.getPrivate("hex");

console.log(`private key:${privKey}`);
console.log(`pub key:${pubKey}`);

// private key:a37b802eaad4e2d266364e091fa837bbf544beafff9b34276992cc65963dfba7
// pub key:0410531ee999243bab9289322620638c5aa16bbc450ebb93c4ca288e02ba110a004f8432bd97bc01309d0a5ec0d36cd8b77498f3cc474488667b470892e6d6bd05
