// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is where Tailwind settings live in Next.js 15+
  tailwindConfig: {
    darkMode: "class",
    plugins: [require("tailwindcss-animate")],
    theme: {
      extend: {
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
  },
};

export default nextConfig;