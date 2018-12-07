import _ from 'lodash';
import readInput from './readInput';
import { start } from 'repl';

type Point = {
  x: number;
  y: number;
}

function pointToString(pt: Point) {
  return `${pt.x},${pt.y}`;
}

function parsePoint(str: string): Point {
  const [x, y] = str.split(',');
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
  }
}

function distanceBetween(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function part1() {
  const startingPoints = readInput('day6', parsePoint);
  const minX = _.chain(startingPoints).map(pt => pt.x).min().value() as number;
  const maxX = _.chain(startingPoints).map(pt => pt.x).max().value() as number;
  const minY = _.chain(startingPoints).map(pt => pt.y).min().value() as number;
  const maxY = _.chain(startingPoints).map(pt => pt.y).max().value() as number;
  const grid = []
  for (const y of _.range(minY, maxY+1)) {
    grid[y - minY] = [] as string[];
    for (const x of _.range(minX, maxX+1)) {
      const currentPt = {x, y};
      let minId = '';
      let minDistance = Infinity;
      for (const startPt of startingPoints) {
        const distance = distanceBetween(startPt, currentPt);
        if (distance < minDistance) {
          minId = pointToString(startPt);
          minDistance = distance;
        } else if (distance === minDistance) {
          minId = '.';
        }
      }
      grid[y-minY][x-minX] = minId;
    }
  }
  const infiniteIds = new Set();
  _.forEach(_.first(grid), id => infiniteIds.add(id));
  _.forEach(_.last(grid), id => infiniteIds.add(id));
  _.forEach(_.map(grid, l => _.last(l)), id => infiniteIds.add(id));
  _.forEach(_.map(grid, l => _.first(l)), id => infiniteIds.add(id));
  
  return _.chain(grid)
    .flatten()
    .filter(x => !infiniteIds.has(x) && x !== '.')
    .compact()
    .countBy()
    .values()
    .max()
    .value();
}

function part2() {
  const startingPoints = readInput('day6', parsePoint);
  const minX = _.chain(startingPoints).map(pt => pt.x).min().value() as number-100;
  const maxX = _.chain(startingPoints).map(pt => pt.x).max().value() as number+100;
  const minY = _.chain(startingPoints).map(pt => pt.y).min().value() as number-100;
  const maxY = _.chain(startingPoints).map(pt => pt.y).max().value() as number+100;
  let totalArea = 0;
  for (const y of _.range(minY, maxY+1)) {
    for (const x of _.range(minX, maxX+1)) {
      const currentPt = {x, y};
      let distance = 0;        
      for (const startPt of startingPoints) {
        distance += distanceBetween(startPt, currentPt);
      }
      if (distance < 10000) {
        totalArea++;
      }

    }
  }
  return totalArea;
}


describe('output', () => {
  test('part1', () => {
    console.log(part1());
  })
  test.only('part2', () => {
    console.log(part2());
  })
});
