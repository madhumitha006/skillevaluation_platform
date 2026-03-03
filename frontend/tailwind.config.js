/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e6e9f0',
          100: '#c0c8db',
          200: '#96a4c4',
          300: '#6c80ad',
          400: '#4d649c',
          500: '#2e488b',
          600: '#294183',
          700: '#233878',
          800: '#1d306e',
          900: '#0f1c54',
          950: '#0a1128',
        },
        electric: {
          50: '#e6f0ff',
          100: '#c0d9ff',
          200: '#99c0ff',
          300: '#73a7ff',
          400: '#5694ff',
          500: '#3a81ff',
          600: '#3479ff',
          700: '#2c6eff',
          800: '#2563ff',
          900: '#184fff',
        },
        violet: {
          50: '#f3e5ff',
          100: '#e0bfff',
          200: '#cc94ff',
          300: '#b869ff',
          400: '#a849ff',
          500: '#9829ff',
          600: '#9024ff',
          700: '#851fff',
          800: '#7b19ff',
          900: '#6a0fff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(58, 129, 255, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(152, 41, 255, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(58, 129, 255, 0.2) 0px, transparent 50%)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient': 'gradient 8s linear infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(58, 129, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(58, 129, 255, 0.6)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
