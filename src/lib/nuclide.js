export function normalizeSymbol(symbol) {
  if (!symbol) return '';
  return symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase();
}

export function parseNuclideInput(input, periodicTable) {
  const cleaned = input?.trim();
  if (!cleaned) {
    throw new Error('Please enter a nuclide like 15O, O-15, or 15 O.');
  }

  const compact = cleaned.replace(/\s+/g, '');
  const massFirst = compact.match(/^(\d+)([A-Za-z]{1,2})$/);
  const symbolFirst = compact.match(/^([A-Za-z]{1,2})-(\d+)$/);

  let symbol;
  let A;

  if (massFirst) {
    A = Number(massFirst[1]);
    symbol = normalizeSymbol(massFirst[2]);
  } else if (symbolFirst) {
    A = Number(symbolFirst[2]);
    symbol = normalizeSymbol(symbolFirst[1]);
  } else {
    throw new Error('Invalid format. Use 15O, O-15, or 15 O.');
  }

  const Z = periodicTable[symbol];
  if (!Z) {
    throw new Error(`Unknown element symbol "${symbol}".`);
  }

  const N = A - Z;
  if (N < 0) {
    throw new Error(`Mass number A=${A} is too small for ${symbol} (Z=${Z}).`);
  }

  return { input: cleaned, A, Z, N, symbol };
}
