import { parseNuclideInput } from './lib/nuclide.js';
import { configurationString, fillOrbitals } from './lib/filling.js';
import { renderShellDiagram } from './components/ShellDiagram.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="min-h-screen p-4 md:p-8">
    <section class="max-w-6xl mx-auto space-y-4">
      <h1 class="text-2xl font-bold">Spherical Shell-Model Level Diagram</h1>
      <p class="text-sm text-slate-600">Schematic single-particle levels for protons and neutrons up to the 126 closure.</p>

      <div class="flex flex-col md:flex-row gap-3 md:items-end bg-white p-4 rounded-xl border border-slate-200">
        <div class="flex-1">
          <label for="nuclideInput" class="block text-sm font-medium mb-1">Nuclide</label>
          <input id="nuclideInput" class="w-full border rounded-lg p-2" placeholder="15O, O-15, or 15 O" />
        </div>
        <div>
          <label for="examples" class="block text-sm font-medium mb-1">Examples</label>
          <select id="examples" class="border rounded-lg p-2">
            <option value="">Choose...</option>
            <option>15O</option>
            <option>16O</option>
            <option>40Ca</option>
            <option>56Ni</option>
            <option>132Sn</option>
          </select>
        </div>
        <button id="plotButton" class="bg-slate-900 text-white px-4 py-2 rounded-lg">Plot</button>
      </div>

      <p id="error" class="text-red-700 text-sm"></p>
      <div id="summary" class="bg-white rounded-xl border border-slate-200 p-4 text-sm hidden"></div>
      <div id="diagram" class="overflow-x-auto"></div>
    </section>
  </main>
`;

const input = document.querySelector('#nuclideInput');
const plotButton = document.querySelector('#plotButton');
const diagram = document.querySelector('#diagram');
const errorEl = document.querySelector('#error');
const summary = document.querySelector('#summary');
const examples = document.querySelector('#examples');

let periodicTable = null;

examples.addEventListener('change', () => {
  if (examples.value) input.value = examples.value;
});

async function loadPeriodicTable() {
  const response = await fetch('./src/data/periodicTable.json');
  if (!response.ok) {
    throw new Error('Could not load periodic table data.');
  }
  periodicTable = await response.json();
}

function plot() {
  try {
    if (!periodicTable) {
      throw new Error('Data is still loading. Please try again.');
    }
    errorEl.textContent = '';

    const parsed = parseNuclideInput(input.value, periodicTable);
    const protonFill = fillOrbitals(parsed.Z);
    const neutronFill = fillOrbitals(parsed.N);

    summary.classList.remove('hidden');
    summary.innerHTML = `
      <p><strong>${parsed.symbol}-${parsed.A}</strong> &nbsp; A=${parsed.A}, Z=${parsed.Z}, N=${parsed.N}</p>
      <p class="mt-2"><strong>Protons:</strong> ${configurationString(protonFill.occupancy) || '—'}</p>
      <p><strong>Neutrons:</strong> ${configurationString(neutronFill.occupancy) || '—'}</p>
    `;

    renderShellDiagram(diagram, protonFill.occupancy, neutronFill.occupancy);
  } catch (error) {
    summary.classList.add('hidden');
    diagram.innerHTML = '';
    errorEl.textContent = error.message;
  }
}

plotButton.addEventListener('click', plot);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') plot();
});

input.value = '15O';
loadPeriodicTable().then(plot).catch((error) => {
  errorEl.textContent = error.message;
});
