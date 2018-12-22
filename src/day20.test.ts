import _ from 'lodash';
import readInput from './readInput';

type InputChar = '$' | '^' | '(' | ')' | '|' | DirChar;
type DirChar = 'N' | 'E' | 'W' | 'S';

function part1(regex?: string): number {
  const input = _.split(regex || readInput('day20')[0], '');
  const map = {} as _.Dictionary<number>;
  buildMap(input as InputChar[], 0, 0, 0, 0, map);
  return _.chain(map)
    .values()
    .max()
    .value() || -1;
}

function part2() {
  const input = _.split(readInput('day20')[0], '');
  const map = {} as _.Dictionary<number>;
  buildMap(input as InputChar[], 0, 0, 0, 0, map);
  return _.chain(map)
    .values()
    .filter(v => v >= 1000)
    .size()
    .value() || -1;
}

const dx = {
  'E': 1,
  'W': -1,
}

const dy = {
  'N': -1,
  'S': 1,
}

function buildMap(directions: InputChar[], startIdx: number, startx: number, starty: number, startDistance: number, map: _.Dictionary<number>): number {
  let idx = startIdx;
  let x = startx;
  let y = starty;
  let distance = startDistance;
  while (idx < directions.length) {
    const char = directions[idx];
    switch (char) {
      case '$': return idx;
      case '^': break;
      case '(': { idx = buildMap(directions, idx+1, x, y, distance, map); break; }
      case ')': return idx;
      case '|': { x = startx; y = starty; distance = startDistance; break }
      default: {
        y += _.get(dy, char, 0);
        x += _.get(dx, char, 0);
        const pos = `${x},${y}`;
        distance = _.get(map, pos, distance + 1);
        map[pos] = distance;
      }
    }
    idx++;
  }
  return idx;
}


describe('examples', () => {
  test('^WNE$', () => {
    expect(part1('^WNE$')).toBe(3);
  });
  test('^ENWWW(NEEE|SSE(EE|N))$', () => {
    expect(part1('^ENWWW(NEEE|SSE(EE|N))$')).toBe(10);
  });
  test('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$', () => {
    expect(part1('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$')).toBe(18);
  });
  test('^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$', () => {
    expect(part1('^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$')).toBe(23);
  });
  test('^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$', () => {
    expect(part1('^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$')).toBe(31);
  });
});

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  });

  test('part 2 ', () => {
    console.log(part2());
  });
});