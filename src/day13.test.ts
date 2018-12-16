import _ from 'lodash';
import readInput from './readInput';
import fs from 'fs';

const input = _.chain(fs.readFileSync(`input/day13`, "utf-8"))
.split("\n")
.map(l => _.split(l, ''))
.value();

type Orientation = '<' | 'v' | '>' | '^';

type Cart = {
  x: number,
  y: number,
  orientation: Orientation
  intersectionCount: number,
}

const dx = {
    '<': -1,
    '>': 1,
    '^': 0,
    'v': 0,
};
const dy = {
    '<': 0,
    '>': 0,
    '^': -1,
    'v': 1,
};

const cornerResults = {
  '>': {
    '\\': 'v',
    '/': '^',
  },
  'v': {
    '\\': '>',
    '/': '<',
  },
  '^': {
    '\\': '<',
    '/': '>',
  },
  '<': {
    '\\': '^',
    '/': 'v',
  }
} as _.Dictionary<_.Dictionary<Orientation>>;

const intersectionResults = {
  '>' : ['^', '>', 'v'],
  'v' : ['>', 'v', '<'],
  '<' : ['v', '<', '^'],
  '^' : ['<', '^', '>'],
} as _.Dictionary<Orientation[]>;

function part1() {
  const track = input;
  let carts = [] as Cart[];
  const dungeonsAndDragonsAndCornersAndTurns = {} as { [idx: string]: string }
  const cartSigils = new Set(['<', '^', '>', 'v']);
  const cornerAndTurnSigils = new Set(['/', '\\', '+']);
  _.forEach(track, (l, y) => {
    _.forEach(l, (sigil, x) => {
      if (cartSigils.has(sigil)) {
        carts.push({
          x,
          y,
          intersectionCount: 0,
          orientation: sigil as Orientation,
        })
      } else if (cornerAndTurnSigils.has(sigil)) {
        dungeonsAndDragonsAndCornersAndTurns[`${x},${y}`] = sigil;
      }
    })
  })
  while (true) {
    //return out when crashed woo
    const tickCartPositions = new Set(_.map(carts, c => `${c.x},${c.y}`));
    carts = _.sortBy(carts, ['y', 'x']);
    for (const cart of carts) {
      tickCartPositions.delete(`${cart.x},${cart.y}`)
      cart.x += dx[cart.orientation];
      cart.y += dy[cart.orientation];
      const position = `${cart.x},${cart.y}`;
      if (tickCartPositions.has(position)) {
        //CRASH
        return position;
      }
      tickCartPositions.add(position);
      if (_.has(dungeonsAndDragonsAndCornersAndTurns, position)) {
        const positionSigil = dungeonsAndDragonsAndCornersAndTurns[position];
        if (positionSigil === '+') {
          cart.orientation = intersectionResults[cart.orientation][cart.intersectionCount];
          cart.intersectionCount = (cart.intersectionCount + 1) % 3;
        } else {
          cart.orientation = cornerResults[cart.orientation][positionSigil];
        }
      }
    }
  }
}

function part2() {
  const track = input;
  let carts = {} as _.Dictionary<Cart>;
  const dungeonsAndDragonsAndCornersAndTurns = {} as { [idx: string]: string }
  const cartSigils = new Set(['<', '^', '>', 'v']);
  const cornerAndTurnSigils = new Set(['/', '\\', '+']);
  _.forEach(track, (l, y) => {
    _.forEach(l, (sigil, x) => {
      if (cartSigils.has(sigil)) {
        carts[`${x},${y}`] = {
          x,
          y,
          intersectionCount: 0,
          orientation: sigil as Orientation,
        };
      } else if (cornerAndTurnSigils.has(sigil)) {
        dungeonsAndDragonsAndCornersAndTurns[`${x},${y}`] = sigil;
      }
    })
  })
  while (_.size(carts) > 1) {
    //return out when crashed woo
    const cartOrder = _.chain(carts).values().sortBy(['y', 'x']).value();
    for (const cart of cartOrder) {
      const x = cart.x;
      const y = cart.y;
      const lastPosition = `${cart.x},${cart.y}`
      if (!carts[lastPosition]) {
        //cart was kill. skip
        continue;
      } 
      _.unset(carts, lastPosition);
      cart.x += dx[cart.orientation];
      cart.y += dy[cart.orientation];
      const newX = cart.x;
      const newY = cart.y;
      const position = `${cart.x},${cart.y}`;
      if (_.has(carts, position)) {
        //CRASH
        _.unset(carts, position);
        continue;
      }
      carts[position] = cart;
      if (_.has(dungeonsAndDragonsAndCornersAndTurns, position)) {
        const positionSigil = dungeonsAndDragonsAndCornersAndTurns[position];
        if (positionSigil === '+') {
          cart.orientation = intersectionResults[cart.orientation][cart.intersectionCount];
          cart.intersectionCount = (cart.intersectionCount + 1) % 3;
        } else {
          cart.orientation = cornerResults[cart.orientation][positionSigil];
        }
      }
    }
  }
  return carts;
}

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});
