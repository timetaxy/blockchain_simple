`use strict`;
const SHA256 = require("crypto-js/sha256");
class Block {
  constructor(idx, timestamp, data, prevHash = "") {
    //prevHash is optional
    this.idx = idx;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calculatedHash();
    this.nonce = 0;
  }
  calculatedHash() {
    return SHA256(
      this.idx +
        this.prevHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    console.log(`mine target : ${Array(difficulty + 1).join("0")}`);
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      console.log(`now mining, difficulty:${difficulty}, nonce:${this.nonce}`);
      this.hash = this.calculatedHash();
    }
    console.log(`Block mined:${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }
  createGenesisBlock() {
    return new Block(0, Date.now().toString(), `Genesis block`, `0`);
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculatedHash();
    newBlock.mineBlock(this.difficulty);

    this.chain.push(newBlock);
  }
  isChainValid() {
    for (let index = 1; index < this.chain.length; index++) {
      const currBlock = this.chain[index];
      const prevBlock = this.chain[index - 1];
      if (currBlock.hash !== currBlock.calculatedHash()) {
        return false;
      }
      if (currBlock.prevHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let dummyData = [{ amount: 1 }, { amount: 3 }, { amount: 5 }];
let superCoin = new Blockchain();
let blockSession = 1;
for (let index = 0; index < 3; index++) {
  console.log(`block mining... ${blockSession}`);
  superCoin.addBlock(new Block(index, Date.now().toString(), dummyData[index]));
}
// superCoin.addBlock(new Block(1, Date.now().toString(), { amount: 1 }));
// superCoin.addBlock(new Block(2, Date.now().toString(), { amount: 3 }));
// console.log(JSON.stringify(superCoin, null, 4));

// console.log(`chain valid test #1 : ${superCoin.isChainValid()}`);

// // data corruption test
// superCoin.chain[1].data = { amount: 7 };
// superCoin.chain[1].hash = superCoin.chain[1].calculatedHash();

// console.log(`chain valid test #2 : ${superCoin.isChainValid()}`);
