import { magicNumbers, orbitals } from '../data/orbitals.js';

const levelHeight = 28;

function magicBoundaryY(magicNumber) {
  let cumulative = 0;
  for (const orbital of orbitals) {
    cumulative += orbital.capacity;
    if (cumulative === magicNumber) {
      return orbital.orderIndex * levelHeight;
    }
  }
  return null;
}

function line(x1, y1, x2, y2, attrs = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs} />`;
}

function text(x, y, value, attrs = '') {
  return `<text x="${x}" y="${y}" ${attrs}>${value}</text>`;
}

function circle(cx, cy, r, attrs = '') {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs} />`;
}

function panelSvg(data, x0, title) {
  const panelWidth = 360;
  const lineStart = x0 + 20;
  const lineEnd = x0 + 230;
  const parts = [];

  parts.push(text(x0 + panelWidth / 2, 20, title, 'text-anchor="middle" font-size="16" font-weight="700"'));

  data.forEach((orbital) => {
    const y = 30 + orbital.orderIndex * levelHeight;
    parts.push(line(lineStart, y, lineEnd, y, 'stroke="#334155" stroke-width="2"'));

    if (orbital.fraction > 0) {
      const color = orbital.state === 'full' ? '#0f766e' : '#ea580c';
      const filledX = lineStart + (lineEnd - lineStart) * orbital.fraction;
      parts.push(line(lineStart, y, filledX, y, `stroke="${color}" stroke-width="6" stroke-linecap="round"`));
    }

    parts.push(text(lineEnd + 10, y + 4, orbital.label, 'font-size="12"'));

    if (orbital.state === 'partial' && orbital.occupancy % 2 === 1) {
      const unpairedX = lineStart + (lineEnd - lineStart) * orbital.fraction;
      parts.push(circle(unpairedX, y - 8, 4, 'fill="#b91c1c"'));
    }
  });

  magicNumbers.forEach((magic) => {
    const y = magicBoundaryY(magic);
    if (!y) return;
    const yPos = y + 30;
    parts.push(text(x0, yPos + 4, magic, 'font-size="11" fill="#475569"'));
    parts.push(line(x0 + 14, yPos, lineStart - 4, yPos, 'stroke="#cbd5e1" stroke-dasharray="2,2"'));
  });

  return parts.join('');
}

export function renderShellDiagram(container, protonData, neutronData) {
  const width = 760;
  const height = 30 + (orbitals.length + 1) * levelHeight;

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto bg-white rounded-xl border border-slate-200">
      ${panelSvg(protonData, 18, 'Protons')}
      ${panelSvg(neutronData, 390, 'Neutrons')}
    </svg>
  `;
}
