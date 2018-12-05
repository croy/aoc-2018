import _ from 'lodash';
import readInput from './readInput';

function atMostOneReaction(line: string) {
  for(let i = 0; i < line.length -1; i++) {
    if (line[i] !== line[i+1] && _.toUpper(line[i]) === _.toUpper(line[i+1])) {
      return line.substring(0, i) + line.substring(i+2);
    }
  }
  return line;
}

function reduceString(line: string) {
  let prev = line;
  let current = atMostOneReaction(line);
  while (prev !== current) {
    prev = current;
    current = atMostOneReaction(current);
  }
  return current;
}

function part1() {
  return readInput('day5', reduceString)[0].length;
}

function part2() {
  const input = readInput('day5')[0];
  return _.chain('abcdefghijklmnopqrstuvwxyz')
  .map(ltr  => _.join(_.filter(input, c => _.toUpper(c) !== _.toUpper(ltr)), ''))
  .map(b => reduceString(b).length)
  .sort()
  .value();
}

describe('reduceString', () => {
  test('example from problem', () => {
    expect(reduceString('dabAcCaCBAcCcaDA')).toEqual('dabCBAcaDA')
  })
})

describe('output', () => {
  test('part1', () => {
    console.log(part1());
  })
  test('part2', () => {
    console.log(part2());
  })
})