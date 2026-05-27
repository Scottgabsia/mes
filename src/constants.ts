export const SITE_URL = "https://cryptorecoveryasset.com";

/** Primary contact / admin inbox (privacy, support mailto links) */
export const CONTACT_EMAIL = "info@cryptorecoveryasset.com";

/**
 * Email API on Firebase (used when Hostinger serves static files only).
 * After deploy: firebase deploy --only functions
 */
export const FIREBASE_API_URL =
  "https://us-central1-mysterybritishsh-1748710084193.cloudfunctions.net/mes";

/** Header/footer logo */
export const LOGO_URL = "/logo.png?v=8";

/** Square brand mark for Google / structured data (≥112×112) */
export const BRAND_ICON_URL = `${SITE_URL}/brand-icon-512.png`;
export const FAVICON_VERSION = "11";

export const SOCIAL_LINKS = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/18j9xTsdgN/?mibextid=wwXIfr",
  },
  {
    id: "quora",
    label: "Quora",
    href: "https://www.quora.com/profile/Crypto-Recovery-Asset?ch=17&oid=3197810077&share=b07007ed&srid=5DlkEm&target_type=user",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@crypto_recovery_asset?_r=1&_t=ZT-96hRxLCgTdN",
  },
] as const;

/** WhatsApp, Facebook, Twitter link previews — image with dark background */
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png?v=1`;

export const CRYPTO_CURRENCIES = [
  "Bitcoin (BTC)",
  "Ethereum (ETH)",
  "Tether (USDT)",
  "BNB (BNB)",
  "Solana (SOL)",
  "XRP (XRP)",
  "USDC (USDC)",
  "Cardano (ADA)",
  "Dogecoin (DOGE)",
  "Avalanche (AVAX)",
  "Shiba Inu (SHIB)",
  "Polkadot (DOT)",
  "TRON (TRX)",
  "Chainlink (LINK)",
  "Polygon (MATIC)",
  "Wrapped Bitcoin (WBTC)",
  "Bitcoin Cash (BCH)",
  "Near Protocol (NEAR)",
  "Uniswap (UNI)",
  "Litecoin (LTC)",
  "Internet Computer (ICP)",
  "Pepe (PEPE)",
  "DAI (DAI)",
  "Cassiopeia (KAS)",
  "Ethereum Classic (ETC)",
  "Stacks (STX)",
  "Filecoin (FIL)",
  "Render (RNDR)",
  "Lido DAO (LDO)",
  "Arbitrum (ARB)",
  "Cosmos (ATOM)",
  "Optimism (OP)",
  "Injective (INJ)",
  "The Graph (GRT)",
  "VeChain (VET)",
  "Theta Network (THETA)",
  "Fantom (FTM)",
  "Thorchain (RUNE)",
  "Fetch.ai (FET)",
  "Algorand (ALGO)",
  "Arweave (AR)",
  "Sei (SEI)",
  "Flow (FLOW)",
  "Bitget Token (BGB)",
  "Maker (MKR)",
  "Ethena (ENA)",
  "Gala (GALA)",
  "Aave (AAVE)",
  "Jupiter (JUP)",
  "Quant (QNT)",
  "Bonk (BONK)",
  "Monero (XMR)",
  "Bitcoin SV (BSV)",
  "Tezos (XTZ)",
  "MultiversX (EGLD)",
  "The Sandbox (SAND)",
  "Decentraland (MANA)",
  "Axie Infinity (AXS)",
  "EOS (EOS)",
  "Chiliz (CHZ)",
  "IOTA (IOTA)",
  "Neo (NEO)",
  "Klaytn (KLAY)",
  "PancakeSwap (CAKE)",
  "Aptos (APT)",
  "Sui (SUI)",
  "Beam (BEAM)",
  "Gnosis (GNO)",
  "Flare (FLR)",
  "JasmyCoin (JASMY)",
  "Onyx (XCN)",
  "Zilliqa (ZIL)",
  "Celo (CELO)",
  "Lisk (LSK)",
  "Nexo (NEXO)",
  "Wanchain (WAN)",
  "Bancor (BNT)",
  "Enjin Coin (ENJ)",
  "Harmony (ONE)",
  "Holo (HOT)",
  "Ravencoin (RVN)",
  "Siacoin (SC)",
  "Waves (WAVES)",
  "Qtum (QTUM)",
  "Nano (XNO)",
  "Decred (DCR)",
  "DigiByte (DGB)",
  "Verge (XVG)",
  "Groestlcoin (GRS)",
  "Komodo (KMD)",
  "Bitshares (BTS)",
  "Steem (STEEM)",
  "Ardor (ARDR)",
  "Ark (ARK)",
  "Viacoin (VIA)",
  "Counterparty (XCP)",
  "Burst (BURST)",
  "Bytecoin (BCN)",
  "Primecoin (XPM)",
  "Peercoin (PPC)",
  "Namecoin (NMC)"
];
