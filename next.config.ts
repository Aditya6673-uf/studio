import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This is to allow the Next.js dev server to be accessed from the
    // cloud workstation's proxy.
    allowedDevOrigins: [
      'https://*.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
