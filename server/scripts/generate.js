const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp256k1.utils.randomPrivateKey();

console.log("private key: ", toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);

const ethereumPublicKey = keccak256(publicKey).slice(-20)

console.log("public key: ", toHex(ethereumPublicKey));


// const privateKeys = [
//     "9ad4b117535bba151e95d7e74a553ae726c0c7e3bc303c941a4fc66810424850",
//     "6ff0c3a721118c708ab5d45822d06be8ca2024c5db6c440c86d4b3f8d8d24449",
//     "7b76317104e362868e8b14636e76d755704765ff10b9420e23f279aded3a8f06"
// ]
// const balances = {
//     "42b5d3f6936a2892378757ace3348e8eae0fd790": 100,
//     "114a0423a20e8643e5941371a5e615492cd158d4": 50,
//     "ca8142947afce526b1f670d2dea5323760173552": 75,
// };