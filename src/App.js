// src/app.js
import "./App.css";
import { ethers } from "ethers";
import { useState } from "react";
import TokenArtifact from "./Token.json";
// const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const tokenAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";

const contractAddress = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F"
function App() {
  const [tokenData, setTokenData] = useState({});
  const [amount, setAmount] = useState();
  const [balance, setBalance] = useState(0);

  const [userAccountId, setUserAccountId] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  async function _intializeContract(init) {
    // We first initialize ethers by creating a provider using window.ethereum
    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const contract = new ethers.Contract(tokenAddress, TokenArtifact.abi, init);

    return contract;
  }
  async function _getTokenData() {
    const contract = await _intializeContract(signer);
    console.log(contract);

    const name = await contract._approve(
      contractAddress,
      ethers.utils.parseEther("100000000000000000000")
    );
    console.log(name);
    // const symbol = await contract.symbol();
    // const tokenData = {name, symbol}
    // setTokenData(tokenData);
  }
  async function sendMDToken() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const contract = await _intializeContract(signer);
      const transaction = await contract.transfer(userAccountId, amount);
      await transaction.wait();
      console.log(`${amount} MDToken has been sent to ${userAccountId}`);
    }
  }
  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      console.log(signer);
      const contract = await _intializeContract(signer);
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const balance = await contract.balanceOf(account);
      console.log("Account Balance: ", balance.toString());
      setBalance(balance.toString());
    }
  }
  const allowances = async () => {
    const contract = await _intializeContract(signer);
    const allowance = await contract._allowance(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      contractAddress,
    );
    console.log(allowance);
  };
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={_getTokenData}>get token data</button>
        <h1>{tokenData.name}</h1>
        <h1>{tokenData.symbol}</h1>
        <button onClick={allowances}>allowance</button>

        <button onClick={getBalance}>
          Get Token available Balance:{balance}
        </button>
        <button onClick={sendMDToken}>Send MDToken</button>
        <input
          onChange={(e) => setUserAccountId(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </header>
    </div>
  );
}
export default App;
