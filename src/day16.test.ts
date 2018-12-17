import _ from 'lodash';
import fs from 'fs';

type State = [number, number, number, number]

type Op = [number, number, number, number]

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

const opcodeFuncs = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];

type OpcodeExample = {
  initialState: State,
  endState: State,
  operation: Op,
}

function parseState(state: string): State {
  const matches = /\[(\d+), (\d+), (\d+), (\d+)\]/.exec(state);
  if (!matches) {
    throw 'beep boop';
  }
  return [
    parseInt(matches[1],10),
    parseInt(matches[2],10),
    parseInt(matches[3],10),
    parseInt(matches[4],10),
  ];
}

function parseOperation(operation: string): Op {
  const matches = /(\d+) (\d+) (\d+) (\d+)/.exec(operation);
  if (!matches) {
    throw 'beep boop';
  }
  return [
    parseInt(matches[1],10),
    parseInt(matches[2],10),
    parseInt(matches[3],10),
    parseInt(matches[4],10),
  ];
}

function parseOpcodeExample([ initialState, operation, endState]: [string, string, string]): OpcodeExample {
  return {
    initialState: parseState(initialState),
    operation: parseOperation(operation),
    endState: parseState(endState),
  }
}

function part1() {
  return _.chain(fs.readFileSync('input/day16.opcode', 'utf-8'))
    .split('\n')
    .chunk(4)
    .map(parseOpcodeExample)
    .map((example: OpcodeExample) => _.chain(opcodeFuncs)
      .reduce((acc, f, i) => {
        const result = f(example.operation[1],
          example.operation[2],
          example.operation[3],
          example.initialState);
        if (_.isEqual(example.endState, result)) {
          acc.add(i);
        }
        return acc;
        },
        new Set())
      .size()
      .value())
    .filter((c: number) => c >= 3)
    .size()
    .value();
}

function part2() {
  /*_.chain(fs.readFileSync('input/day16.opcode', 'utf-8'))
    .split('\n')
    .chunk(4)
    .map(parseOpcodeExample)
    .map((example: OpcodeExample) => ({
      opcode: example.operation[0],
      ops: _.chain(opcodeFuncs)
        .reduce(
          (acc, f, i) => {
            const result = f(example.operation[1],
              example.operation[2],
              example.operation[3],
              example.initialState);
            if (_.isEqual(example.endState, result)) {
              acc.add(i);
            }
            return acc;
          },
          new Set())
        .value()
      }))
    .groupBy((f: {opcode: number}) => f.opcode)
    .mapValues((opc: {ops: Set<any>}[]) => 
      _.intersection(..._.map(opc, o => [...o.ops]))
    )
    .value()
  */
  //MANUAL:
  const opcodeMap = 
  [
    opcodeFuncs[14],
    opcodeFuncs[7],
    opcodeFuncs[1],
    opcodeFuncs[5],
    opcodeFuncs[9],
    opcodeFuncs[15],
    opcodeFuncs[0],
    opcodeFuncs[11],
    opcodeFuncs[6],
    opcodeFuncs[10],
    opcodeFuncs[8],
    opcodeFuncs[13],
    opcodeFuncs[2],
    opcodeFuncs[3],
    opcodeFuncs[12],
    opcodeFuncs[4],
  ]
  return _.chain(fs.readFileSync('input/day16.program', 'utf-8'))
    .split('\n')
    .reduce((state: State, line: string) => {
      const [opcode, a, b, c] = _.chain(line)
        .split(' ')
        .map(i => parseInt(i, 10))
        .value()
      return opcodeMap[opcode](a,b,c, state);
    }, [0, 0, 0, 0] as State)
    .value();
}

describe('output', () => {
  test('part 1', () => {
    console.log(part1());
  });
  test('part 2', () => {
    console.log(part2());
  });
});