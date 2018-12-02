import fs from 'fs';
import _ from 'lodash';
import readInput from './readInput';

function part1() {
  return _.chain(readInput('day1'))
  .map(str => parseInt(str, 10))
  .reduce((a,b) => a + b, 0)
  .value();
}

function* repeat<T>(arr: T[]) {
  while(true) {
    yield* arr;
  }
}

function part2() {
  const seen = new Set();
  const frequencyChanges = _.map(readInput('day1'), str => parseInt(str, 10));
  let accumulator = 0;
  for (const frequency of repeat(frequencyChanges)) {
    accumulator += frequency;
    if (seen.has(accumulator)) {
      return accumulator;
    }
    seen.add(accumulator);
  }
}

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});