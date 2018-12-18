import fs from 'fs';
import _ from 'lodash';
import readInput from './readInput';

type Point = {
  x: number,
  y: number,
}

function parseLine(line: string): Point[] {
  const xMatches = /x=(\d+)(..(\d+))?/.exec(line);
  const yMatches = /y=(\d+)(..(\d+))?/.exec(line);
  if (xMatches && yMatches) {
    const xStart = parseInt(xMatches[1], 10);
    const xEnd = (xMatches[3] ? parseInt(xMatches[3], 10) : xStart) + 1;
    const yStart = parseInt(yMatches[1], 10);
    const yEnd = (yMatches[3] ? parseInt(yMatches[3], 10) : yStart) + 1;
    return _.flatMap(_.range(xStart, xEnd), x => _.map(_.range(yStart, yEnd), y => ({x, y})))
  }
  throw 'beep boop';
}

function print(grid: string[][]): void {
  console.log(_.join(_.map(grid, l => _.join(l, '')), '\n'));
}

function theWaterMustFlow() {
  const clay = _.chain(readInput('day17', parseLine))
    .flatten()
    .value();
  const minX = _.chain(clay).map(xy => xy.x).min().value() as number;
  const maxX = _.chain(clay).map(xy => xy.x).max().value() as number;
  const minY = _.chain(clay).map(xy => xy.y).min().value() as number;
  const maxY = _.chain(clay).map(xy => xy.y).max().value() as number;
  const grid = _.map(_.range(minY-1, maxY+1), () => _.map(_.range(minX-1, maxX + 2), () => '.'));
  _.forEach(clay, point => {
      grid[point.y - minY+1][point.x - minX + 1] = '#';
  })
  grid[0][500 - minX + 1] = '+';
  const scanPoints = [{x: 500 - minX + 1, y: 1}] as Point[];
  while (!_.isEmpty(scanPoints)) {
    const current = scanPoints.pop() as Point;
    grid[current.y][current.x] = '|';
    if (current.y + 1 < grid.length && (grid[current.y+1][current.x] === '#' || grid[current.y+1][current.x] === '~')) {
      let leftEdge = current.x;
      let rightEdge = current.x;
      //flood left
      while (leftEdge >= 0 && grid[current.y][leftEdge] !== '#' && grid[current.y+1][leftEdge] !== '.') {
        leftEdge--;
      }
      //flood right
      while (rightEdge <= maxX - minX && grid[current.y][rightEdge] !== '#' && grid[current.y+1][rightEdge] !== '.') {
        rightEdge++;
      }
      const fillColor = (grid[current.y][leftEdge] === '#' && grid[current.y][rightEdge] === '#') ? '~' : '|';
      for (const x of _.range(leftEdge+1, rightEdge)) {
        grid[current.y][x] = fillColor;
      }
      if (grid[current.y][leftEdge] === '.') {
        grid[current.y][leftEdge] = '|';
        scanPoints.push({x: leftEdge, y: current.y});
      }
      if (grid[current.y][rightEdge] === '.') {
        grid[current.y][rightEdge] = '|';
        scanPoints.push({x: rightEdge, y: current.y});
      }
    } else if (current.y + 1 < grid.length && grid[current.y+1][current.x] !== '|') {
      scanPoints.push(current);
      scanPoints.push({x: current.x, y: current.y+1 });
    }
  }
  return grid;
}

function part1() {
  const grid = theWaterMustFlow();
  return _.chain(grid)
    .slice(1)
    .flatten()
    .filter(c => c === '|' || c === '~')
    .size()
    .value()
}

function part2() {
  const grid = theWaterMustFlow();
  return _.chain(grid)
    .slice(1)
    .flatten()
    .filter(c => c === '~')
    .size()
    .value()
}


describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});