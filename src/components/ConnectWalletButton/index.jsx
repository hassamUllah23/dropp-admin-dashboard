import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setWallet } from "@/lib/slices/wallet/actions";

const ConnectWalletButton = () => {
  const [provider, setProvider] = useState(null);
  const address = useSelector((state) => state.wallet.address);
  const dispatch = useDispatch();

  const initializeProvider = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const address = await provider.getSigner();
      dispatch(setWallet({ network, address: address.address }));

      setProvider(provider);
      localStorage.setItem("walletConnected", true);
    }
  };

  useEffect(() => {
    if (!!localStorage.getItem("walletConnected")) {
      initializeProvider();
    }
  }, []);

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
    <button className="connect-wallet" onClick={initializeProvider}>
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;
