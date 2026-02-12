# Nuclide Shell Diagram (Frontend-only)

Static single-page web app to plot schematic spherical shell-model single-particle level diagrams for both **protons** and **neutrons**. The user enters a nuclide (e.g., `15O`) and the app computes `A`, `Z`, `N`, orbital occupancies, and configuration strings.

## Stack

- JavaScript (frontend-only static site)
- TailwindCSS (CDN for static hosting simplicity)
- Plain SVG rendering (clean and maintainable)
- Node built-in test runner for unit tests

## Features

- Nuclide input parsing: `15O`, `O-15`, `15 O`
- Internal periodic table map (`src/data/periodicTable.json`) for symbol → Z
- Schematic orbital ordering up to the 126 closure (`src/data/orbitals.js`)
- Two-column diagram (Protons / Neutrons)
- Magic numbers shown: 2, 8, 20, 28, 50, 82, 126
- Occupancy overlays for empty/full/partial levels and an unpaired-nucleon marker on top partial orbitals
- Proton and neutron configuration strings

## Local development

```bash
npm run dev
```

Then open: `http://localhost:4173`

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```

This project is static and does not require transpilation or bundling, so build is a no-op check.

## GitHub Pages deployment

The app uses **relative paths** (e.g., `./src/main.js`, `./src/data/periodicTable.json`) so it works when hosted from a repository subpath on GitHub Pages.

Typical workflow:

1. Push repository contents to GitHub.
2. In GitHub repo settings, enable Pages and select deployment from your default branch root (or `/docs` if you relocate files).
3. Visit your GitHub Pages URL.

## Limitations

- This is a schematic sequential filling model.
- It does not include residual interactions, deformation, pairing corrections, or detailed spectroscopy.
- Orbital ordering is fixed for educational diagramming and not intended as a high-precision shell-evolution calculator.
