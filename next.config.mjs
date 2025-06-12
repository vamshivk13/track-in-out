/** @type {import('next').NextConfig} */

import nextPWA from "next-pwa";

const withPwa = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {};

export default withPwa(nextConfig);
