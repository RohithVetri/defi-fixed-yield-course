/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 完全禁用 SSR - 生成静态站点
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 禁用静态优化，强制客户端渲染
  experimental: {
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // 只在客户端构建时添加 fallback
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;