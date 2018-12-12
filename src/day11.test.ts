import _ from 'lodash';

function fuelValue(x: number, y: number, serial: number): number {
  const rackId = x + 10;
  return (Math.floor(((((y * rackId) + serial) * rackId) / 100)) % 10) - 5
}

function summedAreaSquare(xSize: number, ySize: number, serial: number): number[][] {
  const summedAreaSquare = [] as number[][];
  for (const y of _.range(ySize)) {
    summedAreaSquare[y] = [];
    for (const x of _.range(xSize)) {
      const valueOfSquare = fuelValue(x+1, y+1, serial);
      if (x === 0 || y === 0) {
        summedAreaSquare[y][x] = valueOfSquare
      } else {
        summedAreaSquare[y][x] = valueOfSquare + summedAreaSquare[y][x-1] + summedAreaSquare[y-1][x] - summedAreaSquare[y-1][x-1];
      }
    }
  }
  return summedAreaSquare;
}

function* allSquares(gridSize: number, dialMin: number, dialMax: number) {
  for (const squareSize of _.range(dialMin, dialMax+1)) {
    for (const y of _.range(gridSize)) {
      for (const x of _.range(gridSize)) {
        if (y + squareSize <= gridSize && x + squareSize <= gridSize) {
          yield {
            x,
            y,
            squareSize
          };
        }
      }
    }
  }
}

function part1(serial: number) {
  const summedSquare = summedAreaSquare(300, 300, serial);
  let currentBest = -Infinity;
  let currentIdx = '';
  for (const square of allSquares(300, 3, 3)) {
    const rightX = square.x + square.squareSize - 1;
    const bottomY = square.y + square.squareSize - 1;
    const leftX = square.x;
    const topY = square.y;
    const topLeftSquareVal = leftX > 0 && topY > 0 ? summedSquare[topY-1][leftX-1] : 0;
    const leftSquareVal = leftX > 0 ? summedSquare[bottomY][leftX-1] : 0;
    const topSquareVal = topY > 0 ? summedSquare[topY-1][rightX] : 0;
    const currentVal = summedSquare[bottomY][rightX] + topLeftSquareVal - leftSquareVal - topSquareVal;
    if (currentVal > currentBest) {
      currentBest = currentVal;
      currentIdx = `${square.x+1}, ${square.y+1}, ${square.squareSize}`;
    }
  }
  return currentIdx;
}

function part2(serial: number) {
  const summedSquare = summedAreaSquare(300, 300, serial);
  let currentBest = -Infinity;
  let currentIdx = '';
  for (const square of allSquares(300, 1, 300)) {
    const rightX = square.x + square.squareSize - 1;
    const bottomY = square.y + square.squareSize - 1;
    const leftX = square.x;
    const topY = square.y;
    const topLeftSquareVal = leftX > 0 && topY > 0 ? summedSquare[topY-1][leftX-1] : 0;
    const leftSquareVal = leftX > 0 ? summedSquare[bottomY][leftX-1] : 0;
    const topSquareVal = topY > 0 ? summedSquare[topY-1][rightX] : 0;
    const currentVal = summedSquare[bottomY][rightX] + topLeftSquareVal - leftSquareVal - topSquareVal;
    if (currentVal > currentBest) {
      currentBest = currentVal;
      currentIdx = `${square.x+1}, ${square.y+1}, ${square.squareSize}`;
    }
  }
  return currentIdx;
}

describe('sample data', () => {
  test('fuelValue', () => {
    expect(fuelValue(3,5,8)).toBe(4);
    expect(fuelValue(122,79,57)).toBe(-5);
    expect(fuelValue(217,196, 39)).toBe(0);
    expect(fuelValue(101,153,71)).toBe(4)
  })
})

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1(9221));
  })

  test('part 2 ', () => {
    console.log(part2(9221));
  })
});
