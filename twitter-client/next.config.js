/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Google profile pictures (OAuth login)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // GitHub avatars
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // ✅ Any AWS S3 bucket — covers your own bucket regardless of name/region
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      // Imgur (for testing)
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
};

module.exports = nextConfig;
