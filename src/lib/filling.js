import { orbitals } from '../data/orbitals.js';

export function fillOrbitals(count) {
  let remaining = count;
  const occupancy = orbitals.map((orbital) => {
    const occ = Math.min(orbital.capacity, Math.max(remaining, 0));
    remaining -= occ;

    return {
      ...orbital,
      occupancy: occ,
      fraction: occ / orbital.capacity,
      state: occ === 0 ? 'empty' : occ === orbital.capacity ? 'full' : 'partial'
    };
  });

  const topPartialIndex = occupancy.findLastIndex((orbital) => orbital.state === 'partial');
  return {
    occupancy,
    topPartialIndex,
    hasUnpaired: topPartialIndex !== -1 && occupancy[topPartialIndex].occupancy % 2 === 1
  };
}

export function configurationString(occupancy) {
  return occupancy
    .filter((orbital) => orbital.occupancy > 0)
    .map((orbital) => `(${orbital.label})^${orbital.occupancy}`)
    .join(' ');
}
