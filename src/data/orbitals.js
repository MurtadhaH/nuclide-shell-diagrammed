const rawOrbitals = [
  { id: '1s1/2', label: '1s1/2', n: 1, l: 0, j: 0.5, orderIndex: 1 },
  { id: '1p3/2', label: '1p3/2', n: 1, l: 1, j: 1.5, orderIndex: 2 },
  { id: '1p1/2', label: '1p1/2', n: 1, l: 1, j: 0.5, orderIndex: 3 },
  { id: '1d5/2', label: '1d5/2', n: 1, l: 2, j: 2.5, orderIndex: 4 },
  { id: '2s1/2', label: '2s1/2', n: 2, l: 0, j: 0.5, orderIndex: 5 },
  { id: '1d3/2', label: '1d3/2', n: 1, l: 2, j: 1.5, orderIndex: 6 },
  { id: '1f7/2', label: '1f7/2', n: 1, l: 3, j: 3.5, orderIndex: 7 },
  { id: '2p3/2', label: '2p3/2', n: 2, l: 1, j: 1.5, orderIndex: 8 },
  { id: '1f5/2', label: '1f5/2', n: 1, l: 3, j: 2.5, orderIndex: 9 },
  { id: '2p1/2', label: '2p1/2', n: 2, l: 1, j: 0.5, orderIndex: 10 },
  { id: '1g9/2', label: '1g9/2', n: 1, l: 4, j: 4.5, orderIndex: 11 },
  { id: '1g7/2', label: '1g7/2', n: 1, l: 4, j: 3.5, orderIndex: 12 },
  { id: '2d5/2', label: '2d5/2', n: 2, l: 2, j: 2.5, orderIndex: 13 },
  { id: '3s1/2', label: '3s1/2', n: 3, l: 0, j: 0.5, orderIndex: 14 },
  { id: '2d3/2', label: '2d3/2', n: 2, l: 2, j: 1.5, orderIndex: 15 },
  { id: '1h11/2', label: '1h11/2', n: 1, l: 5, j: 5.5, orderIndex: 16 },
  { id: '1h9/2', label: '1h9/2', n: 1, l: 5, j: 4.5, orderIndex: 17 },
  { id: '2f7/2', label: '2f7/2', n: 2, l: 3, j: 3.5, orderIndex: 18 },
  { id: '3p3/2', label: '3p3/2', n: 3, l: 1, j: 1.5, orderIndex: 19 },
  { id: '2f5/2', label: '2f5/2', n: 2, l: 3, j: 2.5, orderIndex: 20 },
  { id: '3p1/2', label: '3p1/2', n: 3, l: 1, j: 0.5, orderIndex: 21 },
  { id: '1i13/2', label: '1i13/2', n: 1, l: 6, j: 6.5, orderIndex: 22 }
];

export const orbitals = rawOrbitals.map((orbital) => ({
  ...orbital,
  capacity: 2 * orbital.j + 1
}));

export const magicNumbers = [2, 8, 20, 28, 50, 82, 126];
