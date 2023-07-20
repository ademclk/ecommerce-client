/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    env: {
      baseUrl: 'https://localhost:7068/api/',
      test: "sadas"
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: "https",
          hostname: 'ademclkstorage.blob.core.windows.net',
          port: '',
          pathname: '/**'
        }
      ],
    },
  }
