import _ from 'lodash';
import readInput from './readInput';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

type Nanobot = {
  id: string,
  x: number,
  y: number,
  z: number,
  r: number,
}

function* uniquePairs<T>(arr: T[]): IterableIterator<[T,T]> {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      yield [arr[i], arr[j]];
    }
  }
};

function parseLine(line: string): Nanobot {
  const matches = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(-?\d+)/.exec(line);
  if (!matches) throw 'beep boop';
  return {
    id: `${matches[1]},${matches[2]},${matches[3]}`,
    x: parseInt(matches[1]),
    y: parseInt(matches[2]),
    z: parseInt(matches[3]),
    r: parseInt(matches[4]),
  }
}

function part1(filename: string): number {
  const bots = readInput(filename, parseLine);
  const largestRadius = _.maxBy(bots, 'r') as Nanobot;
  return _.chain(bots)
    .filter(bot => largestRadius.r >= Math.abs(bot.x - largestRadius.x) + Math.abs(bot.y - largestRadius.y) + Math.abs(bot.z - largestRadius.z))
    .size()
    .value();
}

function part2(filename: string): string {
  //output z3 solver code because this problem is complete bullshit.
  const bots = readInput(filename, parseLine);
  const rangez3 = _.chain(bots)
    .map(bot => `    (if (<= (dist x y z ${bot.x} ${bot.y} ${bot.z}) ${bot.r}) 1 0)`)
    .join('\n')
    .value();
  return _.join([z3Start, rangez3, z3End], '');
}

const z3Start = `
(declare-const x Int)
(declare-const y Int)
(declare-const z Int)

(define-fun abs ((v Int)) Int
 (if (> v 0)
     v
     (* -1 v)))

(define-fun dist ((x1 Int) (y1 Int) (z1 Int) (x2 Int) (y2 Int) (z2 Int)) Int
 (+ (abs (- x1 x2))
    (abs (- y1 y2))
    (abs (- z1 z2))))
  
(define-fun botsInRange ((x Int) (y Int) (z Int)) Int
  (+
`

const z3End = `
  ))

(maximize (botsInRange x y z))
(minimize (dist 0 0 0 x y z))
(check-sat)
(get-model)
`

describe.skip('examples', () => {
  test('part1', () => {
    expect(part1('day23.example.1')).toBe(7);
  });
  test('part2', () => {
    console.log(part2('day23.example.2'));
  });
})

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1('day23'));
  })

  test('part 2 ', () => {
    console.log(part2('day23'));
  })
});