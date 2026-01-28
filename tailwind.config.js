/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff5eb',
                    100: '#ffe8d1',
                    200: '#ffd1a3',
                    300: '#ffb370',
                    400: '#ff8c3a',
                    500: '#fd7e14', // Brand Primary (Candidate Orange)
                    600: '#e06b00', // Hover state
                    700: '#c25d00',
                    800: '#9e4d00',
                    900: '#7a3c00',
                    950: '#4d2600',
                },
                secondary: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981', // Brand Secondary
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                },
                slate: {
                    850: '#1e293b', // Custom dark surface
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
