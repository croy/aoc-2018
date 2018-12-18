import _ from 'lodash';
import readInput from './readInput';
import printGrid from './printGrid';

type Team = 'E' | 'G';

type Position = {
  x: number,
  y: number,
}

type Mob = Position & {
  id: string,
  health: number,
  attack: number,
  team: Team,
}

type SearchNode =  Position & {
  dx: number,
  dy: number,
}


function findStep(mob: Mob, squaresInRange: Position[], grid: string[][]) {
  const targets = new Set(_.map(squaresInRange, square => `${square.x},${square.y}`));
  if (targets.has(`${mob.x},${mob.y}`)) {
    return null;
  }
  const seen = new Set([`${mob.x},${mob.y}`]);
  let searchAtDepth = [] as SearchNode[];
  let nextDepth = [
    {x: mob.x, y: mob.y-1, dx: 0, dy: -1},
    {x: mob.x-1, y: mob.y, dx: -1, dy: 0},
    {x: mob.x+1, y: mob.y, dx: 1, dy: 0},
    {x: mob.x, y: mob.y+1, dx: 0, dy: 1},
  ];
  nextDepth.forEach(sn => {
    if (_.get(grid, [sn.y, sn.x], '#') === '.' && !seen.has(`${sn.x},${sn.y}`)){
      seen.add(`${sn.x},${sn.y}`);
      searchAtDepth.push(sn);
    }
  });
  nextDepth = [];
  while (!_.isEmpty(searchAtDepth)) {
    const current = searchAtDepth.shift() as SearchNode;
    const currentPosId = `${current.x},${current.y}`
    if (targets.has(currentPosId)) {
      return current;
    }
    const next = [
      {x: current.x, y: current.y-1, dx: current.dx, dy: current.dy },
      {x: current.x-1, y: current.y, dx: current.dx, dy: current.dy },
      {x: current.x+1, y: current.y, dx: current.dx, dy: current.dy },
      {x: current.x, y: current.y+1, dx: current.dx, dy: current.dy },
    ]
    next.forEach(sn => {
      if (_.get(grid, [sn.y, sn.x], '#') === '.' && !seen.has(`${sn.x},${sn.y}`)){
        seen.add(`${sn.x},${sn.y}`);
        nextDepth.push(sn);
      }
    });
    if (_.isEmpty(searchAtDepth)) {
      searchAtDepth = _.sortBy(nextDepth, ['y', 'x']);
      nextDepth = [];
    }
  }
}

function adjacentPositions(x: number, y: number): Position[] {
  return [
    { x: x, y: y-1 },
    { x: x-1, y: y },
    { x: x+1, y: y },
    { x: x, y: y+1 },
  ]
}

function part1(filename: string, elfAtk = 3): number {
  const grid = readInput(filename, l => _.split(l, ''));
  const elfIdSpace = _.chain('abcdefghijklmnopqrstuvwxyz').split('').reverse().value();
  const goblinIdSpace = _.chain('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('').reverse().value();
  const mobMap = {} as _.Dictionary<Mob>;
  _.forEach(grid, (line, y) => {
    _.forEach(line, (space, x) => {
      if (space === 'G' || space === 'E') {
        const id = space === 'G' ? goblinIdSpace.pop() as string : elfIdSpace.pop() as string;
        mobMap[id] = {
          id,
          x,
          y,
          team: space,
          health: 200,
          attack: space === 'E' ? elfAtk : 3,
        }
        grid[y][x] = id as string;
      } 
    });
  });
  let roundNumber = 0;
  let actionTaken = true;
  round:
  while (actionTaken) {
    actionTaken = false;
    const mobActionOrder = _.chain(mobMap).values().sortBy(['y', 'x']).value();
    for (const mob of mobActionOrder) {
      if (!_.has(mobMap, mob.id)) {
        //NANI?
        continue;
      }
      const enemies = _.chain(mobActionOrder)
        .values()
        .filter(mob => mob.health > 0)
        .groupBy('team')
        .get(mob.team === 'E' ? 'G' : 'E')
        .value();
      if (_.size(enemies) === 0) {
        //no enemies means combat is over
        break round;
      }
      const adjacencies = _.chain(enemies)
        .flatMap(enemy => adjacentPositions(enemy.x, enemy.y))
        .filter(pos => grid[pos.y][pos.x] === '.' || grid[pos.y][pos.x] === mob.id)
        .value();
      if (adjacencies.length === 0) {
        //no available adjacencies, skip turn
        continue;
      }
      const step = findStep(mob, adjacencies, grid)
      //move
      if (step) {
        grid[mob.y][mob.x] = '.';
        mob.y += step.dy;
        mob.x += step.dx;
        grid[mob.y][mob.x] = mob.id;
        actionTaken = true;
      }
      //attack
      const attackTarget = _.chain(adjacentPositions(mob.x, mob.y))
        .map(pos => _.get(grid, [pos.y, pos.x], '.'))
        .map(id => mobMap[id])
        .compact()
        .filter((target: Mob) => target.team !== mob.team)
        .sortBy(['health', 'y', 'x'])
        .first()
        .value();
      if (attackTarget) {
        actionTaken = true;
        attackTarget.health -= mob.attack;
        if (attackTarget.health <= 0) {
          grid[attackTarget.y][attackTarget.x] = '.';
          _.unset(mobMap, attackTarget.id);
        }
      }
    }
    if (actionTaken) {
      roundNumber++;
    }
  }

  return (roundNumber) * _.chain(mobMap).values().map(m => m.health).sum().value();
}

function simulateUntilElfDeath(grid: string[][], elfAtkPower: number) {
  const elfIdSpace = _.chain('abcdefghijklmnopqrstuvwxyz').split('').reverse().value();
  const goblinIdSpace = _.chain('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('').reverse().value();
  const mobMap = {} as _.Dictionary<Mob>;
  _.forEach(grid, (line, y) => {
    _.forEach(line, (space, x) => {
      if (space === 'G' || space === 'E') {
        const id = space === 'G' ? goblinIdSpace.pop() as string : elfIdSpace.pop() as string;
        mobMap[id] = {
          id,
          x,
          y,
          team: space,
          health: 200,
          attack: space === 'E' ? elfAtkPower : 3,
        }
        grid[y][x] = id as string;
      } 
    });
  });
  while (true) {
    const mobActionOrder = _.chain(mobMap).values().sortBy(['y', 'x']).value();
    for (const mob of mobActionOrder) {
      if (!_.has(mobMap, mob.id)) {
        //NANI?
        continue;
      }
      const enemies = _.chain(mobActionOrder)
        .values()
        .filter(mob => mob.health > 0)
        .groupBy('team')
        .get(mob.team === 'E' ? 'G' : 'E')
        .value();
      if (_.size(enemies) === 0) {
        //no enemies means combat is over
        return true;
      }
      const adjacencies = _.chain(enemies)
        .flatMap(enemy => adjacentPositions(enemy.x, enemy.y))
        .filter(pos => grid[pos.y][pos.x] === '.' || grid[pos.y][pos.x] === mob.id)
        .value();
      if (adjacencies.length === 0) {
        //no available adjacencies, skip turn
        continue;
      }
      const step = findStep(mob, adjacencies, grid)
      //move
      if (step) {
        grid[mob.y][mob.x] = '.';
        mob.y += step.dy;
        mob.x += step.dx;
        grid[mob.y][mob.x] = mob.id;
      }
      //attack
      const attackTarget = _.chain(adjacentPositions(mob.x, mob.y))
        .map(pos => _.get(grid, [pos.y, pos.x], '.'))
        .map(id => mobMap[id])
        .compact()
        .filter((target: Mob) => target.team !== mob.team)
        .sortBy(['health', 'y', 'x'])
        .first()
        .value();
      if (attackTarget) {
        attackTarget.health -= mob.attack;
        if (attackTarget.health <= 0) {
          if (attackTarget.team === 'E') {
            return false;
          }
          grid[attackTarget.y][attackTarget.x] = '.';
          _.unset(mobMap, attackTarget.id);
        }
      }
    }
  }
}

function findMinAtk(filename: string) {
  const input = readInput(filename, l => _.split(l, ''));
  for (const elfAtk of _.range(4, 10000)) {
    if (simulateUntilElfDeath(_.cloneDeep(input), elfAtk)) {
      return elfAtk;
    }
  }
  return -1;
}

function part2(filename: string) {
  return part1(filename, findMinAtk(filename));
}

describe('example', () => {
  test('part1 example 1', () => {
    expect(part1('day15.example1')).toBe(27730);
  });
  test('part1 example 2', () => {
    expect(part1('day15.example2')).toBe(36334);
  });
  test('part1 example 3', () => {
    expect(part1('day15.example3')).toBe(39514);
  });
  test('part1 example 4', () => {
    expect(part1('day15.example4')).toBe(27755);
  });
  test('part1 example 5', () => {
    expect(part1('day15.example5')).toBe(28944);
  });
  test('part1 example 6', () => {
    expect(part1('day15.example6')).toBe(18740);
  });
  test('part2 example 1', () => {
    expect(findMinAtk('day15.example1')).toBe(15);
  });
  test('part2 example 3', () => {
    expect(findMinAtk('day15.example3')).toBe(4);
  });
  test('part2 example 4', () => {
    expect(findMinAtk('day15.example4')).toBe(15);
  });
  test('part2 example 5', () => {
    expect(findMinAtk('day15.example5')).toBe(12);
  });
  test('part2 example 6', () => {
    expect(findMinAtk('day15.example6')).toBe(34);
  });
})

describe('output', () => {
  test('part1', () => {
    console.log(part1('day15'));
  });
  test('part2', () => {
    console.log(part2('day15'));
  });
})