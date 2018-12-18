import _ from 'lodash';
import { gridToString } from './printGrid';
import readInput from './readInput';

function countLumber(grid: string[][]) {
  const resources = _.chain(grid)
    .flatten()
    .groupBy(c => c)
    .mapValues(v => v.length)
    .value();
  return _.get(resources, '#', 0) * _.get(resources, '|', 0);
}

function getAdjacentVals(grid: string[][], x: number, y: number) {
  return {
    topLeft: _.get(grid, [y-1, x-1]),
    top: _.get(grid, [y-1, x]),
    topRight: _.get(grid, [y-1, x+1]),
    left: _.get(grid, [y, x-1]),
    right: _.get(grid, [y, x+1]),
    bottomLeft: _.get(grid, [y+1, x-1]),
    bottom: _.get(grid, [y+1, x]),
    bottomRight: _.get(grid, [y+1, x+1]),
  };
}

function advance(grid: string[][]) {
  return _.map(
    grid,
    (l, y) => _.map(
      l, 
      (c, x) => {
        const adjacentMap = _.chain(getAdjacentVals(grid, x, y))
          .values()
          .groupBy()
          .mapValues(l => l.length)
          .value();
        if (c === '.') {
          return (adjacentMap['|'] >= 3) ? '|' : c;
        } else if (c === '|') {
          return (adjacentMap['#'] >= 3) ? '#' : c;
        } else if (c === '#') {
          return (adjacentMap['#'] >= 1 && adjacentMap['|'] >= 1) ? '#' : '.';
        }
        return c;
      }
    ));
}

function part1() {
  const startGrid = readInput('day18', l => _.split(l,''));
  const endGrid = _.reduce(_.range(10), (grid: string[][], c: number) => advance(grid), startGrid);
  return countLumber(endGrid);
}

function part2() {
  const startGrid = readInput('day18', l => _.split(l,''));
  const cache = {} as _.Dictionary<number>;
  let idx = 0;
  let current = startGrid;
  let currentId = gridToString(startGrid);
  while (!_.has(cache, currentId)) {
    cache[currentId] = idx;
    current = advance(current);
    currentId = gridToString(current);
    idx++;
  }
  const loopSize = idx - cache[currentId];
  const stepsLeft = (1000000000 - idx) % loopSize;
  const endGrid = _.reduce(_.range(stepsLeft), (grid: string[][], c: number) => advance(grid), current);
  return countLumber(endGrid);
}

describe('countLumber', () => {
  test('example', () => {
    const grid = _.map([
      '.||##.....',
      '||###.....',
      '||##......',
      '|##.....##',
      '|##.....##',
      '|##....##|',
      '||##.####|',
      '||#####|||',
      '||||#|||||',
      '||||||||||'], l => _.split(l, ''));
    expect(countLumber(grid)).toBe(1147);
  });
});

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});