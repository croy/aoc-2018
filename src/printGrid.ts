import _ from 'lodash';

export default function printGrid(grid: string[][]): void {
  console.log(gridToString(grid));
}

export function gridToString(grid: string[][]): string {
  return _.join(_.map(grid, l => _.join(l, '')), '\n');
}