import _ from 'lodash';
import printGrid from './printGrid';

const fields = ['.','=','|'];
const allowedTools = {
  '.' : new Set(['T', 'C']),
  '=' : new Set(['C', 'N']),
  '|' : new Set(['T', 'N']),
} as any;

function print(erosionMap: number[][]) {
  printGrid(_.map(erosionMap, (l) => _.map(l, ev => fields[ev % 3])));
}


function part1(depth: number, targetX: number, targetY: number) {
  const erosionValues = [] as number[][];
  for (const y of _.range(targetY+1)) {
    erosionValues[y] = [];
    for(const x of _.range(targetX+1)) {
      let geologicalValue = 0;
      if (y === targetY && x === targetX) {
        geologicalValue = 0;
      } else if (y === 0) {
        geologicalValue = x * 16807;
      } else if (x === 0) {
        geologicalValue = y * 48271;
      } else {
        geologicalValue = erosionValues[y][x-1] * erosionValues[y-1][x];
      }
      erosionValues[y][x] = (geologicalValue + depth) % 20183;
    }
  }
  return _.chain(erosionValues)
    .flatMap()
    .map(ev => ev % 3)
    .sum()
    .value();
}

type GearId = 'N' | 'C' | 'T';
type NextNode = {
  x: number,
  y: number,
  gear: GearId,
  distance: number,
}

type SearchNode = {
  id: string,
  x: number,
  y: number,
  gear: GearId,
  bestDistance: number,
  estimate: number,
}

function part2(depth: number, targetX: number, targetY: number) {
  const erosionValues = [] as number[][];
  //we could build a thing that auto-calculates erosion as we need it and caches the results.
  //or we could just make the default grid size huge and hope we don't go outside it :thinkingface:
  const maxY = targetY * 10;
  const maxX = targetX * 10;
  for (const y of _.range(maxY+1)) {
    erosionValues[y] = [];
    for(const x of _.range(maxX+1)) {
      let geologicalValue = 0;
      if (y === targetY && x === targetX) {
        geologicalValue = 0;
      } else if (y === 0) {
        geologicalValue = x * 16807;
      } else if (x === 0) {
        geologicalValue = y * 48271;
      } else {
        geologicalValue = erosionValues[y][x-1] * erosionValues[y-1][x];
      }
      erosionValues[y][x] = (geologicalValue + depth) % 20183;
    }
  }
  const erosionMap = _.map(erosionValues, (l) => _.map(l, ev => fields[ev % 3]));
  const targetNode = `${targetX},${targetY},T`;
  const nodeMap = {'0,0,T': {
    id: '0,0,T',
    x: 0,
    y: 0,
    gear: 'T',
    bestDistance: 0,
    estimate: Math.abs(targetX) + Math.abs(targetY),
  }} as _.Dictionary<SearchNode>;
  const seen = new Set();
  const toSee = new Set(['0,0,T']) as Set<string>;
  while(!seen.has(targetNode) && toSee.size > 0) {
    const lowestEstimate = _.chain([...toSee])
      .map(k => nodeMap[k])
      .minBy('estimate')
      .value() as SearchNode;
      toSee.delete(lowestEstimate.id)
      seen.add(lowestEstimate.id);
    const currentX = lowestEstimate.x;
    const currentY = lowestEstimate.y;
    const currentGear = lowestEstimate.gear;
    const currentDistance = lowestEstimate.bestDistance;
    const possibleNextNodes = [
      { x: currentX-1, y: currentY, gear: currentGear, distance: 1 },
      { x: currentX+1, y: currentY, gear: currentGear, distance: 1 },
      { x: currentX, y: currentY-1, gear: currentGear, distance: 1 },
      { x: currentX, y: currentY+1, gear: currentGear, distance: 1 },
      { x: currentX, y: currentY, gear: 'T', distance: 7 },
      { x: currentX, y: currentY, gear: 'C', distance: 7 },
      { x: currentX, y: currentY, gear: 'N', distance: 7 },
    ] as NextNode[];
    possibleNextNodes
      .filter(n =>
        n.x >= 0 &&
        n.x <= maxX &&
        n.y >= 0 &&
        n.y <= maxY &&
        !seen.has(`${n.x},${n.y},${n.gear}`) &&
        allowedTools[erosionMap[n.y][n.x]].has(n.gear)
      )
      .forEach(n => {
        const nextId = `${n.x},${n.y},${n.gear}`;
        if (currentDistance + n.distance < _.get(nodeMap, [nextId, 'bestDistance'], Infinity)) {
          nodeMap[nextId] = {
            id: nextId,
            x: n.x,
            y: n.y,
            gear: n.gear,
            bestDistance: currentDistance + n.distance,
            estimate: currentDistance + n.distance + Math.abs(targetX - n.x) + Math.abs(targetY - n.y),
          }
        }
        toSee.add(nextId);
      })
  }
  return _.get(nodeMap, [targetNode, 'bestDistance'], -1);
}

describe('examples', () => {
  test('part1', () => {
    expect(part1(510, 10, 10)).toBe(114);
  });
  test('part2', () => {
    expect(part2(510, 10, 10)).toBe(45);
  });
})

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1(3198, 12, 757));
  })

  test('part 2 ', () => {
    console.log(part2(3198, 12, 757));
  })
});