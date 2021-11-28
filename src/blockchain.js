`use strict`;
const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
class Tx {
  constructor(fromAddr, toAddr, amount) {
    this.fromAddr = fromAddr;
    this.toAddr = toAddr;
    this.amount = amount;
  }
  calculatedHash() {
    return SHA256(this.fromAddr + this.toAddr + this.amount).toString();
  }
  signTransaction(signKey) {
    if (signKey.getPublic("hex") !== this.fromAddr) {
      throw new Error(`Can't sign, pubKey unmatched`);
    }
    const hashTx = this.calculatedHash();
    const sig = signKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }
  isValid() {
    if (this.fromAddr === null) return true;
    if (!this.signature || this.signature.length === 0) {
      throw new Error(`No signature in this tx`);
    }
    const pubKey = ec.keyFromPublic(this.fromAddr, "hex");
    return pubKey.verify(this.calculatedHash(), this.signature);
  }
}
class Block {
  constructor(timestamp, txs, prevHash = "") {
    //prevHash is optional
    // this.idx = idx;
    this.timestamp = timestamp;
    this.txs = txs;
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
  hasValidTx() {
    for (const tx of this.txs) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTxs = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block(0, Date.now().toString(), `Genesis block`, `0`);
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  minePendingTxs(miningRewardAddr) {
    let block = new Block(Date.now(), this.pendingTxs);
    block.mineBlock(this.difficulty);
    console.log(`Block mine success`);
    this.chain.push(block);
    this.pendingTxs = [new Tx(null, miningRewardAddr, this.miningReward)];
  }
  addTx(tx) {
    //   createTx(tx) {
    if (!tx.fromAddr || !tx.toAddr) {
      throw new Error(`Tx must include from and to addr`);
    }
    if (!tx.isValid()) {
      throw new Error(`Can't add invalid tx`);
    }
    this.pendingTxs.push(tx);
  }
  getBalance(addr) {
    let balance = 0;
    for (const block of this.chain) {
      for (const tx of block.txs) {
        if (tx.fromAddr == addr) {
          balance -= tx.amount;
        }
        if (tx.toAddr == addr) {
          balance += tx.amount;
        }
      }
    }
    return balance;
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
      if (!currBlock.hasValidTx()) {
        return false;
      }
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

// module.exports.Blockchain = Blockchain;
// module.exports.Tx = Tx;
module.exports = { Blockchain, Tx };
