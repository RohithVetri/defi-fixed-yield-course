"use client";
import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface ProvidersProps {
  children: ReactNode;
}

// 动态导入所有 Web3 相关组件，完全禁用 SSR
const Web3Providers = dynamic(
  () => import("./web3-providers").then((mod) => ({ default: mod.Web3Providers })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="text-lg">正在初始化钱包连接...</div>
      </div>
    ),
  }
);

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 确保只在客户端渲染
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="text-lg">正在加载应用...</div>
      </div>
    );
  }

  return (
    <Web3Providers>
      {children}
    </Web3Providers>
  );
}