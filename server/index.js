const express = require("express");
const app = express();
const cors = require("cors");
const { sha256 } = require("ethereum-cryptography/sha256");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "42b5d3f6936a2892378757ace3348e8eae0fd790": 100,
  "114a0423a20e8643e5941371a5e615492cd158d4": 50,
  "ca8142947afce526b1f670d2dea5323760173552": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, sender, pubkey, recipient, amount } = req.body;

  const messageHash = toHex(sha256(utf8ToBytes(sender + recipient + amount)));
  const isSigned = secp256k1.verify(signature, messageHash, pubkey);

  if (!isSigned) {
    res.status(400).send({ message: "Not authorized!" });
  } else {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
