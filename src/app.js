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

          <fieldset class="control-item direction-group">
            <legend>Direction</legend>
            <label><input type="radio" name="direction" value="down" checked /> Bottom → Up</label>
            <label><input type="radio" name="direction" value="up" /> Top → Down</label>
          </fieldset>

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
  const directionInputs = document.querySelectorAll('input[name="direction"]');

  const levelHeight = 28;
  const topPad = 48;

  function selectedDirection() {
    const checked = document.querySelector('input[name="direction"]:checked');
    return checked ? checked.value : 'down';
  }

  examples.addEventListener('change', function () {
    if (examples.value) input.value = examples.value;
  });

  directionInputs.forEach(function (el) {
    el.addEventListener('change', plot);
  });

  function yForOrder(orderIndex, maxVisibleOrder, direction) {
    if (direction === 'down') {
      return topPad + (maxVisibleOrder - orderIndex + 1) * levelHeight;
    }
    return topPad + orderIndex * levelHeight;
  }

  function makeSvgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  function addText(svg, x, y, text, attrs) {
    const t = makeSvgEl('text');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.textContent = text;
    Object.entries(attrs || {}).forEach(function ([k, v]) {
      t.setAttribute(k, v);
    });
    svg.appendChild(t);
  }

  function addLine(svg, x1, y1, x2, y2, attrs) {
    const l = makeSvgEl('line');
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    Object.entries(attrs || {}).forEach(function ([k, v]) {
      l.setAttribute(k, v);
    });
    svg.appendChild(l);
  }

  function addCircle(svg, cx, cy, r, attrs) {
    const c = makeSvgEl('circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    Object.entries(attrs || {}).forEach(function ([k, v]) {
      c.setAttribute(k, v);
    });
    svg.appendChild(c);
  }

  function addRect(svg, x, y, width, height, attrs) {
    const r = makeSvgEl('rect');
    r.setAttribute('x', x);
    r.setAttribute('y', y);
    r.setAttribute('width', width);
    r.setAttribute('height', height);
    Object.entries(attrs || {}).forEach(function ([k, v]) {
      r.setAttribute(k, v);
    });
    svg.appendChild(r);
  }

  function highestOccupiedOrder(data) {
    let maxOrder = 0;
    for (const orbital of data) {
      if (orbital.occupancy > 0) maxOrder = orbital.orderIndex;
    }
    return maxOrder;
  }

  function visibleOrbitals(data, maxVisibleOrder) {
    return data.filter(function (orbital) {
      return orbital.orderIndex <= maxVisibleOrder;
    });
  }

  function drawNucleonBalls(svg, orbital, lineStart, lineEnd, y) {
    if (orbital.occupancy <= 0) return;

    const slots = orbital.capacity;
    const spacing = (lineEnd - lineStart) / (slots + 1);
    for (let i = 0; i < orbital.occupancy; i += 1) {
      const cx = lineStart + spacing * (i + 1);
      addCircle(svg, cx, y - 9, 2.8, {
        fill: orbital.state === 'full' ? '#0f766e' : '#ea580c',
        stroke: '#ffffff',
        'stroke-width': '0.5'
      });
    }
  }

  function renderPanel(svg, data, x0, title, direction, maxVisibleOrder, totalHeight) {
    const panelWidth = 352;
    const panelX = x0 + 2;
    const lineStart = panelX + 26;
    const lineEnd = panelX + 244;

    addRect(svg, panelX, 10, panelWidth, totalHeight - 20, {
      rx: '12',
      fill: '#f8fafc',
      stroke: '#cbd5e1'
    });

    const titleY = direction === 'down' ? totalHeight - 18 : 32;
    addText(svg, panelX + panelWidth / 2, titleY, title, {
      'text-anchor': 'middle',
      'font-size': '16',
      'font-weight': '700',
      fill: '#0f172a'
    });

    const visible = visibleOrbitals(data, maxVisibleOrder);

    for (const orbital of visible) {
      const y = yForOrder(orbital.orderIndex, maxVisibleOrder, direction);
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

      drawNucleonBalls(svg, orbital, lineStart, lineEnd, y);

      addText(svg, lineEnd + 12, y - 6, orbital.label, {
        'font-size': '12',
        fill: '#0f172a',
        'font-weight': '600'
      });
    }

    for (const magic of window.magicNumbers) {
      let cumulative = 0;
      let boundaryOrder = null;
      for (const orbital of window.orbitals) {
        cumulative += orbital.capacity;
        if (cumulative === magic) {
          boundaryOrder = orbital.orderIndex;
          break;
        }
      }
      if (!boundaryOrder || boundaryOrder > maxVisibleOrder) continue;

      const yPos = yForOrder(boundaryOrder, maxVisibleOrder, direction);
      addText(svg, panelX + 2, yPos - 6, String(magic), {
        'font-size': '11',
        fill: '#475569',
        'font-weight': '600'
      });
      addLine(svg, panelX + 20, yPos, lineStart - 5, yPos, {
        stroke: '#cbd5e1',
        'stroke-dasharray': '2,2'
      });
    }
  }

  function renderShellDiagram(container, protonData, neutronData, direction) {
    const protonMax = highestOccupiedOrder(protonData);
    const neutronMax = highestOccupiedOrder(neutronData);
    const maxVisibleOrder = Math.max(Math.max(protonMax, neutronMax) + 1, 1);

    const width = 760;
    const height = topPad + (maxVisibleOrder + 3) * levelHeight;

    container.innerHTML = '';
    const svg = makeSvgEl('svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'shell-svg');

    renderPanel(svg, protonData, 16, 'Protons', direction, maxVisibleOrder, height);
    renderPanel(svg, neutronData, 390, 'Neutrons', direction, maxVisibleOrder, height);

    container.appendChild(svg);
  }

  function configHtml(occupancy) {
    const filled = occupancy.filter(function (orbital) {
      return orbital.occupancy > 0;
    });

    if (!filled.length) return '<span class="cfg-empty">—</span>';

    return filled
      .map(function (orbital) {
        return (
          '<span class="cfg-chip">' +
          '<span class="cfg-orb">(' +
          orbital.label +
          ')</span>' +
          '<span class="cfg-occ">n=' +
          orbital.occupancy +
          '</span>' +
          '</span>'
        );
      })
      .join('');
  }

  function plot() {
    try {
      errorEl.textContent = '';
      const parsed = window.parseNuclideInput(input.value, window.periodicTable);
      const protonFill = window.fillOrbitals(parsed.Z);
      const neutronFill = window.fillOrbitals(parsed.N);
      const direction = selectedDirection();

      summary.classList.remove('hidden');
      summary.innerHTML = `
        <p><strong>${parsed.symbol}-${parsed.A}</strong> &nbsp; A=${parsed.A}, Z=${parsed.Z}, N=${parsed.N}</p>

        <div class="cfg-block spaced">
          <div class="cfg-label">Protons</div>
          <div class="cfg-row">${configHtml(protonFill.occupancy)}</div>
        </div>

        <div class="cfg-block">
          <div class="cfg-label">Neutrons</div>
          <div class="cfg-row">${configHtml(neutronFill.occupancy)}</div>
        </div>
      `;

      renderShellDiagram(diagram, protonFill.occupancy, neutronFill.occupancy, direction);
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
