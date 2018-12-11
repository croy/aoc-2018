import _ from 'lodash';
import readInput from './readInput';

type Point = {
  x: number,
  y: number,
}

type Velocity = {
  dx: number,
  dy: number,
}

type Particle = {
  startPoint: Point,
  velocity: Velocity
}

function parseLine(line: string): Particle {
  const regex = /^position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>$/
  const matches = regex.exec(line);
  if (!matches) {
    throw 'beep boop';
  }
  return {
    startPoint: {
      x: parseInt(matches[1], 10),
      y: parseInt(matches[2], 10),
    },
    velocity: {
      dx: parseInt(matches[3], 10),
      dy: parseInt(matches[4], 10),
    }
  }
}

function* timeGenerator() {
  let i = 0;
  while(true) yield i++;
}

function pointAtT(particle: Particle, time: number) {
  return {
    x: particle.startPoint.x + (particle.velocity.dx * time),
    y: particle.startPoint.y + (particle.velocity.dy * time),
  }
}

function areaCoveredByPoints(points: Point[]) {
  const minX = (_.minBy(points, p => p.x) as Point).x;
  const maxX = (_.maxBy(points, p => p.x) as Point).x;
  const minY = (_.minBy(points, p => p.y) as Point).y;
  const maxY = (_.maxBy(points, p => p.y) as Point).y;
  return (maxY - minY) * (maxX - minX);
}

function findSmallestAreaT(particles: Particle[]): number {
  let lastArea = Infinity;
  for(const t of timeGenerator()) {
    const currentArea = areaCoveredByPoints(_.map(particles, p => pointAtT(p, t)));
    if (currentArea > lastArea) {
      return t-1;
    }
    lastArea = currentArea;
  }
  throw 'beep boop cannot happen';
}

function plotPoints(points: Point[]) : string[][] {
  const minX = (_.minBy(points, p => p.x) as Point).x;
  const maxX = (_.maxBy(points, p => p.x) as Point).x;
  const minY = (_.minBy(points, p => p.y) as Point).y;
  const maxY = (_.maxBy(points, p => p.y) as Point).y;
  const grid = _.range(maxY - minY + 1).map(
    () =>_.range(maxX - minX + 1).map(
      () => "."
    )
  );
  _.forEach(points, point => {
    grid[point.y - minY][point.x - minX] = '#';
  });
  return grid;
}

function part1() {
  const particles = readInput('day10', parseLine);
  const timeWhenPointsAreTightest = findSmallestAreaT(particles);
  const grid = plotPoints(_.map(particles, p => pointAtT(p, timeWhenPointsAreTightest)));
  return _.map(grid, line => _.join(line, ''));
}

function part2() {
  const particles = readInput('day10', parseLine);
  return findSmallestAreaT(particles);
}

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});