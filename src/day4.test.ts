import _ from 'lodash';
import moment, { MomentLongDateFormat } from 'moment';
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

function part1() {
  return readInput('day4', parseInput)
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