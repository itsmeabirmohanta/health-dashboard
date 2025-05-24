/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", "class"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'50': '#e6f0ff',
  				'100': '#cce0ff',
  				'200': '#99c2ff',
  				'300': '#66a3ff',
  				'400': '#3385ff',
  				'500': '#0066ff',
  				'600': '#0052cc',
  				'700': '#003d99',
  				'800': '#002966',
  				'900': '#001433',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)'
  			]
  		},
  		animation: {
  			heartbeat: 'heartbeat 0.6s ease-in-out',
  			'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			bubble: 'bubble 3s ease-in-out infinite'
  		},
  		keyframes: {
  			heartbeat: {
  				'0%, 100%': {
  					transform: 'scale(1)'
  				},
  				'50%': {
  					transform: 'scale(1.15)'
  				}
  			},
  			'pulse-ring': {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'scale(1.5)',
  					opacity: '0'
  				}
  			},
  			bubble: {
  				'0%': {
  					transform: 'translateY(0)',
  					opacity: '0'
  				},
  				'50%': {
  					opacity: '0.8'
  				},
  				'100%': {
  					transform: 'translateY(-100px)',
  					opacity: '0'
  				}
  			}
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/aspect-ratio")
  ],
}
