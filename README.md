# Nuclide Shell Diagram (Pure Static HTML/CSS/JS)

A frontend-only static web app that plots a schematic spherical shell-model single-particle level diagram for both **protons** and **neutrons**.

## What this project uses

- Plain `index.html`
- Plain JavaScript files in `src/`
- Plain CSS in `src/styles.css`
- No npm, no bundler, no framework runtime

## Features

- Nuclide input parsing: `15O`, `O-15`, `15 O`
- Computes `A`, `Z`, and `N = A - Z`
- Uses local periodic table data (`src/data/periodicTable.js`)
- Uses fixed shell-model orbital ordering (`src/data/orbitals.js`)
- Two boxed SVG columns: **Protons** and **Neutrons**
- Direction toggle by radio buttons:
  - Bottom → Up
  - Top → Down
- If Bottom → Up is selected, panel titles are drawn at the bottom
- Magic numbers: `2, 8, 20, 28, 50, 82, 126`
- Orbitals draw filled line segments plus small nucleon balls above each line
- Occupancy overlays (empty/full/partial) and unpaired marker for odd partial occupancy
- Shows only occupied levels plus one extra level above
- Configuration strings shown as styled chips with superscript occupancy

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server.

Example with Python (optional):

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## GitHub Pages

This is a static site with relative paths, so it works on GitHub Pages repo subpaths without build steps.

## Limitations

- Schematic sequential filling model only
- Not a full spectroscopy or shell-evolution solver
