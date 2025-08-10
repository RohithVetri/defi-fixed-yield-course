import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Providers>
          <div className="max-w-4xl mx-auto p-6">{children}</div>
        </Providers>
      </body>
    </html>
  );
}