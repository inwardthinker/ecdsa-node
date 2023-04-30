import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onPrivateKeyChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(keccak256(secp256k1.getPublicKey(privateKey)).slice(-20));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type private key for this address, for example: 0x1" value={privateKey} onChange={onPrivateKeyChange}></input>
      </label>


      <div className="address">Wallet Address: {address}</div><br/>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
