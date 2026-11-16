/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fbvcdaqjeqwciksjwjse.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/imgs/**',
      },
    ],
  },
};

export default nextConfig;
