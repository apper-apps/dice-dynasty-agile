/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        // Ludo King inspired color palette
        primary: '#FF4444', // Red player
        secondary: '#4444FF', // Blue player  
        accent: '#44FF44', // Green player
        warning: '#FFDD44', // Yellow player
        surface: '#FFF8E7', // Warm cream background
        background: '#F5F0E8', // Light beige
        cardBg: '#FFFFFF', // Pure white for cards
        boardBg: '#E8DCC0', // Board background
        success: '#44AA44',
        error: '#DD4444',
        info: '#4488FF',
        // Traditional Ludo colors
        ludoRed: '#E53E3E',
        ludoBlue: '#3182CE', 
        ludoGreen: '#38A169',
        ludoYellow: '#D69E2E',
        // Board elements
        pathCell: '#FFFFFF',
        safeZone: '#FFE4B5',
        homeZone: '#F0F8F0',
      },
      fontFamily: {
        righteous: ['Righteous', 'cursive'],
        fredoka: ['Fredoka One', 'cursive'],
        sans: ['Open Sans', 'sans-serif'],
      },
      animation: {
        'dice-roll': 'roll 0.8s ease-out',
        'piece-bounce': 'bounce 0.6s ease-out',
        'capture-burst': 'burst 0.4s ease-out',
        'confetti': 'confetti 2s ease-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'token-shine': 'tokenShine 1.5s ease-in-out infinite',
      },
      keyframes: {
        roll: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'rotateX(90deg) rotateY(45deg)' },
          '50%': { transform: 'rotateX(180deg) rotateY(90deg)' },
          '75%': { transform: 'rotateX(270deg) rotateY(135deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(180deg)' },
        },
        burst: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotateZ(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotateZ(720deg)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.6)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.9)' },
        },
        tokenShine: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 6px 12px rgba(0,0,0,0.3)' },
        },
      },
      boxShadow: {
        'ludo': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'ludo-lg': '0 8px 25px rgba(0, 0, 0, 0.2)',
        'piece': '0 2px 8px rgba(0, 0, 0, 0.25)',
        'board': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}