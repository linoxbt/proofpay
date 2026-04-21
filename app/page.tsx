"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";
import { RIALO_USDC_ADDRESS } from "../lib/config";
import { ERC20_ABI, toRawUsdc, fromRawUsdc, formatUsdc } from "../lib/erc20";
import type { Employee, GitHubActivityResult } from "../lib/types";
import { verifyWork } from "../lib/proof-engine";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [githubData, setGithubData] = useState<GitHubActivityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee>({
    id: "1",
    name: "Alice Engineer",
    walletAddress: "0x0000000000000000000000000000000000000000",
    githubUsername: "0xnald",
    salaryUsdc: 3000,
    minActivity: 10,
    createdAt: Date.now(),
    verificationMode: "github",
  });
  const [proofResult, setProofResult] = useState<any>(null);

  const { data: usdcBalance } = useReadContract({
    address: RIALO_USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
         enabled: !!address,
    }
  });

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleFetchDevActivity = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/github?username=${employee.githubUsername}`);
      if (!res.ok) throw new Error("Failed to fetch github activity");
      const data = await res.json();
      setGithubData(data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!githubData) return;
    setLoading(true);
    try {
      const result = await verifyWork({
        githubData,
        threshold: employee.minActivity,
        employeeWallet: employee.walletAddress,
      });
      setProofResult(result);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!proofResult?.eligible) return;
    writeContract({
      address: RIALO_USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [employee.walletAddress, toRawUsdc(employee.salaryUsdc)],
    });
  };

  return (
    <main className="min-h-screen p-8 lg:p-24 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight glow-text text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          ProofPay <span className="text-white text-2xl">on Rialo</span>
        </h1>
        <ConnectButton />
      </div>

      {!isConnected ? (
        <div className="glass-card p-12 text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">Welcome to ProofPay</h2>
          <p className="text-gray-400 mb-8">Connect your wallet to manage onchain payroll powered by Rialo reactive execution.</p>
          <div className="flex justify-center"><ConnectButton /></div>
        </div>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Employer Panel */}
          <div className="space-y-8">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Funding Wallet (Employer)</h2>
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm break-all">
                {address}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-400">USDC Balance:</span>
                <span className="text-xl font-bold">
                  {usdcBalance !== undefined ? formatUsdc(fromRawUsdc(usdcBalance as bigint)) : "—"}
                </span>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Name</label>
                  <input
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm"
                    value={employee.name}
                    onChange={(e) => setEmployee({...employee, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">GitHub Username</label>
                  <input
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm"
                    value={employee.githubUsername}
                    onChange={(e) => setEmployee({...employee, githubUsername: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Wallet Address</label>
                  <input
                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm font-mono"
                    value={employee.walletAddress}
                    onChange={(e) => setEmployee({...employee, walletAddress: e.target.value as `0x${string}`})}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Salary (USDC)</label>
                    <input
                      type="number"
                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm"
                      value={employee.salaryUsdc}
                      onChange={(e) => setEmployee({...employee, salaryUsdc: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Min. Activity</label>
                    <input
                      type="number"
                      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm"
                      value={employee.minActivity}
                      onChange={(e) => setEmployee({...employee, minActivity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Panel */}
          <div className="space-y-8">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">1. Fetch Work Data</h2>
              <button
                onClick={handleFetchDevActivity}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Fetching..." : "Fetch GitHub Activity"}
              </button>

              {githubData && (
                <div className="mt-4 bg-black/50 rounded-lg p-4 text-sm font-mono text-gray-300">
                  <p className="text-green-400 mb-2">// Data Retrieved successfully</p>
                  <div>Events this month: {githubData.totalEvents}</div>
                  <div>Pushes: {githubData.pushEvents}</div>
                  <div>PRs: {githubData.prEvents}</div>
                  <div className="mt-2 text-white font-bold">Computed Score: {githubData.activityScore}</div>
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">2. Rialo Proof Verification</h2>
              <button
                onClick={handleVerify}
                disabled={loading || !githubData}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                 Verify with Rialo
              </button>

              {proofResult && (
                <div className={`mt-4 rounded-lg p-4 text-sm font-mono ${proofResult.eligible ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                  <p className="font-bold mb-2">// Verification {proofResult.eligible ? 'PASSED' : 'FAILED'}</p>
                  <p>{proofResult.reason}</p>
                  <p className="mt-2 text-xs opacity-70">
                    Sources: {Object.entries(proofResult.sources).filter(([_,v]) => v).map(([k]) => k).join(", ")}
                  </p>
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">3. Execute Payment</h2>
              <button
                onClick={handlePay}
                disabled={isConfirming || !proofResult?.eligible}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isConfirming ? "Confirming..." : "Pay Salary (USDC)"}
              </button>
              {txHash && (
                <div className="mt-4 text-sm font-mono text-gray-400">
                  Tx: {txHash}
                  {isConfirmed && <div className="text-emerald-400 mt-1">Confirmed!</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
