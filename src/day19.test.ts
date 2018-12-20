import _ from 'lodash';
import readInput from './readInput';

type State = [number, number, number, number, number, number];
type Op = [string, number, number, number];

function addr(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] + result[b];
  return result as State;
}

function addi(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] + b;
  return result as State;
}

function mulr(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] * result[b];
  return result as State;
}

function muli(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] * b;
  return result as State;
}

function banr(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] & result[b];
  return result as State;
}

function bani(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] & b;
  return result as State;
}

function borr(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] | result[b];
  return result as State;
}

function bori(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] | b;
  return result as State;
}

function setr(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a];
  return result as State;
}

function seti(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = a;
  return result as State;
}

function gtir(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = a > result[b] ? 1 : 0;
  return result as State;
}

function gtri(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] > b ? 1 : 0;
  return result as State;
}

function gtrr(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] > result[b] ? 1 : 0;
  return result as State;
}

function eqir(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = a === result[b] ? 1 : 0;
  return result as State;
}

function eqri(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] === b ? 1 : 0;
  return result as State;
}

function eqrr(a: number, b: number, c: number, state: State): State {
  const result = [...state];
  result[c] = result[a] === result[b] ? 1 : 0;
  return result as State;
}

const opMap = { addr, addi, mulr, muli, borr, bori, banr, bani, setr, seti, eqri, eqrr, eqir, gtir, gtri, gtrr } as any;

function part1() {
  const input = readInput('day19', l => _.split(l, ' '));
  const ops = _.chain(input)
    .slice(1)
    .map(([a,b,c,d]) => [a, parseInt(b, 10), parseInt(c, 10), parseInt(d, 10)] as Op)
    .value();
  let state = [0,0,0,0,0,0];
  const ipRegister = parseInt(_.chain(input).first().last().value() as string);
  while (state[ipRegister] < ops.length) {
    const ip = state[ipRegister];
    const op = ops[ip] as Op;
    state = opMap[op[0]](op[1], op[2], op[3], state);
    state[ipRegister]++;
  }
  return state;
}

function part2() {
  const input = readInput('day19', l => _.split(l, ' '));
  const ops = _.chain(input)
    .slice(1)
    .map(([a,b,c,d]) => [a, parseInt(b, 10), parseInt(c, 10), parseInt(d, 10)] as Op)
    .value();
  const ipRegister = parseInt(_.chain(input).first().last().value() as string);
  const registers = _.split('ABCDEF', '');
  registers[ipRegister] = 'I';
  _.chain(ops)
    .map((op: Op, i) => {
      const resultRegister = registers[op[3]];
      const instruction = op[0];
      const arg1 = op[1];
      const arg2 = op[2];
      switch (instruction) {
        case 'seti': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${arg1}`;
        case 'setr': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]}`;
        case 'addi': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]} + ${arg2}`;
        case 'addr': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]} + ${registers[arg2]}`;
        case 'muli': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]} * ${arg2}`;
        case 'mulr': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]} * ${registers[arg2]}`;
        case 'banr': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]} & ${arg2}`;
        case 'bani': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]} & ${registers[arg2]}`;
        case 'borr': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]} | ${arg2}`;
        case 'bori': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = ${registers[arg1]} | ${registers[arg2]}`;
        case 'eqir': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = (${arg1} == ${registers[arg2]}) ? 1 : 0`;
        case 'eqri': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = (${registers[arg1]} == ${arg2}) ? 1 : 0`;
        case 'eqrr': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = (${registers[arg1]} == ${registers[arg2]}) ? 1 : 0`;
        case 'gtir': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = (${arg1} > ${registers[arg2]}) ? 1 : 0`;
        case 'gtri': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = (${registers[arg1]} > ${arg2}) ? 1 : 0`;
        case 'gtrr': return `${_.padStart(i.toString(), 2, '0')}: ${resultRegister} = (${registers[arg1]} > ${registers[arg2]}) ? 1 : 0`;
        
      }
      return `${op}`;
    })
    .join('\n')
    .value();
  //hey guess what after staring at day19.translated it just summing up all the numbers that divide cleanly into a number it calculates and when A starts as 1 that number is way larger.
  return _.chain(_.range(10551374)).filter(i => 10551373 % i === 0).sum().value();
}

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});