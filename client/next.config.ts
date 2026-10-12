import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: ["expectant-flop-research.ngrok-free.dev"],

images: {
remotePatterns: [
{
protocol: "https",
hostname: "res.cloudinary.com",
},
{
protocol: "https",
hostname: "randomuser.me",
},
],
},
};

export default nextConfig;
