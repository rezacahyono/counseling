import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js',
    './pages/**/*.{ts,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      boxShadow: {
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: '#fafafa',
            },
            primary: {
              DEFAULT: '#00aa14',
            },
            secondary: {
              DEFAULT: '#2d9496',
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#43b742',
            },
            secondary: {
              DEFAULT: '#30a9ae',
            },
          },
        },
      },
    }),
  ],
}
export default config

