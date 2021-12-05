import tachyonPrismUrl from 'app/images/Tachyon_Prism.png'
import largeTachyonPrismUrl from 'app/images/Large_Tachyon_Prism.png'
import powerfulTachyonPrismUrl from 'app/images/Powerful_Tachyon_Prism.png'
import epicTachyonPrismUrl from 'app/images/Epic_Tachyon_Prism.png'
import legendaryTachyonPrismUrl from 'app/images/Legendary_Tachyon_Prism.png'
import supremeTachyonPrismUrl from 'app/images/Supreme_Tachyon_Prism.png'
import boostBeacon from 'app/images/Boost_Beacon.png'
import epicBoostBeacon from 'app/images/Epic_Boost_Beacon.png'
import largeBoostBeacon from 'app/images/Large_Boost_Beacon.png'
import legendaryBoostBeacon from 'app/images/Legendary_Boost_Beacon.png'
import 'lodash.multicombinations'
import 'lodash.product'
import { max, min, multicombinations, product, sum, sumBy } from 'lodash'

// Tachyon Prisms -- Increase internal hatchery rate
export const tachyonPrisms = [
  {
    name: 'Tachyon Prism',
    multiplier: 10,
    time: 30,
    cost: 200,
    tokens: 1,
    imageUrl: tachyonPrismUrl,
    letter: 'A',
  },
  {
    name: 'Large Tachyon Prism',
    multiplier: 10,
    time: 240,
    cost: 500,
    tokens: 3,
    imageUrl: largeTachyonPrismUrl,
    letter: 'B',
  },
  {
    name: 'Powerful Tachyon Prism',
    multiplier: 100,
    time: 20,
    cost: 1000,
    tokens: 3,
    imageUrl: powerfulTachyonPrismUrl,
    letter: 'C',
  },
  {
    name: 'Epic Tachyon Prism',
    multiplier: 100,
    time: 120,
    cost: 5_000,
    tokens: 4,
    imageUrl: epicTachyonPrismUrl,
    letter: 'D',
  },
  {
    name: 'Legendary Tachyon Prism',
    multiplier: 1_000,
    time: 10,
    cost: 12_000,
    tokens: 6,
    imageUrl: legendaryTachyonPrismUrl,
    letter: 'E',
  },
  {
    name: 'Supreme Tachyon Prism',
    multiplier: 1_000,
    time: 60,
    cost: 30_000,
    tokens: 12,
    imageUrl: supremeTachyonPrismUrl,
    letter: 'F',
  },
]

// Boost Boosts -- Increase boost effectiveness
export const boostBeacons = [
  {
    name: 'Boost Beacon',
    multiplier: 2,
    time: 30,
    cost: 1_000,
    tokens: 5,
    imageUrl: boostBeacon,
    letter: 'W',
  },
  {
    name: 'Epic Boost Beacon',
    multiplier: 10,
    time: 10,
    cost: 8_000,
    tokens: 8,
    imageUrl: epicBoostBeacon,
    letter: 'X',
  },
  {
    name: 'Large Boost Beacon',
    multiplier: 5,
    time: 60,
    cost: 15_000,
    tokens: 10,
    imageUrl: largeBoostBeacon,
    letter: 'Y',
  },
  {
    name: 'Legendary Boost Beacon',
    multiplier: 50,
    time: 10,
    cost: 50_000,
    tokens: 15,
    imageUrl: legendaryBoostBeacon,
    letter: 'Z',
  },
]

const boosts = [...tachyonPrisms, ...boostBeacons]
export default boosts

const beaconCombinations = [
  multicombinations(boostBeacons, 1),
  multicombinations(boostBeacons, 2),
  multicombinations(boostBeacons, 3),
  multicombinations(boostBeacons, 4),
]

// We can take anywhere from 1 to 5 Tachyon Prisms
export const boostCombinations = [
  // 1 Prism
  ...multicombinations(tachyonPrisms, 1).map((p) => [p, []]),
  ...product(multicombinations(tachyonPrisms, 1), [
    ...beaconCombinations[0],
    ...beaconCombinations[1],
    ...beaconCombinations[2],
    ...beaconCombinations[3],
  ]),

  // 2 Prisms
  ...multicombinations(tachyonPrisms, 2).map((p) => [p, []]),
  ...product(multicombinations(tachyonPrisms, 2), [
    ...beaconCombinations[0],
    ...beaconCombinations[1],
    ...beaconCombinations[2],
  ]),

  // 3 Prisms
  ...multicombinations(tachyonPrisms, 3).map((p) => [p, []]),
  ...product(multicombinations(tachyonPrisms, 3), [
    ...beaconCombinations[0],
    ...beaconCombinations[1],
  ]),
  // 4 Prisms
  ...multicombinations(tachyonPrisms, 4).map((p) => [p, []]),
  ...product(multicombinations(tachyonPrisms, 4), beaconCombinations[0]),

  // 5 Prisms
  ...multicombinations(tachyonPrisms, 5).map((p) => [p, []]),
].map(([prisms, beacons], i) => {
  const comboTime = max([...prisms, ...beacons].map((i) => i.time))
  // if (
  //   prisms[0] === tachyonPrisms[0] &&
  //   prisms[1] === tachyonPrisms[1] &&
  //   beacons.length === 0
  // ) {
  //   debugger
  // }
  return {
    key: i,
    prisms,
    beacons,
    cost: sumBy(prisms, 'cost') + sumBy(beacons, 'cost'),
    tokens: sumBy(prisms, 'tokens') + sumBy(beacons, 'tokens'),
    time: comboTime,
    boostedComboTime({dilithiumStoneMultiplier = 1} = {}) {
      return comboTime * dilithiumStoneMultiplier
    },
    name: [
      prisms.map((p) => p.letter).join(''),
      beacons.map((b) => b.letter).join(''),
    ].join(''),
    // FIXME: This doesn't work unless the boost beacons line up time-wise exactly in full
    // averageMultiplier: sum(
    //   prisms.map((p) => p.multiplier / (comboTime / p.time))
    // ),
    premium: prisms.length + beacons.length > 2,
    chickensForHatchRate(hatchRate, { monocleBoostBonus = 0, dilithiumStoneMultiplier = 1} = {}) {
      function prismMultiplierWithArtifactBoost(prism) {
        return prism.multiplier * (1 + monocleBoostBonus / 100)
      }

      // Hatch multiplier refers to the product of time and the population multiplier. 
      // The total chicken hatched will therefore simply be hatch multiplier * hatch rate.

      const hatchMultiplierWithBeacon = sum(
        product(prisms, beacons).map(
          ([prism, beacon]) => prismMultiplierWithArtifactBoost(prism) * beacon.multiplier * min([beacon.time, prism.time]) * dilithiumStoneMultiplier
        ))

      let hatchMultiplierWithoutBeacon;
      if (beacons.length === 0) {
        // If there are no beacons used, simply sum up the effect of each prism over its duration.
        hatchMultiplierWithoutBeacon = sum(prisms.map((p) => prismMultiplierWithArtifactBoost(p) * p.time * dilithiumStoneMultiplier))
      } else {
        // Find the duration for each prism that is not boosted by any boost beacons. 
        hatchMultiplierWithoutBeacon = sum(
          prisms.map((p) => {
            const maxBoostBeaconTime = max(beacons.map((i) => i.time))
            return prismMultiplierWithArtifactBoost(p) * max([0, (p.time - maxBoostBeaconTime) * dilithiumStoneMultiplier])
          }))
      }

      return (hatchMultiplierWithBeacon + hatchMultiplierWithoutBeacon) * hatchRate
    },
  }
})

// B =  10x for 240min
// C = 100x for  20min
// W =   2x for  30min

// B, W multiplier = 11.25 (10 + [10/8])
// C, W multiplier = 200

// const combinations = [
//   ...multicombinations(tachyonPrisms, 1),
//   ...multicombinations(boosts, 2),
//   ...multicombinations(boosts, 3),
//   ...multicombinations(boosts, 4),
//   ...multicombinations(boosts, 5),
// ]

// console.log(combinations.length)
