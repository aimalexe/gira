/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,html}',
        "./src/app/**/*.{js,ts,jsx,tsx,html}"
    ],
    theme: {
        extend: {
            colors: {
                'teal-custom': '#26A69A', 
                'coral-custom': '#FF7043',
                'indigo-custom': '#5E35B1', 
                'gray-soft': '#E0E0E0',
            },
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
};