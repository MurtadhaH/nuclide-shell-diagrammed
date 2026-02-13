(function () {
  function fillOrbitals(count) {
    let remaining = count;

    const occupancy = window.orbitals.map((orbital) => {
      const occ = Math.min(orbital.capacity, Math.max(remaining, 0));
      remaining -= occ;

      return {
        ...orbital,
        occupancy: occ,
        fraction: occ / orbital.capacity,
        state: occ === 0 ? 'empty' : occ === orbital.capacity ? 'full' : 'partial'
      };
    });

    let topPartialIndex = -1;
    for (let i = occupancy.length - 1; i >= 0; i -= 1) {
      if (occupancy[i].state === 'partial') {
        topPartialIndex = i;
        break;
      }
    }

    return {
      occupancy,
      topPartialIndex,
      hasUnpaired: topPartialIndex !== -1 && occupancy[topPartialIndex].occupancy % 2 === 1
    };
  }

  function configurationString(occupancy) {
    return occupancy
      .filter((orbital) => orbital.occupancy > 0)
      .map((orbital) => `(${orbital.label})^${orbital.occupancy}`)
      .join(' ');
  }

  window.fillOrbitals = fillOrbitals;
  window.configurationString = configurationString;
})();
