// ---------------------------------------------------------------------------
// ProofPay on Rialo – Shared Types
// ---------------------------------------------------------------------------

export type VerificationMode = "github" | "none";

export interface Employee {
  id: string;
  name: string;
  walletAddress: `0x${string}`;
  githubUsername: string;
  /** Monthly salary in USDC (human-readable, e.g. 3000) */
  salaryUsdc: number;
  /** Minimum activity score required to unlock payment */
  minActivity: number;
  createdAt: number;
  verificationMode?: VerificationMode;
}

export interface GitHubActivityResult {
  username: string;
  totalEvents: number;
  pushEvents: number;
  prEvents: number;
  lastEventAt: string | null;
  activityScore: number;
  summary: string;
  fetchedAt: number;
}

export interface ProofVerificationResult {
  eligible: boolean;
  reason: string;
  rialoAttested: boolean;
  sources: {
    github: boolean;
    localThreshold: boolean;
    rialo: boolean;
  };
  timestamp: number;
}

export interface RialoAttestationMeta {
  jobId?: string;
  oracleHash?: string;
  attestedAt?: number;
}

export interface PaymentResult {
  status: "pending" | "confirmed" | "failed";
  txHash: `0x${string}` | null;
  from: `0x${string}`;
  to: `0x${string}`;
  amountUsdc: number;
  timestamp: number;
  error?: string;
}

export interface PaymentRecord extends PaymentResult {
  employeeId: string;
  employeeName: string;
}
