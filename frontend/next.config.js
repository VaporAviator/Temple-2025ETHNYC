const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  transpilePackages: ['@walletconnect/ethereum-provider', '@reown/appkit'],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
}

module.exports = nextConfig