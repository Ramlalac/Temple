/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#e98f08",
        gold: "#c88a13",
        ivory: "#fffaf0",
        sandal: "#f4c35b",
        ink: "#321407",
        cosmic: "#321407",
        midnight: "#fff4dc",
        ocean: "#fff8e7",
        starlight: "#6d3a08",
        maroon: "#7f1416",
        communityGreen: "#1f7a58"
      },
      fontFamily: {
        heading: ["Cinzel", "Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["\"Segoe UI\"", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      },
      boxShadow: {
        aura: "0 18px 50px rgba(97, 51, 10, 0.12)",
        glow: "0 14px 34px rgba(200, 138, 19, 0.2)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 20% 20%, rgba(248,212,107,0.3), transparent 26%), radial-gradient(circle at 78% 18%, rgba(31,122,88,0.14), transparent 24%), linear-gradient(135deg, rgba(255,250,240,0.98), rgba(255,244,220,0.96) 48%, rgba(255,255,255,0.98))",
        "lotus-pattern":
          "radial-gradient(circle at top, rgba(248,212,107,0.22), transparent 32%), radial-gradient(circle at 15% 20%, rgba(245,158,11,0.12), transparent 20%), radial-gradient(circle at 85% 10%, rgba(31,122,88,0.1), transparent 24%), linear-gradient(135deg, #fffaf0 0%, #fff4dc 48%, #ffffff 100%)",
        "site-shimmer":
          "linear-gradient(120deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 45%, rgba(245,208,111,0.12))"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.8s ease both",
        pulseHalo: "pulseHalo 5s ease-in-out infinite",
        drift: "drift 20s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseHalo: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.95", transform: "scale(1.08)" }
        },
        drift: {
          "0%": { transform: "translate3d(-2%, 0, 0)" },
          "50%": { transform: "translate3d(2%, -2%, 0)" },
          "100%": { transform: "translate3d(-2%, 0, 0)" }
        }
      }
    }
  },
  plugins: []
};
