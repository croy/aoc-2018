import _ from 'lodash';

function part1(input: number) {
  const scores = [3, 7];
  let elfAIdx = 0;
  let elfBIdx = 1;
  while(scores.length < input + 10) {
    _.chain(scores[elfAIdx] + scores[elfBIdx])
      .split('')
      .forEach((c) => scores.push(parseInt(c, 10)))
      .value();
    elfAIdx = (elfAIdx + 1 + scores[elfAIdx]) % scores.length
    elfBIdx = (elfBIdx + 1 + scores[elfBIdx]) % scores.length
  }
  return _.chain(scores)
    .slice(input, input+10)
    .join('')
    .value();
}

function part2(target: string) {
  const scores = [3, 7];
  let elfAIdx = 0;
  let elfBIdx = 1;
  let sliceStart = 0;
  while(true) {
    _.chain(scores[elfAIdx] + scores[elfBIdx])
      .split('')
      .forEach((c) => scores.push(parseInt(c, 10)))
      .value();
    while (sliceStart + target.length < scores.length) {
      const currScores = _.chain(scores).slice(sliceStart, sliceStart + target.length).join('').value();
      if (currScores === target) {
        return sliceStart;
      }
      sliceStart++;
    }
    elfAIdx = (elfAIdx + 1 + scores[elfAIdx]) % scores.length
    elfBIdx = (elfBIdx + 1 + scores[elfBIdx]) % scores.length
  }

}

describe('output', () => {
  test('part 1', () => {
    console.log(part1(505961));
  });
  test('part 2', () => {
    console.log(part2('505961'));
  });
});