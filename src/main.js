`use strict`;
const { Blockchain, Tx } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "a37b802eaad4e2d266364e091fa837bbf544beafff9b34276992cc65963dfba7"
);
const myWalletAddr = myKey.getPublic("hex");

let codeCoin = new Blockchain();
const tx1 = new Tx(myWalletAddr, "public key here", 10);
tx1.signTransaction(myKey);
codeCoin.addTx(tx1);

console.log(`Starting mine`);
console.log(`now pending tx:${JSON.stringify(codeCoin.pendingTxs)}`);
codeCoin.minePendingTxs(myWalletAddr);
console.log(`balance of mine:${codeCoin.getBalance(myWalletAddr)}`);

//data corruption test
codeCoin.chain[1].txs[0].amount = 1;
console.log(`chain valid test : ${codeCoin.isChainValid()}`);
// console.log(`now pending tx:${JSON.stringify(codeCoin.pendingTxs)}`);
// codeCoin.minePendingTxs("myaddr1");

// const Blockchain = require("./blockchain").Blockchain;
// const Tx = require("./blockchain").Tx;

/*test1 chain*/
// superCoin.addBlock(new Block(1, Date.now().toString(), { amount: 1 }));
// superCoin.addBlock(new Block(2, Date.now().toString(), { amount: 3 }));
// console.log(JSON.stringify(superCoin, null, 4));

// console.log(`chain valid test #1 : ${superCoin.isChainValid()}`);

// // data corruption test
// superCoin.chain[1].data = { amount: 7 };
// superCoin.chain[1].hash = superCoin.chain[1].calculatedHash();

// console.log(`chain valid test #2 : ${superCoin.isChainValid()}`);

/*test2 mine
 */
// let dummyData = [{ amount: 1 }, { amount: 3 }, { amount: 5 }];
// let superCoin = new Blockchain();
// let blockSession = 1;
// for (let index = 0; index < 3; index++) {
//   console.log(`block mining... ${blockSession}`);
//   superCoin.addBlock(new Block(index, Date.now().toString(), dummyData[index]));
// }

/*test3 tx*/
// let codeCoin = new Blockchain();
// codeCoin.createTx(new Tx("addr1", "addr2", 100));
// codeCoin.createTx(new Tx("addr2", "addr1", 10));
// console.log(`Starting mine`);
// console.log(`now pending tx:${JSON.stringify(codeCoin.pendingTxs)}`);
// codeCoin.minePendingTxs("myaddr1");
// console.log(`now pending tx:${JSON.stringify(codeCoin.pendingTxs)}`);
// codeCoin.minePendingTxs("myaddr1");
// console.log(`balance of mine:${codeCoin.getBalance(`myaddr1`)}`);
