import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");
const config: Config = {
  darkMode: "selector",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  safelist: [
    "bg-[#1e5159]",
    "text-[#43b5c5]",
    "bg-[#116939]",
    "text-[#26e97e]",
    "bg-[#712c71]",
    "text-[#fa62fc]",
    "bg-[#512965]",
    "text-[#b45be1]",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
export default config;
