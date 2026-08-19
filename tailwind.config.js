module.exports = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./styles/globals.css",
	],
	theme: {
		extend: {
			fontFamily: {
				// Body / paragraph copy. `font-sans` is Tailwind's default family, so every
				// unstyled element inherits Figtree without needing a class.
				sans: ['var(--font-figtree)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
				// Headings. h1-h6 get this automatically via globals.css; use `font-heading`
				// for visual headings that are not real heading tags.
				heading: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
				// Pinned so the 269 `font-mono` usages (DNS records, SPF/DKIM strings, code
				// blocks) stay deterministic instead of riding Tailwind's default.
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
			},
			backgroundImage: {
				gradient: 'linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)'
			},
			animation: {
				opacity: 'opacity 0.25s ease-in-out',
				appearFromRight: 'appearFromRight 300ms ease-in-out',
				wiggle: 'wiggle 1.5s ease-in-out infinite',
				popup: 'popup 0.25s ease-in-out',
				shimmer: 'shimmer 3s ease-out infinite alternate',
				'gradient-x': 'gradient-x 3s ease infinite',
				'float-in': 'float-in 0.5s ease-out forwards',
				'banner-shimmer': 'banner-shimmer 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out forwards',
				'slide-down': 'slide-down 0.5s ease-out forwards',
				'continuous-drift': 'continuous-drift 60s linear infinite',
				'float': 'float 20s ease-in-out infinite',
				'snowfall': 'snowfall 8s linear infinite'
			},
			keyframes: {
				opacity: {
					'0%': {
						opacity: 0
					},
					'100%': {
						opacity: 1
					}
				},
				appearFromRight: {
					'0%': {
						opacity: 0.3,
						transform: 'translate(15%, 0px);'
					},
					'100%': {
						opacity: 1,
						transform: 'translate(0);'
					}
				},
				wiggle: {
					'0%, 20%, 80%, 100%': {
						transform: 'rotate(0deg)'
					},
					'30%, 60%': {
						transform: 'rotate(-2deg)'
					},
					'40%, 70%': {
						transform: 'rotate(2deg)'
					},
					'45%': {
						transform: 'rotate(-4deg)'
					},
					'55%': {
						transform: 'rotate(4deg)'
					}
				},
				popup: {
					'0%': {
						transform: 'scale(0.8)',
						opacity: 0.8
					},
					'50%': {
						transform: 'scale(1.1)',
						opacity: 1
					},
					'100%': {
						transform: 'scale(1)',
						opacity: 1
					}
				},
				shimmer: {
					'0%': {
						backgroundPosition: '0 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					},
					'100%': {
						backgroundPosition: '0% 50%'
					}
				},
				'gradient-x': {
					'0%, 100%': {
						backgroundSize: '200% 200%',
						backgroundPosition: 'left center'
					},
					'50%': {
						backgroundSize: '200% 200%',
						backgroundPosition: 'right center'
					}
				},
				'float-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px) scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'banner-shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '1',
						textShadow: '0 0 0px currentColor'
					},
					'50%': {
						opacity: '1',
						textShadow: '0 0 8px currentColor, 0 0 12px currentColor'
					}
				},
				'bounce-subtle': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-3px)'
					}
				},
				'slide-up': {
					'from': {
						opacity: '0',
						transform: 'translateY(8px)'
					},
					'to': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-down': {
					'from': {
						opacity: '0',
						transform: 'translateY(-8px)'
					},
					'to': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'continuous-drift': {
					'0%': {
						transform: 'translate(0, 0) rotate(0deg)'
					},
					'25%': {
						transform: 'translate(100px, -50px) rotate(90deg)'
					},
					'50%': {
						transform: 'translate(-50px, 100px) rotate(180deg)'
					},
					'75%': {
						transform: 'translate(-100px, -50px) rotate(270deg)'
					},
					'100%': {
						transform: 'translate(0, 0) rotate(360deg)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'snowfall': {
					'0%': {
						transform: 'translateY(-10vh) translateX(0)',
						opacity: '1'
					},
					'50%': {
						transform: 'translateY(50vh) translateX(20px)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'translateY(110vh) translateX(-20px)',
						opacity: '0.6'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			}
		}
	},
	plugins: [require("daisyui"), require("tailwindcss-animate")],
	daisyui: {
		// The site is hardcoded to data-theme="light" (see config.colors.theme) with no theme
		// toggle and no `dark:` variants, so the daisyUI "dark" theme was pure unused CSS.
		// Shipping only "light" trims the render-blocking stylesheet. Add a theme here if you
		// ever introduce a switcher. https://daisyui.com/
		themes: ["light"],
	},
};
