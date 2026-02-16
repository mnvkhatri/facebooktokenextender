/** @type {import('next').NextConfig} */

// Build-time watermark injection - TAMPER PROOF
const CREATOR = 'mnvkhatri';
const YEAR = new Date().getFullYear();
const WATERMARK = `Made with ❤️ by ${CREATOR} © ${YEAR}`;

const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  env: {
    NEXT_PUBLIC_WATERMARK: WATERMARK,
    NEXT_PUBLIC_CREATOR: CREATOR,
  },
}

module.exports = nextConfig
