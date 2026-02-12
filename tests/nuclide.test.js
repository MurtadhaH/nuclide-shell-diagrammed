import test from 'node:test';
import assert from 'node:assert/strict';
import periodicTable from '../src/data/periodicTable.json' with { type: 'json' };
import { parseNuclideInput } from '../src/lib/nuclide.js';

test('parses mass-first compact format', () => {
  assert.deepEqual(parseNuclideInput('15O', periodicTable), {
    input: '15O',
    A: 15,
    Z: 8,
    N: 7,
    symbol: 'O'
  });
});

test('parses symbol-first hyphen format', () => {
  assert.equal(parseNuclideInput('O-15', periodicTable).N, 7);
});

test('parses mass-first with space', () => {
  assert.equal(parseNuclideInput('15 O', periodicTable).Z, 8);
});

test('throws on invalid symbol', () => {
  assert.throws(() => parseNuclideInput('15Xx', periodicTable), /Unknown element symbol/);
});
