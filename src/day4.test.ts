import _ from 'lodash';
import moment, { Moment } from 'moment';
import readInput from './readInput';


type LoggedEvent = Wake | Sleep | Start

interface Wake {
  time: any,
  type: 'wake'
}

interface Sleep {
  time: any,
  type: 'sleep'
}

interface Start {
  time: any,
  type: 'start',
  id: string,
}

function parseInput(line: string): LoggedEvent {
  const startShiftRegex = /^\[(\d\d\d\d-\d\d-\d\d \d\d\:\d\d)\] Guard \#(\d+) begins shift$/;
  const sleepRegex = /^\[(\d\d\d\d-\d\d-\d\d \d\d:\d\d)\] falls asleep$/;
  const wakeRegex = /^\[(\d\d\d\d-\d\d-\d\d \d\d:\d\d)\] wakes up$/;
  let fields = startShiftRegex.exec(line);
  if (fields) {
    return {
      type: 'start',
      id: fields[2],
      time: moment(fields[1]),
    }
  }
  fields = sleepRegex.exec(line);
  if (fields) {
    return {
      type: 'sleep',
      time: moment(fields[1]),
    }
  }
  fields = wakeRegex.exec(line);
  if (fields) {
    return {
      type: 'wake',
      time: moment(fields[1]),
    }
  }
  throw line;
}

type SleepWindow = {
  id: string,
  start: Moment,
  end: Moment
}

function getSleeps() {
  const logEvents = readInput('day4', parseInput);
  return _.chain(logEvents)
  .sortBy('time')
  .value()
  .reduce<SleepWindow & {sleeps: SleepWindow[]}>((acc, curr) => {
    if (curr.type === 'start') {
      return {
        ...acc,
        id: curr.id,
      }
    } else if (curr.type === 'sleep') {
      return {
        ...acc,
        start: curr.time,
      }
    } else {
      return {
        ...acc,
        sleeps: [...acc.sleeps, {id: acc.id, start: acc.start, end: curr.time}],
      }
    }
    throw 'test';
  }, {id: '', start: moment(), end: moment(), sleeps: [] as SleepWindow[]}).sleeps;
} 

function sleepToMinutes(sleep: SleepWindow): number[] {
  return _.range(sleep.start.minutes(), sleep.end.minutes(), 1)
}

function part1() {
  const sleepsByGuard = _.groupBy(getSleeps(), 'id');
  const sleepiestGuard = _.chain(sleepsByGuard)
    .mapValues(sleeps => sleeps.reduce((acc: number, sleep) => acc + moment.duration(sleep.end.diff(sleep.start)).asMinutes(), 0))
    .toPairs()
    .sortBy('1')
    .last()
    .get('0', '')
    .toNumber()
    .value();
  const sleepiestGuardSleeps = sleepsByGuard[sleepiestGuard];
  const sleepiestGuardsSleepiestMinute = _.chain(sleepiestGuardSleeps)
    .flatMap(sleepToMinutes)
    .countBy()
    .toPairs()
    .sortBy('1')
    .last()
    .get('0', '')
    .toNumber()
    .value();
  return sleepiestGuardsSleepiestMinute * sleepiestGuard;
}

function part2() {

}

describe('output', () => {
  test.only('part1', () => {
    console.log(part1());
  })
  test('part2', () => {
    console.log(part2());
  })
})