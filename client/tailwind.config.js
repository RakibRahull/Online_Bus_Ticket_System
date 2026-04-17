/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};


// module.exports = {
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           DEFAULT: '#006a4e', // Bangladesh green
//           light: '#4d9e82',
//           dark: '#00563f'
//         },
//         secondary: {
//           DEFAULT: '#f42a41', // Bangladesh red
//           light: '#f75566',
//           dark: '#d01c30'
//         },
//         neutral: {
//           50: '#f9fafb',
//           900: '#1a1a1a'
//         }
//       }
//     }
//   }
// }