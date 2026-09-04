export const CRYPTO_ASSETS = ["btc", "eth", "sol"] as const;

export type CryptoAsset = (typeof CRYPTO_ASSETS)[number];

export const CRYPTO_WALLETS = {
  btc: {
    id: "btc",
    label: "BITCOIN",
    address: "3Ni45Pm2qdbBmbDnCuykzCbeXo4EYRFquz",
  },
  eth: {
    id: "eth",
    label: "ETHEREUM",
    address: "0xA3AfF13287dA2cf900208D401149e7EaE2CF8684",
  },
  sol: {
    id: "sol",
    label: "SOLANA",
    address: "Aj2poturfv7Pr9pEzuz6xC2HNfPnVcaxD1mvNcf6MnzH",
  },
} as const satisfies Record<
  CryptoAsset,
  { id: CryptoAsset; label: string; address: string }
>;

export function isCryptoAsset(value: unknown): value is CryptoAsset {
  return value === "btc" || value === "eth" || value === "sol";
}

export function walletFor(asset: CryptoAsset) {
  return CRYPTO_WALLETS[asset];
}
