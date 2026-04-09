# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Bastuku Investments Landing Page - A responsive, modern website for a logistics and supply solutions company based in Lusaka, Zambia.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Google Fonts (Inter, Material Symbols)
- **JavaScript**: Vanilla JS with Tailwind's utility-first approach
- **Features**: Dark mode, responsive design, smooth animations, scroll effects

## Development Commands
```bash
# No build process required - direct HTML editing
# Open in browser:
start index.html  # Windows
# or
open index.html   # macOS

# Live preview with auto-refresh (if using a local server):
# npx serve . -o
```

## File Structure
- `code.html` - Main landing page (single file application)
- `screen.png` - Design reference/image

## Architecture Notes
- Single-page application using semantic HTML5
- Mobile-first responsive design with Tailwind CSS utilities
- Dark mode support via Tailwind's dark mode class
- Smooth hover effects and scroll animations throughout
- Hero section with background image and gradient overlay
- Service cards with group hover effects for interactivity
- Footer with comprehensive contact information

## Key Components
- **Header**: Sticky navigation with dark mode backdrop blur
- **Hero Section**: Full-width background image with call-to-action
- **About Us**: Team image with radial gradient accents
- **Services**: Grid layout with hover effects and CTA card
- **Why Choose Us**: Feature comparison with image overlay
- **CTA Section**: Prominent call-to-action with gradient background
- **Footer**: Multi-column layout with contact details

## Animation & Interactivity
- CSS transitions for hover states on buttons and cards
- Group hover effects for service cards
- Smooth scroll animations (fade-in, scale effects)
- Backdrop blur effects for modern glass morphism

## Deployment
- Static site - can be deployed to any web server
- No build process required
- Domain connection via standard DNS (A records for IPv4)

## Quality Standards
- Ensure semantic HTML tags are used appropriately
- Maintain accessibility with proper ARIA labels
- Test across all device sizes (mobile, tablet, desktop)
- Optimize images for web performance
- Validate HTML/CSS for errors
- Ensure smooth 60fps animations on all devices