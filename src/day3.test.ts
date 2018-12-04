import _ from 'lodash';
import readInput from './readInput';

interface LineInput {
  id: number,
  xStart: number,
  xWidth: number,
  yStart: number,
  yWidth: number,
}

interface Point {
  x: number,
  y: number,
}

function* pointsFromInput(input: LineInput): IterableIterator<Point> {
  for(let xOffset = 0; xOffset < input.xWidth; xOffset++) {
    for (let yOffset = 0; yOffset < input.yWidth; yOffset++) {
      yield {
        x: input.xStart + xOffset,
        y: input.yStart + yOffset
      }
    }
  }
}

function parseLine(line: string): LineInput {
  const lineRegex = /^\#(\d+) \@ (\d+),(\d+): (\d+)x(\d+)$/;
  const matches = lineRegex.exec(line);
  if (!matches) {
    throw 'BEEP BOOP';
  }
  return {
    id: parseInt(matches[1]),
    xStart : parseInt(matches[2]),
    yStart : parseInt(matches[3]),
    xWidth : parseInt(matches[4]),
    yWidth: parseInt(matches[5]),
  };
}

function part1() {
  const lines = readInput('day3');
  const inputs = lines.map(parseLine);
  const grid: {
    [index: string] : number,
  } = {};
  inputs.forEach(input => {
    for (const point of pointsFromInput(input)) {
      const idx = `${point.x},${point.y}`
      if (!grid[idx]) {
        grid[idx] = 0;
      } 
      grid[idx]++;
    }
  })
  return _.chain(grid).values().filter(x => x > 1).value().length
}

function part2() {
  const lines = readInput('day3');
  const inputs = lines.map(parseLine);
  const grid: {
    [index: string] : number,
  } = {};
  inputs.forEach(input => {
    for (const point of pointsFromInput(input)) {
      const idx = `${point.x},${point.y}`;
      if (!grid[idx]) {
        grid[idx] = 0;
      } 
      grid[idx]++;
    }
  })
  return _.find(inputs, input => {
    for (const point of pointsFromInput(input)) {
      const idx = `${point.x},${point.y}`;
      if (grid[idx] > 1) {
        return false;
      }
    }
    return true;
  });
}


describe('output', () => {
  test('part1', () => {
    console.log(part1());
  });
  test('part2', () => {
    console.log(part2());
  });
})