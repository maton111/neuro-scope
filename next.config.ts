import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow @mediapipe/tasks-vision WASM files to be served correctly
  async headers() {
    return [
      {
        source: "/:path*.wasm",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;