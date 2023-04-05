"use client"
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import dynamic from 'next/dynamic'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useEffect, useMemo, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { BackpackWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Stack } from '@mui/material'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const Game = dynamic(() => import('@/components/Game'), { ssr: false });

export default function Home() {
  let [count, setCount] = useState(0);
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/solana-labs/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  useEffect(() => {
    const connection = new Connection("https://rpc.helius.xyz/?api-key=63d7ebb0-a510-4894-a4be-a061d8d39ee2", { confirmTransactionInitialTimeout: 600 });
    const token_mint = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT as string);
    const owner_account = new PublicKey(process.env.NEXT_PUBLIC_OWNER_ACCOUNT as string);
    const ata = getAssociatedTokenAddressSync(token_mint, owner_account);
    connection.getTokenAccountBalance(ata).then((balance) => {setCount(balance.value.uiAmount as number)});
  }, []);

  return (
    <main >
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Stack direction={"row"} spacing={"10px"} alignContent={"center"}>
              <WalletMultiButton />
              <WalletDisconnectButton />
              <h1>Remaining $CRUMBS: {count}</h1>
            </Stack>
            <Game></Game>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  )
}
