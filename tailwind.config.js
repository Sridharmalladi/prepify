/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'floating 6s ease-in-out infinite',
        'float-delayed': 'floating 6s ease-in-out infinite 2s',
        'float-slow': 'floating 8s ease-in-out infinite 4s',
        'gradient-shift': 'gradientShift 30s ease infinite',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth-bounce': 'smoothBounce 2s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite',
      },
      keyframes: {
        floating: {
          '0%, 100%': { 
            transform: 'translate3d(0, 0, 0) rotate(0deg)' 
          },
          '25%': { 
            transform: 'translate3d(10px, -20px, 0) rotate(1deg)' 
          },
          '50%': { 
            transform: 'translate3d(-5px, -30px, 0) rotate(-1deg)' 
          },
          '75%': { 
            transform: 'translate3d(-10px, -15px, 0) rotate(0.5deg)' 
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        smoothBounce: {
          '0%, 100%': {
            transform: 'translateY(0) scale(1)',
            animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          },
          '50%': {
            transform: 'translateY(-20px) scale(1.05)',
            animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '25%': { backgroundPosition: '100% 50%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(251, 191, 36, 0.5)',
        'glow-lg': '0 0 40px rgba(251, 191, 36, 0.6)',
        'professional': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'elevated': '0 25px 50px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'smooth': '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08)',
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'bounce-smooth': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      }
    },
  },
  plugins: [],
}