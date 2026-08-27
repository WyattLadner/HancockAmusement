/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static assets live in /public/images. Darts data is fetched server-side at
  // request/revalidate time from leagueleader.net (see lib/leagueleader.js), so no
  // remote image hosts are needed here.
  reactStrictMode: true,
};

export default nextConfig;
