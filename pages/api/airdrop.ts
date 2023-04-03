import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    createTransferCheckedInstruction,
    getAssociatedTokenAddressSync,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
    transferChecked,
} from "@solana/spl-token";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body);
    const { wallet } = JSON.parse(req.body);
    console.log(wallet);
    const wallet_address = new PublicKey(wallet);
    const token_keypair = loadEnvKey();
    const token_mint = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT as string);
    transfer(token_keypair, wallet_address, token_mint)
        .then((signature) => {
            res.status(200).json({ signature: signature });
        });
}

function loadEnvKey(): Keypair {
    const loaded = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(process.env.GAME_KEYPAIR as string)),
    );
    console.log(`wallet public key: ${loaded.publicKey}`);
    return loaded;
}

async function transfer(
    source: Keypair,
    target: PublicKey,
    mint: PublicKey,
) {
    const connection = new Connection("https://rpc.helius.xyz/?api-key=9721adc2-b436-4fd6-9fae-2cdefd256712", { confirmTransactionInitialTimeout: 600 });

    const source_ata = getAssociatedTokenAddressSync(mint, source.publicKey);
    const target_ata = await getOrCreateAssociatedTokenAccount(connection, source, mint, target, true, "finalized", { skipPreflight: true });

    const signature = await transferChecked(
        connection, // connection
        source, // payer
        source_ata, // from (should be a token account)
        mint, // mint
        target_ata.address, // to (should be a token account)
        source, // from's owner
        1, // amount, if your deciamls is 8, send 10^8 for 1 token
        0 // decimals
    );

    return signature;
}