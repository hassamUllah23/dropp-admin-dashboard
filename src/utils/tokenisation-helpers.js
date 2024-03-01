import { ethers, AbiCoder, sig } from "ethers";

import {
  ControlNetABI,
  ControlNetAddress,
  RelayerPrivateKey,
} from "./tokenisation-constants";

export const createSignatureAndDataForMinting = async () => {
  try {
    const message = "secret message";
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const functionSignature = ethers.id("safeMint(string)").substring(0, 10);
    const userAddress = await signer.getAddress();
    const abiCoder = AbiCoder.defaultAbiCoder();
    const encodedFunctionCall = abiCoder.encode(["string"], [message]);
    const messageHash = ethers.solidityPackedKeccak256(
      ["bytes"],
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
      ["string"],
      [message]
    );
    const messageHash = ethers.solidityPackedKeccak256(
      ["bytes"],
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

// export const submitMetaTransaction = async (baseUrl) => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const relayerWallet = new ethers.Wallet(RelayerPrivateKey, provider);
//   let nonce = await provider.getTransactionCount(relayerWallet.address, 'latest');
//   const {
//     signature,
//     messageHash,
//     functionSignature,
//     s,
//     r,
//     v,
//     userAddress,
//     message,
//   } = await createSignatureAndDataForMinting();
//   await verifySignature(functionSignature, s, r, v, userAddress, message);
//   const contract = new ethers.Contract(
//     ControlNetAddress,
//     ControlNetABI,
//     relayerWallet
//   );
//   try {
//     const txOptions = { nonce: nonce};
//     const tx = await contract.batchMint(
//       userAddress,
//       [baseUrl],
//       messageHash,
//       signature,
//       txOptions
//     );

//     window.alert(
//       `Transaction submitted! Hash: ${tx.hash}`
//     );
//     tx.wait();
//     return {
//       url: `https://mumbai.polygonscan.com/tx/${tx.hash}`,
//     };
//   } catch (error) {
//     console.error("Error submitting meta transaction:", error);
//     throw error;
//   }
// };

export const tokenization = async (urls) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();
  // const adminAddress = "0xEFad1D8aDD7B3DBA1F31fb1b95d7789062719193";
  let nonce = await provider.getTransactionCount(userAddress, "latest");
  const contract = new ethers.Contract(
    ControlNetAddress,
    ControlNetABI,
    signer
  );
  try {
    const txOptions = { nonce: nonce };
    const tx = await contract.batchMint(userAddress, urls, txOptions);
    console.log(tx);
    window.alert(`Transaction submitted! Hash: ${tx.hash}`);
    await tx.wait();
    return { url: `https://mumbai.polygonscan.com/tx/${tx.hash}` };
  } catch (error) {
    console.error("Error submitting meta transaction:", error);
  }
};
