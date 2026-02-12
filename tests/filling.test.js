import test from 'node:test';
import assert from 'node:assert/strict';
import { configurationString, fillOrbitals } from '../src/lib/filling.js';

test('fills oxygen-15 proton levels to Z=8', () => {
  const proton = fillOrbitals(8);
  assert.deepEqual(
    proton.occupancy.slice(0, 3).map((orbital) => orbital.occupancy),
    [2, 4, 2]
  );
  assert.equal(proton.topPartialIndex, -1);
});

test('marks unpaired neutron for N=7', () => {
  const neutron = fillOrbitals(7);
  assert.equal(neutron.topPartialIndex, 2);
  assert.equal(neutron.hasUnpaired, true);
});

test('builds a configuration string', () => {
  const config = configurationString(fillOrbitals(7).occupancy);
  assert.match(config, /\(1s1\/2\)\^2/);
  assert.match(config, /\(1p1\/2\)\^1/);
});
