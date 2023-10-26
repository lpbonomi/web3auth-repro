"use client";

import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, IProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { useEffect, useState } from "react";

const Web3authButtons = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId: "your_client_id",
          web3AuthNetwork: "sapphire_devnet",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: "0x3",
            rpcTarget: "https://api.devnet.solana.com",
          },
          sessionTime: 86400,
          enableLogging: false,
          uiConfig: {
            defaultLanguage: "es",
          },
        });

        setWeb3auth(web3authInstance);

        await web3authInstance.initModal();
        setProvider(web3authInstance.provider);

        if (web3authInstance.connectedAdapterName) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  async function login() {
    if (!web3auth) {
      console.log("web3auth not initialized");
      return;
    }
    await web3auth.connect();
    await web3auth.authenticateUser();
  }

  async function getPrivateKey() {
    if (!provider) {
      console.log("provider not initialized");
      return;
    }

    return await provider.request({
      method: "solanaPrivateKey",
    });
  }

  async function handleLogin() {
    await login();
  }

  async function handleGetPrivateKey() {
    await getPrivateKey();
  }

  return (
    <div>
      <button onClick={handleLogin} className="p-5">
        Connect
      </button>
      <button onClick={handleGetPrivateKey}>Get Private Key</button>
    </div>
  );
};

export default function MyApp() {
  return <Web3authButtons />;
}
