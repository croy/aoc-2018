import readInput from './readInput';
import _ from 'lodash';

function part1() {
  const lineFrequencies = _.chain(readInput('day2'))
    .map(line => _.countBy(line))
    .map(_.invert)
    .value();
  const has2 = _.chain(lineFrequencies)
    .filter(line => line[2])
    .value().length;
  const has3 = _.chain(lineFrequencies)
    .filter(line => line[3])
    .value().length;
  return has2 * has3;
}

function* uniquePairs<T>(arr: T[]): IterableIterator<[T,T]> {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      yield [arr[i], arr[j]];
    }
  }
};

function part2() {
  const input = readInput('day2');
  for (const [a,b] of uniquePairs(input)) {
    const matchingSubstring = _.filter(a, (v,i,c) => v === b[i]).join('');
    if (matchingSubstring.length === a.length - 1) {
      return matchingSubstring;
    }
  }
}

describe('output', () => {
  test('part1', () => {
    console.log(part1());
  });

  test('part2', () => {
    console.log(part2());
  });
});