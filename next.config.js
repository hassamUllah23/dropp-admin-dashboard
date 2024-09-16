/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "data-annotation-dropp.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
