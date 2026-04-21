"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { rialoDevnet } from "../lib/rialo-chain";
import { http } from "wagmi";
import { WALLETCONNECT_PROJECT_ID, RIALO_RPC_URL } from "../lib/config";

const config = getDefaultConfig({
  appName: "ProofPay on Rialo",
  projectId: WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID", // fallback needed if undefined in strict mode
  chains: [rialoDevnet],
  transports: {
    [rialoDevnet.id]: http(RIALO_RPC_URL),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
