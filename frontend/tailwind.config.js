/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Letterboxd-inspired palette
        letterboxd: {
          bg: '#14181c',        // Background principal (dark grey/black)
          card: '#2c3440',      // Cards/Header (lighter grey)
          green: '#00e054',     // Accent verde (botões/destaque)
          orange: '#ff8000',    // Estrelas (laranja)
          text: {
            primary: '#ffffff',   // Texto branco
            secondary: '#99aabb', // Texto cinza
          }
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
