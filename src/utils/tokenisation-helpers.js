import Web3 from 'web3';
import { ControlNetABI, ControlNetAddress } from './tokenisation-constants';
import { toast } from 'react-toastify';

/*********** Tokenization Of Model **************/
export const tokenization = async (url) => {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = new web3.eth.Contract(ControlNetABI, ControlNetAddress);
    /********** Fetch Accounts **************/
    const accounts = await web3.eth.getAccounts();
    const adminAccount = accounts[0];
    let currentGasPrice = await web3.eth.getGasPrice();
    let adjustedGasPrice =
      (BigInt(currentGasPrice) * BigInt(110)) / BigInt(100);
    adjustedGasPrice = adjustedGasPrice.toString();
    const estimatedGas = await contract.methods
      .modelTokenization(adminAccount, url)
      .estimateGas({ from: adminAccount });
    const txOptions = {
      from: adminAccount,
      to: ControlNetAddress,
      data: contract.methods.modelTokenization(adminAccount, url).encodeABI(),
      gas: estimatedGas.toString(),
      gasPrice: adjustedGasPrice,
    };
    const txReceipt = await web3.eth.sendTransaction(txOptions);
    toast.success(`Transaction submitted! Hash: ${txReceipt.transactionHash}`);

    return {
      url: `https://polygonscan.com/tx/${txReceipt.transactionHash}`,
    };
  } catch (error) {
    toast.error('Error submitting Tokenization transaction:', error);
    throw error;
  }
};

/************* Transfer Of Model ***************/
export const transferModel = async (userAddress, tokenId) => {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = new web3.eth.Contract(ControlNetABI, ControlNetAddress);
    /********** Fetch Accounts **************/
    const accounts = await web3.eth.getAccounts();
    const adminAccount = accounts[0];
    let currentGasPrice = await web3.eth.getGasPrice();
    let adjustedGasPrice =
      (BigInt(currentGasPrice) * BigInt(110)) / BigInt(100);
    adjustedGasPrice = adjustedGasPrice.toString();
    const estimatedGas = await contract.methods
      .transferFrom(adminAccount, userAddress, tokenId)
      .estimateGas({ from: adminAccount });
    const txOptions = {
      from: adminAccount,
      to: ControlNetAddress,
      data: contract.methods
        .transferFrom(adminAccount, userAddress, tokenId)
        .encodeABI(),
      gas: estimatedGas.toString(),
      gasPrice: adjustedGasPrice,
    };
    const txReceipt = await web3.eth.sendTransaction(txOptions);
    toast.success(`Transaction submitted! Hash: ${txReceipt.transactionHash}`);
    return {
      url: `https://polygonscan.com/tx/${txReceipt.transactionHash}`,
    };
  } catch (error) {
    toast.error('Error submitting Tokenization transaction:', error);
    throw error;
  }
};
