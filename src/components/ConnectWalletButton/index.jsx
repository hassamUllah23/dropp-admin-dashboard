import React, { useEffect, useState } from "react";
import { Web3 } from "web3";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setWallet } from "@/lib/slices/wallet/actions";

const ConnectWalletButton = () => {
  const [provider, setProvider] = useState(null);
  const address = useSelector((state) => state.wallet.address);
  const dispatch = useDispatch();

  const initializeProvider = async () => {
    if (window.ethereum) {
      const provider = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = await provider.eth.getAccounts();
      const network = await provider.eth.net.getId();
      dispatch(setWallet({ network, address: address[0] }));

      setProvider(provider);
      localStorage.setItem("walletConnected", true);
    }
  };

  // useEffect(() => {
  //   if (!!localStorage.getItem("walletConnected")) {
  //     initializeProvider();
  //   }
  // }, []);

  return !!provider ? (
    <toolbar>
      <div className="wallet-address">
        <p>
          {address.slice(0, 5)}...
          {address.slice(address.length - 5, address.length)}
        </p>
      </div>
    </toolbar>
  ) : (
    <div>
      {/* <button className="connect-wallet" onClick={initializeProvider}>
        Connect Wallet
      </button> */}
    </div>
    
  );
};

export default ConnectWalletButton;
