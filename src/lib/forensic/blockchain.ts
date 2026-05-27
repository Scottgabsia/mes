export type ChainId = "ethereum" | "polygon" | "bsc";

const RPC_URLS: Record<ChainId, string> = {
  ethereum: "https://eth.llamarpc.com",
  polygon: "https://polygon.llamarpc.com",
  bsc: "https://bsc-dataseed.binance.org",
};

export function isEvmAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

async function rpcCall<T>(chain: ChainId, method: string, params: unknown[]): Promise<T> {
  const res = await fetch(RPC_URLS[chain], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = (await res.json()) as { result?: T; error?: { message: string } };
  if (json.error) {
    throw new Error(json.error.message || "RPC error");
  }
  return json.result as T;
}

function padUint256(n: bigint): string {
  return n.toString(16).padStart(64, "0");
}

export async function getContractBytecode(
  chain: ChainId,
  address: string
): Promise<string> {
  const code = await rpcCall<string>(chain, "eth_getCode", [address, "latest"]);
  return code || "0x";
}

export function isContract(bytecode: string): boolean {
  const normalized = bytecode.trim();
  return normalized !== "0x" && normalized.length > 2;
}

/** ERC-165 supportsInterface(bytes4) */
async function supportsInterface(
  chain: ChainId,
  contract: string,
  interfaceId: string
): Promise<boolean> {
  const selector = "01ffc9a7";
  const data =
    "0x" +
    selector +
    interfaceId.replace("0x", "").padStart(8, "0").padEnd(64, "0");
  try {
    const result = await rpcCall<string>(chain, "eth_call", [
      { to: contract, data },
      "latest",
    ]);
    return result !== "0x" && BigInt(result) === 1n;
  } catch {
    return false;
  }
}

export type NftAuthResult = {
  chain: ChainId;
  contract: string;
  tokenId?: string;
  isContract: boolean;
  isErc721: boolean;
  isErc1155: boolean;
  tokenUri?: string;
  metadataPreview?: string;
  riskFlags: string[];
  verdict: "LIKELY_AUTHENTIC" | "REVIEW_REQUIRED" | "HIGH_RISK";
};

export async function authenticateNftOrigin(
  chain: ChainId,
  contractAddress: string,
  tokenId?: string
): Promise<NftAuthResult> {
  const contract = contractAddress.trim();
  const riskFlags: string[] = [];
  const bytecode = await getContractBytecode(chain, contract);
  const contractDeployed = isContract(bytecode);

  if (!contractDeployed) {
    return {
      chain,
      contract,
      tokenId,
      isContract: false,
      isErc721: false,
      isErc1155: false,
      riskFlags: ["ADDRESS_IS_NOT_A_CONTRACT"],
      verdict: "HIGH_RISK",
    };
  }

  const isErc721 = await supportsInterface(chain, contract, "0x80ac58cd");
  const isErc1155 = await supportsInterface(chain, contract, "0xd9b67a26");

  if (!isErc721 && !isErc1155) {
    riskFlags.push("NO_STANDARD_NFT_INTERFACE_DETECTED");
  }

  let tokenUri: string | undefined;
  let metadataPreview: string | undefined;

  if (tokenId && isErc721) {
    const tid = BigInt(tokenId);
    const selector = "c87b56dd";
    const data = "0x" + selector + padUint256(tid);
    try {
      const raw = await rpcCall<string>(chain, "eth_call", [
        { to: contract, data },
        "latest",
      ]);
      if (raw && raw.length > 130) {
        tokenUri = decodeAbiString(raw);
        if (tokenUri.startsWith("ipfs://")) {
          tokenUri = `https://ipfs.io/ipfs/${tokenUri.slice(7)}`;
        }
        if (tokenUri.startsWith("http")) {
          try {
            const metaRes = await fetch(tokenUri, { signal: AbortSignal.timeout(8000) });
            if (metaRes.ok) {
              const text = await metaRes.text();
              metadataPreview = text.slice(0, 500);
            }
          } catch {
            riskFlags.push("METADATA_FETCH_FAILED");
          }
        }
      }
    } catch {
      riskFlags.push("TOKEN_URI_CALL_FAILED");
    }
  } else if (!tokenId && isErc721) {
    riskFlags.push("PROVIDE_TOKEN_ID_FOR_FULL_PROVENANCE");
  }

  if (metadataPreview) {
    const lower = metadataPreview.toLowerCase();
    if (lower.includes("hidden") || lower.includes("placeholder")) {
      riskFlags.push("SUSPICIOUS_METADATA_KEYWORDS");
    }
  }

  let verdict: NftAuthResult["verdict"] = "LIKELY_AUTHENTIC";
  if (riskFlags.includes("ADDRESS_IS_NOT_A_CONTRACT") || riskFlags.includes("NO_STANDARD_NFT_INTERFACE_DETECTED")) {
    verdict = "HIGH_RISK";
  } else if (riskFlags.length > 0) {
    verdict = "REVIEW_REQUIRED";
  }

  return {
    chain,
    contract,
    tokenId,
    isContract: contractDeployed,
    isErc721,
    isErc1155,
    tokenUri,
    metadataPreview,
    riskFlags,
    verdict,
  };
}

export type DexAnalysisResult = {
  chain: ChainId;
  poolAddress: string;
  isContract: boolean;
  reserve0?: string;
  reserve1?: string;
  liquidityScore: number;
  riskFlags: string[];
  verdict: "STABLE" | "CAUTION" | "HIGH_RISK";
};

export async function analyzeDexLiquidity(
  chain: ChainId,
  poolAddress: string
): Promise<DexAnalysisResult> {
  const pool = poolAddress.trim();
  const riskFlags: string[] = [];
  const bytecode = await getContractBytecode(chain, pool);
  const contractDeployed = isContract(bytecode);

  if (!contractDeployed) {
    return {
      chain,
      poolAddress: pool,
      isContract: false,
      liquidityScore: 0,
      riskFlags: ["NOT_A_CONTRACT"],
      verdict: "HIGH_RISK",
    };
  }

  const selector = "0902f1aec";
  let reserve0: string | undefined;
  let reserve1: string | undefined;

  try {
    const raw = await rpcCall<string>(chain, "eth_call", [
      { to: pool, data: "0x" + selector },
      "latest",
    ]);
    if (raw && raw.length >= 130) {
      const hex = raw.replace("0x", "");
      reserve0 = BigInt("0x" + hex.slice(0, 64)).toString();
      reserve1 = BigInt("0x" + hex.slice(64, 128)).toString();
    }
  } catch {
    riskFlags.push("GET_RESERVES_FAILED");
  }

  if (!reserve0 || !reserve1) {
    riskFlags.push("NOT_RECOGNIZED_AS_V2_PAIR");
    return {
      chain,
      poolAddress: pool,
      isContract: true,
      liquidityScore: 10,
      riskFlags,
      verdict: "HIGH_RISK",
    };
  }

  const r0 = BigInt(reserve0);
  const r1 = BigInt(reserve1);
  const minReserve = r0 < r1 ? r0 : r1;

  if (minReserve < 1_000_000_000_000_000n) {
    riskFlags.push("VERY_LOW_POOL_RESERVES");
  }
  if (r0 === 0n || r1 === 0n) {
    riskFlags.push("EMPTY_POOL_SIDE");
  }

  const liquidityScore = Math.min(
    100,
    Math.floor(Number(minReserve / 1_000_000_000_000_000n))
  );

  let verdict: DexAnalysisResult["verdict"] = "STABLE";
  if (riskFlags.includes("VERY_LOW_POOL_RESERVES") || riskFlags.includes("EMPTY_POOL_SIDE")) {
    verdict = "HIGH_RISK";
  } else if (riskFlags.length > 0 || liquidityScore < 40) {
    verdict = "CAUTION";
  }

  return {
    chain,
    poolAddress: pool,
    isContract: true,
    reserve0,
    reserve1,
    liquidityScore,
    riskFlags,
    verdict,
  };
}

function decodeAbiString(hexData: string): string {
  const hex = hexData.replace("0x", "");
  if (hex.length < 128) return "";
  const offset = Number(BigInt("0x" + hex.slice(0, 64)));
  const lenPos = offset * 2;
  const length = Number(BigInt("0x" + hex.slice(lenPos, lenPos + 64)));
  const start = lenPos + 64;
  const strHex = hex.slice(start, start + length * 2);
  let out = "";
  for (let i = 0; i < strHex.length; i += 2) {
    const code = parseInt(strHex.slice(i, i + 2), 16);
    if (code === 0) break;
    out += String.fromCharCode(code);
  }
  return out;
}
