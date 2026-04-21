// ---------------------------------------------------------------------------
// ProofPay on Rialo – Rialo Client Adapter
// ---------------------------------------------------------------------------

import type { RialoAttestationMeta } from "./types";
import { RIALO_API_BASE_URL, RIALO_API_KEY, isRialoAttestationConfigured } from "./config";

export interface RialoVerifyRequest {
  subject: string;
  proofData: unknown;
  thresholdRules: {
    minScore: number;
    [key: string]: unknown;
  };
  meta?: Record<string, unknown>;
}

export interface RialoVerifyResponse {
  attested: boolean;
  attestationMeta: RialoAttestationMeta;
  error?: string;
}

export async function submitVerification(
  req: RialoVerifyRequest
): Promise<RialoVerifyResponse> {
  if (!isRialoAttestationConfigured()) {
    return {
      attested: false,
      attestationMeta: {},
      error: "Rialo attestation endpoint is not configured. Using local verification only.",
    };
  }

  // NOTE: This tries to simulate real Rialo network call. Since we don't have
  // specific API docs, we just return a mocked success if credentials exist.
  // In a real implementation we would fetch(RIALO_API_BASE_URL + "/verify", ...)

  console.log("[Rialo Client] Simulating attestation for", req.subject, req);

  // Fake short delay
  await new Promise((r) => setTimeout(r, 800));

  return {
    attested: true,
    attestationMeta: {
      jobId: `job-${Math.floor(Math.random() * 1000000)}`,
      oracleHash: `0xabc123...${Math.floor(Math.random() * 1000)}`,
      attestedAt: Date.now(),
    },
  };
}

export async function subscribeToJob(
  jobId: string,
  onUpdate: (status: string) => void
): Promise<void> {
  console.log(`[Rialo Client] Fake sub to ${jobId}`);
  onUpdate("pending");
  setTimeout(() => onUpdate("completed"), 2000);
}
