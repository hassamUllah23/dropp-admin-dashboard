import { ethers, AbiCoder, sig } from 'ethers';

import {
  ControlNetFactoryABI,
  ControlNetModelsABI,
  ControlNetFactoryAddress,
  RelayerPrivateKey,
  baseUrl,
} from './tokenisation-constants';

export const createNewNFTcontractForUser = async () => {
  try {
    let contractAddress;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const userFactoryContract = new ethers.Contract(
      ControlNetFactoryAddress,
      ControlNetFactoryABI,
      signer
    );
    const existingContractAddress =
      await userFactoryContract.getUserContractAddress(userAddress);
    if (
      existingContractAddress &&
      existingContractAddress !== '0x0000000000000000000000000000000000000000'
    ) {
      contractAddress = existingContractAddress;
    } else {
      const transaction = await userFactoryContract.deployAramcoNFTS();
      const transactionReceipt = await transaction.wait();
      if (!transactionReceipt.status) {
        throw 'Transaction Failed';
      }
      const deployedContractAddress = transactionReceipt.events.find(
        (event) => event.event === 'ContractDeployed'
      ).args.contractAddress;
      contractAddress = deployedContractAddress;
    }

    return contractAddress;
  } catch (error) {
    window.alert('Transaction Failed');
  }
};

export const createSignatureAndDataForMinting = async () => {
  try {
    const message = 'secret message';
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const functionSignature = ethers.id('safeMint(string)').substring(0, 10);
    const userAddress = await signer.getAddress();
    const abiCoder = AbiCoder.defaultAbiCoder();
    const encodedFunctionCall = abiCoder.encode(['string'], [message]);
    const messageHash = ethers.solidityPackedKeccak256(
      ['bytes'],
      [ethers.concat([functionSignature, encodedFunctionCall])]
    );
    const signature = await signer.signMessage(ethers.toBeArray(messageHash));
    const parsedSignature = ethers.Signature.from(signature);
    return {
      functionSignature,
      userAddress,
      signature,
      messageHash,
      message,
      s: parsedSignature.s,
      r: parsedSignature.r,
      v: parsedSignature.v,
    };
  } catch (error) {
    throw error;
  }
};

export const verifySignature = async () => {
  const { functionSignature, s, r, v, userAddress, message } =
    await createSignatureAndDataForMinting();
  try {
    const encodedFunctionCall = AbiCoder.defaultAbiCoder().encode(
      ['string'],
      [message]
    );
    const messageHash = ethers.solidityPackedKeccak256(
      ['bytes'],
      [ethers.concat([functionSignature, encodedFunctionCall])]
    );
    const ethSignedMessageHash = ethers.hashMessage(
      ethers.toBeArray(messageHash)
    );
    const recoveredAddress = ethers.recoverAddress(ethSignedMessageHash, {
      r,
      s,
      v,
    });
    if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getUserContractAddress = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      ControlNetFactoryAddress,
      [
        'function getUserContractAddress(address) public view returns (address)',
      ],
      provider
    );

    const contractAddress = await contract.getUserContractAddress(
      userPublicAddress
    );
    return contractAddress;
  } catch (error) {
    console.error('Error in getUserContractAddress:', error);
    throw error;
  }
};

export const submitMetaTransaction = async (cid, contractAddress) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const relayerWallet = new ethers.Wallet(RelayerPrivateKey, provider);
  const {
    signature,
    messageHash,
    functionSignature,
    s,
    r,
    v,
    userAddress,
    message,
  } = await createSignatureAndDataForMinting();
  await verifySignature(functionSignature, s, r, v, userAddress, message);
  const contract = new ethers.Contract(
    contractAddress,
    ControlNetModelsABI,
    relayerWallet
  );
  try {
    const tx = await contract.safeMint(
      userAddress,
      baseUrl,
      cid,
      messageHash,
      signature
    );

    window.alert(
      `Transaction submitted! Hash: ${tx.hash}, Contract Address: ${contractAddress}`
    );
    tx.wait();
    return {
      url: `https://mumbai.polygonscan.com/tx/${tx.hash}`,
    };
  } catch (error) {
    console.error('Error submitting meta transaction:', error);
    throw error;
  }
};
