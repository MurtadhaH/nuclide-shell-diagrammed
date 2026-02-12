(function () {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <main class="page">
      <section class="container">
        <h1>Spherical Shell-Model Level Diagram</h1>
        <p class="subtitle">Schematic single-particle levels for protons and neutrons up to the 126 closure.</p>

        <div class="controls">
          <div class="control-item grow">
            <label for="nuclideInput">Nuclide</label>
            <input id="nuclideInput" placeholder="15O, O-15, or 15 O" />
          </div>

          <div class="control-item">
            <label for="examples">Examples</label>
            <select id="examples">
              <option value="">Choose...</option>
              <option>15O</option>
              <option>16O</option>
              <option>40Ca</option>
              <option>56Ni</option>
              <option>132Sn</option>
            </select>
          </div>

          <button id="plotButton">Plot</button>
        </div>

        <p id="error" class="error"></p>
        <div id="summary" class="summary hidden"></div>
        <div id="diagram" class="diagram-wrap"></div>
      </section>
    </main>
  `;

  const input = document.querySelector('#nuclideInput');
  const plotButton = document.querySelector('#plotButton');
  const diagram = document.querySelector('#diagram');
  const errorEl = document.querySelector('#error');
  const summary = document.querySelector('#summary');
  const examples = document.querySelector('#examples');

  const levelHeight = 28;

  examples.addEventListener('change', function () {
    if (examples.value) input.value = examples.value;
  });

  function magicBoundaryY(magicNumber) {
    let cumulative = 0;
    for (const orbital of window.orbitals) {
      cumulative += orbital.capacity;
      if (cumulative === magicNumber) return orbital.orderIndex * levelHeight;
    }
    return null;
  }

  function makeSvgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  function addText(svg, x, y, text, attrs) {
    const t = makeSvgEl('text');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.textContent = text;
    Object.entries(attrs || {}).forEach(([k, v]) => t.setAttribute(k, v));
    svg.appendChild(t);
  }

  function addLine(svg, x1, y1, x2, y2, attrs) {
    const l = makeSvgEl('line');
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    Object.entries(attrs || {}).forEach(([k, v]) => l.setAttribute(k, v));
    svg.appendChild(l);
  }

  function addCircle(svg, cx, cy, r, attrs) {
    const c = makeSvgEl('circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    Object.entries(attrs || {}).forEach(([k, v]) => c.setAttribute(k, v));
    svg.appendChild(c);
  }

  function renderPanel(svg, data, x0, title) {
    const panelWidth = 360;
    const lineStart = x0 + 20;
    const lineEnd = x0 + 230;

    addText(svg, x0 + panelWidth / 2, 20, title, {
      'text-anchor': 'middle',
      'font-size': '16',
      'font-weight': '700'
    });

    for (const orbital of data) {
      const y = 30 + orbital.orderIndex * levelHeight;
      addLine(svg, lineStart, y, lineEnd, y, { stroke: '#334155', 'stroke-width': '2' });

      if (orbital.fraction > 0) {
        const color = orbital.state === 'full' ? '#0f766e' : '#ea580c';
        const filledX = lineStart + (lineEnd - lineStart) * orbital.fraction;
        addLine(svg, lineStart, y, filledX, y, {
          stroke: color,
          'stroke-width': '6',
          'stroke-linecap': 'round'
        });
      }

      addText(svg, lineEnd + 10, y + 4, orbital.label, { 'font-size': '12' });

      if (orbital.state === 'partial' && orbital.occupancy % 2 === 1) {
        const unpairedX = lineStart + (lineEnd - lineStart) * orbital.fraction;
        addCircle(svg, unpairedX, y - 8, 4, { fill: '#b91c1c' });
      }
    }

    for (const magic of window.magicNumbers) {
      const y = magicBoundaryY(magic);
      if (!y) continue;
      const yPos = y + 30;

      addText(svg, x0, yPos + 4, String(magic), { 'font-size': '11', fill: '#475569' });
      addLine(svg, x0 + 14, yPos, lineStart - 4, yPos, {
        stroke: '#cbd5e1',
        'stroke-dasharray': '2,2'
      });
    }
  }

  function renderShellDiagram(container, protonData, neutronData) {
    const width = 760;
    const height = 30 + (window.orbitals.length + 1) * levelHeight;

    container.innerHTML = '';
    const svg = makeSvgEl('svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'shell-svg');

    renderPanel(svg, protonData, 18, 'Protons');
    renderPanel(svg, neutronData, 390, 'Neutrons');

    container.appendChild(svg);
  }

  function plot() {
    try {
      errorEl.textContent = '';
      const parsed = window.parseNuclideInput(input.value, window.periodicTable);
      const protonFill = window.fillOrbitals(parsed.Z);
      const neutronFill = window.fillOrbitals(parsed.N);

      summary.classList.remove('hidden');
      summary.innerHTML = `
        <p><strong>${parsed.symbol}-${parsed.A}</strong> &nbsp; A=${parsed.A}, Z=${parsed.Z}, N=${parsed.N}</p>
        <p class="spaced"><strong>Protons:</strong> ${window.configurationString(protonFill.occupancy) || '—'}</p>
        <p><strong>Neutrons:</strong> ${window.configurationString(neutronFill.occupancy) || '—'}</p>
      `;

      renderShellDiagram(diagram, protonFill.occupancy, neutronFill.occupancy);
    } catch (error) {
      summary.classList.add('hidden');
      diagram.innerHTML = '';
      errorEl.textContent = error.message;
    }
  }

  plotButton.addEventListener('click', plot);
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') plot();
  });

  input.value = '15O';
  plot();
})();
