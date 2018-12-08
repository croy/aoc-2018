import _ from 'lodash';
import readInput from './readInput';

const baseJobLength = 60;

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
      timeToComplete: baseJobLength + (step.codePointAt(0) as number) - ('A'.codePointAt(0) as number) + 1,
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
  let jobs = [] as Job[];
  let availableSteps = [] as string[];
  do {
    const currentTime = _.chain(jobs).map(job => job.completionTime).min().value() || 0;
    const completedJobs = _.chain(jobs)
      .filter(job => job.completionTime === currentTime)
      .value();
    _.forEach(completedJobs, job => {
        completedStepIds.add(job.step.id);
        completionOrder.push(job);
      });
    
    const remainingJobs = _.chain(jobs)
      .filter(job => job.completionTime > currentTime)
      .value();
    availableSteps = _.chain(allStepIds)
      .filter(step => !completedStepIds.has(step))
      .filter(step => _.every(stepById[step].dependencies, dep => completedStepIds.has(dep)))
      .filter(step => !_.includes(_.map(remainingJobs, j => j.step.id), step))
      .sort()
      .value();
    jobs = _.concat(
      remainingJobs,
      _.chain(availableSteps)
        .take(workers - remainingJobs.length)
        .map(stepId => ({
          step: stepById[stepId],
          completionTime: stepById[stepId].timeToComplete + currentTime,
        }))
        .value()
    );

  } while (availableSteps.length !== 0 || jobs.length !== 0);
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
  const input = readInput('day7', parseLine);
  const steps = buildSteps(input);
  return _.chain(completeSteps(steps, 5))
    .map(j => j.completionTime)
    .max()
    .value();
}

describe('output', () => {
  test('part 1 ', () => {
    const result = part1();
    expect(result).toBe('CFMNLOAHRKPTWBJSYZVGUQXIDE');
  })

  test('part 2 ', () => {
    const result = part2();
    expect(result).toBe(971);
  })
});