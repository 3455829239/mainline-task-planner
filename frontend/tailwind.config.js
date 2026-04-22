/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/components/**/*.{vue,js,ts,jsx,tsx}", // 确保包含 components 文件夹
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
