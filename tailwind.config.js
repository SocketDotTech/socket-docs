/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../docs/**/*.mdx"], // my markdown stuff is in ../docs, not /src
  theme: {
    extend: {
      textColor: {
        'secondary': 'var(--text-secondary)'
      },
      backgroundColor: {
        'light-purple': 'var(--bg-primary)',
        'global': 'var(--bg-global)'
      },
      stroke: {
        'primary': 'var(--stroke-primary)'
      }
    },
  },
  plugins: [],
}

