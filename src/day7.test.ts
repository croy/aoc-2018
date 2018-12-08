import _ from 'lodash';
import readInput from './readInput';

function parseLine(line: string) {
  const regex = /Step (.) must be finished before step (.) can begin./;
  const matches = regex.exec(line);
  if (matches) {
    return {
      step: matches[2],
      depends: matches[1],
    };
  }
  throw 'beep boop';
}

function part1() {
  const input = readInput('day7', parseLine);
  const dependencyMap = _.chain(input) 
    .groupBy(dep => dep.step)
    .mapValues(deps => _.flatMap(deps, dep => dep.depends))
    .value();
  const allSteps = _.chain(
      _.concat(
        _.map(input, i => i.step),
        _.map(input, i => i.depends)))
      .sort()
      .uniq()
      .value();
  const completionOrder = [];
  const completed = new Set();
  while (completionOrder.length !== allSteps.length) {
    const next = _.chain(allSteps)
      .filter(step => !completed.has(step))
      .find(step => _.every(dependencyMap[step], dep => completed.has(dep)))
      .value();
    completed.add(next);
    completionOrder.push(next);
  }
  return _.join(completionOrder, '');
}


function part2() {
}

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});