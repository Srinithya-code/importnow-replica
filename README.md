# ImportNow recruitment assignment

A from-scratch React, Vite, JavaScript and Tailwind CSS implementation of the supplied ImportNow concept. The home page follows the reference section order. It includes the animated trade-route globe, scroll-controlled voyage, mobile navigation, FAQ, quote form, blog filters, pagination and individual article URLs.

## Run locally

Use Node.js 20.19 or newer and npm. From this directory:

    npm ci
    npm run dev
    npm run build
    npm run preview

The build writes three static entry points to dist. The quote form opens the reference WhatsApp number with a prefilled message for the visitor to review.

## Structure

- src/main.jsx contains the pages and interactive components.
- src/scenes.jsx implements the globe and mounts the reference voyage scene from src/voyage.js.
- src/style.css contains Tailwind utilities and reference-specific styles.
- src/content.json contains the authorized concept copy, article content and card data.
- public/assets contains the inspected SVG artwork and the Earth textures used by the reference, sourced from the Three.js r160 example textures. The website uses Google Fonts for Sora and Inter.

## Tools used

ChatGPT Codex for reference analysis, implementation and browser checks. React and Tailwind CSS for page components and responsive styling. Three.js for WebGL scenes. Vite and npm for development and the production build.

## Deployment

Push the project root to GitHub, then import the repository in Vercel. The included vercel.json selects the Vite build and dist output. Verify home, blog.html and an article URL on the resulting domain.

## Verification and fidelity

Browser checks covered the desktop and mobile home layout, tablet rendering, mobile menu, FAQ, scroll-driven shipment progression, quote validation, blog category and search filters, and article routing. The first-party form opens WhatsApp and does not submit a message automatically.

The globe uses the reference texture set. The voyage uses the original scroll-driven scene adapted to React, with its water texture bundled locally. Some spacing, animation timing, illustrations and card details can differ from the reference. The local build is an assessment implementation.

Reference: https://importnow-concept.vercel.app/#home

