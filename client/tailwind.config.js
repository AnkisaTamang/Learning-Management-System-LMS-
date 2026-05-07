/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      // Gradient Colors
      colors: {
        primary: "#4f46e5",        // Indigo
        secondary: "#3b82f6",      // Blue
        accent: "#06b6d4",         // Cyan
      },

      // Background Gradient Presets
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #4f46e5, #3b82f6)",
        "gradient-secondary": "linear-gradient(135deg, #3b82f6, #06b6d4)",
        "gradient-dark": "linear-gradient(135deg, #1e293b, #0f172a)",
      },

      // Font Sizes
      fontSize: {
        "course-details-heading-small": "26px",
        "course-details-heading-large": "36px",
        "home-heading-small": "28px",
        "home-heading-large": "48px",
        "base-text": "15px",
      },

      // Grid
      gridTemplateColumns: {
        "auto": "repeat(auto-fit, minmax(200px,1fr))"
      },

      // Spacing
      spacing: {
        "section-height": "500px",
      },

      // Max Width
      maxWidth: {
        'course-card' : '424px'
      },

      // Box Shadow
      boxShadow: {
        'custom-card' : '0px 4px 15px 2px rgba(0,0,0,0.1)',
      }
    },
  },

  plugins: [],
};
