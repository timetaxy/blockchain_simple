`use strict`;
const SHA256 = require("crypto-js/sha256");
class Block {
  constructor(idx, timestamp, data, prevHash = "") {
    this.idx = idx;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calculatedHash();
  }
  calculatedHash() {
    return SHA256(
      this.idx + this.prevHash + this.timestamp + JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
  }
  createGenesisBlock() {
    return new Block(0, Date.now().toString(), `Genesis block`, `0`);
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculatedHash();
    this.chain.push(newBlock);
  }
  isChainValid() {
    for (let index = 0; index < this.chain.length; index++) {
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

let superCoin = new Blockchain();
superCoin.addBlock(new Block(1, Date.now().toString(), { amount: 1 }));
superCoin.addBlock(new Block(2, Date.now().toString(), { amount: 3 }));
console.log(JSON.stringify(superCoin, null, 4));

console.log(`Is this chain valid? ${superCoin.isChainValid()}`);

// data corruption
superCoin.chain[1].data = { amount: 7 };
console.log(`Is this chain valid? ${superCoin.isChainValid()}`);
