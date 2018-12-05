import _ from 'lodash';
import readInput from './readInput';

function reduceString(line: string) {
  let stack = [] as string[];
  for (const ltr of line) {
    if (_.last(stack) !== ltr && _.toUpper(_.last(stack)) === _.toUpper(ltr)) {
        stack.pop();
    } else {
      stack.push(ltr);
    }
  }
  return _.join(stack, '');
}

function part1() {
  return readInput('day5', reduceString)[0].length;
}

function part2() {
  const input = readInput('day5')[0];
  return _.chain('abcdefghijklmnopqrstuvwxyz')
  .map(ltr  => _.join(_.filter(input, c => _.toUpper(c) !== _.toUpper(ltr)), ''))
  .map(b => reduceString(b).length)
  .min()
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