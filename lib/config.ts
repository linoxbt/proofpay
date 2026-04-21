// ---------------------------------------------------------------------------
// ProofPay on Rialo – Environment Config
// ---------------------------------------------------------------------------

function required(key: string): string {
  const val = process.env[key];
  if (!val) {
    if (typeof window === "undefined") {
      console.warn(`[config] Missing env var: ${key}`);
    }
    return "";
  }
  return val;
}

function optionalStr(key: string): string | null {
  return process.env[key] ?? null;
}

// ── Rialo Chain ─────────────────────────────────────────────────────────────
export const RIALO_CHAIN_ID = parseInt(
  process.env.NEXT_PUBLIC_RIALO_CHAIN_ID ?? "1337",
  10
);
export const RIALO_RPC_URL =
  process.env.NEXT_PUBLIC_RIALO_RPC_URL ?? "https://rpc.devnet.rialo.io";
export const RIALO_EXPLORER_URL =
  process.env.NEXT_PUBLIC_RIALO_EXPLORER_URL ?? "https://explorer.devnet.rialo.io";
export const RIALO_CHAIN_NAME =
  process.env.NEXT_PUBLIC_RIALO_CHAIN_NAME ?? "Rialo Devnet";
export const RIALO_USDC_ADDRESS =
  (process.env.NEXT_PUBLIC_RIALO_USDC_ADDRESS as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";

// ── WalletConnect ─────────────────────────────────────────────────────────
export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

// ── GitHub ────────────────────────────────────────────────────────────────
export const GITHUB_TOKEN = optionalStr("GITHUB_TOKEN");

// ── Rialo Attestation API (server-side only) ──────────────────────────────
export const RIALO_API_BASE_URL = optionalStr("RIALO_API_BASE_URL");
export const RIALO_API_KEY = optionalStr("RIALO_API_KEY");

export function isRialoAttestationConfigured(): boolean {
  return Boolean(RIALO_API_BASE_URL && RIALO_API_KEY);
}

// Gas config
export const RIALO_GAS_CONFIG = {
  maxFeePerGas: BigInt("2500000000"),       // 2.5 gwei
  maxPriorityFeePerGas: BigInt("1000000000"), // 1 gwei
};
