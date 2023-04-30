import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const amount = parseInt(sendAmount);
      const publickKey = toHex(secp256k1.getPublicKey(privateKey));
      const reqBody = {
        sender: address,
        pubkey: publickKey,
        recipient: recipient,
        amount: amount
      };
      const messageHash = toHex(sha256(utf8ToBytes(reqBody.sender + reqBody.recipient + reqBody.amount)));
      const signature = secp256k1.sign(messageHash, privateKey);
      reqBody.signature = signature.toCompactHex();
      const {
        data: { balance },
      } = await server.post(`send`, reqBody);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
