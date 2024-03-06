import Web3 from 'web3';
import { ControlNetABI, ControlNetAddress } from './tokenisation-constants';
import { toast } from 'react-toastify';

export const tokenization = async (url) => {
  try {
    const provider = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await provider.eth.getAccounts();
    const userAddress = accounts[0];
    const nonce = await provider.eth.getTransactionCount(userAddress, 'latest');
    const contract = new provider.eth.Contract(
      ControlNetABI,
      ControlNetAddress
    );
    const txOptions = {
      from: userAddress,
      nonce: nonce,
    };

    const tx = await contract.methods
      .modelTokenization(userAddress, url)
      .send(txOptions);
    const receipt = await provider.eth.getTransactionReceipt(
      tx.transactionHash
    );
    toast.success(`Transaction submitted! Hash: ${tx.transactionHash}`);

    return {
      url: `https://polygonscan.com/tx/${receipt.transactionHash}`,
    };
  } catch (error) {
    toast.error('Error submitting Tokenization transaction:', error);
    throw error;
  }
};
