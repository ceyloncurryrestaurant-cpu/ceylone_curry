/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https:;
  font-src 'self' https://fonts.gstatic.com data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  media-src 'self' https:;
  connect-src 'self' https: ws: wss:;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

