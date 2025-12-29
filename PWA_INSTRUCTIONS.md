# PWA Asset Instructions

The following assets are configured in `vite.config.js` but are missing from the `public/` directory. For the PWA to work correctly and pass standard "Add to Home Screen" checks, please add these files:

## Missing Required Assets:

1. **favicon.ico** (Standard 16x16 or 32x32 icon)
2. **apple-touch-icon.png** (180x180 px, required for iOS)
3. **mask-icon.svg** (Monochrome vector SVG for pinned tabs)

## Recommended Improvements:

Currently, `vite.config.js` points both 192x192 and 512x512 icons to `logo.png`. While this works if `logo.png` is large enough, it is highly recommended to provide properly resized icons for better performance on mobile devices.

4. **pwa-192x192.png** (192x192 px, `logo.png` is 244KB which is heavy for a small icon)
5. **pwa-512x512.png** (512x512 px)

Please place these files in the `public/` folder.
