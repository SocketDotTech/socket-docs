/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../docs/**/*.mdx"], // my markdown stuff is in ../docs, not /src
  theme: {
    extend: {
      backgroundColor: {
        'light-purple': 'rgba(134, 51, 242, 0.1)'
      }
    },
  },
  plugins: [],
}

