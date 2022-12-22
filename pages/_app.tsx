import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, bsc, bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

const ethers = require("ethers");
const chains = [arbitrum, mainnet, polygon, bsc, bscTestnet, goerli];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "c9014e13a272d698a8e1a0d7f21ab60d" }),
  alchemyProvider({ apiKey: "CKVwniq4dHSY6_zuEjFjwmIukzzTJoYO" }),
]);
const wagmiClient = createClient({
  autoConnect: false,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Component {...pageProps} />;
      </WagmiConfig>

      <Web3Modal
        projectId={process.env.NEXT_AUTH_PROJECT_ID}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
