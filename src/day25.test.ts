import readInput from './readInput';
import _ from 'lodash';

type Star = {
  id: string,
  parent: Star | null,
  rank: number,
  x: number,
  y: number,
  z: number,
  t: number,
}

function parseLine(line: string): Star {
  const matches = /(-?\d+),(-?\d+),(-?\d+),(-?\d+)/.exec(line);
  if (!matches) {
    throw 'beep boop';
  }
  return {
    parent: null,
    rank: 0,
    id: matches[0],
    x: parseInt(matches[1]),
    y: parseInt(matches[2]),
    z: parseInt(matches[3]),
    t: parseInt(matches[4]),
  }
}

function* uniquePairs<T>(arr: T[]): IterableIterator<[T,T]> {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      yield [arr[i], arr[j]];
    }
  }
};

function find(x: Star): Star {
  if (x.parent === null) {
    return x;
  }
  x.parent = find(x.parent);
  return x.parent;
}

function union(x: Star, y: Star) {
  const xRoot = find(x);
  const yRoot = find(y);
  if (xRoot.id === yRoot.id) {
    return;
  }
  let higherRank = xRoot.rank < yRoot.rank ? yRoot : xRoot;
  let lowerRank = xRoot.rank < yRoot.rank ? xRoot : yRoot;
  lowerRank.parent = higherRank;
  if (lowerRank.rank === higherRank.rank) {
    higherRank.rank++;
  }
}

function distance(a: Star, b: Star): number {
  return Math.abs(a.x - b.x) +
    Math.abs(a.y - b.y) +
    Math.abs(a.z - b.z) +
    Math.abs(a.t - b.t);
}

function part1(filename: string) {
  const stars = readInput(filename, parseLine);
  for (const [a,b] of uniquePairs(stars)) {
    if (distance(a,b) <= 3){
      union(a,b);
    }
  }
  return _.chain(stars)
    .filter(star => star.parent === null)
    .size()
    .value();
}

describe('part 1 examples', () => {
  test('sample 1', () => {
    expect(part1('day25.example.1')).toBe(2);
  });
  test('sample 2', () => {
    expect(part1('day25.example.2')).toBe(4);
  });
  test('sample 3', () => {
    expect(part1('day25.example.3')).toBe(3);
  });
  test('sample 4', () => {
    expect(part1('day25.example.4')).toBe(8);
  });
})

describe('output', () => {
  test('part1', () => {
    console.log(part1('day25'));
  });
});