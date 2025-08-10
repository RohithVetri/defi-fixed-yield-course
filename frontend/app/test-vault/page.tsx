"use client";
import dynamic from "next/dynamic";

const TestComponent = dynamic(() => import("./TestComponent"), {
  ssr: false,
  loading: () => <div>Loading Test...</div>,
});

export default function TestVaultPage() {
  return (
    <div className="p-6">
      <h1>Test Vault Page</h1>
      <TestComponent />
    </div>
  );
}
