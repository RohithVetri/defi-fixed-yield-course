"use client";
import { useState } from "react";
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "Test App",
  projectId: "test",
  chains: [sepolia],
  transports: { [sepolia.id]: http() },
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function Inner() {
  return (
    <div className="space-y-4">
      <h2>测试组件</h2>
      <ConnectButton />
      <div className="p-4 bg-gray-800 rounded">
        <p>如果看到这个内容，说明 QueryClient 设置正确！</p>
      </div>
    </div>
  );
}

export default function TestComponent() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Inner />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
