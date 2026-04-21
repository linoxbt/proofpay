// ---------------------------------------------------------------------------
// ProofPay on Rialo – Proof-of-Work Verification Engine
// ---------------------------------------------------------------------------
import type {
  GitHubActivityResult,
  ProofVerificationResult,
  RialoAttestationMeta,
} from "./types";
import { isRialoAttestationConfigured } from "./config";
import { submitVerification, type RialoVerifyRequest } from "./rialo-client";

export interface VerifyInput {
  githubData: GitHubActivityResult;
  threshold: number;
  employeeWallet: string;
  meta?: Record<string, unknown>;
}

export async function verifyWork(
  input: VerifyInput
): Promise<ProofVerificationResult> {
  const { githubData, threshold, employeeWallet, meta } = input;

  const localPass = githubData.activityScore >= threshold;

  let rialoAttested = false;
  let rialoMeta: RialoAttestationMeta = {};

  if (isRialoAttestationConfigured()) {
    try {
      const req: RialoVerifyRequest = {
        subject: employeeWallet,
        proofData: {
          username: githubData.username,
          activityScore: githubData.activityScore,
          pushEvents: githubData.pushEvents,
          prEvents: githubData.prEvents,
          fetchedAt: githubData.fetchedAt,
        },
        thresholdRules: { minScore: threshold, ...meta },
      };

      const res = await submitVerification(req);
      rialoAttested = res.attested;
      rialoMeta = res.attestationMeta;
    } catch (err) {
      console.warn("[ProofEngine] Rialo attestation call failed:", err);
    }
  }

  const eligible = localPass; // Note: You'd AND with rialoAttested if required

  let reason: string;
  if (eligible) {
    reason = `Activity score ${githubData.activityScore} meets threshold ${threshold}.`;
    if (rialoAttested) {
      reason += ` Rialo attestation confirmed (job ${rialoMeta.jobId ?? "n/a"}).`;
    }
  } else {
    reason = `Activity score ${githubData.activityScore} is below threshold ${threshold}. Payment blocked.`;
  }

  return {
    eligible,
    reason,
    rialoAttested,
    sources: {
      github: true,
      localThreshold: true,
      rialo: isRialoAttestationConfigured(),
    },
    timestamp: Date.now(),
  };
}
