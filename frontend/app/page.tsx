import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">ERC4626 固定年化金库</h1>
      <p>存入代币到 ERC4626 金库，获得固定年化收益。</p>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Link href="/vault" className="px-4 py-2 rounded bg-emerald-600">进入金库面板</Link>
        </div>
        <div className="text-sm text-slate-400">
          <p>📈 固定年化收益率</p>
          <p>🔒 ERC4626 标准合约</p>
          <p>🎁 自动奖励发放</p>
        </div>
      </div>
    </main>
  );
}
