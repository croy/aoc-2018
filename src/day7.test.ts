import _ from 'lodash';
import readInput from './readInput';

type Step = {
  id: string,
  timeToComplete: number,
  dependencies: string[],
}

type Job = {
  completionTime: number,
  step: Step,
}

function buildSteps(inputs: {step: string, depends: string}[]): Step[] {
  const dependencyMap = _.chain(inputs)
    .groupBy(dep => dep.step)
    .mapValues(deps => _.flatMap(deps, dep => dep.depends))
    .value();
  const allSteps = _.chain(
      _.concat(
        _.map(inputs, i => i.step),
        _.map(inputs, i => i.depends)))
      .sort()
      .uniq()
      .value();
  return _.chain(allSteps)
    .map(step => ({
      id: step,
      timeToComplete: 61 + (step.codePointAt(0) as number) - ('A'.codePointAt(0) as number),
      dependencies: dependencyMap[step] || [],
    }))
    .value();
}

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

function completeSteps(steps: Step[], workers: number): Job[] {
  const stepById = _.keyBy(steps, step => step.id);
  const allStepIds = _.keys(stepById).sort();
  const completionOrder = [] as Job[];
  const completedStepIds = new Set();
  while (completionOrder.length !== allStepIds.length) {
    const next = _.chain(allStepIds)
      .filter(step => !completedStepIds.has(step))
      .find(step => _.every(stepById[step].dependencies, dep => completedStepIds.has(dep)))
      .value() as string;
    completedStepIds.add(next);
    completionOrder.push({
      step: stepById[next],
      completionTime: 0,
    });
  }
  return completionOrder;
}

function part1() {
  const input = readInput('day7', parseLine);
  const steps = buildSteps(input);
  return _.chain(completeSteps(steps, 1))
    .map(job => job.step.id)
    .join('')
    .value();
}

function part2() {
}

describe('output', () => {
  test('part 1 ', () => {
    const result = part1();
    expect(result).toBe('CFMNLOAHRKPTWBJSYZVGUQXIDE')
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});