"use client";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import "@rainbow-me/rainbowkit/styles.css";

interface Web3ProvidersProps {
  children: ReactNode;
}

// 只在客户端创建配置
const config = getDefaultConfig({
  appName: "Fixed Yield DeFi",
  projectId: "demo",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: false, // 明确禁用 SSR
});

// 创建 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function Web3Providers({ children }: Web3ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
