import _ from 'lodash';
import readInput from './readInput';


type Node = {
  childCount: number;
  metadataCount: number;
  children: Node[];
  metadata: number[];
}

function parseNode(tokens: IterableIterator<number>): Node {
  const childCount = tokens.next().value;
  const metadataCount = tokens.next().value;
  const children = _.map(_.range(childCount), () => parseNode(tokens));
  const metadata = _.map(_.range(metadataCount), () => tokens.next().value);
  return {
    childCount,
    metadataCount,
    children,
    metadata,
  }
}

function sum1(node: Node): number {
  return _.sum(node.metadata) + _.sum(_.map(node.children, sum1));
}

function sum2(node: Node): number {
  return _.isEmpty(node.children) ?
    _.sum(node.metadata) :
    _.chain(node.metadata)
      .map(n => n - 1) //re-index to 0
      .filter(n => n >= 0 && n < node.children.length) //remove metadata entries without children
      .map(n => node.children[n])
      .map(sum2)
      .sum()
      .value();
}

function* generate<T>(lst: T[]) {
  yield* lst;
}

function solve(sumFnc: (node: Node) => number) {
  const input = _.chain(readInput('day8', (s) => s.split(' ')))
    .flatten()
    .map(s => parseInt(s, 10))
    .value();
  return sumFnc(parseNode(generate(input)));
}

function part1() {
  return solve(sum1);
}

function part2() {
  return solve(sum2);
}

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1());
  })

  test('part 2 ', () => {
    console.log(part2());
  })
});