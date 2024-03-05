import Web3 from 'web3';
import {
  ControlNetABI,
  ControlNetAddress,
  PrivateKey,
} from './tokenisation-constants';

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
    const urls = [url];
    const tx = await contract.methods
      .batchMint(userAddress, urls)
      .send(txOptions);
    window.alert(`Transaction submitted! Hash: ${tx.transactionHash}`);
    const receipt = await provider.eth.getTransactionReceipt(
      tx.transactionHash
    );

    return {
      url: `https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`,
    };
  } catch (error) {
    console.error('Error submitting Tokenization transaction:', error);
    throw error;
  }
};

export const tokenizationUserSide = async (urls) => {
  try {
    const provider = new Web3(window.ethereum);
    const userAccount = provider.eth.accounts.privateKeyToAccount(PrivateKey);
    const userAddress = userAccount.address;
    const nonce = await provider.eth.getTransactionCount(userAddress, 'latest');
    const contract = new provider.eth.Contract(
      ControlNetABI,
      ControlNetAddress
    );
    const txOptions = {
      from: userAddress,
      nonce: nonce,
      // gas: 5000000,
      // gasPrice: await provider.eth.getGasPrice(),
    };

    const signedTx = await userAccount.signTransaction({
      to: ControlNetAddress,
      data: contract.methods.batchMint(userAddress, urls).encodeABI(),
      ...txOptions,
    });

    const txReceipt = await provider.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    window.alert(`Transaction submitted! Hash: ${txReceipt.transactionHash}`);

    return {
      url: `https://mumbai.polygonscan.com/tx/${txReceipt.transactionHash}`,
    };
  } catch (error) {
    console.error('Error submitting Tokenization transaction:', error);
    throw error;
  }
};
