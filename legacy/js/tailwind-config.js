tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#0d7ff2",
                "primary-light": "#1e88f5",
                "primary-dark": "#0951cc",
                "accent": "#8DC63F",
                "accent-light": "#9ED454",
                "accent-dark": "#74A832",
                "background-light": "#f5f7f8",
                "background-dark": "#101922",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "sm": "0.25rem",
                "md": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "2xl": "1.25rem",
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out forwards",
                "fade-in-up": "fadeInUp 0.8s ease-out forwards",
                "fade-in-down": "fadeInDown 0.8s ease-out forwards",
                "slide-in-left": "slideInLeft 0.8s ease-out forwards",
                "slide-in-right": "slideInRight 0.8s ease-out forwards",
                "scale-in": "scaleIn 0.6s ease-out forwards",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" }
                },
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" }
                },
                fadeInDown: {
                    "0%": { opacity: "0", transform: "translateY(-20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" }
                },
                slideInLeft: {
                    "0%": { opacity: "0", transform: "translateX(-40px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" }
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(40px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" }
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" }
                }
            }
        },
    },
}
