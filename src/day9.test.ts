import _ from 'lodash';
import readInput from './readInput';

type MarbleNode = {
  prev: MarbleNode;
  next: MarbleNode;
  value: number;
}

function play(playerCount: number, highestValueMarble: number): number | undefined {
  const playerScores = _.map(_.range(playerCount), () => 0);
  let currentPlayer = 0;
  //initialize game
  let currentMarble = { value: 0 } as MarbleNode;
  currentMarble.prev = currentMarble;
  currentMarble.next = currentMarble;

  //place marbles
  _.range(1, highestValueMarble + 1).forEach(marble => {
    if (marble % 23 === 0) {
      //score!
      const clockWise = currentMarble.prev.prev.prev.prev.prev.prev.prev;
      clockWise.prev.next = clockWise.next;
      clockWise.next.prev = clockWise.prev;
      playerScores[currentPlayer] += marble + clockWise.value;
      currentMarble = clockWise.next;
    } else {
      const prev = currentMarble.next;
      const next = currentMarble.next.next;
      const newMarble = {
        value: marble,
        prev,
        next,
      }
      next.prev = newMarble;
      prev.next = newMarble;
      currentMarble = newMarble;
    }
    currentPlayer = (currentPlayer + 1) % playerCount;
  })
  return _.max(playerScores);
}

function parseLine(str: string): [number, number] {
  const regex = /(\d+) players; last marble is worth (\d+) points/
  const matches = regex.exec(str);
  if (matches) {
    return [parseInt(matches[1], 10), parseInt(matches[2], 10)];
  }
  throw 'beep boop';
}

function part1() {
  const [players, maxMarble] = readInput('day9', parseLine)[0];
  return play(players, maxMarble)
}

function part2() {
  const [players, maxMarble] = readInput('day9', parseLine)[0];
  return play(players, maxMarble * 100)
}


describe('play game', () => {
  test('example 1', () => {
    expect(play(9, 25)).toBe(32)
  });
  test('example 2', () => {
    expect(play(10, 1618)).toBe(8317)
  });
  test('example 3', () => {
    expect(play(13, 7999)).toBe(146373)
  });
  test('example 4', () => {
    expect(play(17, 1104)).toBe(2764)
  });
  test('example 5', () => {
    expect(play(21, 6111)).toBe(54718)
  });
  test('example 6', () => {
    expect(play(30, 5807)).toBe(37305)
  });
});

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});