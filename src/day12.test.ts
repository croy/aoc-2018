import _ from 'lodash';
import readInput from './readInput';

type PlantState = {
  minimalStringRepresentation: string,
  potIndex: number,
}

function generationNext(plantState: PlantState, rules: {[idx: string]: string }): PlantState {
  const current = '.....' + plantState.minimalStringRepresentation + '.....';
  const nextPreTrim = _.chain(_.range(current.length - 5))
    .map(i => _.get(rules, current.substr(i, 5), '.'))
    .join('')
    .trimEnd('.')
    .value();
  const next = _.trimStart(nextPreTrim, '.');
  const potIndexChange = -3 + (nextPreTrim.length - next.length);
  return {
    minimalStringRepresentation: next,
    potIndex: plantState.potIndex + potIndexChange,
  };
}

function parseInput(lines: string[]) {
  return {
    initialState: lines[0].substr(15),
    rules: _.chain(lines)
      .slice(2)
      .keyBy(l => l.substr(0,5))
      .mapValues(v => _.last(v))
      .value() as _.Dictionary<string>,
  };
}

function part1() {
  const potGame = parseInput(readInput('day12'));
  const rules = potGame.rules;
  let plantState = {
    minimalStringRepresentation: potGame.initialState,
    potIndex: 0,
  }
  _.range(20).forEach(() => {
    plantState = generationNext(plantState, rules);
  });
  return _.chain(plantState.minimalStringRepresentation)
    .map((v,i) => v === '#' ? i + plantState.potIndex : 0)
    .sum()
    .value();
}

function part2() {
  const potGame = parseInput(readInput('day12'));
  const rules = potGame.rules;

  const seenStates = {} as {[idx: string]: PlantState & {generation: number}};

  let plantState = {
    minimalStringRepresentation: potGame.initialState,
    potIndex: 0,
  }  
  let i = 0;
  while (!_.has(seenStates, plantState.minimalStringRepresentation)) {
    seenStates[plantState.minimalStringRepresentation] = {...plantState, generation: i};
    i++;
    plantState = generationNext(plantState, rules);
  }
  //manual inspection of repeat shows pattern repeats every generation so let's just cheat
  const previousRepeat = seenStates[plantState.minimalStringRepresentation];
  const finalPotIndex = (50000000 - previousRepeat.generation) * (plantState.potIndex - previousRepeat.potIndex) + previousRepeat.potIndex;
  return _.chain(plantState.minimalStringRepresentation)
    .map((v,i) => v === '#' ? i + finalPotIndex : 0)
    .sum()
    .value();
}


describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});
