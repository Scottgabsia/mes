/** Shared FAQ content for UI and FAQPage structured data */
export type FaqEntry = {
  q: string;
  a: string;
  keywords?: string;
};

export const FAQ_ITEMS: FaqEntry[] = [
  {
    q: "How to recover lost crypto from a deleted wallet?",
    a: "If the wallet was deleted, recovery depends on whether you have the seed phrase (12-24 words) or if raw data remains on the device's storage. Our specialists use deep-sector scanning to find deleted wallet files or help you reconstruct seed phrases from partial backups.",
    keywords: "recover deleted crypto wallet",
  },
  {
    q: "How to recover 12 word seed phrase if I lost some words?",
    a: "We utilize high-performance computing clusters to brute force missing words in a seed phrase. If you have 11 out of 12 words, or if you know the words but not the order, recovery is often mathematically feasible with professional tooling.",
    keywords: "how to recover 12 word seed phrase",
  },
  {
    q: "Is it possible to recover Ledger Nano without seed phrase?",
    a: "Recovery without the seed phrase requires physical access to the device and specialized hardware forensic tools. While difficult due to the Secure Element chip, we have proprietary methods for data extraction in specific failure scenarios.",
    keywords: "recover ledger nano without seed phrase",
  },
  {
    q: "How to recover MetaMask wallet after computer reset?",
    a: "If you did not back up your seed phrase, we can often extract the encrypted vault file from a disk image if sectors have not been overwritten. That file can then be decrypted with your original password when possible.",
    keywords: "recover metamask wallet",
  },
  {
    q: "Can the FBI recover stolen crypto?",
    a: "The FBI (via IC3) compiles evidence and can execute seizures when cases meet federal thresholds. We provide professional forensic reports that document fund flows, which can support agency action.",
    keywords: "can the fbi recover stolen crypto",
  },
  {
    q: "What should I do if I was scammed into sending crypto?",
    a: "Time is critical before funds move to mixers or off-ramps. We trace transactions to exchanges and help coordinate legal notices to freeze assets before cash-out when possible.",
    keywords: "scammed crypto recovery",
  },
  {
    q: "How to recover Coinbase wallet assets sent to the wrong address?",
    a: "If assets were sent to a wrong address on the same chain and it is exchange-controlled, we can mediate with compliance teams. Cross-chain mistakes may require specialized recovery protocols.",
    keywords: "recover coinbase wallet",
  },
  {
    q: "How to hire a crypto recovery specialist safely?",
    a: "Look for verifiable credentials, transparent fees, and clear jurisdiction. Never share private keys or seed phrases. Legitimate firms document scope before engagement.",
    keywords: "hire crypto recovery specialist",
  },
  {
    q: "What are the common recovery scam signs?",
    a: "Red flags include upfront activation or tax fees, claims to hack the blockchain, and guaranteed results in hours. Research the firm and verify contact channels independently.",
    keywords: "recovery scam signs",
  },
];

export const FAQ_CATEGORY_KEYS = [
  "WALLET_RECOVERY",
  "EXCHANGE_&_SCAMS",
  "SECURITY_&_EXPERTISE",
] as const;

export function getFaqCategories() {
  return [
    { category: FAQ_CATEGORY_KEYS[0], questions: FAQ_ITEMS.slice(0, 4) },
    { category: FAQ_CATEGORY_KEYS[1], questions: FAQ_ITEMS.slice(4, 7) },
    { category: FAQ_CATEGORY_KEYS[2], questions: FAQ_ITEMS.slice(7, 9) },
  ];
}
