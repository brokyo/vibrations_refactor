var formantPresets = [
  {
    name: `a`,
    type: `bass`,
    filters: [
      {
        frequency: 600,
        volume: 0,
        bw: 60
      },
      {
        frequency: 1040,
        volume: -7,
        bw: 70
      },
      {
        frequency: 2250,
        volume: -7,
        bw: 110
      },
      {
        frequency: 2450,
        volume: -9,
        bw: 120
      },
      {
        frequency: 2750,
        volume: -20,
        bw: 130
      }
    ]
  },
  {
    name: `e`,
    type: `bass`,
    filters: [
      {
        frequency: 400,
        volume: 0,
        bw: 40
      },
      {
        frequency: 1620,
        volume: -12,
        bw: 80
      },
      {
        frequency: 2400,
        volume: -9,
        bw: 100
      },
      {
        frequency: 2800,
        volume: -12,
        bw: 120
      },
      {
        frequency: 3100,
        volume: -18,
        bw: 120
      }
    ]
  },
  {
    name: `i`,
    type: `bass`,
    filters: [
      {
        frequency: 250,
        volume: 0,
        bw: 60
      },
      {
        frequency: 1750,
        volume: -30,
        bw: 90
      },
      {
        frequency: 2600,
        volume: -16,
        bw: 100
      },
      {
        frequency: 3050,
        volume: -22,
        bw: 120
      },
      {
        frequency: 3340,
        volume: -28,
        bw: 120
      }
    ]
  },
  {
    name: `o`,
    type: `bass`,
    filters: [
      {
        frequency: 400,
        volume: 0,
        bw: 40
      },
      {
        frequency: 750,
        volume: -11,
        bw: 80
      },
      {
        frequency: 2400,
        volume: -21,
        bw: 100
      },
      {
        frequency: 2600,
        volume: -20,
        bw: 120
      },
      {
        frequency: 2900,
        volume: -40,
        bw: 120
      }
    ]
  },
  {
    name: `u`,
    type: `bass`,
    filters: [
      {
        frequency: 350,
        volume: 0,
        bw: 40
      },
      {
        frequency: 600,
        volume: -20,
        bw: 80
      },
      {
        frequency: 2400,
        volume: -32,
        bw: 100
      },
      {
        frequency: 2675,
        volume: -28,
        bw: 120
      },
      {
        frequency: 2950,
        volume: -36,
        bw: 120
      }
    ]
  }
];
async function getRandomFormant() {
  return formantPresets[Math.floor(Math.random() * formantPresets.length)];
}

export { getRandomFormant };
