import _ from 'lodash';
import readInput from './readInput';

function react(a: string, b:string) {
  return a !== b && _.toUpper(a) === _.toUpper(b);
}

function reduceString(line: string) {
  return _.chain(line.split(''))
    .reduce((acc, ltr) => {
      if (react(ltr, _.last(acc) as string)) {
        acc.pop();
      } else {
         acc.push(ltr);
      }
      return acc;
    }, [] as string[])
    .join('')
    .value();
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