/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs")

const nextConfig = {
  eslint: {
    // تحذير: في الإنتاج يجب إزالة ignoreDuringBuilds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // تحذير: في الإنتاج يجب إزالة ignoreBuildErrors
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
      },
    ],
  },
  // إعدادات إضافية للأداء
  poweredByHeader: false,
  compress: true,
}

// Sentry configuration (only if DSN is provided)
const sentryOptions = {
  silent: !process.env.NEXT_PUBLIC_SENTRY_DSN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
}

module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryOptions)
  : nextConfig
