/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://via.placeholder.com;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  media-src 'self' https://res.cloudinary.com;
  connect-src 'self';
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

