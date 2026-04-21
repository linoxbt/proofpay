// ---------------------------------------------------------------------------
// ProofPay on Rialo – Rialo Chain Definition
// ---------------------------------------------------------------------------

import { defineChain } from "viem";
import {
  RIALO_CHAIN_ID,
  RIALO_RPC_URL,
  RIALO_EXPLORER_URL,
  RIALO_CHAIN_NAME,
  RIALO_GAS_CONFIG,
} from "./config";

export const rialoDevnet = defineChain({
  id: RIALO_CHAIN_ID,
  name: RIALO_CHAIN_NAME,
  nativeCurrency: {
    name: "RIA",
    symbol: "RIA",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [""] }, // deliberately empty to prevent network configs from being sent to the wallet
  },
  testnet: true,
});

export function getRecommendedGas() {
  return {
    maxFeePerGas: RIALO_GAS_CONFIG.maxFeePerGas,
    maxPriorityFeePerGas: RIALO_GAS_CONFIG.maxPriorityFeePerGas,
  };
}

export function txExplorerUrl(txHash: string): string {
  return `${RIALO_EXPLORER_URL}/tx/${txHash}`;
}

export function addressExplorerUrl(address: string): string {
  return `${RIALO_EXPLORER_URL}/address/${address}`;
}
